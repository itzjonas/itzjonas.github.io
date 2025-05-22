import { Press_Start_2P } from 'next/font/google';
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

export const metadata: Metadata = {
    description:
        'My digital domain is undergoing a radical transformation! I\'m channeling the power of the 80s to create a portfolio that\'s as vibrant and exciting as a synthwave soundtrack. Stay tuned for updates, and prepare to be amazed!',
    title: 'Decoding JS',
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

    return (
        <html lang="en">
            <body className={`${pressStart2P.variable} antialiased bg-background`}>
                <KonamiWrapper initialSongs={initialSongs}>
                    <NavBar />
                    <div className="grid">
                        <main className="pt-30 max-w-[960px] w-full mx-auto">
                            {children}
                        </main>
                    </div>
                </KonamiWrapper>
                <Footer />
            </body>
        </html>
    );
}
