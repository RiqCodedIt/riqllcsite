import React, { useState } from 'react';
import { useCart } from './CartProvider';
import { redirectToCheckout } from '../../services/stripe';
import type { CartItem } from '../../types/beats';

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconRemove = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconService = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="4" y2="6" /><line x1="4" y1="10" x2="20" y2="10" />
    <line x1="4" y1="14" x2="4" y2="14" /><line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" /><circle cx="16" cy="14" r="2" />
    <line x1="10" y1="6" x2="20" y2="6" /><line x1="4" y1="14" x2="14" y2="14" />
  </svg>
);

const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, clearCart, closeCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      await redirectToCheckout({ items: cart.items });
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
            type="button"
            className="remove-item-btn"
            onClick={() => removeFromCart(index.toString())}
            aria-label={`Remove ${item.beat_title} from cart`}
          >
            <IconRemove />
          </button>
        </div>
      );
    } else {
      return (
        <div key={index} className="cart-item service-item">
          <div className="cart-item-icon">
            <IconService />
          </div>
          <div className="cart-item-details">
            <h4>{item.service_name}</h4>
            <p className="service-category">{item.category}</p>
            <p className="item-price">{formatCurrency(item.price)}</p>
          </div>
          <button
            type="button"
            className="remove-item-btn"
            onClick={() => removeFromCart(index.toString())}
            aria-label={`Remove ${item.service_name} from cart`}
          >
            <IconRemove />
          </button>
        </div>
      );
    }
  };

  if (!cart.isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} aria-hidden="true" />
      <div
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button
            type="button"
            className="close-cart-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <IconClose />
          </button>
        </div>

        <div className="cart-content">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <IconCart />
              </div>
              <h4>Your cart is empty</h4>
              <p>Add some beats or services to get started.</p>
            </div>
          ) : (
            <>
              <div className="cart-items" role="list" aria-label="Cart items">
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
                  <button type="button" className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button
                    type="button"
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? 'Processing…' : 'Checkout'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="cart-error" role="alert" aria-live="assertive">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            <IconClose />
          </button>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
