'use client';

import Link from 'next/link';

export default function ArcadePage() {
  const games = [
    {
      description: 'Blast asteroids and survive in the vast expanse of space.',
      link: '/arcade/asteroids',
      title: 'Retro Asteroids',
    },
    {
      description: <>Defend Earth from relentless alien invaders! <span className="text-80s-yellow">Work in Progress</span></>,
      link: '/arcade/space-invaders',
      title: 'Space Invaders Remastered',
    },
    {
      description: <>Gobble up pellets and avoid those pesky ghosts! <span className="text-80s-yellow">Work in Progress</span></>,
      link: '/arcade/pac-man',
      title: 'Pac-Man Turbo',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-80s-black to-background text-80s-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-heading drop-shadow-[0_0_8px_hsl(var(--80s-cyan))]">
          The 80s Arcade
        </h1>
        <p className="mt-2 text-lg text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
          Step right up and play some classic arcade games!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {games.map((game, index) => (
          <div
            key={index}
            className="bg-secondary-bg p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] hover:scale-105 hover:shadow-[0_0_15px_var(--80s-magenta)] transition-all duration-300 border border-80s-magenta"
          >
            <h2 className="text-2xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
              {game.title}
            </h2>
            <p className="text-foreground mb-4">{game.description}</p>
            <Link href={game.link} className="text-80s-green hover:text-80s-yellow transition-colors duration-200 [text-shadow:0_0_4px_var(--80s-green)] hover:[text-shadow:0_0_6px_var(--80s-yellow)]">
              Play Now!
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
