import { skillGroups } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Skills() {
    return (
        <section className="portfolio-section mb-16 md:mb-20" id="skills">
            <SectionTitle>Skills</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {skillGroups.map((group) => (
                    <div className="portfolio-card p-5 md:p-6" key={group.title}>
                        <h3 className="font-orbitron font-semibold text-synth-primary mb-3 text-sm uppercase tracking-wider">
                            {group.title}
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                            {group.skills.map((skill) => (
                                <li key={skill}>
                                    <span className="inline-block rounded-md bg-synth-bg-mid/80 px-2.5 py-1 text-sm text-synth-text border border-white/5">
                                        {skill}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
