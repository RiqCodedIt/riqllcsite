import React from 'react';
import type { BeatFilters } from '../../types/beats';
import { GENRES, KEYS, BPM_RANGES } from '../../types/beats';

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
  const updateFilter = (key: keyof BeatFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="beat-filters">
      <div className="filters-header">
        <h3>Filter Beats</h3>
        {hasActiveFilters && (
          <button 
            className="clear-filters-btn"
            onClick={onClearFilters}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-section">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search beats..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <label htmlFor="genre">Genre</label>
        <select
          id="genre"
          value={filters.genre || ''}
          onChange={(e) => updateFilter('genre', e.target.value || undefined)}
          className="filter-select"
        >
          <option value="">All Genres</option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="key">Key</label>
        <select
          id="key"
          value={filters.key || ''}
          onChange={(e) => updateFilter('key', e.target.value || undefined)}
          className="filter-select"
        >
          <option value="">All Keys</option>
          {KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>BPM Range</label>
        <div className="bpm-range">
          <div className="bpm-input-group">
            <label htmlFor="bpm-min">Min</label>
            <input
              id="bpm-min"
              type="number"
              min={BPM_RANGES.min}
              max={BPM_RANGES.max}
              step={BPM_RANGES.step}
              placeholder="60"
              value={filters.bpmMin || ''}
              onChange={(e) => updateFilter('bpmMin', e.target.value ? parseInt(e.target.value) : undefined)}
              className="bpm-input"
            />
          </div>
          <span className="bpm-separator">-</span>
          <div className="bpm-input-group">
            <label htmlFor="bpm-max">Max</label>
            <input
              id="bpm-max"
              type="number"
              min={BPM_RANGES.min}
              max={BPM_RANGES.max}
              step={BPM_RANGES.step}
              placeholder="200"
              value={filters.bpmMax || ''}
              onChange={(e) => updateFilter('bpmMax', e.target.value ? parseInt(e.target.value) : undefined)}
              className="bpm-input"
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default BeatFiltersComponent;
