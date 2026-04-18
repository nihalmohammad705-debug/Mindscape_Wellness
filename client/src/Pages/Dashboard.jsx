// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/common/Navigation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');
  const [wellnessTip, setWellnessTip] = useState('');
  const [loading, setLoading] = useState(true);

  const quotes = [
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "Small steps every day lead to big changes over time. Be patient with your journey.",
    "You are stronger than you think, more capable than you imagine, and worthy of self-care.",
    "Mental wellness isn't a destination—it's a continuous journey of growth and self-discovery.",
    "Every breath is a new beginning. Every moment is a fresh start for your well-being.",
    "Your mind is a garden. Nurture it with positive thoughts and watch yourself bloom.",
    "Progress, not perfection. Every step forward is a victory in your wellness journey.",
    "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    "Self-care is how you take your power back. It's saying 'yes' to your well-being.",
    "Your current situation is not your final destination. Better days are coming."
  ];

  const wellnessTips = [
    "Take 5 deep breaths. Inhale peace, exhale stress. Repeat throughout your day.",
    "Drink a glass of water. Hydration is key to both physical and mental clarity.",
    "Step outside for 2 minutes. Fresh air can instantly improve your mood and perspective.",
    "Write down one thing you're grateful for today. Gratitude shifts your focus to positivity.",
    "Stretch your body for 30 seconds. Release physical tension to ease mental stress.",
    "Put your phone away for 15 minutes. Give your mind a digital detox break.",
    "Listen to your favorite song. Music has incredible power to lift your spirits.",
    "Compliment yourself. Acknowledge one thing you did well today.",
    "Look out a window and notice three beautiful things in your surroundings.",
    "Do one small act of kindness. Helping others boosts your own happiness too."
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      let greeting = "Good ";
      if (hours < 12) greeting += "Morning";
      else if (hours < 18) greeting += "Afternoon";
      else greeting += "Evening";

      setCurrentTime(`${greeting} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    
    setDailyQuote(randomQuote);
    setWellnessTip(randomTip);
    setLoading(false);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner text="Preparing your wellness space..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <Navigation />
        </aside>

        <main className="dashboard-main">
          <section className="welcome-section">
            <div className="welcome-header">
              <div className="greeting-container">
                <h1>Hello, {user?.name || 'Beautiful Soul'}! 🌟</h1>
                <p className="time-display">{currentTime}</p>
              </div>
              <div className="unique-id-badge">
                <strong>Wellness ID:</strong> {user?.uniqueId || 'MW' + Date.now().toString(36).toUpperCase()}
              </div>
            </div>
            
            <div className="welcome-message">
              <p>Welcome to your peaceful corner of the internet. How would you like to nurture your well-being today?</p>
            </div>
          </section>

          <section className="inspiration-section">
            <div className="inspiration-card">
              <div className="quote-icon">💭</div>
              <div className="inspiration-content">
                <h3>Today's Inspiration</h3>
                <p className="daily-quote">"{dailyQuote}"</p>
                <div className="inspiration-actions">
                  <button 
                    className="inspiration-btn"
                    onClick={() => setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)])}
                  >
                    🔄 New Quote
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="wellness-actions-section">
            <h2>Your Wellness Toolkit</h2>
            <div className="wellness-grid">
              <Link to="/mood-tracker" className="wellness-card mood-card">
                <div className="card-icon">😊</div>
                <div className="card-content">
                  <h3>Check In</h3>
                  <p>How are you feeling right now? Take a moment to acknowledge your emotions.</p>
                  <span className="card-cta">Express Yourself →</span>
                </div>
              </Link>

              <Link to="/nutrition" className="wellness-card nutrition-card">
                <div className="card-icon">🍎</div>
                <div className="card-content">
                  <h3>Nourish</h3>
                  <p>Fuel your body with intention. What's nourishing you today?</p>
                  <span className="card-cta">Track Nutrition →</span>
                </div>
              </Link>

              <Link to="/activity" className="wellness-card activity-card">
                <div className="card-icon">💪</div>
                <div className="card-content">
                  <h3>Move</h3>
                  <p>Celebrate your body's movement. Every step counts toward wellness.</p>
                  <span className="card-cta">Log Activity →</span>
                </div>
              </Link>

              <Link to="/analytics" className="wellness-card analytics-card">
                <div className="card-icon">📈</div>
                <div className="card-content">
                  <h3>Reflect</h3>
                  <p>See your wellness journey unfold. Patterns emerge, growth happens.</p>
                  <span className="card-cta">View Insights →</span>
                </div>
              </Link>
            </div>
          </section>

          <section className="challenge-section">
            <div className="challenge-card">
              <div className="challenge-header">
                <span className="challenge-icon">🎯</span>
                <h3>Today's Wellness Challenge</h3>
              </div>
              <div className="challenge-content">
                <p>{wellnessTip}</p>
                <div className="challenge-actions">
                  <button 
                    className="challenge-btn completed"
                    onClick={() => {
                      alert("🎉 Amazing! You're taking great care of yourself!");
                      setWellnessTip(wellnessTips[Math.floor(Math.random() * wellnessTips.length)]);
                    }}
                  >
                    ✅ I did this!
                  </button>
                  <button 
                    className="challenge-btn skip"
                    onClick={() => setWellnessTip(wellnessTips[Math.floor(Math.random() * wellnessTips.length)])}
                  >
                    🔄 New Challenge
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mindfulness-section">
            <h2>Mindful Moments</h2>
            <div className="mindfulness-grid">
              <div className="mindfulness-card">
                <div className="mindfulness-icon">🌿</div>
                <h4>Breathe With Me</h4>
                <p>Take 60 seconds for a breathing exercise. Inhale peace, exhale tension.</p>
                <button className="mindfulness-btn" onClick={() => alert("🧘‍♀️ Breathe in... 2... 3... 4... Hold... 2... 3... Breathe out... 2... 3... 4... Beautiful!")}>
                  Start Breathing
                </button>
              </div>

              <div className="mindfulness-card">
                <div className="mindfulness-icon">📝</div>
                <h4>Quick Journal</h4>
                <p>One sentence about today: "Right now, I feel..."</p>
                <button className="mindfulness-btn" onClick={() => {
                  const thought = prompt("Complete this sentence: 'Right now, I feel...'");
                  if (thought) alert(`Thank you for sharing: "${thought}" 💖`);
                }}>
                  Share Your Thought
                </button>
              </div>

              <div className="mindfulness-card">
                <div className="mindfulness-icon">🎵</div>
                <h4>Music Break</h4>
                <p>Put on your favorite song and just listen for 3 minutes.</p>
                <button className="mindfulness-btn" onClick={() => alert("🎶 Perfect! Take this moment to just be present with the music. No multitasking, just listening.")}>
                  Take Music Break
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;