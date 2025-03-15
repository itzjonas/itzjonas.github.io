'use client';

import { useState } from 'react';
import { useAudio } from '@/providers/AudioProvider';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const AudioPlayer = () => {
  const { currentSong, isPlaying, play, pause, next, prev } = useAudio();
  // No more useRef or gradientPosition state

  return (
    <div className="w-full bg-gradient-to-r from-[#121212] to-[#282828] text-white py-2 flex justify-center items-center border-b border-[#FF00FF] mx-auto">
      <div className="flex items-center max-w-[320px] w-full">
        <div className="flex items-center rounded-full bg-gradient-to-r from-[#00FFFF] to-[#FF69B4]">
          <button
            onClick={prev}
            className="rounded-l-full bg-transparent border-none text-gray-900 px-2.5 py-1.5"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className="bg-transparent border-x text-gray-900 px-2.5 py-1.5"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={next}
            className="rounded-r-full bg-transparent border-none text-gray-900 px-2.5 py-1.5"
          >
            <SkipForward size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden ml-2 whitespace-nowrap">
          <p
            className="text-[10px] animate-marquee"
            style={{
              animationDuration: '10s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
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
