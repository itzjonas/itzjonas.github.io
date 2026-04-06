import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { SynthPageShell } from '@/components/SynthPageShell';
import { SectionTitle } from '@/components/portfolio/SectionTitle';

export default function ArcadePage() {
    const games = [
        {
            description: 'Blast asteroids and survive in the vast expanse of space.',
            link: '/arcade/asteroids',
            title: 'Retro Asteroids',
            wip: false,
        },
        {
            description: 'Defend Earth from relentless alien invaders.',
            link: '/arcade/space-invaders',
            title: 'Space Invaders Remastered',
            wip: false,
        },
        {
            description: 'Gobble up pellets and avoid those pesky ghosts.',
            link: '/arcade/pac-man',
            title: 'Pac-Man Turbo',
            wip: false,
        },
    ];

    return (
        <SynthPageShell>
            <header className="mb-10 md:mb-14 text-center md:text-left">
                <SectionTitle className="justify-center md:justify-start" label="ARCADE_CAB" sectionNumber={9} />
                <p className="mx-auto max-w-2xl text-synth-text-muted md:mx-0">
                    Classic arcade experiments. Pick a game and play in the viewport.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {games.map((game, index) => (
                    <article className="portfolio-card flex flex-col overflow-hidden p-5 md:p-6" key={game.link}>
                        <p className="font-mono-label mb-2 text-xs tracking-[0.2em]">
                            <span className="text-gradient-hero inline-block">
                                GAME_{String(index + 1).padStart(2, '0')}
                            </span>
                        </p>
                        <h2 className="font-orbitron mb-2 font-semibold text-synth-primary">{game.title}</h2>
                        <p className="mb-1 flex-1 text-sm leading-relaxed text-synth-text-muted">
                            {game.description}
                            {game.wip ? (
                                <>
                                    {' '}
                                    <span className="text-synth-accent">Work in progress</span>
                                </>
                            ) : null}
                        </p>
                        <Link
                            className="portfolio-link mt-4 inline-flex items-center gap-2 font-mono-label text-sm uppercase tracking-wider group"
                            href={game.link}
                        >
                            Launch
                            <ArrowRight
                                aria-hidden
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                strokeWidth={2}
                            />
                        </Link>
                    </article>
                ))}
            </div>
        </SynthPageShell>
    );
}
