'use client';

import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { SynthPageShell } from '@/components/SynthPageShell';

const C = {
    bulletInvader: '#ff9f1c',
    bulletPlayer: '#00e5ff',
    grid: 'rgba(0, 229, 255, 0.055)',
    gridBright: 'rgba(255, 42, 140, 0.04)',
    invader: '#ff2a8c',
    invaderAlt: '#7c3aed',
    invaderGlow: 'rgba(255, 42, 140, 0.45)',
    player: '#00e5ff',
    playerGlow: 'rgba(0, 229, 255, 0.55)',
    star: 'rgba(240, 238, 245, 0.5)',
    starCyan: 'rgba(0, 229, 255, 0.4)',
    textLose: '#ff2a8c',
    textWin: '#00e5ff',
    trail: 'rgba(5, 5, 12, 0.45)',
};

type Star = { a: number; kind: 'c' | 'w'; r: number; x: number; y: number; };

function getFullscreenElement(): Element | null {
    const doc = document as { webkitFullscreenElement?: Element | null } & Document;
    return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function requestFullscreen(el: HTMLElement): Promise<void> {
    const anyEl = el as {
        mozRequestFullScreen?: () => void;
        msRequestFullscreen?: () => void;
        webkitRequestFullscreen?: () => void;
    } & HTMLElement;
    if (el.requestFullscreen) {
        await el.requestFullscreen();
    } else if (anyEl.webkitRequestFullscreen) {
        anyEl.webkitRequestFullscreen();
    } else if (anyEl.mozRequestFullScreen) {
        anyEl.mozRequestFullScreen();
    } else if (anyEl.msRequestFullscreen) {
        anyEl.msRequestFullscreen();
    }
}

async function exitFullscreen(): Promise<void> {
    const doc = document as {
        mozCancelFullScreen?: () => void;
        msExitFullscreen?: () => void;
        webkitExitFullscreen?: () => void;
    } & Document;
    if (document.exitFullscreen) {
        await document.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    }
}

type Invader = { height: number; tier: 0 | 1 | 2; width: number; x: number; y: number; };

function SpaceInvadersCanvas({
    gameStatus,
    highScore,
    level,
    score,
    setGameStatus,
    setHighScore,
    setLevel,
    setScore,
}: {
    gameStatus: 'defeat' | 'playing' | 'victory';
    highScore: number;
    level: number;
    score: number;
    setGameStatus: React.Dispatch<React.SetStateAction<'defeat' | 'playing' | 'victory'>>;
    setHighScore: React.Dispatch<React.SetStateAction<number>>;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const starsRef = useRef<Star[]>([]);

    const statusRef = useRef<'defeat' | 'playing' | 'victory'>('playing');
    const levelRef = useRef(1);
    const rafRef = useRef<null | number>(null);

    useEffect(() => {
        statusRef.current = gameStatus;
    }, [gameStatus]);

    useEffect(() => {
        levelRef.current = level;
    }, [level]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const keys: Record<number, boolean> = {};
        let lastBulletTime = 0;
        let invaderDirection = 1;

        const player = {
            height: 14,
            velocityX: 6,
            width: 34,
            x: 0,
            y: 0,
        };

        let invaders: Invader[] = [];
        const playerBullets: { radius: number; velocityY: number; x: number; y: number; }[] = [];
        const invaderBullets: { radius: number; velocityY: number; x: number; y: number; }[] = [];

        const initStars = (w: number, h: number) => {
            const n = Math.min(120, Math.floor((w * h) / 14000));
            starsRef.current = Array.from({ length: n }, () => ({
                a: Math.random() * 0.45 + 0.2,
                kind: Math.random() > 0.75 ? 'c' : 'w',
                r: Math.random() * 1 + 0.25,
                x: Math.random() * w,
                y: Math.random() * h,
            }));
        };

        const createInvaders = () => {
            invaders = [];
            const rows = 5;
            const cols = 10;
            const invaderWidth = 22;
            const invaderHeight = 14;
            const spacingX = 12;
            const spacingY = 10;
            const totalW = cols * invaderWidth + (cols - 1) * spacingX;
            const startX = Math.max(24, (canvas.width - totalW) / 2);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const tier = (row < 2 ? 2 : row < 4 ? 1 : 0) as 0 | 1 | 2;
                    invaders.push({
                        height: invaderHeight,
                        tier,
                        width: invaderWidth,
                        x: startX + col * (invaderWidth + spacingX),
                        y: 56 + row * (invaderHeight + spacingY),
                    });
                }
            }
            invaderDirection = 1;
        };

        const resizeCanvas = () => {
            const { height, width } = container.getBoundingClientRect();
            const w = Math.max(320, width);
            const h = Math.max(280, height);
            canvas.width = w;
            canvas.height = h;
            initStars(w, h);
            player.x = Math.min(Math.max(player.x, 8), canvas.width - player.width - 8);
            player.y = canvas.height - 44;
        };

        resizeCanvas();
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - 44;
        createInvaders();

        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.keyCode] = true;
            if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.keyCode] = false;
        };

        const handleResize = () => {
            resizeCanvas();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('resize', handleResize);

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        const invaderSpeed = () => 1.15 + levelRef.current * 0.28;

        const drawGrid = () => {
            const g = 48;
            ctx.strokeStyle = C.grid;
            ctx.lineWidth = 1;
            for (let x = 0; x <= canvas.width; x += g) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += g) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            ctx.strokeStyle = C.gridBright;
            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.5, 0);
            ctx.lineTo(canvas.width * 0.5, canvas.height);
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        const drawStars = () => {
            for (const s of starsRef.current) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.kind === 'c' ? C.starCyan : C.star;
                ctx.globalAlpha = s.a;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };

        const drawInvader = (inv: Invader) => {
            const { height, tier, width, x, y } = inv;
            const fill = tier === 2 ? C.invader : tier === 1 ? C.invaderAlt : C.invader;
            ctx.shadowBlur = tier >= 1 ? 8 : 5;
            ctx.shadowColor = C.invaderGlow;
            ctx.fillStyle = fill;
            ctx.fillRect(x, y, width, height);
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(x + 4, y + 4, width - 8, 4);
        };

        const drawPlayer = () => {
            ctx.shadowBlur = 12;
            ctx.shadowColor = C.playerGlow;
            ctx.strokeStyle = C.player;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(player.x + player.width / 2, player.y);
            ctx.lineTo(player.x, player.y + player.height);
            ctx.lineTo(player.x + player.width, player.y + player.height);
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const draw = () => {
            ctx.fillStyle = C.trail;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawStars();
            drawGrid();

            drawPlayer();

            invaders.forEach(drawInvader);

            playerBullets.forEach((b) => {
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.shadowBlur = 6;
                ctx.shadowColor = C.bulletPlayer;
                ctx.fillStyle = C.bulletPlayer;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            invaderBullets.forEach((b) => {
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.shadowBlur = 5;
                ctx.shadowColor = C.bulletInvader;
                ctx.fillStyle = C.bulletInvader;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            const st = statusRef.current;
            ctx.textAlign = 'center';
            if (st === 'victory') {
                ctx.fillStyle = C.textWin;
                ctx.font = 'bold 22px Orbitron, system-ui, sans-serif';
                ctx.fillText('SECTOR CLEAR', canvas.width / 2, canvas.height / 2 - 16);
                ctx.font = '14px ui-monospace, monospace';
                ctx.fillText(`Wave ${levelRef.current} cleared`, canvas.width / 2, canvas.height / 2 + 12);
                ctx.fillStyle = 'rgba(240,238,245,0.75)';
                ctx.fillText('Press ENTER for next wave', canvas.width / 2, canvas.height / 2 + 40);
            } else if (st === 'defeat') {
                ctx.fillStyle = C.textLose;
                ctx.font = 'bold 22px Orbitron, system-ui, sans-serif';
                ctx.fillText('BREACH', canvas.width / 2, canvas.height / 2 - 8);
                ctx.fillStyle = 'rgba(240,238,245,0.8)';
                ctx.font = '14px ui-monospace, monospace';
                ctx.fillText('Press SPACE to redeploy', canvas.width / 2, canvas.height / 2 + 24);
            }
        };

        const update = () => {
            const st = statusRef.current;

            if (st === 'playing') {
                if (keys[37] && player.x > 4) {
                    player.x -= player.velocityX;
                }
                if (keys[39] && player.x + player.width < canvas.width - 4) {
                    player.x += player.velocityX;
                }

                const now = Date.now();
                if (keys[32] && now - lastBulletTime > 280) {
                    playerBullets.push({
                        radius: 3,
                        velocityY: -7,
                        x: player.x + player.width / 2,
                        y: player.y,
                    });
                    lastBulletTime = now;
                }

                const speed = invaderSpeed();
                if (invaders.length > 0) {
                    const dx = speed * invaderDirection;
                    invaders.forEach((inv) => {
                        inv.x += dx;
                    });

                    const minX = Math.min(...invaders.map((i) => i.x));
                    const maxX = Math.max(...invaders.map((i) => i.x + i.width));

                    if (minX <= 4 || maxX >= canvas.width - 4) {
                        invaderDirection *= -1;
                        invaders.forEach((inv) => {
                            inv.x -= dx;
                            inv.y += 20;
                        });
                    }

                    invaders.forEach((inv) => {
                        if (inv.y + inv.height >= player.y - 4) {
                            statusRef.current = 'defeat';
                            setGameStatus('defeat');
                        }
                    });

                    if (Math.random() < 0.0009 + levelRef.current * 0.0006) {
                        const shooter = invaders[Math.floor(Math.random() * invaders.length)];
                        if (shooter) {
                            invaderBullets.push({
                                radius: 3,
                                velocityY: 3.2 + levelRef.current * 0.45,
                                x: shooter.x + shooter.width / 2,
                                y: shooter.y + shooter.height,
                            });
                        }
                    }
                }

                playerBullets.forEach((b) => {
                    b.y += b.velocityY;
                });
                invaderBullets.forEach((b) => {
                    b.y += b.velocityY;
                });

                for (let i = playerBullets.length - 1; i >= 0; i--) {
                    const bullet = playerBullets[i];
                    let hit = false;
                    for (let j = invaders.length - 1; j >= 0; j--) {
                        const inv = invaders[j];
                        if (
                            bullet.x > inv.x &&
                            bullet.x < inv.x + inv.width &&
                            bullet.y > inv.y &&
                            bullet.y < inv.y + inv.height
                        ) {
                            invaders.splice(j, 1);
                            hit = true;
                            setScore((s) => {
                                const pts = 10 + (inv.tier === 2 ? 5 : inv.tier === 1 ? 2 : 0);
                                const next = s + pts;
                                setHighScore((hs) => {
                                    if (next <= hs) return hs;
                                    try {
                                        localStorage.setItem('space-invaders-high', String(next));
                                    } catch {
                                        /* noop */
                                    }
                                    return next;
                                });
                                return next;
                            });
                            break;
                        }
                    }
                    if (hit) playerBullets.splice(i, 1);
                }

                if (invaders.length === 0) {
                    statusRef.current = 'victory';
                    setGameStatus('victory');
                }

                for (let i = invaderBullets.length - 1; i >= 0; i--) {
                    const bullet = invaderBullets[i];
                    if (
                        bullet.x > player.x &&
                        bullet.x < player.x + player.width &&
                        bullet.y > player.y &&
                        bullet.y < player.y + player.height
                    ) {
                        statusRef.current = 'defeat';
                        setGameStatus('defeat');
                        invaderBullets.splice(i, 1);
                        break;
                    }
                }

                for (let i = playerBullets.length - 1; i >= 0; i--) {
                    if (playerBullets[i].y < 0) playerBullets.splice(i, 1);
                }
                for (let i = invaderBullets.length - 1; i >= 0; i--) {
                    if (invaderBullets[i].y > canvas.height) invaderBullets.splice(i, 1);
                }
            } else if (st === 'victory') {
                if (keys[13]) {
                    levelRef.current += 1;
                    setLevel(levelRef.current);
                    createInvaders();
                    playerBullets.length = 0;
                    invaderBullets.length = 0;
                    statusRef.current = 'playing';
                    setGameStatus('playing');
                    keys[13] = false;
                }
            } else if (st === 'defeat') {
                if (keys[32]) {
                    setScore(0);
                    levelRef.current = 1;
                    setLevel(1);
                    createInvaders();
                    playerBullets.length = 0;
                    invaderBullets.length = 0;
                    player.x = canvas.width / 2 - player.width / 2;
                    statusRef.current = 'playing';
                    setGameStatus('playing');
                    keys[32] = false;
                }
            }

            draw();
            rafRef.current = requestAnimationFrame(update);
        };

        rafRef.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [setScore, setHighScore, setLevel, setGameStatus]);

    return (
        <div className="relative h-full w-full" ref={containerRef}>
            <canvas ref={canvasRef} className="block h-full w-full bg-black" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(124,58,237,0.06)_0%,transparent_42%)]" />
            <div className="absolute top-3 left-3 z-10 max-w-[min(100%,14rem)] rounded border border-cyan-500/25 bg-black/55 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-primary/85 sm:text-xs">SCORE</p>
                <p className="font-orbitron text-xl tabular-nums text-synth-primary sm:text-2xl">{score}</p>
            </div>
            <div className="absolute top-3 right-3 z-10 rounded border border-fuchsia-500/20 bg-black/55 px-3 py-2 text-right backdrop-blur-sm sm:px-4 sm:py-3">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-secondary/90 sm:text-xs">WAVE</p>
                <p className="font-orbitron text-xl tabular-nums text-synth-secondary sm:text-2xl">{level}</p>
            </div>
            <div className="absolute bottom-3 left-3 z-10 rounded border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-sm">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-text-muted sm:text-xs">HI</p>
                <p className="font-orbitron text-lg tabular-nums text-synth-text sm:text-xl">{highScore}</p>
            </div>
        </div>
    );
}

export default function SpaceInvadersPage() {
    const gameShellRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameStatus, setGameStatus] = useState<'defeat' | 'playing' | 'victory'>('playing');

    useEffect(() => {
        try {
            const stored = Number(localStorage.getItem('space-invaders-high') ?? '0');
            if (!Number.isNaN(stored)) {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hydrate from localStorage
                setHighScore(stored);
            }
        } catch {
            /* noop */
        }
    }, []);

    const syncFullscreen = useCallback(() => {
        const el = getFullscreenElement();
        setIsFullscreen(el !== null && el === gameShellRef.current);
    }, []);

    useEffect(() => {
        document.addEventListener('fullscreenchange', syncFullscreen);
        document.addEventListener('webkitfullscreenchange', syncFullscreen);
        return () => {
            document.removeEventListener('fullscreenchange', syncFullscreen);
            document.removeEventListener('webkitfullscreenchange', syncFullscreen);
        };
    }, [syncFullscreen]);

    const toggleFullscreen = useCallback(async () => {
        const el = gameShellRef.current;
        if (!el) return;
        try {
            if (!getFullscreenElement()) {
                await requestFullscreen(el);
            } else {
                await exitFullscreen();
            }
        } catch {
            /* noop */
        }
    }, []);

    return (
        <SynthPageShell innerClassName="max-w-6xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                    className="portfolio-link inline-flex items-center gap-2 font-mono-label text-sm tracking-wide"
                    href="/arcade"
                >
                    <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
                    Back to arcade
                </Link>
                <span className="font-mono-label text-sm text-synth-primary/80">
                    {'// Space Invaders Remastered'}
                </span>
            </div>

            <div className="portfolio-card overflow-hidden p-2 sm:p-3">
                <div className="hud-frame relative w-full">
                    <span aria-hidden className="hud-frame__bracket hud-frame__bracket--tr" />
                    <span aria-hidden className="hud-frame__bracket hud-frame__bracket--bl" />
                    <div
                        ref={gameShellRef}
                        className={
                            isFullscreen
                                ? 'relative h-full min-h-0 w-full overflow-hidden bg-synth-bg-mid'
                                : 'relative h-[min(75vh,820px)] min-h-[300px] w-full overflow-hidden bg-synth-bg-mid sm:min-h-[360px]'
                        }
                    >
                        <SpaceInvadersCanvas
                            gameStatus={gameStatus}
                            highScore={highScore}
                            level={level}
                            score={score}
                            setGameStatus={setGameStatus}
                            setHighScore={setHighScore}
                            setLevel={setLevel}
                            setScore={setScore}
                        />
                        <div className="absolute bottom-3 right-3 z-30">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded border border-cyan-500/35 bg-black/65 px-3 py-2 font-mono-label text-xs uppercase tracking-wider text-synth-primary shadow-[0_0_20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors hover:border-synth-primary/60 hover:text-white"
                                aria-pressed={isFullscreen}
                                title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fill the screen with the playfield'}
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? (
                                    <Minimize2 aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
                                ) : (
                                    <Maximize2 aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
                                )}
                                <span className="max-sm:sr-only">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-center font-mono-label text-xs leading-relaxed text-synth-text-muted sm:text-left">
                Arrows to strafe · Space to fire · Enter advances after a clear · Esc exits fullscreen
            </p>
        </SynthPageShell>
    );
}
