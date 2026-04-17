import { Link } from 'react-router-dom';
import SpotifyTrack from '../components/SpotifyTrack';
import EmailCapture from '../components/EmailCapture';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/Home.css';
import '../styles/PageContent.css';

const FEATURED_TRACKS = [
  { url: 'https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV', credit: 'Mixed & Mastered by RIQ' },
  { url: 'https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX', credit: 'Mixed & Mastered by RIQ' },
  { url: 'https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG', credit: 'Produced by RIQ' },
];

const STATS = [
  { value: '50+',    label: 'Beats Available' },
  { value: '100+',   label: 'Tracks Mixed' },
  { value: 'Remote', label: 'Worldwide Service' },
];

const SERVICES = [
  {
    to: '/beats',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    heading: 'Beat Leases',
    body: 'Professionally crafted beats in Trap, Drill, R\u0026B, and more.',
    price: 'From $50',
    cta: 'Browse Beats',
  },
  {
    to: '/services',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
    heading: 'Mixing \u0026 Mastering',
    body: 'Send your stems and get back a polished, release-ready record.',
    price: 'From $75',
    cta: 'View Services',
  },
  {
    to: '/services',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    heading: 'Full Production',
    body: 'Complete song production from initial concept to final master.',
    price: 'From $250',
    cta: 'Get Started',
  },
];

const Home = () => {
  usePageMeta({
    title: 'PRODBYRIQ | Beats, Mixing & Music Production',
    description: 'Professional beats, mixing & mastering by RIQ. Buy WAV leases from $50, exclusive licenses from $200, mixing from $75.',
    canonicalPath: '/',
  });

  return (
    <div className="hm-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hm-hero">
        <div className="hm-container">
          <p className="hm-eyebrow">Remote · Fast Turnaround · Premium Quality</p>
          <h1>Professional Music Production,{'\u00A0'}Mixing &amp; Mastering</h1>
          <p className="hm-hero-sub">
            Transform your sound with industry-standard quality.
            Remote services. Fast turnaround. Premium results.
          </p>
          <div className="hm-hero-btns">
            <Link to="/beats" className="btn-primary hm-hero-btn">Browse Beats</Link>
            <Link to="/services" className="btn-secondary hm-hero-btn">View Services</Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="hm-stats-section" aria-label="Quick stats">
        <div className="hm-container">
          <dl className="hm-stats-bar">
            {STATS.map((s, i) => (
              <>
                {i > 0 && <div key={`div-${i}`} className="hm-stat-divider" aria-hidden="true" />}
                <div key={s.value} className="hm-stat-item">
                  <dt className="hm-stat-value" data-stat>{s.value}</dt>
                  <dd className="hm-stat-label">{s.label}</dd>
                </div>
              </>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Services Preview ─────────────────────────────────── */}
      <section className="hm-services-section">
        <div className="hm-container">
          <header className="hm-section-header">
            <p className="hm-eyebrow">What I Do</p>
            <h2>Everything you need to take your music further</h2>
          </header>
          <div className="hm-services-grid">
            {SERVICES.map(svc => (
              <Link key={svc.to + svc.heading} to={svc.to} className="hm-svc-card">
                <div className="hm-svc-icon">{svc.icon}</div>
                <h3 className="hm-svc-heading">{svc.heading}</h3>
                <p className="hm-svc-body">{svc.body}</p>
                <span className="hm-svc-price" data-price>{svc.price}</span>
                <span className="hm-svc-cta" aria-hidden="true">{svc.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Productions ──────────────────────────────── */}
      <section className="hm-featured-section">
        <div className="hm-container">
          <header className="hm-section-header">
            <p className="hm-eyebrow">Featured Productions</p>
            <h2>Recent work — mixed, mastered &amp; produced by RIQ</h2>
          </header>
          <div className="hm-tracks-grid">
            {FEATURED_TRACKS.map(track => (
              <div key={track.url} className="hm-track-card">
                <p className="hm-track-credit">{track.credit}</p>
                <SpotifyTrack trackUrl={track.url} />
              </div>
            ))}
          </div>
          <div className="hm-featured-more">
            <Link to="/featured-work" className="btn-secondary">See All Work →</Link>
          </div>
        </div>
      </section>

      {/* ── Email Capture ─────────────────────────────────────── */}
      <section className="hm-subscribe-section">
        <div className="hm-container">
          <EmailCapture />
        </div>
      </section>

    </div>
  );
};

export default Home;
