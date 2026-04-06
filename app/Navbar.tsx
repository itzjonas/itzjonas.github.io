'use client';

import { useEffect, useState } from 'react';
import AudioPlayer from '@/app/AudioPlayer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

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

    const homeSectionLinks = [
        { href: '/#about', label: 'About' },
        { href: '/#skills', label: 'Skills' },
        { href: '/#experience', label: 'Experience' },
        { href: '/#education', label: 'Education' },
        { href: '/#projects', label: 'Projects' },
        { href: '/#contact', label: 'Contact' },
    ];

    const globalLinks = [
        { href: '/', label: 'Home' },
        { href: '/arcade', label: 'Arcade' },
        { href: '/blog', label: 'Blog' },
    ];

    const desktopLinks = isHome
        ? [...homeSectionLinks, ...globalLinks.filter((l) => l.href !== '/')]
        : globalLinks;

    const mobileLinks = isHome ? [...homeSectionLinks, ...globalLinks] : globalLinks;

    const linkClass =
        'text-80s-cyan hover:text-80s-pink transition-colors duration-200 drop-shadow-[0_0_4px_rgba(0,229,255,0.35)] py-1 text-sm lg:text-base whitespace-nowrap';

    return (
        <nav className="w-full bg-80s-black/95 backdrop-blur-sm text-80s-white fixed top-0 left-0 z-50">
            <div className="w-full">
                <AudioPlayer />
            </div>

            <div className="w-full px-4 sm:px-8 py-3 border-b border-80s-magenta/60">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-2">
                    <button
                        aria-expanded={isOpen}
                        aria-label="Toggle menu"
                        className="md:hidden text-80s-cyan focus:outline-none shrink-0"
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    <div className="hidden md:flex flex-wrap items-center justify-end gap-x-4 lg:gap-x-6 gap-y-1">
                        {desktopLinks.map((link) => (
                            <Link
                                className={linkClass}
                                href={link.href}
                                key={link.href + link.label}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {isMobile && isOpen && (
                    <div className="absolute top-full left-0 w-full bg-80s-black border-t border-80s-magenta md:hidden max-h-[70vh] overflow-y-auto">
                        <div className="flex flex-col p-4 space-y-3">
                            {mobileLinks.map((link) => (
                                <Link
                                    className={linkClass}
                                    href={link.href}
                                    key={link.href + link.label}
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
};

export default Navbar;
