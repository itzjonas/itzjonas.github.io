'use client';

import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import AsteroidsThree from '@/components/arcade/AsteroidsThree';
import { SynthPageShell } from '@/components/SynthPageShell';

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

export default function AsteroidsPage() {
    const gameShellRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        try {
            const stored = Number(localStorage.getItem('asteroids-high') ?? '0');
            if (!Number.isNaN(stored)) {
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
            /* fullscreen blocked, unsupported, or not in user gesture */
        }
    }, []);

    const onScoreDelta = useCallback((delta: number) => {
        setScore((prevScore) => {
            const next = prevScore + delta;
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
    }, []);

    const onScoreReset = useCallback(() => {
        setScore(0);
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
                        <AsteroidsThree onScoreDelta={onScoreDelta} onScoreReset={onScoreReset} />
                        <div className="pointer-events-none absolute top-3 left-3 z-10 max-w-[min(100%,14rem)] rounded border border-cyan-500/25 bg-black/55 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
                            <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-primary/85 sm:text-xs">SCORE</p>
                            <p className="font-orbitron text-xl tabular-nums text-synth-primary sm:text-2xl">{score}</p>
                        </div>
                        <div className="pointer-events-none absolute top-3 right-3 z-10 rounded border border-fuchsia-500/20 bg-black/55 px-3 py-2 text-right backdrop-blur-sm sm:px-4 sm:py-3">
                            <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-secondary/90 sm:text-xs">HI</p>
                            <p className="font-orbitron text-xl tabular-nums text-synth-secondary sm:text-2xl">{highScore}</p>
                        </div>
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
