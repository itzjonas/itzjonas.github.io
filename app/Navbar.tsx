'use client';

import { useState, useEffect } from 'react';
import AudioPlayer from '@/app/AudioPlayer';
import Link from 'next/link';

// TYPES
import type { Song } from '@/types/song';

const Navbar = ({ songs }: { songs: Song[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/arcade', label: 'Arcade' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="w-full bg-80s-black text-80s-white fixed top-0 left-0 z-50">
      <div className="w-full">
        <AudioPlayer />
      </div>

      {/* Navigation Links */}
      <div className="w-full px-4 sm:px-8 py-4 border-b border-80s-magenta">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <button
            className="md:hidden text-80s-cyan focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-80s-cyan hover:text-80s-pink transition-colors duration-200 drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {isMobile && isOpen && (
          <div className="absolute top-full left-0 w-full bg-80s-black border-t border-80s-magenta md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-80s-cyan hover:text-80s-pink transition-colors duration-200 drop-shadow-[0_0_4px_hsl(var(--80s-cyan))]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
