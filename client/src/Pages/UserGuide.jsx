import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/common/Navigation';
import './HelpSupport.css';

const UserGuide = () => {
  const { user } = useAuth();

  const sections = [
    {
      title: "Getting Started",
      icon: "🚀",
      items: [
        "Create your account and set up your profile",
        "Take the initial wellness assessment",
        "Set your wellness goals and preferences",
        "Explore the different tracking features"
      ]
    },
    {
      title: "Mood Tracking",
      icon: "😊",
      items: [
        "Log your mood multiple times per day",
        "Use the mood scale (1-10) consistently",
        "Add notes about what influenced your mood",
        "Review your mood patterns in Analytics"
      ]
    },
    {
      title: "Nutrition Tracking",
      icon: "🍎",
      items: [
        "Log meals and snacks throughout the day",
        "Use the food database for accurate tracking",
        "Set daily calorie and nutrient goals",
        "Track water intake and hydration"
      ]
    },
    {
      title: "Activity Tracking",
      icon: "💪",
      items: [
        "Log different types of exercises",
        "Track duration and intensity",
        "Monitor calories burned",
        "Set weekly activity goals"
      ]
    },
    {
      title: "Analytics & Insights",
      icon: "📊",
      items: [
        "View weekly and monthly trends",
        "Identify patterns in your wellness data",
        "Get personalized recommendations",
        "Track progress towards your goals"
      ]
    }
  ];

  return (
    <div className="help-support-page">
      <div className="help-support-container">
        <aside className="help-support-sidebar">
          <Navigation />
        </aside>

        <main className="help-support-main">
          <div className="help-support-header">
            <h1>📖 User Guide</h1>
            <p>Learn how to make the most of MindScape Wellness features</p>
          </div>

          <div className="guide-content">
            {sections.map((section, index) => (
              <div key={index} className="guide-section">
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h2>{section.title}</h2>
                </div>
                <ul className="guide-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="quick-tips">
            <h3>💡 Quick Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>Be Consistent</h4>
                <p>Regular tracking provides the most accurate insights into your wellness patterns.</p>
              </div>
              <div className="tip-card">
                <h4>Set Realistic Goals</h4>
                <p>Start with achievable targets and gradually increase them as you progress.</p>
              </div>
              <div className="tip-card">
                <h4>Use All Features</h4>
                <p>Explore mood, nutrition, and activity tracking for comprehensive wellness insights.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserGuide;