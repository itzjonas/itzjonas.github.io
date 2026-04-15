'use client';

import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SynthPageShell } from '@/components/SynthPageShell';

import Game from './Game';

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

export default function PacManPage() {
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
                <span className="font-mono-label text-sm text-synth-primary/80">{'// Pac-Man Turbo'}</span>
            </div>

            <div className="portfolio-card overflow-hidden p-2 sm:p-3">
                <div className="hud-frame relative w-full">
                    <span aria-hidden className="hud-frame__bracket hud-frame__bracket--tr" />
                    <span aria-hidden className="hud-frame__bracket hud-frame__bracket--bl" />
                    <div
                        ref={gameShellRef}
                        className={
                            isFullscreen
                                ? 'relative flex min-h-0 w-full flex-col overflow-hidden bg-synth-bg-mid pt-12'
                                : 'relative min-h-[280px] w-full overflow-hidden bg-synth-bg-mid pt-12 sm:min-h-[320px]'
                        }
                    >
                        <Game />
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
                Arrows queue turns · Dots score · Four specters chase · Space / Enter after round · Esc exits fullscreen
            </p>
        </SynthPageShell>
    );
}
