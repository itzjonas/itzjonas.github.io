import { profile } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function About() {
    return (
        <section className="portfolio-section mb-16 md:mb-24 w-full max-w-none" id="about">
            <SectionTitle label="ABOUT" sectionNumber={1} />
            <blockquote className="quote-glow rounded-lg p-6 md:p-8 mb-10 w-full">
                <p className="font-orbitron text-lg md:text-xl font-semibold text-white leading-snug">
                    {profile.tagline}
                </p>
            </blockquote>
            <div className="space-y-4 text-synth-text-muted leading-relaxed w-full">
                {profile.about.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
