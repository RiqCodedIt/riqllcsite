import React, { useState } from 'react';
import servicesData from '../data/services.json';
import type { Service } from '../types/services';

interface InquiryFormProps {
  defaultService?: string;
}

const RETAINER_OPTIONS = [
  { label: 'Session Retainer ($175/mo)', value: 'Session Retainer' },
  { label: 'Studio Retainer ($300/mo)', value: 'Studio Retainer' },
  { label: 'Other', value: 'Other' },
];

const serviceOptions = [
  ...(servicesData.services as Service[]).map(s => ({
    label: `${s.name} ($${s.price})`,
    value: s.name,
  })),
  ...RETAINER_OPTIONS,
];

interface FormErrors {
  name?: string;
  email?: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ defaultService = '' }) => {
  const [form, setForm] = useState({ name: '', email: '', service: defaultService, notes: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/submit-inquiry', {
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
        <p>I'll review your inquiry and respond within 24 hours.</p>
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
            aria-describedby={errors.name ? 'inq-name-err' : undefined}
          />
          {errors.name && <span id="inq-name-err" className="inquiry-field-error">{errors.name}</span>}
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
            aria-describedby={errors.email ? 'inq-email-err' : undefined}
          />
          {errors.email && <span id="inq-email-err" className="inquiry-field-error">{errors.email}</span>}
        </div>
      </div>

      <div className="inquiry-field">
        <label htmlFor="inq-service">Service</label>
        <select id="inq-service" name="service" value={form.service} onChange={handleChange}>
          <option value="">Select a service...</option>
          {serviceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          maxLength={2000}
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
