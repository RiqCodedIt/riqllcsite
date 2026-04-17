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
      <div className="ec-wrap ec-wrap--success" role="status">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p className="ec-confirm">You&apos;re in. I&apos;ll send mix tips, beat drops, and exclusive offers.</p>
      </div>
    );
  }

  return (
    <div className="ec-wrap">
      <div className="ec-copy">
        <h2 className="ec-heading">Get exclusive mix tips + first access to new beats</h2>
        <p className="ec-sub">No spam. Unsubscribe anytime.</p>
      </div>
      <form className="ec-form" onSubmit={handleSubmit} noValidate>
        <div className="ec-row">
          <label htmlFor="ec-email-input" className="ec-sr-only">Email address</label>
          <input
            id="ec-email-input"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError('');
              if (status === 'error') setStatus('idle');
            }}
            placeholder="your@email.com"
            autoComplete="email"
            aria-describedby={emailError ? 'ec-email-err' : undefined}
            aria-invalid={emailError ? 'true' : undefined}
          />
          <button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
            {status === 'loading' ? 'Joining…' : 'Join the List'}
          </button>
        </div>
        {emailError && (
          <span id="ec-email-err" className="ec-field-error" role="alert">{emailError}</span>
        )}
      </form>
      {status === 'error' && (
        <p className="ec-error" role="alert">Something went wrong — please try again.</p>
      )}
    </div>
  );
};

export default EmailCapture;
