import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/common/Navigation';
import './HelpSupport.css';

const ReportIssue = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    issueType: 'bug',
    title: '',
    description: '',
    steps: '',
    priority: 'medium'
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
    console.log('Issue reported:', formData);
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
              <h2>Issue Reported Successfully!</h2>
              <p>Thank you for reporting the issue. Our team will review it and get back to you within 24 hours.</p>
              <p>Reference ID: <strong>ISS-{Date.now().toString().slice(-6)}</strong></p>
              <div className="success-actions">
                <a href="/dashboard" className="btn btn-primary">Back to Dashboard</a>
                <a href="/report-issue" className="btn btn-secondary">Report Another Issue</a>
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
            <h1>🐛 Report an Issue</h1>
            <p>Help us improve MindScape Wellness by reporting any bugs or issues you encounter</p>
          </div>

          <form onSubmit={handleSubmit} className="issue-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="issueType">Issue Type</label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="bug">Bug/Technical Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="ui">User Interface Problem</option>
                  <option value="performance">Performance Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="low">Low - Minor inconvenience</option>
                  <option value="medium">Medium - Affects functionality</option>
                  <option value="high">High - Prevents core feature use</option>
                  <option value="critical">Critical - App not working</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">Issue Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
                rows="4"
                placeholder="Please describe the issue in detail..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="steps">Steps to Reproduce</label>
              <textarea
                id="steps"
                name="steps"
                value={formData.steps}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Submit Issue Report
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

export default ReportIssue;