import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../cart/CartProvider';
import type { Beat } from '../../types/beats';

interface BeatCardProps {
  beat: Beat;
  isPlaying?: boolean;
  onPlay?: (beatId: string) => void;
  onPause?: () => void;
}

const BeatCard: React.FC<BeatCardProps> = ({ beat, isPlaying = false, onPlay, onPause }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { addBeatToCart } = useCart();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (onPause) onPause();
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      if (onPause) onPause();
    } else {
      if (onPlay) onPlay(beat.beat_id);
    }
  };

  const handleAddToCart = (licenseType: 'lease' | 'exclusive') => {
    const price = licenseType === 'lease' ? beat.lease_price : beat.exclusive_price;
    addBeatToCart(
      {
        beat_id: beat.beat_id,
        title: beat.title,
        cover_path: beat.cover_path
      },
      licenseType,
      price
    );
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="beat-card">
      <div className="beat-cover">
        <img src={beat.cover_path} alt={beat.title} />
        
        {/* Play/Pause Overlay */}
        <div className="play-overlay">
          <button 
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : isPlaying ? (
              <span className="pause-icon">⏸</span>
            ) : (
              <span className="play-icon">▶</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}

        {/* Time Display */}
        {isPlaying && (
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>

      <div className="beat-info">
        <h3 className="beat-title">{beat.title}</h3>
        
        <div className="beat-metadata">
          <span className="beat-bpm">{beat.bpm} BPM</span>
          <span className="beat-key">{beat.key}</span>
          {beat.genres.map((genre, index) => (
            <span key={index} className="beat-genre">{genre}</span>
          ))}
        </div>

        {beat.tags && beat.tags.length > 0 && (
          <div className="beat-tags">
            {beat.tags.map((tag, index) => (
              <span key={index} className="beat-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="beat-pricing">
          <button 
            className="lease-btn"
            onClick={() => handleAddToCart('lease')}
          >
            Lease - {formatCurrency(beat.lease_price)}
          </button>
          <button 
            className="exclusive-btn"
            onClick={() => handleAddToCart('exclusive')}
          >
            Exclusive - {formatCurrency(beat.exclusive_price)}
          </button>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        preload="metadata"
        src={beat.preview_path}
      />
    </div>
  );
};

export default BeatCard;
