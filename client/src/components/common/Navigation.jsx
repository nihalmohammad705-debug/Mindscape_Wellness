import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  // Handle Help Center click - navigate to profile with help tab
  const handleHelpCenter = () => {
    navigate('/profile', { state: { activeTab: 'help' } });
  };

  // Handle Privacy Policy click - navigate to profile with privacy tab
  const handlePrivacyPolicy = () => {
    navigate('/profile', { state: { activeTab: 'privacy' } });
  };

  return (
    <nav className="sidebar-navigation">
      <div className="nav-items">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <span>📊</span>
          Dashboard
        </Link>
        <Link to="/mood-tracker" className={`nav-item ${isActive('/mood-tracker') ? 'active' : ''}`}>
          <span>😊</span>
          Mood Tracker
        </Link>
        <Link to="/nutrition" className={`nav-item ${isActive('/nutrition') ? 'active' : ''}`}>
          <span>🍎</span>
          Nutrition
        </Link>
        <Link to="/activity" className={`nav-item ${isActive('/activity') ? 'active' : ''}`}>
          <span>💪</span>
          Activity
        </Link>
        <Link to="/analytics" className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}>
          <span>📈</span>
          Analytics
        </Link>
        <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <span>👤</span>
          Profile
        </Link>
      </div>

      {/* Support Section */}
      <div className="support-section">
        <h4 className="support-title">Support</h4>
        <div className="support-links">
          <button 
            onClick={handleHelpCenter}
            className="support-link"
          >
            <span className="support-icon">❓</span>
            <span>Help Center</span>
          </button>
          
          <Link 
            to="/contact-support" 
            className="support-link"
          >
            <span className="support-icon">📞</span>
            <span>Contact</span>
          </Link>
          
          <button 
            onClick={handlePrivacyPolicy}
            className="support-link"
          >
            <span className="support-icon">🔒</span>
            <span>Privacy Policy</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;