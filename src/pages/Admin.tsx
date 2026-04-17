import React, { useState, useMemo } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/Admin.css';
import BeatUpload from '../components/BeatUpload';
import GoogleDriveUpload from '../components/GoogleDriveUpload';
import type { Beat } from '../types/beats';
import beatsData from '../data/beats.json';

const ALL_BEATS: Beat[] = beatsData.beats as Beat[];
const SESSION_KEY = 'riq_admin_auth';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'prodbyriq2025';

/* ── SVG Icons ───────────────────────────────────────────────── */
const IconLock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconSearch = () => (
  <svg className="bl-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

/* ── Password Gate ───────────────────────────────────────────── */
const PasswordGate: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 300));
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onAuth();
    } else {
      setError('Incorrect password. Try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="ad-gate" role="main">
      <div className="ad-gate-card">
        <span style={{ display: 'flex', justifyContent: 'center', color: 'var(--ad-accent)' }}>
          <IconLock />
        </span>
        <h1 className="ad-gate-heading">Beat Upload Portal</h1>
        <p className="ad-gate-sub">Admin access only</p>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="ad-gate-field">
              <label htmlFor="ad-password">Password</label>
              <input
                id="ad-password"
                type="password"
                className="ad-gate-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-required="true"
                aria-describedby={error ? 'ad-gate-error' : undefined}
                aria-invalid={!!error}
              />
              {error && (
                <span id="ad-gate-error" className="ad-gate-error" role="alert">{error}</span>
              )}
            </div>
            <button
              type="submit"
              className="ad-gate-btn"
              disabled={submitting || !password}
              aria-busy={submitting}
            >
              {submitting ? 'Checking…' : 'Enter Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Beat Library Tab ────────────────────────────────────────── */
const BeatLibrary: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_BEATS;
    const q = search.toLowerCase();
    return ALL_BEATS.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.beat_id.toLowerCase().includes(q) ||
      b.genres.some(g => g.toLowerCase().includes(q)) ||
      b.key.toLowerCase().includes(q)
    );
  }, [search]);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

  return (
    <section className="bl-section" aria-label="Beat library">
      <div className="bl-toolbar">
        <p className="bl-count">
          <strong data-stat>{filtered.length}</strong> / {ALL_BEATS.length} beats
        </p>
        <div className="bl-search-wrap">
          <IconSearch />
          <input
            type="search"
            className="bl-search"
            placeholder="Search by title, ID, genre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search beat library"
          />
        </div>
      </div>

      <div className="bl-table-wrap" role="region" aria-label="Beat library table" tabIndex={0}>
        <table className="bl-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">ID</th>
              <th scope="col">BPM</th>
              <th scope="col">Key</th>
              <th scope="col">Genres</th>
              <th scope="col">Lease</th>
              <th scope="col">Excl.</th>
              <th scope="col">Preview</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="bl-empty">No beats match your search.</td>
              </tr>
            ) : (
              filtered.map(beat => (
                <tr key={beat.beat_id}>
                  <td className="bl-title">{beat.title}</td>
                  <td><span className="bl-beat-id">{beat.beat_id}</span></td>
                  <td className="bl-bpm">{beat.bpm}</td>
                  <td>{beat.key}</td>
                  <td>
                    {beat.genres.map(g => (
                      <span key={g} className="bl-genre-pill">{g}</span>
                    ))}
                  </td>
                  <td className="bl-price">{fmt(beat.lease_price)}</td>
                  <td className="bl-price">{fmt(beat.exclusive_price)}</td>
                  <td>
                    {beat.preview_path ? (
                      <a
                        href={beat.preview_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Preview ${beat.title}`}
                        style={{ color: 'var(--ad-text-muted)', display: 'inline-flex' }}
                      >
                        <IconEye />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--ad-text-muted)', fontSize: '0.75rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

/* ── Admin Portal ────────────────────────────────────────────── */
type Tab = 'upload' | 'library';

const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [tab, setTab] = useState<Tab>('upload');

  usePageMeta({
    title: 'Beat Upload Portal | PRODBYRIQ Admin',
    description: 'Internal beat management portal for PRODBYRIQ.',
    canonicalPath: '/admin',
  });

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <div className="ad-page"><PasswordGate onAuth={() => setAuthed(true)} /></div>;
  }

  return (
    <div className="ad-page">
      {/* Header */}
      <header className="ad-header">
        <div className="ad-header-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span className="ad-header-brand">PRODBYRIQ</span>
            <span className="ad-header-title">Beat Upload Portal</span>
          </div>
          <button type="button" className="ad-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="ad-tabs-bar" aria-label="Portal sections">
        <div className="ad-tabs-inner">
          <button
            type="button"
            className={`ad-tab${tab === 'upload' ? ' ad-tab--active' : ''}`}
            onClick={() => setTab('upload')}
            aria-current={tab === 'upload' ? 'page' : undefined}
          >
            Add Beat
          </button>
          <button
            type="button"
            className={`ad-tab${tab === 'library' ? ' ad-tab--active' : ''}`}
            onClick={() => setTab('library')}
            aria-current={tab === 'library' ? 'page' : undefined}
          >
            Beat Library ({ALL_BEATS.length})
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="ad-main" id="main-content">
        {tab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <BeatUpload />
            <GoogleDriveUpload />
          </div>
        )}
        {tab === 'library' && <BeatLibrary />}
      </main>
    </div>
  );
};

export default Admin;
