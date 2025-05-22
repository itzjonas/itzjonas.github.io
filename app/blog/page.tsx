// import { format } from 'date-fns';
// import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts'; // Assuming getAllPosts is the correct function

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-80s-black to-background text-80s-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-heading drop-shadow-[0_0_8px_hsl(var(--80s-cyan))]">
          From Floppy Disks to Modern Tricks
        </h1>
        <p className="mt-2 text-lg text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
          ...we&apos;re going back to the future of web development, 80s style!
        </p>
      </header>

      <div className="mx-auto">
        {posts.map(({ slug, metadata }) => (
          <div
            key={slug}
            className="mb-8 p-6 rounded-lg bg-secondary-bg shadow-[0_0_10px_var(--80s-magenta)] hover:scale-105 hover:shadow-[0_0_15px_var(--80s-magenta)] transition-all duration-300 border border-80s-magenta"
          >
            <h2 className="text-2xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
              <Link
                href={`/blog/${slug}`}
                className="hover:text-80s-white hover:drop-shadow-[0_0_6px_hsl(var(--80s-cyan))] transition-colors duration-200"
              >
                {metadata.title}
              </Link>
            </h2>
            <p className="text-foreground mb-4">{metadata.description}</p>
            <p className="text-sm text-80s-yellow">
              {new Date(metadata.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
