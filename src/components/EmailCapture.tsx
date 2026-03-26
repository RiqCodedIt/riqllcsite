import React, { useState } from 'react';

const EmailCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="email-capture-section">
        <div className="email-capture-inner">
          <p className="email-capture-confirm">You're in. I'll send mix tips, beat drops, and exclusive offers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-capture-section">
      <div className="email-capture-inner">
        <div className="email-capture-copy">
          <h3>Get exclusive mix tips + first access to new beats</h3>
          <p>No spam. Unsubscribe anytime.</p>
        </div>
        <form className="email-capture-form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            aria-label="Email address"
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining...' : 'Join the List'}
          </button>
        </form>
        {status === 'error' && (
          <p className="email-capture-error">Something went wrong — try again.</p>
        )}
      </div>
    </div>
  );
};

export default EmailCapture;
