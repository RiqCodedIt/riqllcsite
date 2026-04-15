import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <p className="footer-logo">PRODBYRIQ</p>
          <p className="footer-tagline">Professional Music Production</p>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <div className="footer-links-list">
            <a href="mailto:riq@prodbyriq.com" className="footer-link">
              riq@prodbyriq.com
            </a>
            <a href="tel:+18333104683" className="footer-link">
              (833) 310-4683
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <nav className="footer-links-list">
            <Link to="/beats" className="footer-link">Beats</Link>
            <Link to="/services" className="footer-link">Services</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/featured-work" className="footer-link">Featured Work</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h3>Follow Me</h3>
          <div className="footer-links-list">
            <a
              href="https://instagram.com/prodbyriq"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@prodbyriq"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              TikTok
            </a>
            <a
              href="https://www.youtube.com/@not-riq"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ProdByRiq LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
