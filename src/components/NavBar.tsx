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

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    RIQ
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
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        About
                    </Link>
                    <Link
                        to="/beats"
                        className={`nav-link ${location.pathname === '/beats' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Beats
                    </Link>
                    <Link
                        to="/services"
                        className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Services
                    </Link>
                    <Link
                        to="/booking"
                        className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Booking
                    </Link>
                    <button
                        className="cart-icon-btn"
                        onClick={() => { openCart(); closeMenu(); }}
                        aria-label="Open cart"
                    >
                        🛒
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
