import React, { useState, useEffect } from 'react';
import '../styles/PageContent.css';
import '../styles/BeatsStyles.css';
import BeatCard from '../components/beats/BeatCard';
import BeatFilters from '../components/beats/BeatFilters';
import type { Beat, BeatFilters as BeatFiltersType } from '../types/beats';
import beatsData from '../data/beats.json';

const Beats: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([]);
  const [filters, setFilters] = useState<BeatFiltersType>({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load beats data
  useEffect(() => {
    setBeats(beatsData.beats);
    setFilteredBeats(beatsData.beats);
    setIsLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...beats];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(beat => 
        beat.title.toLowerCase().includes(searchTerm) ||
        beat.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
        beat.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter(beat => beat.genres.includes(filters.genre!));
    }

    // Key filter
    if (filters.key) {
      filtered = filtered.filter(beat => beat.key === filters.key);
    }

    // BPM filters
    if (filters.bpmMin) {
      filtered = filtered.filter(beat => beat.bpm >= filters.bpmMin!);
    }
    if (filters.bpmMax) {
      filtered = filtered.filter(beat => beat.bpm <= filters.bpmMax!);
    }

    setFilteredBeats(filtered);
  }, [beats, filters]);

  const handlePlay = (beatId: string) => {
    setCurrentlyPlaying(beatId);
  };

  const handlePause = () => {
    setCurrentlyPlaying(null);
  };

  const handleFiltersChange = (newFilters: BeatFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="loading-spinner">Loading beats...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="beats-header">
        <h1>Beats</h1>
        <p>High-quality instrumentals for your next project</p>
        <div className="beats-stats">
          <span>{beats.length} beats available</span>
          <span>•</span>
          <span>30-second previews</span>
          <span>•</span>
          <span>Instant download</span>
        </div>
      </div>
      
      <div className="beats-layout">
        <aside className="beats-sidebar">
          <BeatFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <main className="beats-main">
          <div className="beats-results-header">
            <h2>
              {filteredBeats.length} beat{filteredBeats.length !== 1 ? 's' : ''} found
            </h2>
            {Object.keys(filters).some(key => filters[key as keyof BeatFiltersType] !== undefined && filters[key as keyof BeatFiltersType] !== '') && (
              <button 
                className="clear-all-filters"
                onClick={handleClearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredBeats.length === 0 ? (
            <div className="no-beats-found">
              <h3>No beats found</h3>
              <p>Try adjusting your filters or browse all beats.</p>
              <button onClick={handleClearFilters}>Show all beats</button>
            </div>
          ) : (
            <div className="beats-grid">
              {filteredBeats.map((beat) => (
                <BeatCard
                  key={beat.beat_id}
                  beat={beat}
                  isPlaying={currentlyPlaying === beat.beat_id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Beats;
