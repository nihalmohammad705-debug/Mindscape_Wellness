import React from 'react';

const PrivacyPolicy = () => {
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
      <h1 style={{ marginBottom: '2rem', color: '#667eea' }}>Privacy Policy</h1>
      <div style={{ 
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{ 
          backgroundColor: '#f7fafc',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Data Collection</h3>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            We collect only the information necessary to provide you with personalized wellness tracking and recommendations.
          </p>
          
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>How We Use Your Data</h3>
          <p style={{ color: '#4a5568', marginBottom: '1rem' }}>Your data is used to:</p>
          <ul style={{ color: '#4a5568', marginBottom: '1.5rem', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Track your mental wellness progress</li>
            <li>Provide personalized insights and recommendations</li>
            <li>Improve our services</li>
            <li>Ensure the security of your account</li>
          </ul>
          
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Data Security</h3>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            We implement industry-standard security measures including encryption and secure servers to protect your personal information.
          </p>
          
          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Your Rights</h3>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            You have the right to access, modify, or delete your personal data at any time through your account settings. 
            You can also request a copy of all data we have stored about you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;