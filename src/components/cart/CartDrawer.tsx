import React, { useState } from 'react';
import { useCart } from './CartProvider';
import { redirectToCheckout } from '../../services/stripe';
import type { CartItem } from '../../types/beats';

const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, clearCart, closeCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      await redirectToCheckout({
        items: cart.items
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setLoading(false);
    }
  };

  const renderCartItem = (item: CartItem, index: number) => {
    if (item.type === 'beat') {
      return (
        <div key={index} className="cart-item beat-item">
          <div className="cart-item-image">
            <img src={item.cover_path} alt={item.beat_title} />
          </div>
          <div className="cart-item-details">
            <h4>{item.beat_title}</h4>
            <p className="license-type">{item.license_type === 'lease' ? 'Lease License' : 'Exclusive License'}</p>
            <p className="item-price">{formatCurrency(item.price)}</p>
          </div>
          <button 
            className="remove-item-btn"
            onClick={() => removeFromCart(index.toString())}
            aria-label="Remove item"
          >
            ×
          </button>
        </div>
      );
    } else if (item.type === 'studio_session') {
      return (
        <div key={index} className="cart-item studio-item">
          <div className="cart-item-icon">
            🎵
          </div>
          <div className="cart-item-details">
            <h4>Studio Session</h4>
            <p className="studio-name">{item.studio_name}</p>
            <p className="session-details">{item.date} • {item.time_slot}</p>
            <p className="session-type">{item.session_type} • {item.duration}h</p>
            <p className="item-price">{formatCurrency(item.price)}</p>
          </div>
          <button 
            className="remove-item-btn"
            onClick={() => removeFromCart(index.toString())}
            aria-label="Remove item"
          >
            ×
          </button>
        </div>
      );
    } else {
      // Service item
      return (
        <div key={index} className="cart-item service-item">
          <div className="cart-item-icon">
            🎛️
          </div>
          <div className="cart-item-details">
            <h4>{item.service_name}</h4>
            <p className="service-category">{item.category}</p>
            <p className="item-price">{formatCurrency(item.price)}</p>
          </div>
          <button 
            className="remove-item-btn"
            onClick={() => removeFromCart(index.toString())}
            aria-label="Remove item"
          >
            ×
          </button>
        </div>
      );
    }
  };

  if (!cart.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={closeCart} />
      
      {/* Drawer */}
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-cart-btn" onClick={closeCart}>
            ×
          </button>
        </div>

        <div className="cart-content">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h4>Your cart is empty</h4>
              <p>Add some beats or book a studio session to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item, index) => renderCartItem(item, index))}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <div className="total-row">
                    <span>Subtotal ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})</span>
                    <span className="total-amount">{formatCurrency(cart.total)}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button 
                    className="clear-cart-btn secondary"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button 
                    className="checkout-btn primary"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="cart-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
