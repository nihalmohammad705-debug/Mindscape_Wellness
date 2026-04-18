import React from 'react';

const About = () => {
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
      <h1 style={{ marginBottom: '2rem', color: '#667eea' }}>About MindScape Wellness</h1>
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
          <h3 style={{ color: '#667eea', marginBottom: '1.5rem' }}>Our Mission</h3>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            At MindScape Wellness, we believe that mental health is just as important as physical health. 
            Our mission is to provide a comprehensive platform that helps you track, understand, and 
            improve your mental wellness journey through intuitive tools and personalized insights.
          </p>

          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>What We Offer</h3>
          <div style={{ 
            textAlign: 'left',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            <ul style={{ color: '#4a5568', lineHeight: '1.6' }}>
              <li>Daily mood tracking and analysis</li>
              <li>Nutrition and activity monitoring</li>
              <li>Personalized wellness recommendations</li>
              <li>Progress analytics and insights</li>
              <li>Secure and private data storage</li>
            </ul>
          </div>

          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Our Story</h3>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          MindScape Wellness is a fifth-semester Computer Science Engineering mini project developed in 2025 by students Nihal, Kabir, Chirag, and Navya. Inspired by research in digital mental health interventions, our team created a comprehensive wellness platform that combines mood tracking with nutrition and activity monitoring.

As a student-led initiative, we've applied cutting-edge web technologies and user-centered design principles to build an intuitive platform that demonstrates how technical innovation can contribute to accessible wellness tools. Our project represents the potential of student-driven solutions to address real-world health challenges..
          </p>

          <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Our Values</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Privacy First</h4>
              <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Your data is always secure and private</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>User-Centered</h4>
              <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Designed with your needs in mind</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Evidence-Based</h4>
              <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Backed by mental health research</p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#667eea',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '6px',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Join Our Community</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Start your wellness journey today and discover a better you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;