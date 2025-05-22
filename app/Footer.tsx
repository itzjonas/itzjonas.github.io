export default function Footer() {
  return (
    <footer className="w-full py-4 border-t border-80s-magenta shadow-[0_-2px_10px_var(--80s-magenta)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 text-center text-80s-white">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Jason Seegmiller. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
