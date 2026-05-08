'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { HeroThreeScene } from '@/components/portfolio/HeroThreeScene';

export type HomeNameAccent = 'default' | 'jason' | 'seegmiller';

type HomeAccentContextValue = {
    accent: HomeNameAccent;
};

const HomeAccentContext = createContext<HomeAccentContextValue>({ accent: 'default' });

export function useHomeAccent(): HomeAccentContextValue {
    return useContext(HomeAccentContext);
}

const GRADIENT_PRESETS: Record<HomeNameAccent, { end: string; start: string }> = {
    default: { end: '#00e5ff', start: '#ff2a8c' },
    jason: { end: '#7c3aed', start: '#00e5ff' },
    seegmiller: { end: '#00e5ff', start: '#ff2a8c' },
};

const ACCENT_POOL = ['#00e5ff', '#39ff14', '#7c3aed', '#ff2a8c', '#ff9f1c', '#ff69b4'];

function randomPair(): { end: string; start: string } {
    const a = ACCENT_POOL[Math.floor(Math.random() * ACCENT_POOL.length)]!;
    let b = ACCENT_POOL[Math.floor(Math.random() * ACCENT_POOL.length)]!;

    while (b === a) {
        b = ACCENT_POOL[Math.floor(Math.random() * ACCENT_POOL.length)]!;
    }

    return { end: b, start: a };
}

function shouldIgnoreShortcutTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    if (target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) {
        return true;
    }

    return false;
}

const SECTION_IDS = ['about', 'skills', 'experience', 'education', 'certifications', 'projects', 'contact'] as const;

export function HomePageShell({ children }: { children: React.ReactNode }) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [accent, setAccent] = useState<HomeNameAccent>('default');
    const [randomGradient, setRandomGradient] = useState<{ end: string; start: string } | null>(null);
    const [helpOpen, setHelpOpen] = useState(false);

    const applyCssVars = useCallback((start: string, end: string, headingColor: string) => {
        const el = rootRef.current;

        if (!el) return;

        el.style.setProperty('--gradient-hero-start', start);
        el.style.setProperty('--gradient-hero-end', end);
        el.style.setProperty('--portfolio-heading-color', headingColor);
    }, []);

    useEffect(() => {
        if (randomGradient) {
            applyCssVars(randomGradient.start, randomGradient.end, randomGradient.start);

            return;
        }

        const g = GRADIENT_PRESETS[accent];
        const heading =
            accent === 'jason' ? '#00e5ff' : accent === 'seegmiller' ? '#ff2a8c' : '#ff2a8c';
        applyCssVars(g.start, g.end, heading);
    }, [accent, applyCssVars, randomGradient]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (shouldIgnoreShortcutTarget(e.target)) return;

            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.key === 'Escape') {
                setHelpOpen(false);
                setRandomGradient(null);
                setAccent('default');

                return;
            }

            if (e.key === '?') {
                e.preventDefault();
                setHelpOpen((o) => !o);

                return;
            }

            if (e.key === 'j' || e.key === 'J') {
                e.preventDefault();
                setRandomGradient(null);
                setAccent('jason');

                return;
            }

            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                setRandomGradient(null);
                setAccent('seegmiller');

                return;
            }

            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                setAccent('default');
                setRandomGradient(randomPair());

                return;
            }

            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                window.location.assign('/arcade');

                return;
            }

            const n = Number.parseInt(e.key, 10);

            if (n >= 1 && n <= 7) {
                e.preventDefault();
                const id = SECTION_IDS[n - 1];
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const ctx = useMemo(() => ({ accent }), [accent]);

    const sceneColors = useMemo(() => {
        if (randomGradient) {
            return { primary: randomGradient.start, secondary: randomGradient.end };
        }

        const g = GRADIENT_PRESETS[accent];

        return { primary: g.start, secondary: g.end };
    }, [accent, randomGradient]);

    return (
        <HomeAccentContext.Provider value={ctx}>
            <div className="portfolio-root text-synth-text relative" ref={rootRef}>
                <div className="pointer-events-none fixed inset-0 z-[1]">
                    <HeroThreeScene accentPrimary={sceneColors.primary} accentSecondary={sceneColors.secondary} />
                </div>

                <div className="portfolio-inner relative z-10 mx-auto flex w-full max-w-6xl flex-col py-8 sm:py-12 md:py-16 lg:py-20">
                    {children}
                </div>

                <button
                    aria-expanded={helpOpen}
                    className="font-mono-label fixed bottom-6 left-6 z-[60] rounded border border-synth-primary/35 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-wider text-synth-primary shadow-lg backdrop-blur-sm hover:border-synth-primary/60 sm:text-xs"
                    onClick={() => setHelpOpen((o) => !o)}
                    type="button"
                >
                    Keys (?)
                </button>

                {helpOpen ? (
                    <div
                        aria-modal="true"
                        className="fixed bottom-20 left-6 z-[60] max-w-sm rounded border border-white/10 bg-black/90 p-4 font-mono-label text-xs text-synth-text shadow-2xl backdrop-blur-md sm:text-sm"
                        role="dialog"
                    >
                        <p className="mb-3 font-orbitron text-sm tracking-wide text-synth-primary">Shortcuts</p>
                        <ul className="space-y-1.5 text-synth-text-muted [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-white/20 [&_kbd]:bg-white/5 [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:text-synth-text">
                            <li>
                                <kbd>?</kbd> Toggle this panel
                            </li>
                            <li>
                                <kbd>j</kbd> Jason accent · <kbd>s</kbd> Seegmiller accent
                            </li>
                            <li>
                                <kbd>r</kbd> Random gradient
                            </li>
                            <li>
                                <kbd>a</kbd> Go to arcade
                            </li>
                            <li>
                                <kbd>1</kbd>–<kbd>7</kbd> Jump to sections
                            </li>
                            <li>
                                <kbd>Esc</kbd> Reset accent
                            </li>
                        </ul>
                    </div>
                ) : null}
            </div>
        </HomeAccentContext.Provider>
    );
}
