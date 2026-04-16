import React, { useState, useEffect } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/PageContent.css';
import '../styles/ServicesStyles.css';
import { useCart } from '../components/cart/CartProvider';
import InquiryForm from '../components/InquiryForm';
import type { Service } from '../types/services';
import servicesData from '../data/services.json';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Place Your Order',
    description: 'Add a service to your cart and complete checkout. You\'ll get an order confirmation with next steps.'
  },
  {
    step: '02',
    title: 'Send Your Files',
    description: 'Upload your stems or audio files via the link in your confirmation email. WAV or AIFF at the session\'s sample rate preferred.'
  },
  {
    step: '03',
    title: 'Receive Your Mix',
    description: 'Get back a polished, release-ready record within the delivery window. Revisions included — no extra charge.'
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'mixing': return '🎚️';
    case 'mastering': return '🎛️';
    case 'combo': return '🎵';
    case 'other': return '⚡';
    default: return '🎶';
  }
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { addServiceToCart } = useCart();

  usePageMeta({
    title: 'Mixing & Mastering Services | PRODBYRIQ',
    description: 'Professional remote mixing & mastering from $75. Send your stems, get back a polished record. Fast turnaround, unlimited revisions.',
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
    <div className="page-content">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="svc-hero">
        <div className="svc-hero-inner">
          <p className="svc-eyebrow">Remote · Fast Turnaround · Unlimited Revisions</p>
          <h1>Remote Mixing &amp; Mastering</h1>
          <p className="svc-hero-sub">
            Send your stems. Get back a finished record.
            No studio time required — just results.
          </p>
          <a href="#inquiry" className="btn-primary svc-hero-cta">Start a Project</a>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────── */}
      <section className="svc-section">
        <div className="svc-container">
          <div className="svc-section-header">
            <h2>Services</h2>
            <p>Choose the service that fits your project. All work is done remotely.</p>
          </div>
          <div className="svc-grid">
            {services.map((service) => {
              const expanded = expandedCard === service.service_id;
              return (
                <div
                  key={service.service_id}
                  className={`svc-card${expanded ? ' svc-card--expanded' : ''}`}
                  data-category={service.category}
                >
                  <button
                    type="button"
                    className="svc-card-header"
                    onClick={() => toggleExpanded(service.service_id)}
                    aria-expanded={expanded}
                  >
                    <span className="svc-card-icon" aria-hidden="true">
                      {getCategoryIcon(service.category)}
                    </span>
                    <span className="svc-card-title-wrap">
                      <span className="svc-card-title">{service.name}</span>
                      <span className="svc-card-price">{formatCurrency(service.price)}</span>
                    </span>
                    <span className="svc-card-toggle" aria-hidden="true">
                      {expanded ? '−' : '+'}
                    </span>
                  </button>

                  <p className="svc-card-desc">{service.description}</p>

                  {expanded && (
                    <div className="svc-card-details">
                      <div className="svc-detail-block">
                        <h4>What's included</h4>
                        <ul className="svc-features-list">
                          {service.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="svc-detail-block">
                        <h4>Delivery times</h4>
                        <div className="svc-delivery-table">
                          <div className="svc-delivery-row">
                            <span>1 song</span>
                            <span>{service.delivery_info.delivery_times.one_song}</span>
                          </div>
                          <div className="svc-delivery-row">
                            <span>5 songs</span>
                            <span>{service.delivery_info.delivery_times.five_songs}</span>
                          </div>
                          <div className="svc-delivery-row">
                            <span>10 songs</span>
                            <span>{service.delivery_info.delivery_times.ten_songs}</span>
                          </div>
                        </div>
                        <div className="svc-policy-chips">
                          {service.delivery_info.delivery_policy.map((policy, i) => (
                            <span key={i} className="svc-policy-chip">{policy}</span>
                          ))}
                        </div>
                      </div>

                      <div className="svc-detail-block">
                        <h4>How to send files</h4>
                        <p>{service.how_to_send.instructions}</p>
                      </div>
                    </div>
                  )}

                  <div className="svc-card-actions">
                    <button
                      type="button"
                      className="btn-primary svc-add-btn"
                      onClick={() => handleAddToCart(service)}
                    >
                      Add to Cart — {formatCurrency(service.price)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="svc-how-section">
        <div className="svc-container">
          <div className="svc-section-header">
            <h2>How It Works</h2>
            <p>Simple, remote, and built around your schedule.</p>
          </div>
          <ol className="svc-steps" aria-label="How it works steps">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <li key={step} className="svc-step">
                <span className="svc-step-number" aria-hidden="true">{step}</span>
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
      <section className="svc-retainer-section">
        <div className="svc-container">
          <div className="svc-section-header">
            <h2>Monthly Retainer Plans</h2>
            <p>Priority access, consistent delivery, and a dedicated engineer every month.</p>
          </div>
          <div className="svc-retainer-grid">
            <div className="svc-retainer-card">
              <span className="svc-retainer-badge">Most Popular</span>
              <h3>Session Retainer</h3>
              <div className="svc-retainer-price">$175<span>/mo</span></div>
              <ul className="svc-retainer-features">
                <li>Up to 4 mixing sessions per month</li>
                <li>Priority turnaround (24–48 hrs)</li>
                <li>Unlimited revisions per session</li>
                <li>Direct line via email &amp; DM</li>
                <li>Monthly performance recap</li>
              </ul>
              <a href="#inquiry" className="btn-secondary svc-retainer-cta">Get Started</a>
            </div>
            <div className="svc-retainer-card svc-retainer-card--premium">
              <span className="svc-retainer-badge svc-retainer-badge--premium">Full Access</span>
              <h3>Pro Retainer</h3>
              <div className="svc-retainer-price">$300<span>/mo</span></div>
              <ul className="svc-retainer-features">
                <li>Unlimited mixing sessions</li>
                <li>Same-day turnaround available</li>
                <li>Mastering included on all tracks</li>
                <li>Beat licensing discounts</li>
                <li>Dedicated project folder &amp; archive</li>
                <li>Monthly strategy call</li>
              </ul>
              <a href="#inquiry" className="btn-primary svc-retainer-cta">Get Started</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inquiry Form ─────────────────────────────────────── */}
      <section className="svc-inquiry-section" id="inquiry">
        <div className="svc-container svc-inquiry-inner">
          <div className="svc-section-header">
            <h2>Start a Project</h2>
            <p>Tell me what you're working on and I'll get back to you within 24 hours.</p>
          </div>
          <InquiryForm />
        </div>
      </section>

    </div>
  );
};

export default Services;
