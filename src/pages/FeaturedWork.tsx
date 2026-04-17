import { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/FeaturedWork.css';

interface Track {
  id: string;
  title: string;
  platform: 'spotify' | 'soundcloud';
  embedCode: string;
  url: string;
  description?: string;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Track 1',
    platform: 'spotify',
    embedCode: `<iframe src="https://open.spotify.com/embed/track/3rlbQrNDUyIpF5QPjpFCkV?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
    url: 'https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV',
    description: 'Mixed & Mastered by RIQ',
  },
  {
    id: '2',
    title: 'Track 2',
    platform: 'spotify',
    embedCode: `<iframe src="https://open.spotify.com/embed/track/2hNLyPN3fM0Ds7LASznUkX?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
    url: 'https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX',
    description: 'Mixed & Mastered by RIQ',
  },
  {
    id: '3',
    title: 'Track 3',
    platform: 'spotify',
    embedCode: `<iframe src="https://open.spotify.com/embed/track/7ngZ2kMSW18SHZ7RG3QeOG?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
    url: 'https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG',
    description: 'Produced by RIQ',
  },
  {
    id: '4',
    title: 'mvp w/ j dean + sophia [OUT ON ALL PLATS]',
    platform: 'soundcloud',
    embedCode: `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2065978932&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`,
    url: 'https://soundcloud.com/prodbyriq/mvp-w-j-dean-sophia?si=c61117b0c94148f4a442668189746841&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
    description: 'Collaborative track featuring J Dean and Sophia',
  },
];

type FilterValue = 'all' | 'spotify' | 'soundcloud';

const FeaturedWork = () => {
  usePageMeta({
    title: 'Featured Work | PRODBYRIQ',
    description: 'Hear mixes, masters, and productions by RIQ — hip hop, drill, R&B, and more.',
    canonicalPath: '/featured-work',
  });

  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredTracks = filter === 'all'
    ? TRACKS
    : TRACKS.filter(t => t.platform === filter);

  const platformLabel = (p: Track['platform']) =>
    p === 'spotify' ? 'Spotify' : 'SoundCloud';

  return (
    <div className="page-content fw-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="fw-hero">
        <div className="fw-container">
          <p className="fw-eyebrow">Production · Mixing · Mastering</p>
          <h1>Featured Work</h1>
          <p className="fw-hero-sub">
            Released music across Spotify, SoundCloud, and beyond — hip hop, drill, R&amp;B, and more.
          </p>
        </div>
      </section>

      {/* ── Filter ───────────────────────────────────────────── */}
      <section className="fw-filter-section">
        <div className="fw-container">
          <div className="fw-filter-bar" role="group" aria-label="Filter by platform">
            {(['all', 'spotify', 'soundcloud'] as FilterValue[]).map(val => (
              <button
                key={val}
                type="button"
                className={`fw-filter-btn${filter === val ? ' fw-filter-btn--active' : ''}`}
                onClick={() => setFilter(val)}
                aria-pressed={filter === val}
              >
                {val === 'all' ? 'All Platforms' : val === 'spotify' ? 'Spotify' : 'SoundCloud'}
              </button>
            ))}
          </div>
          <p className="fw-track-count" aria-live="polite">
            {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* ── Tracks Grid ──────────────────────────────────────── */}
      <section className="fw-tracks-section" aria-labelledby="fw-tracks-heading">
        <div className="fw-container">
          <h2 id="fw-tracks-heading" className="fw-sr-only">Tracks</h2>
          {filteredTracks.length > 0 ? (
            <div className="fw-tracks-grid">
              {filteredTracks.map(track => (
                <article key={track.id} className="fw-track-card">
                  <div className="fw-track-header">
                    <h3 className="fw-track-title">{track.title}</h3>
                    <span className={`fw-platform-badge fw-platform-badge--${track.platform}`}>
                      {platformLabel(track.platform)}
                    </span>
                  </div>
                  {track.description && (
                    <p className="fw-track-desc">{track.description}</p>
                  )}
                  <div className="fw-track-embed">
                    <div dangerouslySetInnerHTML={{ __html: track.embedCode }} />
                  </div>
                  <div className="fw-track-actions">
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fw-track-link"
                    >
                      Listen on {platformLabel(track.platform)}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="fw-empty">No tracks found for the selected platform.</p>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="fw-cta-section">
        <div className="fw-container">
          <div className="fw-cta-inner">
            <h2>Ready to Work Together?</h2>
            <p>Send your stems or browse beats — let&apos;s make something.</p>
            <div className="fw-cta-buttons">
              <Link to="/services" className="fw-cta-btn fw-cta-btn--primary">Start a Project</Link>
              <Link to="/beats" className="fw-cta-btn fw-cta-btn--secondary">Browse Beats</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FeaturedWork;
