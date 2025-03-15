'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';

// TYPES
import type { Song } from '@/types/song';
interface AudioContextProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentSong: Song;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
}

const AudioContext = createContext<AudioContextProps | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ songs, children }: { songs: Song[]; children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null); // Keep null here
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return; // Add null check

    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.displayName,
      artist: 'Unknown Artist',
    });

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('nexttrack', () => next());
    navigator.mediaSession.setActionHandler('previoustrack', () => prev());
  }, [currentSong]);

  const next = () => setCurrentSongIndex((i) => (i + 1) % songs.length);
  const prev = () => setCurrentSongIndex((i) => (i - 1 + songs.length) % songs.length);
  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <AudioContext.Provider
      value={{ audioRef, currentSong, isPlaying, play, pause, next, prev }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.filePath}
        onEnded={next}
        preload="auto"
      />
    </AudioContext.Provider>
  );
};
