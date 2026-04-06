import { DM_Sans, Orbitron, Press_Start_2P } from 'next/font/google';
import Footer from './Footer';
import KonamiWrapper from '@/components/KonamiWrapper';
import NavBar from '@/app/Navbar';

// STYLES
import './globals.css';

// TYPES
import type { Metadata } from 'next';
import type { Song } from '@/types/song';

const pressStart2P = Press_Start_2P({
    subsets: ['latin'],
    variable: '--font-press-start-2p',
    weight: '400',
});

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    weight: ['400', '500', '600', '700'],
});

const orbitron = Orbitron({
    subsets: ['latin'],
    variable: '--font-orbitron',
    weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
    description:
        'Jason Seegmiller — Principal Front End Developer at Shed. React, TypeScript, Next.js, and frontend architecture across healthcare and retail.',
    title: 'Jason Seegmiller | Principal Front End Developer',
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const initialSongs: Song[] = [
        {
            displayName: 'Never Gonna Give You Up',
            filePath: '/audio/nggyu.mp3',
        },
        {
            displayName: 'Sweet Dreams',
            filePath: '/audio/sd.mp3',
        },
        {
            displayName: 'Don\'t Stop Believin\'',
            filePath: '/audio/dsb.mp3',
        },
        {
            displayName: 'Material Girl',
            filePath: '/audio/mg.mp3',
        },
        {
            displayName: 'Girls Just Wanna Have Fun',
            filePath: '/audio/gjwhf.mp3',
        },
        {
            displayName: 'Under Pressure',
            filePath: '/audio/up.mp3',
        },
    ];

    const fontVariables = `${pressStart2P.variable} ${dmSans.variable} ${orbitron.variable}`;

    return (
        <html lang="en">
            <body className={`${fontVariables} antialiased bg-black`}>
                <KonamiWrapper initialSongs={initialSongs}>
                    <NavBar />
                    <div className="grid">
                        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </main>
                    </div>
                </KonamiWrapper>
                <Footer />
            </body>
        </html>
    );
}
