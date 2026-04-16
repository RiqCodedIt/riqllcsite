import React, { createContext, useContext, useState } from 'react';
import type { Beat } from '../types/beats';

interface AudioPlayerContextType {
  currentBeat: Beat | null;
  isPlaying: boolean;
  playBeat: (beat: Beat) => void;
  pauseBeat: () => void;
  togglePlayPause: () => void;
  stopBeat: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playBeat = (beat: Beat) => {
    setCurrentBeat(beat);
    setIsPlaying(true);
  };

  const pauseBeat = () => setIsPlaying(false);

  const togglePlayPause = () => {
    if (!currentBeat) return;
    setIsPlaying(prev => !prev);
  };

  const stopBeat = () => {
    setIsPlaying(false);
    setCurrentBeat(null);
  };

  return (
    <AudioPlayerContext.Provider value={{ currentBeat, isPlaying, playBeat, pauseBeat, togglePlayPause, stopBeat }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
};
