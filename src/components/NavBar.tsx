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
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    PRODBYRIQ
                </Link>

                <button
                    type="button"
                    className="mobile-menu-toggle"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

                <div className={`nav-menu${menuOpen ? ' mobile-open' : ''}`}>
                    <Link
                        to="/beats"
                        className={`nav-link${isActive('/beats') ? ' active' : ''}`}
                        onClick={closeMenu}
                    >
                        Beats
                    </Link>
                    <Link
                        to="/services"
                        className={`nav-link${isActive('/services') ? ' active' : ''}`}
                        onClick={closeMenu}
                    >
                        Services
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link${isActive('/about') ? ' active' : ''}`}
                        onClick={closeMenu}
                    >
                        About
                    </Link>
                    <Link
                        to="/featured-work"
                        className={`nav-link${isActive('/featured-work') ? ' active' : ''}`}
                        onClick={closeMenu}
                    >
                        Work
                    </Link>
                    <button
                        className="cart-icon-btn"
                        onClick={() => { openCart(); closeMenu(); }}
                        aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        {itemCount > 0 && (
                            <span className="cart-count">{itemCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
