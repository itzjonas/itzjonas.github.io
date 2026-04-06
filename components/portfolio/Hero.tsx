import Image from 'next/image';
import Link from 'next/link';

import { contact, profile } from '@/lib/resume';

export function Hero() {
    return (
        <section className="portfolio-section mb-20 md:mb-28 pt-6 md:pt-10" id="hero">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 lg:items-start">
                <div className="relative shrink-0 w-full max-w-[min(100%,380px)] lg:max-w-[420px] aspect-square">
                    <div className="hud-frame h-full w-full p-2">
                        <span aria-hidden className="hud-frame__bracket hud-frame__bracket--tr" />
                        <span aria-hidden className="hud-frame__bracket hud-frame__bracket--bl" />
                        <div className="relative h-full w-full overflow-hidden bg-synth-bg-mid">
                            <Image
                                alt="Jason Seegmiller"
                                className="object-cover"
                                fill
                                priority
                                sizes="(max-width: 1024px) 90vw, 420px"
                                src="/profile.jpeg"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 gap-8">
                    <div>
                        <h1 className="sr-only">
                            {profile.name}, {profile.title} at {profile.company}
                        </h1>
                        <p
                            aria-hidden
                            className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-2 md:mb-3"
                        >
                            {profile.heroLine1}
                        </p>
                        <p
                            aria-hidden
                            className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gradient-hero leading-[1.12] pb-1"
                        >
                            {profile.heroLine2}
                        </p>
                        <p className="mt-4 text-synth-text-muted max-w-xl">
                            {profile.title} · {profile.company} · {profile.location}
                        </p>
                        <p className="mt-3 text-synth-text-muted/90 max-w-xl text-sm md:text-base">{profile.tagline}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center lg:items-start">
                        <Link className="btn-gradient" href="/#contact">
                            Get in touch
                        </Link>
                        <a
                            className="font-mono-label text-sm text-synth-primary border border-synth-primary/40 px-5 py-3 rounded hover:bg-synth-primary/10 transition-colors"
                            href={`mailto:${contact.email}?subject=Hello`}
                        >
                            Email me
                        </a>
                    </div>

                    <a
                        className="flex flex-col items-center gap-2 text-synth-text-muted font-mono-label text-xs tracking-[0.2em] uppercase mt-4 lg:mt-8 hover:text-synth-primary transition-colors group"
                        href="#about"
                    >
                        <span>Scroll</span>
                        <svg
                            aria-hidden
                            className="w-5 h-5 animate-bounce opacity-70 group-hover:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
