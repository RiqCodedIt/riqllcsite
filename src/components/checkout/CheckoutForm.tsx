import React, { useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { redirectToCheckout } from '../../services/stripe';
import type { CheckoutData } from '../../services/stripe';
import '../../styles/Checkout.css';

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const checkoutData: CheckoutData = {
        items: cart.items,
        customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined
      };

      await redirectToCheckout(checkoutData);
      // If we reach here, something went wrong with the redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form-container">
        <div className="checkout-form-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="checkout-form-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-details">
                    {item.type === 'beat' && (
                      <>
                        <span className="item-name">{item.beat_title}</span>
                        <span className="item-type">{item.license_type} License</span>
                      </>
                    )}
                    {item.type === 'studio_session' && (
                      <>
                        <span className="item-name">Studio Session</span>
                        <span className="item-type">{item.studio_name} • {item.date}</span>
                      </>
                    )}
                    {item.type === 'service' && (
                      <>
                        <span className="item-name">{item.service_name}</span>
                        <span className="item-type">{item.category}</span>
                      </>
                    )}
                  </div>
                  <span className="item-price">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: {formatCurrency(cart.total)}</strong>
            </div>
          </div>

          {/* Customer Information Form */}
          <form onSubmit={handleSubmit} className="customer-form">
            <h3>Contact Information (Optional)</h3>
            <p className="form-note">
              Providing your contact information helps us send you order confirmations and updates.
            </p>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="checkout-btn primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(cart.total)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
