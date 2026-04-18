import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/common/Navigation';
import './HelpSupport.css';

const ContactSupport = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: '',
    contactEmail: user?.email || ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would send data to backend
    console.log('Support request:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="help-support-page">
        <div className="help-support-container">
          <aside className="help-support-sidebar">
            <Navigation />
          </aside>
          <main className="help-support-main">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Message Sent Successfully!</h2>
              <p>Thank you for contacting us. Our support team will get back to you within 24 hours.</p>
              <p>Ticket ID: <strong>TKT-{Date.now().toString().slice(-6)}</strong></p>
              <div className="success-actions">
                <a href="/dashboard" className="btn btn-primary">Back to Dashboard</a>
                <a href="/contact-support" className="btn btn-secondary">Send Another Message</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="help-support-page">
      <div className="help-support-container">
        <aside className="help-support-sidebar">
          <Navigation />
        </aside>

        <main className="help-support-main">
          <div className="help-support-header">
            <h1>📞 Contact Support</h1>
            <p>Get in touch with our support team for any questions or assistance</p>
          </div>

          <div className="contact-info">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">⏰</div>
                <h4>Response Time</h4>
                <p>Typically within 24 hours</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h4>Email Support</h4>
                <p>support@mindscapewellness.com</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🕒</div>
                <h4>Support Hours</h4>
                <p>Mon-Fri, 9AM-6PM IST</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">Product Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Your Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Brief summary of your inquiry"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-input"
                rows="6"
                placeholder="Please describe your issue or question in detail..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
              <a href="/dashboard" className="btn btn-secondary">
                Cancel
              </a>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ContactSupport;