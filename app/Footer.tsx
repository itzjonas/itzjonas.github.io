export default function Footer() {
    return (
        <footer className="w-full py-6 border-t border-synth-primary/20 bg-synth-bg/90 backdrop-blur-sm">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 text-center text-synth-text-muted text-sm">
                <p>&copy; {new Date().getFullYear()} Jason Seegmiller. All rights reserved.</p>
            </div>
        </footer>
    );
}
