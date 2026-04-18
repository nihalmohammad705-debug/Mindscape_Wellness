import React from 'react';

const Contact = () => {
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
      <h1 style={{ marginBottom: '2rem', color: '#667eea' }}>Contact Us</h1>
      <div style={{ 
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{ 
          backgroundColor: '#f7fafc',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '1.5rem' }}>Get in Touch</h3>
          <p style={{ color: '#4a5568', marginBottom: '2rem' }}>
            We'd love to hear from you! Reach out through any of the following methods:
          </p>
          
          <div style={{ 
            textAlign: 'left',
            display: 'inline-block',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> contact@mindscapewellness.com
            </p>
            <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
              <strong>Phone:</strong> +91 8618233493
            </p>
            <p style={{ color: '#4a5568' }}>
              <strong>Address:</strong> Near S.E.A College, 2nd Cross Ekta Nagar, K.R Puram, Bangalore, Karnataka-560036
            </p>
          </div>
          
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Office Hours</h3>
          <div style={{ 
            textAlign: 'left',
            display: 'inline-block'
          }}>
            <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
            <p style={{ color: '#4a5568' }}>Saturday: 10:00 AM - 2:00 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;