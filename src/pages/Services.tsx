import React, { useState, useEffect } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/PageContent.css';
import '../styles/ServicesStyles.css';
import { useCart } from '../components/cart/CartProvider';
import InquiryForm from '../components/InquiryForm';
import type { Service } from '../types/services';
import servicesData from '../data/services.json';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { addServiceToCart } = useCart();

  usePageMeta({
    title: 'Mixing & Mastering Services | PRODBYRIQ',
    description: 'Professional mixing & mastering from $75. Monthly retainer plans from $175/mo. Send your stems for studio-quality sound.',
    canonicalPath: '/services',
  });

  useEffect(() => {
    setServices(servicesData.services as Service[]);
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mixing': return '🎚️';
      case 'mastering': return '🎛️';
      case 'combo': return '🎵';
      case 'other': return '⚡';
      default: return '🎶';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mixing': return '#60efff';
      case 'mastering': return '#ff6b6b';
      case 'combo': return '#00ff87';
      case 'other': return '#ffa500';
      default: return '#60efff';
    }
  };

  const handleAddToCart = (service: Service) => {
    addServiceToCart({
      service_id: service.service_id,
      service_name: service.name,
      price: service.price,
      category: service.category
    });
  };

  const toggleExpanded = (serviceId: string) => {
    setExpandedCard(expandedCard === serviceId ? null : serviceId);
  };

  const isExpanded = (serviceId: string) => {
    return expandedCard === serviceId;
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="loading-spinner">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="services-header">
        <h1>Professional Audio Services</h1>
        <p>High-quality mixing, mastering, and audio production services</p>
        <div className="services-stats">
          <span>{services.length} services available</span>
          <span>•</span>
          <span>Professional quality</span>
          <span>•</span>
          <span>Fast delivery</span>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.service_id} className={`service-card ${isExpanded(service.service_id) ? 'expanded' : ''}`}>
            <div className="service-header" onClick={() => toggleExpanded(service.service_id)}>
              <div className="service-icon" style={{ color: getCategoryColor(service.category) }}>
                {getCategoryIcon(service.category)}
              </div>
              <div className="service-title-price">
                <h3 className="service-title">{service.name}</h3>
                <div className="service-price">{formatCurrency(service.price)}</div>
              </div>
              <div className="expand-indicator">
                {isExpanded(service.service_id) ? '−' : '+'}
              </div>
            </div>

            <div className="service-description">
              <p>{service.description}</p>
            </div>

            {isExpanded(service.service_id) && (
              <div className="service-details">
                <div className="service-features">
                  <h4>What's included?</h4>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-delivery">
                  <h4>Delivery Times</h4>
                  <div className="delivery-times">
                    <div className="delivery-item">
                      <span className="delivery-label">[1 Song]</span>
                      <span className="delivery-time">{service.delivery_info.delivery_times.one_song}</span>
                    </div>
                    <div className="delivery-item">
                      <span className="delivery-label">[5 Songs]</span>
                      <span className="delivery-time">{service.delivery_info.delivery_times.five_songs}</span>
                    </div>
                    <div className="delivery-item">
                      <span className="delivery-label">[10 Songs]</span>
                      <span className="delivery-time">{service.delivery_info.delivery_times.ten_songs}</span>
                    </div>
                  </div>
                  <div className="delivery-policy">
                    {service.delivery_info.delivery_policy.map((policy, index) => (
                      <span key={index} className="policy-item">• {policy}</span>
                    ))}
                  </div>
                </div>

                <div className="service-how-to-send">
                  <h4>How to send?</h4>
                  <p>{service.how_to_send.instructions}</p>
                  
                  {/* <h5>What DAW can I send you stems from?</h5>
                  <div className="supported-daws">
                    {service.how_to_send.supported_daws.map((daw, index) => (
                      <span key={index} className="daw-tag">{daw}</span>
                    ))}
                  </div> */}
                </div>
              </div>
            )}

            <div className="service-actions">
              <button 
                className="add-to-cart-service-btn"
                onClick={() => handleAddToCart(service)}
              >
                Add to Cart - {formatCurrency(service.price)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Retainer Plans */}
      <div className="retainer-section">
        <div className="retainer-header">
          <h2>Monthly Retainer Plans</h2>
          <p>Priority access, consistent delivery, and a dedicated engineer on your team every month.</p>
        </div>
        <div className="retainer-grid">
          <div className="retainer-card">
            <div className="retainer-badge">Most Popular</div>
            <h3>Session Retainer</h3>
            <div className="retainer-price">$175<span>/mo</span></div>
            <ul className="retainer-features">
              <li>Up to 4 mixing sessions per month</li>
              <li>Priority turnaround (24–48 hrs)</li>
              <li>Unlimited revisions per session</li>
              <li>Direct line via email & DM</li>
              <li>Monthly performance recap</li>
            </ul>
            <a href="#inquiry" className="retainer-cta">Get Started</a>
          </div>
          <div className="retainer-card retainer-card--premium">
            <div className="retainer-badge retainer-badge--premium">Full Access</div>
            <h3>Studio Retainer</h3>
            <div className="retainer-price">$300<span>/mo</span></div>
            <ul className="retainer-features">
              <li>Unlimited mixing sessions</li>
              <li>Same-day turnaround available</li>
              <li>Mastering included on all tracks</li>
              <li>Beat licensing discounts</li>
              <li>Dedicated project folder & archive</li>
              <li>Monthly strategy call</li>
            </ul>
            <a href="#inquiry" className="retainer-cta retainer-cta--premium">Get Started</a>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="inquiry-section" id="inquiry">
        <div className="inquiry-section-header">
          <h2>Start a Project</h2>
          <p>Tell me what you're working on and I'll get back to you within 24 hours.</p>
        </div>
        <InquiryForm />
      </div>
    </div>
  );
};

export default Services;
