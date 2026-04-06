import Link from 'next/link';

const footerLinks = [
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#education', label: 'Education' },
    { href: '/#certifications', label: 'Certifications' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contact' },
    { href: '/arcade', label: 'Arcade' },
    { href: '/blog', label: 'Blog' },
];

export default function Footer() {
    return (
        <footer className="w-full py-8 border-t border-synth-primary/15 bg-black/90 backdrop-blur-sm">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex flex-col gap-6 items-center">
                <nav aria-label="Footer">
                    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-mono-label text-synth-text-muted">
                        {footerLinks.map((item) => (
                            <li key={item.href + item.label}>
                                <Link className="hover:text-synth-primary transition-colors" href={item.href}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <p className="text-synth-text-muted/80 text-sm text-center">
                    &copy; {new Date().getFullYear()} Jason Seegmiller. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
