'use client';

import Link from 'next/link';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { SynthPageShell } from '@/components/SynthPageShell';

/** Canvas palette aligned with globals.css synth tokens */
const C = {
    bg: '#000000',
    trail: 'rgba(5, 5, 12, 0.32)',
    grid: 'rgba(0, 229, 255, 0.055)',
    gridBright: 'rgba(255, 42, 140, 0.04)',
    ship: '#00e5ff',
    shipGlow: 'rgba(0, 229, 255, 0.65)',
    thrustCore: '#ff2a8c',
    thrustEdge: '#ff9f1c',
    rock: '#e8e4ef',
    rockAlt: 'rgba(255, 42, 140, 0.92)',
    bullet: '#00e5ff',
    bulletGlow: 'rgba(0, 229, 255, 0.9)',
    star: 'rgba(240, 238, 245, 0.55)',
    starCyan: 'rgba(0, 229, 255, 0.45)',
};

function getFullscreenElement(): Element | null {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function requestFullscreen(el: HTMLElement): Promise<void> {
    const anyEl = el as HTMLElement & {
        webkitRequestFullscreen?: () => void;
        mozRequestFullScreen?: () => void;
        msRequestFullscreen?: () => void;
    };
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
    const doc = document as Document & {
        webkitExitFullscreen?: () => void;
        mozCancelFullScreen?: () => void;
        msExitFullscreen?: () => void;
    };
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

type Star = { x: number; y: number; r: number; a: number; kind: 'w' | 'c' };

function AsteroidsCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const starsRef = useRef<Star[]>([]);

    const gameRef = useRef({
        ship: null as {
            x: number;
            y: number;
            radius: number;
            angle: number;
            thrust: { x: number; y: number };
            friction: number;
        } | null,
        asteroids: [] as {
            x: number;
            y: number;
            radius: number;
            velocityX: number;
            velocityY: number;
            vertices: { x: number; y: number }[];
            hue: 'rock' | 'alt';
        }[],
        bullets: [] as {
            x: number;
            y: number;
            velocityX: number;
            velocityY: number;
            radius: number;
            lifeTime: number;
        }[],
        keys: {} as Record<number, boolean>,
        animationFrameId: 0 as number | null,
        lastTime: 0,
    });

    useEffect(() => {
        try {
            const stored = Number(localStorage.getItem('asteroids-high') ?? '0');
            if (!Number.isNaN(stored)) {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hydrate from localStorage
                setHighScore(stored);
            }
        } catch {
            /* noop */
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const game = gameRef.current;

        const initStars = (w: number, h: number) => {
            const n = Math.min(140, Math.floor((w * h) / 12000));
            starsRef.current = Array.from({ length: n }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.1 + 0.25,
                a: Math.random() * 0.45 + 0.25,
                kind: Math.random() > 0.72 ? 'c' : 'w',
            }));
        };

        const resizeCanvas = () => {
            const { width, height } = container.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            initStars(width, height);

            if (game.ship) {
                game.ship.x = canvas.width / 2;
                game.ship.y = canvas.height / 2;
            }
        };

        resizeCanvas();

        game.ship = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 15,
            angle: 0,
            thrust: { x: 0, y: 0 },
            friction: 0.98,
        };

        const generateAsteroidVertices = (radius: number) => {
            const vertices: { x: number; y: number }[] = [];
            const numVertices = Math.floor(Math.random() * 5) + 7;

            for (let i = 0; i < numVertices; i++) {
                const angle = (i / numVertices) * Math.PI * 2;
                const vertexRadius = radius * (0.75 + Math.random() * 0.25);
                vertices.push({
                    x: Math.cos(angle) * vertexRadius,
                    y: Math.sin(angle) * vertexRadius,
                });
            }

            return vertices;
        };

        const createAsteroid = (x?: number, y?: number, radius?: number) => {
            const r = radius || Math.random() * 30 + 20;
            return {
                x: x ?? Math.random() * canvas.width,
                y: y ?? Math.random() * canvas.height,
                radius: r,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: (Math.random() - 0.5) * 2,
                vertices: generateAsteroidVertices(r),
                hue: (Math.random() > 0.5 ? 'rock' : 'alt') as 'rock' | 'alt',
            };
        };

        const createBullet = () => {
            if (!game.ship) return;
            if (game.bullets.length < 10) {
                const bullet = {
                    x: game.ship.x + Math.cos(game.ship.angle) * game.ship.radius,
                    y: game.ship.y + Math.sin(game.ship.angle) * game.ship.radius,
                    velocityX: Math.cos(game.ship.angle) * 7,
                    velocityY: Math.sin(game.ship.angle) * 7,
                    radius: 3,
                    lifeTime: 60,
                };
                game.bullets.push(bullet);
            }
        };

        game.asteroids = [];
        for (let i = 0; i < 5; i++) {
            let x: number;
            let y: number;
            let distance: number;
            do {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
                const dx = x - game.ship!.x;
                const dy = y - game.ship!.y;
                distance = Math.sqrt(dx * dx + dy * dy);
            } while (distance < 150);

            game.asteroids.push(createAsteroid(x, y));
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            game.keys[e.keyCode] = true;
            if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            game.keys[e.keyCode] = false;
        };

        const handleResize = () => {
            resizeCanvas();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('resize', handleResize);

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        const updateScore = (points: number) => {
            setScore((prevScore) => {
                const next = prevScore + points;
                setHighScore((hs) => {
                    if (next <= hs) return hs;
                    try {
                        localStorage.setItem('asteroids-high', String(next));
                    } catch {
                        /* noop */
                    }
                    return next;
                });
                return next;
            });
        };

        const drawGrid = () => {
            const g = 56;
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
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.5, 0);
            ctx.lineTo(canvas.width * 0.5, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.5);
            ctx.lineTo(canvas.width, canvas.height * 0.5);
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

        const update = (timestamp: number) => {
            const deltaTime = timestamp - (game.lastTime || timestamp);
            game.lastTime = timestamp;
            const timeScale = deltaTime / 16.67;

            if (!game.ship) return;

            if (game.keys[37] || game.keys[65]) {
                game.ship.angle -= 0.05 * timeScale;
            }
            if (game.keys[39] || game.keys[68]) {
                game.ship.angle += 0.05 * timeScale;
            }
            if (game.keys[38] || game.keys[87]) {
                game.ship.thrust.x += Math.cos(game.ship.angle) * 0.1 * timeScale;
                game.ship.thrust.y += Math.sin(game.ship.angle) * 0.1 * timeScale;
            }

            if (game.keys[32]) {
                createBullet();
                game.keys[32] = false;
            }

            game.ship.thrust.x *= game.ship.friction;
            game.ship.thrust.y *= game.ship.friction;

            game.ship.x += game.ship.thrust.x * timeScale;
            game.ship.y += game.ship.thrust.y * timeScale;

            if (game.ship.x < 0) game.ship.x = canvas.width;
            if (game.ship.x > canvas.width) game.ship.x = 0;
            if (game.ship.y < 0) game.ship.y = canvas.height;
            if (game.ship.y > canvas.height) game.ship.y = 0;

            for (let i = 0; i < game.asteroids.length; i++) {
                const asteroid = game.asteroids[i];

                asteroid.x += asteroid.velocityX * timeScale;
                asteroid.y += asteroid.velocityY * timeScale;

                if (asteroid.x < -asteroid.radius) asteroid.x = canvas.width + asteroid.radius;
                if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = -asteroid.radius;
                if (asteroid.y < -asteroid.radius) asteroid.y = canvas.height + asteroid.radius;
                if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = -asteroid.radius;
            }

            for (let i = game.bullets.length - 1; i >= 0; i--) {
                const bullet = game.bullets[i];

                bullet.x += bullet.velocityX * timeScale;
                bullet.y += bullet.velocityY * timeScale;

                bullet.lifeTime--;

                if (
                    bullet.x < 0 ||
                    bullet.x > canvas.width ||
                    bullet.y < 0 ||
                    bullet.y > canvas.height ||
                    bullet.lifeTime <= 0
                ) {
                    game.bullets.splice(i, 1);
                    continue;
                }

                let hit = false;
                for (let j = game.asteroids.length - 1; j >= 0; j--) {
                    if (hit) break;

                    const asteroid = game.asteroids[j];
                    const dx = bullet.x - asteroid.x;
                    const dy = bullet.y - asteroid.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < bullet.radius + asteroid.radius) {
                        game.bullets.splice(i, 1);
                        hit = true;

                        if (asteroid.radius > 25) {
                            for (let k = 0; k < 2; k++) {
                                game.asteroids.push(createAsteroid(asteroid.x, asteroid.y, asteroid.radius / 2));
                            }
                            updateScore(20);
                        } else {
                            updateScore(10);
                        }

                        game.asteroids.splice(j, 1);

                        if (game.asteroids.length < 10) {
                            game.asteroids.push(createAsteroid());
                        }
                    }
                }
            }

            for (let i = 0; i < game.asteroids.length; i++) {
                const asteroid = game.asteroids[i];
                const dx = game.ship.x - asteroid.x;
                const dy = game.ship.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < game.ship.radius + asteroid.radius) {
                    game.ship.x = canvas.width / 2;
                    game.ship.y = canvas.height / 2;
                    game.ship.thrust = { x: 0, y: 0 };

                    game.asteroids = [];
                    for (let j = 0; j < 5; j++) {
                        let x: number;
                        let y: number;
                        let dist: number;
                        do {
                            x = Math.random() * canvas.width;
                            y = Math.random() * canvas.height;
                            const ddx = x - game.ship.x;
                            const ddy = y - game.ship.y;
                            dist = Math.sqrt(ddx * ddx + ddy * ddy);
                        } while (dist < 150);

                        game.asteroids.push(createAsteroid(x, y));
                    }

                    game.bullets = [];
                    setScore(0);
                    break;
                }
            }

            draw();
            game.animationFrameId = requestAnimationFrame(update);
        };

        const draw = () => {
            ctx.fillStyle = C.trail;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawStars();
            drawGrid();

            if (!game.ship) return;

            ctx.save();
            ctx.translate(game.ship.x, game.ship.y);
            ctx.rotate(game.ship.angle);

            ctx.beginPath();
            ctx.moveTo(game.ship.radius, 0);
            ctx.lineTo(-game.ship.radius, -game.ship.radius / 2);
            ctx.lineTo(-game.ship.radius, game.ship.radius / 2);
            ctx.closePath();
            ctx.shadowBlur = 14;
            ctx.shadowColor = C.shipGlow;
            ctx.strokeStyle = C.ship;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;

            if (game.keys[38] || game.keys[87]) {
                const g = ctx.createLinearGradient(
                    -game.ship.radius - 14,
                    0,
                    -game.ship.radius,
                    0,
                );
                g.addColorStop(0, C.thrustEdge);
                g.addColorStop(0.55, C.thrustCore);
                g.addColorStop(1, 'rgba(255, 42, 140, 0.15)');
                ctx.beginPath();
                ctx.moveTo(-game.ship.radius, 0);
                ctx.lineTo(-game.ship.radius - 12, -6);
                ctx.lineTo(-game.ship.radius - 4, 0);
                ctx.lineTo(-game.ship.radius - 12, 6);
                ctx.closePath();
                ctx.fillStyle = g;
                ctx.fill();
            }

            ctx.restore();

            game.asteroids.forEach((asteroid) => {
                ctx.beginPath();
                ctx.save();
                ctx.translate(asteroid.x, asteroid.y);

                ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
                for (let i = 1; i < asteroid.vertices.length; i++) {
                    ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
                }

                ctx.closePath();
                ctx.strokeStyle = asteroid.hue === 'alt' ? C.rockAlt : C.rock;
                ctx.lineWidth = asteroid.radius > 28 ? 1.5 : 1;
                ctx.shadowBlur = asteroid.hue === 'alt' ? 6 : 0;
                ctx.shadowColor = C.rockAlt;
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.restore();
            });

            game.bullets.forEach((bullet) => {
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
                ctx.shadowBlur = 8;
                ctx.shadowColor = C.bulletGlow;
                ctx.fillStyle = C.bullet;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        };

        game.animationFrameId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            if (game.animationFrameId != null) {
                cancelAnimationFrame(game.animationFrameId);
            }
        };
    }, []);

    return (
        <div className="relative h-full w-full" ref={containerRef}>
            <canvas ref={canvasRef} className="block h-full w-full bg-black" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(124,58,237,0.06)_0%,transparent_40%)]" />
            <div className="absolute top-3 left-3 z-10 max-w-[min(100%,14rem)] rounded border border-cyan-500/25 bg-black/55 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-primary/85 sm:text-xs">SCORE</p>
                <p className="font-orbitron text-xl tabular-nums text-synth-primary sm:text-2xl">{score}</p>
            </div>
            <div className="absolute top-3 right-3 z-10 rounded border border-fuchsia-500/20 bg-black/55 px-3 py-2 text-right backdrop-blur-sm sm:px-4 sm:py-3">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-secondary/90 sm:text-xs">HI</p>
                <p className="font-orbitron text-xl tabular-nums text-synth-secondary sm:text-2xl">{highScore}</p>
            </div>
        </div>
    );
}

export default function AsteroidsPage() {
    const gameShellRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
            /* fullscreen blocked, unsupported, or not in user gesture */
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
                <span className="font-mono-label text-sm text-synth-primary/80">{'// Retro Asteroids'}</span>
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
                        <AsteroidsCanvas />
                        <div className="absolute bottom-3 right-3 z-30">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded border border-cyan-500/35 bg-black/65 px-3 py-2 font-mono-label text-xs uppercase tracking-wider text-synth-primary shadow-[0_0_20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors hover:border-synth-primary/60 hover:text-white"
                                onClick={toggleFullscreen}
                                aria-pressed={isFullscreen}
                                title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fill the screen with the playfield'}
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
                WASD or arrow keys to thrust &amp; turn · Space to fire · Neon rocks cost more to split · Esc exits
                fullscreen
            </p>
        </SynthPageShell>
    );
}
