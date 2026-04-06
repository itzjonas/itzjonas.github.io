import { education } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Education() {
    return (
        <section className="portfolio-section mb-16 md:mb-20" id="education">
            <SectionTitle>Education</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
                {education.map((edu) => (
                    <div className="portfolio-card p-5 md:p-6" key={edu.school}>
                        <h3 className="font-semibold text-synth-primary mb-1">{edu.degree}</h3>
                        <p className="text-synth-text">{edu.school}</p>
                        <p className="text-synth-text-muted text-sm mt-2">
                            {edu.range}
                            {edu.location ? ` · ${edu.location}` : ''}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
