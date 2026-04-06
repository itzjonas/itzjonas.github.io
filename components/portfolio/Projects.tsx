import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { projects } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Projects() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="projects">
            <SectionTitle label="BLUEPRINTS" sectionNumber={6} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {projects.map((project, index) => (
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
                            <p className="font-mono-label text-xs tracking-[0.2em] mb-2">
                                <span className="text-gradient-hero inline-block">
                                    MODULE_{String(index + 1).padStart(2, '0')}
                                </span>
                            </p>
                            <h3 className="font-orbitron font-semibold text-synth-primary mb-2">{project.title}</h3>
                            <p className="text-synth-text-muted text-sm leading-relaxed flex-1">{project.description}</p>
                            <a
                                className="portfolio-link text-sm mt-4 inline-flex items-center gap-2 font-mono-label uppercase tracking-wider group"
                                href={project.href}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                View project
                                <ArrowRight
                                    aria-hidden
                                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                    strokeWidth={2}
                                />
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
