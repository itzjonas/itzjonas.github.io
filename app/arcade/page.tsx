'use client';

import Button from '@/components/Button';
// import Link from 'next/link';

export default function ArcadePage() {
  const games = [
    {
      description: 'Defend Earth from relentless alien invaders!',
      link: '/arcade/space-invaders',
      title: 'Space Invaders Remastered',
    },
    {
      description: 'Gobble up pellets and avoid those pesky ghosts!',
      link: '/arcade/pac-man',
      title: 'Pac-Man Turbo',
    },
    {
      description: 'Blast asteroids and survive in the vast expanse of space.',
      link: '/arcade/asteroids',
      title: 'Asteroids 3D',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-80s-black to-80s-dark-blue text-80s-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-80s-neon-pink drop-shadow-[0_0_8px_hsl(var(--80s-neon-pink))]">
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
            className="bg-80s-dark-gray p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-80s-magenta"
          >
            <h2 className="text-2xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
              {game.title}
            </h2>
            <p className="text-80s-light-gray mb-4">{game.description}</p>
            <Button>Coming soon</Button>
            {/* <Link href={game.link} className="text-80s-green hover:text-80s-yellow transition-colors duration-200">
              Play Now!
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}
