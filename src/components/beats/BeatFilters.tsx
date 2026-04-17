import React, { useState } from 'react';
import type { BeatFilters } from '../../types/beats';
import { GENRES, MOODS, KEYS, BPM_RANGES } from '../../types/beats';

interface BeatFiltersProps {
  filters: BeatFilters;
  onFiltersChange: (filters: BeatFilters) => void;
  onClearFilters: () => void;
}

const BeatFiltersComponent: React.FC<BeatFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const setGenre = (genre: string | undefined) => {
    onFiltersChange({ ...filters, genre });
  };

  const setMood = (mood: string | undefined) => {
    onFiltersChange({ ...filters, mood });
  };

  const hasActive = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="beat-filters-bar">
      {/* Search */}
      <div className="bfb-search-wrap">
        <svg className="bfb-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          className="bfb-search"
          placeholder="Search beats..."
          value={filters.search || ''}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value || undefined })}
          aria-label="Search beats"
        />
      </div>

      {/* Mood pills */}
      <div className="bfb-pills-row" role="group" aria-label="Filter by mood">
        <button
          type="button"
          className={`bfb-pill${!filters.mood ? ' active' : ''}`}
          aria-pressed={!filters.mood}
          onClick={() => setMood(undefined)}
        >
          All
        </button>
        {MOODS.map(mood => (
          <button
            key={mood}
            type="button"
            className={`bfb-pill${filters.mood === mood ? ' active' : ''}`}
            aria-pressed={filters.mood === mood}
            onClick={() => setMood(filters.mood === mood ? undefined : mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Genre + More Filters row */}
      <div className="bfb-bottom-row">
        <div className="bfb-genre-wrap">
          <label htmlFor="bfb-genre" className="bfb-label">Genre</label>
          <select
            id="bfb-genre"
            className="bfb-select"
            value={filters.genre || ''}
            onChange={e => setGenre(e.target.value || undefined)}
          >
            <option value="">All Genres</option>
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`bfb-more-btn${moreOpen ? ' open' : ''}`}
          onClick={() => setMoreOpen(prev => !prev)}
          aria-expanded={moreOpen}
          aria-controls="bfb-more-panel"
        >
          More Filters
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
            <polyline points="2,4 6,8 10,4" />
          </svg>
        </button>

        {hasActive && (
          <button type="button" className="bfb-clear-btn" onClick={onClearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* More Filters panel */}
      {moreOpen && (
        <div id="bfb-more-panel" className="bfb-more-panel">
          <div className="bfb-more-group">
            <label htmlFor="bfb-key" className="bfb-label">Key</label>
            <select
              id="bfb-key"
              className="bfb-select"
              value={filters.key || ''}
              onChange={e => onFiltersChange({ ...filters, key: e.target.value || undefined })}
            >
              <option value="">Any Key</option>
              {KEYS.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="bfb-more-group bfb-bpm-group">
            <span className="bfb-label">BPM Range</span>
            <div className="bfb-bpm-inputs">
              <input
                type="number"
                className="bfb-bpm-input"
                min={BPM_RANGES.min} max={BPM_RANGES.max} step={BPM_RANGES.step}
                placeholder="Min"
                value={filters.bpmMin || ''}
                onChange={e => { const v = parseInt(e.target.value); onFiltersChange({ ...filters, bpmMin: e.target.value && !isNaN(v) ? v : undefined }); }}
                aria-label="Minimum BPM"
              />
              <span className="bfb-bpm-sep">–</span>
              <input
                type="number"
                className="bfb-bpm-input"
                min={BPM_RANGES.min} max={BPM_RANGES.max} step={BPM_RANGES.step}
                placeholder="Max"
                value={filters.bpmMax || ''}
                onChange={e => { const v = parseInt(e.target.value); onFiltersChange({ ...filters, bpmMax: e.target.value && !isNaN(v) ? v : undefined }); }}
                aria-label="Maximum BPM"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatFiltersComponent;
