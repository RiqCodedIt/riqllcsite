import React, { useState, useEffect } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/BeatsStyles.css';
import BeatCard from '../components/beats/BeatCard';
import EmailCapture from '../components/EmailCapture';
import BeatFilters from '../components/beats/BeatFilters';
import type { Beat, BeatFilters as BeatFiltersType } from '../types/beats';
import beatsData from '../data/beats.json';

const Beats: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([]);
  const [filters, setFilters] = useState<BeatFiltersType>({});
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(true);

  usePageMeta({
    title: 'Buy Beats | PRODBYRIQ',
    description: 'Buy hip hop, trap, drill & more beats. WAV lease $50 | Exclusive $200. Instant download with 30-second previews.',
    canonicalPath: '/beats',
  });

  useEffect(() => {
    setBeats(beatsData.beats);
    setFilteredBeats(beatsData.beats);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...beats];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(beat =>
        beat.title.toLowerCase().includes(q) ||
        beat.genres.some(g => g.toLowerCase().includes(q)) ||
        beat.tags?.some(t => t.toLowerCase().includes(q)) ||
        beat.mood?.some(m => m.toLowerCase().includes(q))
      );
    }

    if (filters.mood) {
      filtered = filtered.filter(beat =>
        beat.mood?.map(m => m.toLowerCase()).includes(filters.mood!.toLowerCase())
      );
    }

    if (filters.genre) {
      filtered = filtered.filter(beat => beat.genres.includes(filters.genre!));
    }

    if (filters.key) {
      filtered = filtered.filter(beat => beat.key === filters.key);
    }

    if (filters.bpmMin) {
      filtered = filtered.filter(beat => beat.bpm >= filters.bpmMin!);
    }

    if (filters.bpmMax) {
      filtered = filtered.filter(beat => beat.bpm <= filters.bpmMax!);
    }

    setFilteredBeats(filtered);
  }, [beats, filters]);

  const handleFiltersChange = (newFilters: BeatFiltersType) => setFilters(newFilters);
  const handleClearFilters = () => setFilters({});

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  if (isLoading) {
    return (
      <div className="beats-page">
        <div className="beats-loading">Loading beats…</div>
      </div>
    );
  }

  return (
    <div className="beats-page">
      {/* Page header */}
      <div className="beats-page-header">
        <div className="beats-container">
          <div className="beats-header-content">
            <div>
              <h1>Beat Store</h1>
              <p className="beats-header-sub">
                {beats.length} beats &nbsp;·&nbsp; Instant download &nbsp;·&nbsp; WAV quality
              </p>
            </div>
            {/* View toggle */}
            <div className="beats-view-toggle" role="group" aria-label="View mode">
              <button
                className={`vtoggle-btn${view === 'list' ? ' active' : ''}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                title="List view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button
                className={`vtoggle-btn${view === 'grid' ? ' active' : ''}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                title="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="beats-filters-section">
        <div className="beats-container">
          <BeatFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Results */}
      <div className="beats-results-section">
        <div className="beats-container">
          {hasActiveFilters && (
            <p className="beats-results-count">
              {filteredBeats.length} result{filteredBeats.length !== 1 ? 's' : ''}
            </p>
          )}

          {filteredBeats.length === 0 ? (
            <div className="beats-empty">
              <p>No beats match your filters.</p>
              <button className="btn-secondary" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          ) : view === 'list' ? (
            <div className="beats-list">
              {filteredBeats.map(beat => (
                <BeatCard key={beat.beat_id} beat={beat} view="list" />
              ))}
            </div>
          ) : (
            <div className="beats-grid">
              {filteredBeats.map(beat => (
                <BeatCard key={beat.beat_id} beat={beat} view="grid" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email capture */}
      <div className="beats-email-section">
        <div className="beats-container">
          <EmailCapture />
        </div>
      </div>
    </div>
  );
};

export default Beats;
