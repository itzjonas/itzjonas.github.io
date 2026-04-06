import Image from 'next/image';

import { profile } from '@/lib/resume';

export function Hero() {
    return (
        <section id="about" className="portfolio-section mb-16 md:mb-24 pt-4">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                <div className="relative shrink-0 rounded-full overflow-hidden w-64 sm:w-80 md:w-96 aspect-square border-2 border-synth-primary/40 shadow-[0_0_32px_rgba(0,229,255,0.25)]">
                    <Image
                        alt="Jason Seegmiller"
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 768px) 80vw, 400px"
                        src="/profile.jpeg"
                    />
                </div>

                <div className="text-center lg:text-left max-w-xl">
                    <h1 className="portfolio-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                        {profile.name}
                    </h1>
                    <p className="text-lg sm:text-xl text-synth-primary font-medium mb-1">
                        {profile.title}
                    </p>
                    <p className="text-synth-secondary text-sm sm:text-base font-medium mb-4">
                        {profile.company} · {profile.location}
                    </p>
                    <p className="text-synth-text-muted leading-relaxed">{profile.tagline}</p>
                </div>
            </div>
        </section>
    );
}
