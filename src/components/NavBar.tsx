import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';
import { useCart } from './cart/CartProvider';

const NavBar = () => {
    const location = useLocation();
    const { getItemCount, openCart } = useCart();
    const itemCount = getItemCount();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    RIQ
                </Link>
                <div className="nav-menu">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                    >
                        About
                    </Link>
                    <Link 
                        to="/beats" 
                        className={`nav-link ${location.pathname === '/beats' ? 'active' : ''}`}
                    >
                        Beats
                    </Link>
                    <Link 
                        to="/services" 
                        className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
                    >
                        Services
                    </Link>
                    <Link 
                        to="/booking" 
                        className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
                    >
                        Booking
                    </Link>
                    <button 
                        className="cart-icon-btn"
                        onClick={openCart}
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
