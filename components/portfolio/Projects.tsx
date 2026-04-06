import Image from 'next/image';

import { projects } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Projects() {
    return (
        <section className="portfolio-section mb-16 md:mb-20" id="projects">
            <SectionTitle>Projects</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {projects.map((project) => (
                    <article className="portfolio-card overflow-hidden flex flex-col" key={project.id}>
                        <a
                            className="block relative aspect-[5/3] w-full bg-synth-bg-mid"
                            href={project.href}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Image
                                alt={project.imageAlt}
                                className="object-cover"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                src={project.imageSrc}
                            />
                        </a>
                        <div className="p-5 md:p-6 flex flex-col flex-1">
                            <h3 className="font-orbitron font-semibold text-synth-primary mb-2">
                                {project.title}
                            </h3>
                            <p className="text-synth-text-muted text-sm leading-relaxed flex-1">{project.description}</p>
                            <a
                                className="portfolio-link text-sm mt-4 inline-block"
                                href={project.href}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                View →
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
