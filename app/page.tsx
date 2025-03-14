import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-80s-black text-80s-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="rounded-full overflow-hidden w-48 h-48">
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
          <h1 className="text-4xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))]">
            Portfolio: Under Construction!
          </h1>
          <p className="mt-4 text-lg text-80s-pink drop-shadow-[0_0_8px_hsl(var(--80s-pink))]">
            Whoa, dude! My digital digs are still loading...
          </p>
          <p className="mt-2 text-lg text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
            Check back soon for a totally tubular portfolio!
          </p>
          <p className="mt-4 text-sm text-80s-magenta drop-shadow-[0_0_8px_hsl(var(--80s-magenta))]">
            (Patience is a virtue, just like a high score on Pac-Man.)
          </p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-80s-white">
          Stay tuned for more!
        </p>
      </footer>
    </div>
  );
}