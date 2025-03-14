import { getSortedPostsData } from '@/lib/posts';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const allPostsData = getSortedPostsData();

  console.log(allPostsData);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 md:p-16 lg:p-20 pb-8 sm:pb-12 md:pb-16 lg:pb-20 gap-8 sm:gap-12 md:gap-16 font-[family-name:var(--font-geist-sans)] bg-80s-black text-80s-white">
      <main className="flex flex-col gap-8 sm:gap-12 md:gap-16 row-start-2 items-center max-w-screen-sm">
        <div className="rounded-full overflow-hidden w-48 sm:w-64 md:w-72 lg:w-80 h-48 sm:h-64 md:h-72 lg:h-80">
          <Image
            alt="Your Profile"
            className="object-cover w-full h-full"
            height={200}
            priority
            src="/profile.jpeg"
            width={200}
          />
        </div>

        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))]">
            Portfolio: Under Construction!
          </h1>
          <p className="mt-2 sm:mt-4 text-lg text-80s-pink drop-shadow-[0_0_8px_hsl(var(--80s-pink))]">
            Whoa, dude! My digital digs are still loading...
          </p>
          <p className="mt-1 sm:mt-2 text-lg text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
            Check back soon for a totally tubular portfolio!
          </p>
          <p className="mt-2 sm:mt-4 text-sm text-80s-magenta drop-shadow-[0_0_8px_hsl(var(--80s-magenta))]">
            (Patience is a virtue, just like a high score on Pac-Man.)
          </p>

          {/* <h1>Blog Posts</h1>
          <ul>
            {allPostsData.map(({ id, date, title }) => (
              <li key={id}>
                <Link href={`/posts/${id}`}>
                  {title}
                </Link>
                <br />
                {new Date(date).toLocaleDateString()}
              </li>
            ))}
          </ul> */}
        </div>
      </main>
      <footer className="row-start-3 flex gap-4 sm:gap-8 md:gap-12 flex-wrap items-center justify-center">
        <p className="text-sm text-80s-white">
          Stay tuned for more!
        </p>
      </footer>
    </div>
  );
}