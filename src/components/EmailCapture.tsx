import React, { useState } from 'react';
import '../styles/EmailCapture.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/subscribe', {
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
          <div className="email-capture-input-wrap">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(''); }}
              placeholder="your@email.com"
              aria-label="Email address"
              aria-describedby={emailError ? 'ec-email-err' : undefined}
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Joining...' : 'Join the List'}
            </button>
          </div>
          {emailError && <span id="ec-email-err" className="email-capture-field-error">{emailError}</span>}
        </form>
        {status === 'error' && (
          <p className="email-capture-error">Something went wrong — try again.</p>
        )}
      </div>
    </div>
  );
};

export default EmailCapture;
