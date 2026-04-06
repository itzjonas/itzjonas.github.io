import { certifications } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Certifications() {
    return (
        <section className="portfolio-section mb-16 md:mb-20" id="certifications">
            <SectionTitle>Certifications</SectionTitle>
            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                {certifications.map((c) => (
                    <li
                        className="portfolio-card px-4 py-3 text-sm text-synth-text-muted flex-1 min-w-[200px]"
                        key={c.name}
                    >
                        <span className="block text-synth-text font-medium">{c.name}</span>
                        <span className="text-xs text-synth-text-muted">
                            {c.issuer} · {c.issued}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
