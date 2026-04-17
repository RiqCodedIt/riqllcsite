import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';
import { useCart } from './cart/CartProvider';

const NavBar = () => {
  const location = useLocation();
  const { getItemCount, openCart } = useCart();
  const itemCount = getItemCount();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nb-nav" aria-label="Main navigation">
      <div className="nb-container">

        <Link to="/" className="nb-logo" onClick={closeMenu} aria-label="PRODBYRIQ — Home">
          PRODBYRIQ
        </Link>

        <button
          type="button"
          className="nb-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nb-menu"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="2" y1="2" x2="16" y2="16" />
              <line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="0" y1="2" x2="20" y2="2" />
              <line x1="0" y1="8" x2="20" y2="8" />
              <line x1="0" y1="14" x2="20" y2="14" />
            </svg>
          )}
        </button>

        <ul
          id="nb-menu"
          className={`nb-menu${menuOpen ? ' nb-menu--open' : ''}`}
        >
          {[
            { to: '/beats', label: 'Beats' },
            { to: '/services', label: 'Services' },
            { to: '/about', label: 'About' },
            { to: '/featured-work', label: 'Work' },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nb-link${isActive(to) ? ' nb-link--active' : ''}`}
                onClick={closeMenu}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="nb-cart-btn"
              onClick={() => { openCart(); closeMenu(); }}
              aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="nb-cart-badge" aria-hidden="true">{itemCount}</span>
              )}
            </button>
          </li>
        </ul>

      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="nb-overlay"
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default NavBar;
