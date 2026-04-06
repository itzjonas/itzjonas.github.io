import { profile } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function About() {
    return (
        <section className="portfolio-section mb-16 md:mb-20">
            <SectionTitle>About</SectionTitle>
            <div className="space-y-4 text-synth-text-muted leading-relaxed max-w-3xl">
                {profile.about.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
