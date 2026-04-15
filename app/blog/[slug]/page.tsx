import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SynthPageShell } from '@/components/SynthPageShell';
import { getAllPostSlugs, getPostData } from '@/lib/posts';

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => ({
        slug: path.slug,
    }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const postData = await getPostData(slug);
        return {
            description: postData.excerpt || '',
            title: postData.title,
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post Not Found',
        };
    }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
    const { slug } = await params;
    let postData;
    try {
        postData = await getPostData(slug);
    } catch (error) {
        console.error('Error loading post:', error);
        return notFound();
    }

    return (
        <SynthPageShell innerClassName="max-w-3xl">
            <Link
                className="portfolio-link mb-8 inline-flex items-center gap-2 font-mono-label text-sm tracking-wide"
                href="/blog"
            >
                <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
                Back to dispatch
            </Link>

            <article>
                <header className="mb-8 border-b border-white/10 pb-8">
                    <p className="font-mono-label mb-2 text-xs tracking-wide text-synth-primary/80">
                        {'// LOG_ENTRY'}
                    </p>
                    <h1 className="portfolio-heading mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">{postData.title}</h1>
                    <time className="font-mono-label text-sm text-synth-text-muted" dateTime={postData.date}>
                        {format(new Date(postData.date), 'MMMM d, yyyy')}
                    </time>
                </header>

                <div
                    className="blog-prose"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                />
            </article>
        </SynthPageShell>
    );
}
