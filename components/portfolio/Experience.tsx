import { experience } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Experience() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="experience">
            <SectionTitle label="CHRONOLOGY" sectionNumber={3} />
            <div className="relative">
                <div
                    aria-hidden
                    className="absolute left-[7px] top-2 bottom-2 w-px md:left-[11px] bg-gradient-to-b from-synth-primary via-synth-secondary to-synth-tertiary opacity-70"
                />
                <ul className="flex flex-col gap-0">
                    {experience.map((job) => (
                        <li className="relative pl-8 md:pl-12 pb-12 last:pb-0" key={job.id}>
                            <span
                                aria-hidden
                                className="font-mono-label absolute left-0 top-1.5 w-[15px] h-[15px] md:w-[23px] md:h-[23px] border-2 border-synth-primary bg-black shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                            />
                            <article className="portfolio-card p-5 md:p-7 -mt-1">
                                <p className="font-mono-label text-sm text-synth-primary mb-2 tracking-wide">
                                    {job.range}
                                    {job.location ? ` · ${job.location}` : ''}
                                </p>
                                <h3 className="font-orbitron text-lg md:text-xl font-semibold text-white mb-1">{job.role}</h3>
                                <p className="text-synth-accent font-medium font-mono-label text-sm mb-4">{job.company}</p>
                                <ul className="list-disc list-inside space-y-2 text-synth-text-muted text-sm md:text-base leading-relaxed marker:text-synth-secondary">
                                    {job.highlights.map((line, i) => (
                                        <li key={i}>{line}</li>
                                    ))}
                                </ul>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
