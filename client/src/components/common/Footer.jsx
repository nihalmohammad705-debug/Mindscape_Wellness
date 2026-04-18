import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌿 MindScape Wellness</h3>
            <p>Your comprehensive mental wellness and fitness tracking companion.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <Link to="/help-center">Help Center</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MindScape Wellness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;