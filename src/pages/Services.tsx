import React, { useState, useEffect } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/PageContent.css';
import '../styles/ServicesStyles.css';
import { useCart } from '../components/cart/CartProvider';
import InquiryForm from '../components/InquiryForm';
import type { Service } from '../types/services';
import servicesData from '../data/services.json';

/* ── SVG Icons (inline, no emoji) ─────────────────────────── */
const IconMixing = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="4" y2="6" /><line x1="4" y1="10" x2="20" y2="10" />
    <line x1="4" y1="14" x2="4" y2="14" /><line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" /><circle cx="16" cy="14" r="2" />
    <line x1="10" y1="6" x2="20" y2="6" /><line x1="4" y1="14" x2="14" y2="14" />
  </svg>
);

const IconMastering = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconCombo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

const IconOther = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
    className={`svc-chevron${open ? ' svc-chevron--open' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Category icon map ────────────────────────────────────── */
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'mixing':    return <IconMixing />;
    case 'mastering': return <IconMastering />;
    case 'combo':     return <IconCombo />;
    default:          return <IconOther />;
  }
};

/* ── Trust stats ──────────────────────────────────────────── */
const TRUST_STATS = [
  { value: '100+', label: 'Tracks Mixed' },
  { value: '1–3 Days', label: 'Avg. Turnaround' },
  { value: 'Remote', label: 'Worldwide' },
];

/* ── How It Works steps ───────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Place Your Order',
    description: 'Add a service to your cart and complete checkout. You\'ll receive an order confirmation email immediately.'
  },
  {
    step: '02',
    title: 'Send Your Files',
    description: 'RIQ will reach out with stem upload instructions after your order is confirmed. WAV or AIFF at session sample rate preferred.'
  },
  {
    step: '03',
    title: 'Receive Your Mix',
    description: 'Get back a polished, release-ready record within the delivery window. Revisions are included — no extra charge.'
  }
];

/* ── Component ────────────────────────────────────────────── */
const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { addServiceToCart } = useCart();

  usePageMeta({
    title: 'Mixing & Mastering Services | PRODBYRIQ',
    description: 'Professional remote mixing & mastering from $75. Send your stems, get back a polished record. Fast turnaround, revisions included.',
    canonicalPath: '/services',
  });

  useEffect(() => {
    setServices(servicesData.services as Service[]);
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleAddToCart = (service: Service) => {
    addServiceToCart({
      service_id: service.service_id,
      service_name: service.name,
      price: service.price,
      category: service.category
    });
  };

  const toggleExpanded = (serviceId: string) => {
    setExpandedCard(prev => (prev === serviceId ? null : serviceId));
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="svc-loading">Loading services…</div>
      </div>
    );
  }

  return (
    <div className="page-content svc-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="svc-hero">
        <div className="svc-container">
          <p className="svc-eyebrow">Remote · Fast Turnaround · Revisions Included</p>
          <h1 className="svc-hero-headline">
            Send Your Stems.<br />
            Get Back a Finished Record.
          </h1>
          <p className="svc-hero-sub">
            Professional mixing &amp; mastering — done remotely.
            No in-person sessions. No location limits. Just results.
          </p>
          <a href="#inquiry" className="svc-hero-cta">Start a Project</a>

          {/* Trust Stats */}
          <div className="svc-trust-bar" role="list" aria-label="Service highlights">
            {TRUST_STATS.map(({ value, label }) => (
              <div key={label} className="svc-trust-stat" role="listitem">
                <span className="svc-trust-value">{value}</span>
                <span className="svc-trust-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────── */}
      <section className="svc-services-section" aria-labelledby="services-heading">
        <div className="svc-container">
          <div className="svc-section-header">
            <h2 id="services-heading">Services</h2>
            <p>All work is done remotely. Stems in, polished record out.</p>
          </div>

          <div className="svc-grid">
            {services.map((service) => {
              const expanded = expandedCard === service.service_id;
              const detailsId = `svc-details-${service.service_id}`;
              return (
                <article
                  key={service.service_id}
                  className="svc-card"
                  data-category={service.category}
                >
                  {/* Card top — always visible */}
                  <div className="svc-card-top">
                    <div className="svc-card-icon-wrap" data-category={service.category}>
                      {getCategoryIcon(service.category)}
                    </div>
                    <div className="svc-card-meta">
                      <h3 className="svc-card-name">{service.name}</h3>
                      <p className="svc-card-desc">{service.description}</p>
                    </div>
                    <div className="svc-card-price-wrap">
                      <span className="svc-card-price">{formatCurrency(service.price)}</span>
                    </div>
                  </div>

                  {/* Top features — always visible (exclude delivery/policy strings already shown in details) */}
                  <ul className="svc-card-features" aria-label={`${service.name} features`}>
                    {service.features.filter(f => !f.startsWith('Delivery')).slice(0, 3).map((feature, i) => (
                      <li key={i}>
                        <span className="svc-check-icon"><IconCheck /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Actions row */}
                  <div className="svc-card-actions">
                    <button
                      type="button"
                      className="svc-add-btn"
                      onClick={() => handleAddToCart(service)}
                    >
                      Add to Cart — {formatCurrency(service.price)}
                    </button>
                    {(service.features.length > 3 || service.delivery_info) && (
                      <button
                        type="button"
                        className="svc-details-toggle"
                        onClick={() => toggleExpanded(service.service_id)}
                        aria-expanded={expanded}
                        aria-controls={detailsId}
                      >
                        {expanded ? 'Hide details' : 'View details'}
                        <IconChevron open={expanded} />
                      </button>
                    )}
                  </div>

                  {/* Expandable details — always in DOM so aria-controls is always valid */}
                  <div
                    className={`svc-card-details${expanded ? '' : ' svc-card-details--closed'}`}
                    id={detailsId}
                    role="region"
                    aria-label={`${service.name} details`}
                  >
                      {service.features.filter(f => !f.startsWith('Delivery')).length > 3 && (
                        <div className="svc-detail-block">
                          <p className="svc-detail-label">All included</p>
                          <ul className="svc-features-full" aria-label="All features">
                            {service.features.filter(f => !f.startsWith('Delivery')).map((feature, i) => (
                              <li key={i}>
                                <span className="svc-check-icon"><IconCheck /></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="svc-detail-block">
                        <p className="svc-detail-label">Delivery times</p>
                        <div className="svc-delivery-table">
                          <div className="svc-delivery-row">
                            <span>1 song</span>
                            <strong>{service.delivery_info.delivery_times.one_song}</strong>
                          </div>
                          <div className="svc-delivery-row">
                            <span>5 songs</span>
                            <strong>{service.delivery_info.delivery_times.five_songs}</strong>
                          </div>
                          <div className="svc-delivery-row">
                            <span>10 songs</span>
                            <strong>{service.delivery_info.delivery_times.ten_songs}</strong>
                          </div>
                        </div>
                        <div className="svc-policy-chips">
                          {service.delivery_info.delivery_policy.map((policy, i) => (
                            <span key={i} className="svc-policy-chip">{policy}</span>
                          ))}
                        </div>
                      </div>

                      <div className="svc-detail-block">
                        <p className="svc-detail-label">How to send files</p>
                        <p className="svc-detail-text">{service.how_to_send.instructions}</p>
                      </div>
                    </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="svc-how-section" aria-labelledby="how-heading">
        <div className="svc-container">
          <div className="svc-section-header">
            <h2 id="how-heading">How It Works</h2>
            <p>Simple, remote, built around your schedule.</p>
          </div>
          <ol className="svc-steps" aria-label="Process steps">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <li key={step} className="svc-step">
                <div className="svc-step-num" aria-hidden="true">{step}</div>
                <div className="svc-step-connector" aria-hidden="true" />
                <div className="svc-step-body">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Retainer Plans ───────────────────────────────────── */}
      <section className="svc-retainer-section" aria-labelledby="retainer-heading">
        <div className="svc-container">
          <div className="svc-section-header">
            <h2 id="retainer-heading">Monthly Retainer Plans</h2>
            <p>Consistent output every month. Priority turnaround. No per-track negotiations.</p>
          </div>
          <div className="svc-retainer-grid">

            <div className="svc-retainer-card">
              <div className="svc-retainer-top">
                <span className="svc-retainer-badge">Popular</span>
                <h3>Session Retainer</h3>
                <div className="svc-retainer-price">
                  <span className="svc-price-amount">$175</span>
                  <span className="svc-price-period">/mo</span>
                </div>
              </div>
              <ul className="svc-retainer-features">
                <li><IconCheck />Up to 4 mixing sessions per month</li>
                <li><IconCheck />Priority turnaround (24–48 hrs)</li>
                <li><IconCheck />Revisions included per session</li>
                <li><IconCheck />Direct line via email &amp; DM</li>
                <li><IconCheck />Monthly performance recap</li>
              </ul>
              <a href="#inquiry" className="svc-retainer-cta svc-retainer-cta--secondary">
                Get Started
              </a>
            </div>

            <div className="svc-retainer-card svc-retainer-card--premium">
              <div className="svc-retainer-top">
                <span className="svc-retainer-badge svc-retainer-badge--premium">Full Access</span>
                <h3>Pro Retainer</h3>
                <div className="svc-retainer-price">
                  <span className="svc-price-amount">$300</span>
                  <span className="svc-price-period">/mo</span>
                </div>
              </div>
              <ul className="svc-retainer-features">
                <li><IconCheck />Unlimited mixing sessions</li>
                <li><IconCheck />Same-day turnaround available</li>
                <li><IconCheck />Mastering included on all tracks</li>
                <li><IconCheck />Beat licensing discounts</li>
                <li><IconCheck />Dedicated project folder &amp; archive</li>
                <li><IconCheck />Monthly strategy call</li>
              </ul>
              <a href="#inquiry" className="svc-retainer-cta svc-retainer-cta--primary">
                Get Started
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── Inquiry Form ─────────────────────────────────────── */}
      <section className="svc-inquiry-section" id="inquiry" aria-labelledby="inquiry-heading">
        <div className="svc-container">
          <div className="svc-inquiry-inner">
            <div className="svc-section-header">
              <h2 id="inquiry-heading">Start a Project</h2>
              <p>Tell me what you're working on — I'll get back to you within 24 hours.</p>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
