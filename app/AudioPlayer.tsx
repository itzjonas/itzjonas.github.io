'use client';

import { useEffect, useState } from 'react';
import { useAudio } from '@/providers/AudioProvider';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

const iconClass = 'text-white/90';

/** Avoids hydration mismatches when browser extensions (e.g. Dark Reader) inject SVG attributes before React hydrates. */
const AudioPlayer = () => {
    const [mounted, setMounted] = useState(false);
    const { currentSong, isPlaying, next, pause, play, prev } = useAudio();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                aria-hidden
                className="w-full bg-black border-b border-[#FF00FF]/80 min-h-[44px] flex items-center justify-center"
            />
        );
    }

    return (
        <div className="w-full bg-black text-white py-2 flex justify-center items-center border-b border-[#FF00FF]/80 mx-auto">
            <div className="flex items-center max-w-[min(100%,480px)] w-full px-3 gap-3">
                <div className="flex items-center shrink-0">
                    <button
                        aria-label="Previous track"
                        className={`${iconClass} p-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded`}
                        onClick={prev}
                        type="button"
                    >
                        <SkipBack className="w-[18px] h-[18px]" strokeWidth={1.35} />
                    </button>
                    <span aria-hidden className="w-px h-5 bg-white/25" />
                    <button
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className={`${iconClass} p-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded`}
                        onClick={isPlaying ? pause : play}
                        type="button"
                    >
                        {isPlaying ? (
                            <Pause className="w-[18px] h-[18px]" strokeWidth={1.35} />
                        ) : (
                            <Play className="w-[18px] h-[18px] ml-0.5" strokeWidth={1.35} />
                        )}
                    </button>
                    <span aria-hidden className="w-px h-5 bg-white/25" />
                    <button
                        aria-label="Next track"
                        className={`${iconClass} p-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded`}
                        onClick={next}
                        type="button"
                    >
                        <SkipForward className="w-[18px] h-[18px]" strokeWidth={1.35} />
                    </button>
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                    <p
                        className="text-[10px] sm:text-xs text-white/70 animate-marquee whitespace-nowrap"
                        style={{
                            animationDuration: '12s',
                            animationIterationCount: 'infinite',
                            animationTimingFunction: 'linear',
                        }}
                    >
                        {isPlaying
                            ? currentSong?.displayName
                            : 'Insert Cassette... Press Play... Get Rad!'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
