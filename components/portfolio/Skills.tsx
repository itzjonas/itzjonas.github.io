import { Code2, Server, Sparkles, Wrench } from 'lucide-react';

import { skillGroups } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

const iconFor = (title: string) => {
    if (title.includes('AI')) return Sparkles;
    if (title.includes('Backend')) return Server;
    if (title.includes('DevOps') || title.includes('Quality')) return Wrench;
    return Code2;
};

export function Skills() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="skills">
            <SectionTitle label="SKILLS" sectionNumber={2} />
            <p className="font-mono-label text-xs md:text-sm text-synth-secondary mb-6 -mt-2 tracking-widest uppercase">
                02.1 ASSET LOG
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {skillGroups.map((group) => {
                    const Icon = iconFor(group.title);
                    return (
                        <div className="portfolio-card portfolio-card--dark p-5 md:p-6" key={group.title}>
                            <div className="flex items-start gap-3 mb-4">
                                <span className="text-synth-primary shrink-0 [&>svg]:w-6 [&>svg]:h-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                                    <Icon aria-hidden strokeWidth={1.75} />
                                </span>
                                <h3 className="font-orbitron font-semibold text-synth-primary text-sm uppercase tracking-wider">
                                    {group.title}
                                </h3>
                            </div>
                            <ul className="flex flex-wrap gap-2">
                                {group.skills.map((skill) => (
                                    <li key={skill}>
                                        <span className="font-mono-label inline-block rounded px-2 py-1 text-xs text-synth-text border border-white/10 bg-black/40">
                                            {skill}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
