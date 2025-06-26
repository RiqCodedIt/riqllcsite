import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <p>
              <a href="mailto:riq@prodbyriq.com" className="footer-link">
                riq@prodbyriq.com
              </a>
            </p>
            <p>
              <a href="tel:+18333104683" className="footer-link">
                (833) 310-4683
              </a>
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Studio Location</h3>
          <div className="address">
            <p>
              <a 
                href="https://maps.google.com/?q=The+Record+Co.+960+Massachusetts+Avenue+Boston+MA+02118" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                The Record Co.<br />
                960 Massachusetts Avenue<br />
                Boston, MA 02118
              </a>
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a 
              href="https://instagram.com/prodbyriq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              Instagram
            </a>
            <a 
              href="https://tiktok.com/@prodbyriq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              TikTok
            </a>
            <a 
              href="https://www.youtube.com/@not-riq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 ProdByRiq LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
