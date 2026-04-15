import React from 'react';
import { useCart } from '../cart/CartProvider';
import { useAudioPlayer } from '../AudioPlayerContext';
import type { Beat } from '../../types/beats';

interface BeatCardProps {
  beat: Beat;
  view?: 'list' | 'grid';
}

const BeatCard: React.FC<BeatCardProps> = ({ beat, view = 'list' }) => {
  const { addBeatToCart } = useCart();
  const { currentBeat, isPlaying, playBeat, pauseBeat } = useAudioPlayer();

  const isThisBeatPlaying = currentBeat?.beat_id === beat.beat_id && isPlaying;
  const hasPreview = Boolean(beat.preview_path);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPreview) return;
    if (isThisBeatPlaying) {
      pauseBeat();
    } else {
      playBeat(beat);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, licenseType: 'lease' | 'exclusive') => {
    e.stopPropagation();
    const price = licenseType === 'lease' ? beat.lease_price : beat.exclusive_price;
    addBeatToCart({ beat_id: beat.beat_id, title: beat.title, cover_path: beat.cover_path }, licenseType, price);
  };

  if (view === 'grid') {
    return (
      <div
        className={`beat-card-grid${isThisBeatPlaying ? ' is-playing' : ''}`}
        role="article"
        aria-label={beat.title}
      >
        <div className="bcg-cover" onClick={handlePlayPause}>
          <img src={beat.cover_path} alt={beat.title} loading="lazy" />
          <div className="bcg-play-overlay" aria-hidden="true">
            {isThisBeatPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </div>
        </div>
        <div className="bcg-info">
          <h3 className="bcg-title">{beat.title}</h3>
          <div className="bcg-meta">
            <span>{beat.bpm} BPM</span>
            <span>·</span>
            <span>{beat.key}</span>
            <span>·</span>
            <span>{beat.genres[0]}</span>
          </div>
          <div className="beat-buy-btns">
            <button
              className="beat-btn-lease"
              onClick={(e) => handleAddToCart(e, 'lease')}
            >
              Lease {formatCurrency(beat.lease_price)}
            </button>
            <button
              className="beat-btn-exclusive"
              onClick={(e) => handleAddToCart(e, 'exclusive')}
            >
              Excl. {formatCurrency(beat.exclusive_price)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: list view
  return (
    <div
      className={`beat-card-list${isThisBeatPlaying ? ' is-playing' : ''}`}
      role="article"
      aria-label={beat.title}
    >
      <button
        className="bcl-play-btn"
        onClick={handlePlayPause}
        disabled={!hasPreview}
        aria-label={isThisBeatPlaying ? `Pause ${beat.title}` : `Play ${beat.title}`}
      >
        {isThisBeatPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        )}
      </button>

      <img src={beat.cover_path} alt={beat.title} className="bcl-cover" loading="lazy" />

      <div className="bcl-info">
        <span className="bcl-title">{beat.title}</span>
        <div className="bcl-tags">
          {beat.mood?.map(m => (
            <span key={m} className="bcl-tag bcl-tag-mood">{m}</span>
          ))}
          {beat.tags?.slice(0, 2).map(t => (
            <span key={t} className="bcl-tag">#{t}</span>
          ))}
        </div>
      </div>

      <div className="bcl-meta">
        <span className="bcl-bpm">{beat.bpm} BPM</span>
        <span className="bcl-key">{beat.key}</span>
        <span className="bcl-genre">{beat.genres[0]}</span>
      </div>

      <div className="beat-buy-btns">
        <button
          className="beat-btn-lease"
          onClick={(e) => handleAddToCart(e, 'lease')}
        >
          Lease {formatCurrency(beat.lease_price)}
        </button>
        <button
          className="beat-btn-exclusive"
          onClick={(e) => handleAddToCart(e, 'exclusive')}
        >
          Excl. {formatCurrency(beat.exclusive_price)}
        </button>
      </div>
    </div>
  );
};

export default BeatCard;
