import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Determine logo text color based on theme
  const getLogoTextColor = () => {
    return darkMode ? 'yellow' : 'var(--accent-primary)';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">🌿</span>
            <span 
              className="logo-text" 
              style={{ color: getLogoTextColor() }}
            >
              MindScape Wellness
            </span>
          </Link>
        </div>

        <nav className="nav">
          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                Dashboard
              </Link>
              <Link to="/mood-tracker" className={isActive('/mood-tracker') ? 'active' : ''}>
                Mood
              </Link>
              <Link to="/nutrition" className={isActive('/nutrition') ? 'active' : ''}>
                Nutrition
              </Link>
              <Link to="/activity" className={isActive('/activity') ? 'active' : ''}>
                Activity
              </Link>
              <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
                Analytics
              </Link>
              <div className="user-menu">
                <button 
                  onClick={toggleDarkMode} 
                  className="theme-toggle"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                <span>Hello, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <button 
                onClick={toggleDarkMode} 
                className="theme-toggle"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <Link to="/login">Login</Link>
              <Link to="/register" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </nav>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link to="/mood-tracker" onClick={() => setIsMobileMenuOpen(false)}>Mood</Link>
                <Link to="/nutrition" onClick={() => setIsMobileMenuOpen(false)}>Nutrition</Link>
                <Link to="/activity" onClick={() => setIsMobileMenuOpen(false)}>Activity</Link>
                <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>Analytics</Link>
                <button onClick={toggleDarkMode}>
                  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={toggleDarkMode}>
                  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;