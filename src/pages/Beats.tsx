import React, { useState, useMemo } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/BeatsStyles.css';
import BeatCard from '../components/beats/BeatCard';
import EmailCapture from '../components/EmailCapture';
import BeatFilters from '../components/beats/BeatFilters';
import type { Beat, BeatFilters as BeatFiltersType } from '../types/beats';
import beatsData from '../data/beats.json';

const ALL_BEATS: Beat[] = beatsData.beats;

const Beats: React.FC = () => {
  const [filters, setFilters] = useState<BeatFiltersType>({});
  const [view, setView] = useState<'list' | 'grid'>('list');

  usePageMeta({
    title: 'Buy Beats | PRODBYRIQ',
    description: 'Buy hip hop, trap, drill & more beats. WAV lease $50 | Exclusive $200. Instant download with 30-second previews.',
    canonicalPath: '/beats',
  });

  const filteredBeats = useMemo(() => {
    let result = ALL_BEATS;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.genres.some(g => g.toLowerCase().includes(q)) ||
        b.tags?.some(t => t.toLowerCase().includes(q)) ||
        b.mood?.some(m => m.toLowerCase().includes(q))
      );
    }
    if (filters.mood) {
      result = result.filter(b =>
        b.mood?.map(m => m.toLowerCase()).includes(filters.mood!.toLowerCase())
      );
    }
    if (filters.genre) {
      result = result.filter(b => b.genres.includes(filters.genre!));
    }
    if (filters.key) {
      result = result.filter(b => b.key === filters.key);
    }
    if (filters.bpmMin !== undefined && !isNaN(filters.bpmMin)) {
      result = result.filter(b => b.bpm >= filters.bpmMin!);
    }
    if (filters.bpmMax !== undefined && !isNaN(filters.bpmMax)) {
      result = result.filter(b => b.bpm <= filters.bpmMax!);
    }

    return result;
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="bs-page">

      {/* ── Page Header ──────────────────────────────────── */}
      <header className="bs-header">
        <div className="bs-container">
          <div className="bs-header-row">
            <div>
              <h1>Beat Store</h1>
              <p className="bs-header-sub">
                <span data-stat>{ALL_BEATS.length}</span> beats
                &nbsp;·&nbsp; Instant download &nbsp;·&nbsp; WAV quality
              </p>
            </div>
            <div className="bs-view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`bs-vtoggle${view === 'list' ? ' bs-vtoggle--active' : ''}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                aria-label="List view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
              <button
                type="button"
                className={`bs-vtoggle${view === 'grid' ? ' bs-vtoggle--active' : ''}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Filters ──────────────────────────────────────── */}
      <div className="bs-filters-section">
        <div className="bs-container">
          <BeatFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters({})}
          />
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────── */}
      <div className="bs-results-section">
        <div className="bs-container">
          {hasActiveFilters && (
            <p className="bs-results-count" aria-live="polite">
              <span data-stat>{filteredBeats.length}</span> result{filteredBeats.length !== 1 ? 's' : ''}
            </p>
          )}

          {filteredBeats.length === 0 ? (
            <div className="bs-empty">
              <p>No beats match your filters.</p>
              <button type="button" className="btn-secondary" onClick={() => setFilters({})}>
                Clear Filters
              </button>
            </div>
          ) : view === 'list' ? (
            <div className="bs-list" role="list">
              {filteredBeats.map(beat => (
                <BeatCard key={beat.beat_id} beat={beat} view="list" />
              ))}
            </div>
          ) : (
            <div className="bs-grid">
              {filteredBeats.map(beat => (
                <BeatCard key={beat.beat_id} beat={beat} view="grid" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Email Capture ─────────────────────────────────── */}
      <div className="bs-email-section">
        <div className="bs-container">
          <EmailCapture />
        </div>
      </div>

    </div>
  );
};

export default Beats;
