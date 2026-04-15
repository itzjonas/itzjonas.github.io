'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import AudioPlayer from '@/app/AudioPlayer';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';
    const contactHref = '/#contact';

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
        { href: '/#certifications', label: 'Certifications' },
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
        <nav className="w-full bg-black/95 backdrop-blur-sm text-80s-white fixed top-0 left-0 z-50 border-b border-white/5">
            <div className="w-full">
                <AudioPlayer />
            </div>

            <div className="w-full px-4 sm:px-8 py-3 border-b border-synth-secondary/30">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-3">
                    <Link
                        className="font-orbitron text-sm sm:text-base font-bold tracking-[0.2em] text-white hover:text-synth-primary transition-colors shrink-0"
                        href="/"
                    >
                        JS
                    </Link>

                    <button
                        aria-expanded={isOpen}
                        aria-label="Toggle menu"
                        className="md:hidden text-80s-cyan focus:outline-none shrink-0 ml-auto"
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

                    <div className="hidden md:flex flex-wrap items-center justify-end gap-x-3 lg:gap-x-5 gap-y-1 flex-1">
                        {desktopLinks.map((link) => (
                            <Link
                                className={linkClass}
                                href={link.href}
                                key={link.href + link.label}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link className="btn-gradient ml-2 text-center" href={contactHref}>
                            Hire me
                        </Link>
                    </div>
                </div>

                {isMobile && isOpen && (
                    <div className="absolute top-full left-0 w-full bg-black border-t border-synth-secondary/30 md:hidden max-h-[70vh] overflow-y-auto">
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
                            <Link
                                className="btn-gradient text-center mt-2"
                                href={contactHref}
                                onClick={() => setIsOpen(false)}
                            >
                                Hire me
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
