import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { SynthPageShell } from '@/components/SynthPageShell';
import { SectionTitle } from '@/components/portfolio/SectionTitle';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
    const allPosts = getSortedPostsData();

    return (
        <SynthPageShell>
            <header className="mb-10 md:mb-14">
                <SectionTitle label="DISPATCH" sectionNumber={8} />
                <p className="max-w-2xl text-synth-text-muted">
                    Notes on frontend development, tooling, and whatever else fits the log.
                </p>
            </header>

            <div className="flex flex-col gap-6 md:gap-8">
                {allPosts.map(({ slug, date, title, excerpt }) => (
                    <article className="portfolio-card p-5 md:p-6" key={slug}>
                        <Link className="group block" href={`/blog/${slug}`}>
                            <time
                                className="font-mono-label mb-2 block text-xs tracking-wide text-synth-primary/80"
                                dateTime={date}
                            >
                                {format(new Date(date), 'MMMM d, yyyy')}
                            </time>
                            <h2 className="font-orbitron mb-2 text-lg font-semibold text-synth-primary transition-colors group-hover:text-synth-secondary sm:text-xl">
                                {title}
                            </h2>
                            <p className="mb-4 text-sm leading-relaxed text-synth-text-muted">{excerpt}</p>
                            <span className="portfolio-link inline-flex items-center gap-2 font-mono-label text-sm uppercase tracking-wider">
                                Read entry
                                <ArrowRight
                                    aria-hidden
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    strokeWidth={2}
                                />
                            </span>
                        </Link>
                    </article>
                ))}
            </div>
        </SynthPageShell>
    );
}
