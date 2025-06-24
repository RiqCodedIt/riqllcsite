import React, { useState, useEffect } from 'react';
import '../styles/PageContent.css';
import '../styles/ServicesStyles.css';
import { useCart } from '../components/cart/CartProvider';
import type { Service } from '../types/services';
import servicesData from '../data/services.json';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { addServiceToCart } = useCart();

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
    </div>
  );
};

export default Services;
