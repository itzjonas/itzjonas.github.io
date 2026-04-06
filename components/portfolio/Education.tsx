import { education } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Education() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="education">
            <SectionTitle label="ACADEMIC" sectionNumber={4} />
            <div className="grid gap-4 md:grid-cols-2">
                {education.map((edu) => (
                    <div className="portfolio-card p-5 md:p-6" key={edu.school}>
                        <h3 className="font-semibold text-synth-primary mb-1">{edu.degree}</h3>
                        <p className="text-synth-text font-mono-label text-sm">{edu.school}</p>
                        <p className="text-synth-text-muted text-sm mt-2 font-mono-label">
                            {edu.range}
                            {edu.location ? ` · ${edu.location}` : ''}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
