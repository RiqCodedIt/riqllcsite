import React, { useState, useRef, KeyboardEvent } from 'react';
import { GENRES, MOODS, KEYS } from '../types/beats';

interface BeatFormData {
  title: string;
  bpm: string;
  key: string;
  genres: string[];
  mood: string[];
  tags: string[];
  lease_price: string;
  exclusive_price: string;
  preview_path: string;
  full_path: string;
  cover_path: string;
  google_drive_file_id: string;
  google_drive_cover_id: string;
}

interface FormErrors {
  title?: string;
  bpm?: string;
  key?: string;
  genres?: string;
  preview_path?: string;
  full_path?: string;
  cover_path?: string;
}

const EMPTY_FORM: BeatFormData = {
  title: '',
  bpm: '',
  key: '',
  genres: [],
  mood: [],
  tags: [],
  lease_price: '50',
  exclusive_price: '200',
  preview_path: '',
  full_path: '',
  cover_path: '',
  google_drive_file_id: '',
  google_drive_cover_id: '',
};

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const generateBeatId = (title: string): string => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `beat_${slug}_${Date.now().toString(36)}`;
};

const validate = (form: BeatFormData): FormErrors => {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  const bpm = parseInt(form.bpm);
  if (!form.bpm || isNaN(bpm) || bpm < 40 || bpm > 250) errors.bpm = 'Enter a valid BPM (40–250)';
  if (!form.key) errors.key = 'Key is required';
  if (form.genres.length === 0) errors.genres = 'Select at least one genre';
  if (!form.preview_path.trim()) errors.preview_path = 'Preview URL is required';
  if (!form.full_path.trim()) errors.full_path = 'Full track URL is required';
  if (!form.cover_path.trim()) errors.cover_path = 'Cover path is required';
  return errors;
};

const BeatUpload: React.FC = () => {
  const [form, setForm] = useState<BeatFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [generatedJson, setGeneratedJson] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof BeatFormData, value: BeatFormData[keyof BeatFormData]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const touch = (field: string) => {
    setTouched(prev => new Set(prev).add(field));
    const errs = validate({ ...form });
    setErrors(errs);
  };

  const toggleCheckbox = (field: 'genres' | 'mood', value: string) => {
    set(field, form[field].includes(value)
      ? form[field].filter(v => v !== value)
      : [...form[field], value]
    );
  };

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '_');
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    set('tags', form.tags.filter(t => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      set('tags', form.tags.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allFields = ['title', 'bpm', 'key', 'genres', 'preview_path', 'full_path', 'cover_path'];
    setTouched(new Set(allFields));
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));

    const entry = {
      beat_id: generateBeatId(form.title),
      title: form.title.trim(),
      bpm: parseInt(form.bpm),
      key: form.key,
      genres: form.genres,
      preview_path: form.preview_path.trim(),
      full_path: form.full_path.trim(),
      cover_path: form.cover_path.trim(),
      lease_price: !isNaN(parseInt(form.lease_price)) ? parseInt(form.lease_price) : 50,
      exclusive_price: !isNaN(parseInt(form.exclusive_price)) ? parseInt(form.exclusive_price) : 200,
      created_at: new Date().toISOString().split('T')[0],
      ...(form.tags.length > 0 && { tags: form.tags }),
      ...(form.mood.length > 0 && { mood: form.mood }),
      ...(form.google_drive_file_id.trim() && { google_drive_file_id: form.google_drive_file_id.trim() }),
      ...(form.google_drive_cover_id.trim() && { google_drive_cover_id: form.google_drive_cover_id.trim() }),
    };

    setGeneratedJson(JSON.stringify(entry, null, 2));
    setSubmitting(false);
  };

  const handleCopy = async () => {
    if (!generatedJson) return;
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(generatedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched(new Set());
    setGeneratedJson(null);
    setCopied(false);
    setTagInput('');
  };

  const showError = (field: string) => touched.has(field) ? errors[field as keyof FormErrors] : undefined;

  return (
    <form className="bu-form" onSubmit={handleSubmit} noValidate aria-label="Add new beat">

      {/* Basic info */}
      <section className="bu-section" aria-labelledby="bu-basics-heading">
        <p className="bu-section-title" id="bu-basics-heading">Beat Info</p>
        <div className="bu-row">
          <div className="bu-field">
            <label htmlFor="bu-title" className="bu-label bu-label-required">Title</label>
            <input
              id="bu-title"
              type="text"
              className={`bu-input${showError('title') ? ' bu-input--error' : ''}`}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onBlur={() => touch('title')}
              autoComplete="off"
              aria-required="true"
              aria-describedby={showError('title') ? 'bu-title-err' : undefined}
            />
            {showError('title') && <span id="bu-title-err" className="bu-field-error" role="alert">{showError('title')}</span>}
          </div>

          <div className="bu-field">
            <label htmlFor="bu-bpm" className="bu-label bu-label-required">BPM</label>
            <input
              id="bu-bpm"
              type="number"
              className={`bu-input${showError('bpm') ? ' bu-input--error' : ''}`}
              value={form.bpm}
              onChange={e => set('bpm', e.target.value)}
              onBlur={() => touch('bpm')}
              min={40}
              max={250}
              aria-required="true"
              aria-describedby={showError('bpm') ? 'bu-bpm-err' : undefined}
            />
            {showError('bpm') && <span id="bu-bpm-err" className="bu-field-error" role="alert">{showError('bpm')}</span>}
          </div>
        </div>

        <div className="bu-row">
          <div className="bu-field">
            <label htmlFor="bu-key" className="bu-label bu-label-required">Key</label>
            <select
              id="bu-key"
              className={`bu-select${showError('key') ? ' bu-select--error' : ''}`}
              value={form.key}
              onChange={e => set('key', e.target.value)}
              onBlur={() => touch('key')}
              aria-required="true"
              aria-describedby={showError('key') ? 'bu-key-err' : undefined}
            >
              <option value="">Select key…</option>
              {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            {showError('key') && <span id="bu-key-err" className="bu-field-error" role="alert">{showError('key')}</span>}
          </div>

          <div className="bu-field">
            <label htmlFor="bu-lease" className="bu-label">Lease Price ($)</label>
            <input
              id="bu-lease"
              type="number"
              className="bu-input"
              value={form.lease_price}
              onChange={e => set('lease_price', e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="bu-row">
          <div className="bu-field">
            <label htmlFor="bu-excl" className="bu-label">Exclusive Price ($)</label>
            <input
              id="bu-excl"
              type="number"
              className="bu-input"
              value={form.exclusive_price}
              onChange={e => set('exclusive_price', e.target.value)}
              min={0}
            />
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="bu-section" aria-labelledby="bu-genres-heading">
        <p className="bu-section-title" id="bu-genres-heading">Genres & Mood</p>
        <div className="bu-field">
          <p className="bu-label bu-label-required" id="bu-genres-label">Genres</p>
          <div
            className="bu-checkbox-group"
            role="group"
            aria-labelledby="bu-genres-label"
            onBlur={() => touch('genres')}
          >
            {GENRES.map(g => (
              <label
                key={g}
                className={`bu-checkbox-pill${form.genres.includes(g) ? ' bu-checkbox-pill--checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={form.genres.includes(g)}
                  onChange={() => toggleCheckbox('genres', g)}
                  aria-label={g}
                />
                {form.genres.includes(g) && <IconCheck />}
                {g}
              </label>
            ))}
          </div>
          {showError('genres') && <span className="bu-field-error" role="alert">{showError('genres')}</span>}
        </div>

        <div className="bu-field">
          <p className="bu-label" id="bu-mood-label">Mood</p>
          <div className="bu-checkbox-group" role="group" aria-labelledby="bu-mood-label">
            {MOODS.map(m => (
              <label
                key={m}
                className={`bu-checkbox-pill${form.mood.includes(m) ? ' bu-checkbox-pill--checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={form.mood.includes(m)}
                  onChange={() => toggleCheckbox('mood', m)}
                  aria-label={m}
                />
                {form.mood.includes(m) && <IconCheck />}
                {m}
              </label>
            ))}
          </div>
        </div>

        <div className="bu-field">
          <label htmlFor="bu-tag-input" className="bu-label">Tags</label>
          <div
            className="bu-tags-wrap"
            onClick={() => tagInputRef.current?.focus()}
            aria-label="Tags input"
          >
            {form.tags.map(tag => (
              <span key={tag} className="bu-tag-chip">
                {tag}
                <button
                  type="button"
                  className="bu-tag-remove"
                  onClick={e => { e.stopPropagation(); removeTag(tag); }}
                  aria-label={`Remove tag ${tag}`}
                >×</button>
              </span>
            ))}
            <input
              id="bu-tag-input"
              ref={tagInputRef}
              type="text"
              className="bu-tag-input"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
              placeholder={form.tags.length === 0 ? 'Type and press Enter or comma…' : ''}
              aria-label="Add tag"
            />
          </div>
          <span className="bu-helper">Press Enter or comma to add. Backspace removes the last tag.</span>
        </div>
      </section>

      {/* File paths */}
      <section className="bu-section" aria-labelledby="bu-files-heading">
        <p className="bu-section-title" id="bu-files-heading">File URLs</p>

        <div className="bu-field bu-field--full">
          <label htmlFor="bu-preview" className="bu-label bu-label-required">Preview URL (S3 / CDN)</label>
          <input
            id="bu-preview"
            type="url"
            className={`bu-input${showError('preview_path') ? ' bu-input--error' : ''}`}
            value={form.preview_path}
            onChange={e => set('preview_path', e.target.value)}
            onBlur={() => touch('preview_path')}
            placeholder="https://bucket.s3.region.amazonaws.com/previews/…"
            autoComplete="off"
            aria-required="true"
            aria-describedby={showError('preview_path') ? 'bu-preview-err' : undefined}
          />
          {showError('preview_path') && <span id="bu-preview-err" className="bu-field-error" role="alert">{showError('preview_path')}</span>}
        </div>

        <div className="bu-field bu-field--full">
          <label htmlFor="bu-full" className="bu-label bu-label-required">Full Track URL (S3 / CDN)</label>
          <input
            id="bu-full"
            type="url"
            className={`bu-input${showError('full_path') ? ' bu-input--error' : ''}`}
            value={form.full_path}
            onChange={e => set('full_path', e.target.value)}
            onBlur={() => touch('full_path')}
            placeholder="https://bucket.s3.region.amazonaws.com/full_tracks/…"
            autoComplete="off"
            aria-required="true"
            aria-describedby={showError('full_path') ? 'bu-full-err' : undefined}
          />
          {showError('full_path') && <span id="bu-full-err" className="bu-field-error" role="alert">{showError('full_path')}</span>}
        </div>

        <div className="bu-field bu-field--full">
          <label htmlFor="bu-cover" className="bu-label bu-label-required">Cover Path</label>
          <input
            id="bu-cover"
            type="text"
            className={`bu-input${showError('cover_path') ? ' bu-input--error' : ''}`}
            value={form.cover_path}
            onChange={e => set('cover_path', e.target.value)}
            onBlur={() => touch('cover_path')}
            placeholder="/covers/cover017.png"
            autoComplete="off"
            aria-required="true"
            aria-describedby={showError('cover_path') ? 'bu-cover-err' : undefined}
          />
          {showError('cover_path') && <span id="bu-cover-err" className="bu-field-error" role="alert">{showError('cover_path')}</span>}
        </div>
      </section>

      {/* Google Drive (optional) */}
      <section className="bu-section" aria-labelledby="bu-drive-heading">
        <p className="bu-section-title" id="bu-drive-heading">Google Drive IDs (optional)</p>
        <div className="bu-row">
          <div className="bu-field">
            <label htmlFor="bu-gd-file" className="bu-label">Drive File ID</label>
            <input
              id="bu-gd-file"
              type="text"
              className="bu-input"
              value={form.google_drive_file_id}
              onChange={e => set('google_drive_file_id', e.target.value)}
              placeholder="1aBcD…"
              autoComplete="off"
            />
          </div>
          <div className="bu-field">
            <label htmlFor="bu-gd-cover" className="bu-label">Drive Cover ID</label>
            <input
              id="bu-gd-cover"
              type="text"
              className="bu-input"
              value={form.google_drive_cover_id}
              onChange={e => set('google_drive_cover_id', e.target.value)}
              placeholder="1xYz…"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="bu-actions">
        <button
          type="submit"
          className="bu-submit-btn"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? 'Generating…' : 'Generate JSON Entry'}
        </button>
        <button type="button" className="bu-reset-btn" onClick={handleReset}>
          Reset Form
        </button>
      </div>

      {/* Generated JSON output */}
      {generatedJson && (
        <div className="bu-success-banner" role="status" aria-live="polite">
          <span className="bu-success-icon"><IconCheck /></span>
          <div className="bu-success-text">
            <strong>JSON entry ready</strong>
            Copy and paste this into <code>src/data/beats.json</code> inside the <code>"beats"</code> array.
            <pre className="bu-json-block">{generatedJson}</pre>
            <button
              type="button"
              className={`bu-copy-btn${copied ? ' bu-copy-btn--copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy JSON to clipboard"
            >
              <IconCopy />
              {copied ? 'Copied!' : copyError ? 'Copy failed — select manually' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BeatUpload;
