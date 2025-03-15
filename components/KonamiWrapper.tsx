'use client';

import { useEffect, useState } from 'react';
import type { Song } from '@/types/song';
import { AudioProvider } from '@/providers/AudioProvider';

interface KonamiWrapperProps {
    children: React.ReactNode;
    initialSongs: Song[];
}

const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

const KonamiWrapper: React.FC<KonamiWrapperProps> = ({
    children,
    initialSongs,
}) => {
    const [enteredCode, setEnteredCode] = useState<string[]>([]);
    const [konamiActive, setKonamiActive] = useState(false);
    const [songs, setSongs] = useState<Song[]>(initialSongs); // Initialize as an array
    const [isLightTheme, setIsLightTheme] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            const newCode = [...enteredCode, key];
            setEnteredCode(newCode);

            if (newCode.length > konamiCode.length) {
                newCode.shift();
            }

            if (JSON.stringify(newCode) === JSON.stringify(konamiCode)) {
                setKonamiActive(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enteredCode]);

    useEffect(() => {
        if (konamiActive) {
            const audio = new Audio('/audio/konami.mp3');
            audio.play();

            setSongs((prevSongs) => [
                ...prevSongs,
                {
                    displayName: 'Mystery Track 1',
                    filePath: '/audio/mt1.mp3',
                },
                {
                    displayName: 'Mystery Track 2',
                    filePath: '/audio/mt2.mp3',
                },
            ]);

            let switchCount = 0;
            const totalSwitches = 45;
            const switchInterval = 3000 / totalSwitches;

            const themeSwitchInterval = setInterval(() => {
                setIsLightTheme((prev) => !prev);
                switchCount++;

                if (switchCount >= totalSwitches) {
                    clearInterval(themeSwitchInterval);
                    setTimeout(() => {
                        setIsLightTheme(false);
                        setKonamiActive(false);
                    }, switchInterval);
                }
            }, switchInterval);

            return () => clearInterval(themeSwitchInterval);
        }
    }, [konamiActive]);

    const themeClass = isLightTheme ? 'bg-white text-black' : 'bg-black text-white';
    const transitionClass = 'transition-colors duration-200';

    return (
        <div className={`${themeClass} ${transitionClass}`}>
            <AudioProvider songs={songs}>{children}</AudioProvider>
        </div>
    );
};

export default KonamiWrapper;
