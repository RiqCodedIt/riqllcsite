import React, { useState } from 'react';

interface InquiryFormProps {
  defaultService?: string;
}

const SERVICE_OPTIONS = [
  'Mixing + Mastering ($100)',
  'Mixing Only ($75)',
  'Mastering Only ($50)',
  'Session Retainer ($175/mo)',
  'Studio Retainer ($300/mo)',
  'Full Production',
  'Other',
];

const InquiryForm: React.FC<InquiryFormProps> = ({ defaultService = '' }) => {
  const [form, setForm] = useState({ name: '', email: '', service: defaultService, notes: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="inquiry-confirmation">
        <h3>Got it — I'll be in touch soon.</h3>
        <p>Check your inbox for a confirmation. Most responses within 24 hours.</p>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="inquiry-form-row">
        <div className="inquiry-field">
          <label htmlFor="inq-name">Name</label>
          <input
            id="inq-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>
        <div className="inquiry-field">
          <label htmlFor="inq-email">Email</label>
          <input
            id="inq-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="inquiry-field">
        <label htmlFor="inq-service">Service</label>
        <select id="inq-service" name="service" value={form.service} onChange={handleChange}>
          <option value="">Select a service...</option>
          {SERVICE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="inquiry-field">
        <label htmlFor="inq-notes">Project notes</label>
        <textarea
          id="inq-notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Tell me about your project — genre, vibe, timeline, anything relevant."
          rows={4}
        />
      </div>

      {status === 'error' && (
        <p className="inquiry-error">Something went wrong. Email riq@prodbyriq.com directly.</p>
      )}

      <button type="submit" className="inquiry-submit-btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  );
};

export default InquiryForm;
