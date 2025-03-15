import { format } from 'date-fns';
import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export default function BlogPage() {
  const allPosts = getSortedPostsData();
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {allPosts.map(({ slug, date, title, excerpt }) => (
          <article key={slug} className="border-b pb-6">
            <Link href={`/blog/${slug}`} className="block">
              <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors">{title}</h2>
              <time className="text-gray-500 text-sm">
                {format(new Date(date), 'MMMM d, yyyy')}
              </time>
              <p className="mt-2 text-gray-700">{excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// export default async function BlogPage() {
//   const posts = await getAllPosts();

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-80s-black to-80s-dark-blue text-80s-white p-8">
//       <header className="text-center mb-12">
//         <h1 className="text-4xl font-bold text-80s-neon-pink drop-shadow-[0_0_8px_hsl(var(--80s-neon-pink))]">
//           From Floppy Disks to Modern Tricks
//         </h1>
//         <p className="mt-2 text-lg text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
//           ...we&apos;re going back to the future of web development, 80s style!
//         </p>
//       </header>

//       <div className="mx-auto">
//         {posts.map(({ slug, metadata }) => (
//           <div
//             key={slug}
//             className="mb-8 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-80s-magenta"
//           >
//             <h2 className="text-2xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
//               <Link
//                 href={`/blog/${slug}`}
//                 className="hover:text-80s-pink transition-colors duration-200"
//               >
//                 {metadata.title}
//               </Link>
//             </h2>
//             <p className="text-80s-light-gray mb-4">{metadata.description}</p>
//             <p className="text-sm text-80s-yellow">
//               {new Date(metadata.date).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
