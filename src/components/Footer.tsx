import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="ft-footer">
      <div className="ft-inner">

        <div className="ft-brand">
          <p className="ft-logo">PRODBYRIQ</p>
          <p className="ft-tagline">Professional Music Production</p>
        </div>

        <div className="ft-col">
          <p className="ft-col-heading">Contact</p>
          <nav className="ft-links" aria-label="Contact links">
            <a href="mailto:riq@prodbyriq.com" className="ft-link">riq@prodbyriq.com</a>
            <a href="tel:+18333104683" className="ft-link">(833) 310-4683</a>
          </nav>
        </div>

        <div className="ft-col">
          <p className="ft-col-heading">Pages</p>
          <nav className="ft-links" aria-label="Site pages">
            <Link to="/beats" className="ft-link">Beats</Link>
            <Link to="/services" className="ft-link">Services</Link>
            <Link to="/about" className="ft-link">About</Link>
            <Link to="/featured-work" className="ft-link">Featured Work</Link>
          </nav>
        </div>

        <div className="ft-col">
          <p className="ft-col-heading">Follow</p>
          <nav className="ft-links" aria-label="Social media links">
            <a href="https://instagram.com/prodbyriq" target="_blank" rel="noopener noreferrer" className="ft-link">Instagram</a>
            <a href="https://tiktok.com/@prodbyriq" target="_blank" rel="noopener noreferrer" className="ft-link">TikTok</a>
            <a href="https://www.youtube.com/@not-riq" target="_blank" rel="noopener noreferrer" className="ft-link">YouTube</a>
          </nav>
        </div>

      </div>

      <div className="ft-bottom">
        <p>&copy; {new Date().getFullYear()} ProdByRiq LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
