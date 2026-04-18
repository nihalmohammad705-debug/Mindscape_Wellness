import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🌿MindScape  Wellness</h1>
          <p className="hero-subtitle">
            Your comprehensive mental wellness and fitness tracking companion
          </p>
          <p className="hero-description">
            Track your mood, monitor nutrition, log activities, and get personalized insights 
            for better mental health and overall wellbeing.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="feature-cards">
            <div className="feature-card">😊 Mood Tracking</div>
            <div className="feature-card">🍎 Nutrition Analysis</div>
            <div className="feature-card">💪 Activity Monitoring</div>
            <div className="feature-card">📈 Progress Insights</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose MindScape Wellness?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h3>Comprehensive Tracking</h3>
              <p>Monitor mood, nutrition, sleep, and activity in one place with detailed analytics and insights.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is encrypted and secure. We prioritize your privacy with unique user IDs.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💡</div>
              <h3>Smart Recommendations</h3>
              <p>Get personalized suggestions based on your patterns and wellness goals.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple, intuitive interface designed for daily use with quick entry options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up & Create Profile</h3>
              <p>Register with your email and get a unique user ID for secure access.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Track Daily Activities</h3>
              <p>Log your mood, food intake, exercise, and sleep patterns daily.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>View Insights</h3>
              <p>See patterns and trends in your wellness data with interactive charts.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Recommendations</h3>
              <p>Receive personalized tips for improving your mental and physical health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Wellness Journey Today</h2>
          <p>Join thousands of users who have improved their mental health with MindScape Wellness.</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;