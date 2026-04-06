import { experience } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Experience() {
    return (
        <section className="portfolio-section mb-16 md:mb-20" id="experience">
            <SectionTitle>Experience</SectionTitle>
            <div className="flex flex-col gap-6 md:gap-8">
                {experience.map((job) => (
                    <article className="portfolio-card p-6 md:p-8" key={job.id}>
                        <header className="mb-3">
                            <h3 className="font-orbitron text-lg md:text-xl font-semibold text-synth-primary">
                                {job.role}
                            </h3>
                            <p className="text-synth-accent font-medium">{job.company}</p>
                            <p className="text-synth-text-muted text-sm mt-1">
                                {job.range}
                                {job.location ? ` · ${job.location}` : ''}
                            </p>
                        </header>
                        <ul className="list-disc list-inside space-y-2 text-synth-text-muted text-sm md:text-base leading-relaxed">
                            {job.highlights.map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}
