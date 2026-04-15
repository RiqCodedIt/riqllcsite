import React, { useEffect, useRef, useState } from 'react';
import '../styles/AudioPlayer.css';
import type { Beat } from '../types/beats';

interface AudioPlayerProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentBeat, isPlaying, onPlayPause, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Load new beat
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentBeat?.preview_path) return;
    audio.src = currentBeat.preview_path;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
  }, [currentBeat?.beat_id]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentBeat) return null;

  return (
    <div className="audio-player" role="region" aria-label="Audio player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
      />

      <div className="audio-player-inner">
        {/* Cover + Title */}
        <div className="ap-track-info">
          <img
            src={currentBeat.cover_path}
            alt={currentBeat.title}
            className="ap-cover"
          />
          <div className="ap-meta">
            <span className="ap-title">{currentBeat.title}</span>
            <span className="ap-detail">{currentBeat.bpm} BPM · {currentBeat.key}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="ap-controls">
          <button
            className="ap-play-btn"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>

          <div className="ap-progress-wrap">
            <span className="ap-time">{formatTime(currentTime)}</span>
            <div className="ap-progress-track" role="none">
              <div
                className="ap-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <input
                type="range"
                className="ap-seek"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek"
              />
            </div>
            <span className="ap-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="ap-volume">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {volume > 0 && <path d="M19.07 4.93a10 10 0 010 14.14"/>}
            {volume > 0 && <path d="M15.54 8.46a5 5 0 010 7.07"/>}
          </svg>
          <input
            type="range"
            className="ap-volume-slider"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
