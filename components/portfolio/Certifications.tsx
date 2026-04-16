import Image from 'next/image';

import { certifications } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Certifications() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="certifications">
            <SectionTitle label="CREDENTIALS" sectionNumber={5} />
            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                {certifications.map((c) => {
                    const meta = `${c.issuer} · ${c.pending ? 'Planned' : c.issued}`;
                    const showImage = Boolean(c.imageSrc);
                    const showPendingPlaceholder = Boolean(c.pending && !c.imageSrc);

                    const imageBlock =
                        showImage || showPendingPlaceholder ? (
                            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-synth-primary/20 bg-black/40">
                                {showImage ? (
                                    <Image
                                        alt={c.imageAlt ?? c.name}
                                        className="object-contain object-top"
                                        fill
                                        sizes="(max-width: 640px) 100vw, 320px"
                                        src={c.imageSrc!}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full min-h-[140px] items-center justify-center px-3 text-center text-[10px] font-mono-label uppercase tracking-[0.15em] text-synth-text-muted">
                                        Planned
                                    </div>
                                )}
                            </div>
                        ) : null;

                    const textBlock = (
                        <div className="flex flex-col gap-1 px-4 py-3">
                            <span className="text-synth-text font-medium">{c.name}</span>
                            <span className="text-xs font-mono-label text-synth-text-muted">{meta}</span>
                        </div>
                    );

                    const cardClass = `portfolio-card flex flex-col overflow-hidden flex-1 min-w-[200px] text-sm text-synth-text-muted ${c.pending ? 'opacity-75' : ''}`;

                    if (c.href && !c.pending) {
                        return (
                            <li className={cardClass} key={c.id ?? c.name}>
                                <a
                                    className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-synth-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                    href={c.href}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    {imageBlock}
                                    <div className="flex flex-col gap-1 px-4 py-3">
                                        <span className="font-medium text-synth-primary transition-colors duration-200 group-hover:text-synth-secondary">
                                            {c.name}
                                        </span>
                                        <span className="text-xs font-mono-label text-synth-text-muted">{meta}</span>
                                    </div>
                                </a>
                            </li>
                        );
                    }

                    return (
                        <li className={cardClass} key={c.id ?? c.name}>
                            {imageBlock}
                            {textBlock}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
