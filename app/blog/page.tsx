import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

// TYPES
import type { PostData } from '@/types/post';

export default function BlogPage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-80s-black to-80s-dark-blue text-80s-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-80s-neon-pink drop-shadow-[0_0_8px_hsl(var(--80s-neon-pink))]">
          From Floppy Disks to Modern Tricks
        </h1>
        <p className="mt-2 text-lg text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
          ...we&apos;re going back to the future of web development, 80s style!
        </p>
      </header>

      <div className="mx-auto">
        {allPostsData.map((post) => (
          <div
            key={post.id}
            className="mb-8 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-80s-magenta"
          >
            <h2 className="text-2xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
              <Link href={`/posts/${post.id}`} className="hover:text-80s-pink transition-colors duration-200">
                {post.title}
              </Link>
            </h2>
            <p className="text-80s-light-gray mb-4">{post.description}</p>
            <p className="text-sm text-80s-yellow">
              {new Date(post.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
