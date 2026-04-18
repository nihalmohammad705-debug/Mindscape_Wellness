import React from 'react';

const HelpCenter = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#667eea' }}>Help Center</h1>
      <div style={{ 
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{ 
          backgroundColor: '#f7fafc',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(245, 6, 6, 0.1)'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ fontWeight: 'bold', color: '#2d3748' }}>Q: How do I track my mood?</p>
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>A: Go to the Mood section in your dashboard and select your current mood level.</p>
            
            <p style={{ fontWeight: 'bold', color: '#2d3748' }}>Q: Can I export my data?</p>
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>A: Yes, visit the Analytics section to export your wellness data.</p>
            
            <p style={{ fontWeight: 'bold', color: '#2d3748' }}>Q: Is my data secure?</p>
            <p style={{ color: '#4a5568' }}>A: Yes, we use industry-standard encryption to protect your personal information.</p>
          </div>
          
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Need More Help?</h3>
          <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
            <strong>Email:</strong> support@mindscapewellness.com
          </p>
          <p style={{ color: '#4a5568' }}>
            <strong>Phone:</strong> +91 8618233493
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;