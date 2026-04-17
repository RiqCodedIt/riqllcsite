import React, { useState } from 'react';

interface GoogleDriveUploadProps {
  onFileLinked?: (fileId: string, fileName: string) => void;
}

const IconDrive = () => (
  <svg width="18" height="18" viewBox="0 0 87.3 78" fill="none" aria-hidden="true">
    <path d="M6.6 66.85 3.3 72.55C2.16 74.5 3.54 77 5.8 77h75.7c2.26 0 3.64-2.5 2.5-4.45l-3.3-5.7H6.6z" fill="#3772FF"/>
    <path d="M29.15 5.5 1.9 53.3l4.7 8.1L35.4 13 29.15 5.5z" fill="#2AB7CA"/>
    <path d="M85.4 61.4 58.15 13 51.9 5.5 35.4 13l19.35 33.5 26.35-8.85 4.3 13.75z" fill="#F9C74F"/>
    <path d="M58.15 13 51.9 5.5 29.15 5.5 35.4 13h22.75z" fill="#43AA8B"/>
    <path d="M6.6 66.85h73.8l-4.3-13.75-36.7 12.3-7.05 1.45H6.6z" fill="#90BE6D"/>
  </svg>
);

const IconLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const GoogleDriveUpload: React.FC<GoogleDriveUploadProps> = ({ onFileLinked }) => {
  const [connected, setConnected] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linked, setLinked] = useState<{ id: string; name: string } | null>(null);
  const [linkError, setLinkError] = useState('');

  const extractFileId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    if (match) return match[1];
    const match2 = url.match(/id=([a-zA-Z0-9_-]{25,})/);
    if (match2) return match2[1];
    if (/^[a-zA-Z0-9_-]{25,}$/.test(url.trim())) return url.trim();
    return null;
  };

  const handleConnect = () => {
    setConnected(true);
  };

  const handleLinkFile = () => {
    setLinkError('');
    const id = extractFileId(linkInput.trim());
    if (!id) {
      setLinkError('Paste a Google Drive share link or file ID');
      return;
    }
    const name = `drive_file_${id.slice(0, 8)}`;
    setLinked({ id, name });
    onFileLinked?.(id, name);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setLinked(null);
    setLinkInput('');
    setLinkError('');
  };

  return (
    <section className="gd-section" aria-labelledby="gd-heading">
      <p className="bu-section-title" id="gd-heading">Google Drive Integration</p>

      <div className="gd-status" role="status" aria-live="polite">
        <span
          className={`gd-status-dot${connected ? ' gd-status-dot--connected' : ' gd-status-dot--disconnected'}`}
          aria-hidden="true"
        />
        <span className="gd-status-text">
          {connected ? 'Connected to Google Drive' : 'Not connected'}
        </span>
      </div>

      {!connected ? (
        <>
          <button
            type="button"
            className="gd-connect-btn"
            onClick={handleConnect}
            aria-label="Connect Google Drive account"
          >
            <IconDrive />
            Connect Google Drive
          </button>
          <p className="gd-note">
            This is a placeholder connection state — no OAuth redirect or Google authentication is
            performed yet. Use this to prepare Drive file IDs for the upload form. Full OAuth integration
            requires a server-side implementation.
          </p>
        </>
      ) : (
        <>
          {linked ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p className="bu-label">Linked file</p>
              <div className="gd-status">
                <IconLink />
                <span className="gd-status-text" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>
                  {linked.id}
                </span>
              </div>
              <button
                type="button"
                className="bu-reset-btn"
                onClick={() => { setLinked(null); setLinkInput(''); }}
                style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
              >
                Unlink file
              </button>
            </div>
          ) : (
            <div className="bu-field">
              <label htmlFor="gd-link-input" className="bu-label">
                Paste Drive share link or file ID
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <input
                  id="gd-link-input"
                  type="url"
                  className={`bu-input${linkError ? ' bu-input--error' : ''}`}
                  value={linkInput}
                  onChange={e => setLinkInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleLinkFile())}
                  placeholder="https://drive.google.com/file/d/… or file ID"
                  autoComplete="off"
                  aria-describedby={linkError ? 'gd-link-err' : undefined}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="bu-submit-btn"
                  onClick={handleLinkFile}
                  style={{ flexShrink: 0 }}
                >
                  Link
                </button>
              </div>
              {linkError && (
                <span id="gd-link-err" className="bu-field-error" role="alert">{linkError}</span>
              )}
            </div>
          )}

          <button
            type="button"
            className="bu-reset-btn"
            onClick={handleDisconnect}
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            Disconnect Drive
          </button>
        </>
      )}
    </section>
  );
};

export default GoogleDriveUpload;
