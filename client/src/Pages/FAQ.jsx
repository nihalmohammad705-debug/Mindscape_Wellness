import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/common/Navigation';
import './HelpSupport.css';

const FAQ = () => {
  const { user } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page. You'll need your unique ID to complete the reset process."
    },
    {
      question: "Can I export my wellness data?",
      answer: "Yes, you can export your complete wellness data from the Privacy & Security section in your Profile. Data is exported in CSV format."
    },
    {
      question: "How often should I track my mood?",
      answer: "We recommend tracking your mood 2-3 times per day to get accurate patterns. Morning, afternoon, and evening entries work well."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, all your data is encrypted and stored securely. We never share personal information with third parties without your consent."
    },
    {
      question: "Can I use the app without internet?",
      answer: "Yes, you can track entries offline. Data will sync automatically when you reconnect to the internet."
    },
    {
      question: "How do I set wellness goals?",
      answer: "Goals can be set in each tracking section. Start with small, achievable goals and adjust them as you progress."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-support-page">
      <div className="help-support-container">
        <aside className="help-support-sidebar">
          <Navigation />
        </aside>

        <main className="help-support-main">
          <div className="help-support-header">
            <h1>❓ Frequently Asked Questions</h1>
            <p>Find quick answers to common questions about MindScape Wellness</p>
          </div>

          <div className="faq-content">
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="support-contact">
              <h3>Still need help?</h3>
              <p>Can't find the answer you're looking for? Our support team is here to help.</p>
              <a href="/contact-support" className="btn btn-primary">
                Contact Support
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;