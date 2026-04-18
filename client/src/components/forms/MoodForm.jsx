// client/src/components/forms/MoodForm.jsx
import React, { useState } from "react";
import { 
  moodQuestions, 
  detailedSuggestions, 
  motivationalQuotes, 
  getMoodLevel, 
  getRandomSuggestion, 
  getRandomQuote 
} from "../../utils/moodQuestions";
import "./MoodForm.css";

const MoodForm = ({ onSubmit, loading }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExpression, setShowExpression] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [userExpression, setUserExpression] = useState("");

  const handleAnswer = (questionId, value, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, score }
    }));

    if (currentQuestion < moodQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // All questions answered, show expression section
      setShowExpression(true);
    }
  };

  const handleExpressionSubmit = () => {
    // Analyze mood after expression
    analyzeMood();
  };

  const analyzeMood = () => {
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
    const averageScore = totalScore / moodQuestions.length;
    const moodLevel = getMoodLevel(averageScore);
    
    const suggestion = getRandomSuggestion(moodLevel);
    const quote = getRandomQuote();

    const analysisResult = {
      moodScore: Math.round(averageScore * 10) / 10,
      moodLevel,
      primaryMood: answers[1]?.value || 'neutral',
      sleepQuality: answers[2]?.value || 'fair',
      energyLevel: answers[3]?.value || 'moderate',
      stressLevel: answers[4]?.value || 'moderate',
      productivity: answers[5]?.value || 'moderate',
      socialConnection: answers[6]?.value || 'somewhat',
      physicalHealth: answers[7]?.value || 'okay',
      satisfaction: answers[8]?.value || 'neutral',
      optimism: answers[9]?.value || 'uncertain',
      resilience: answers[10]?.value || 'good',
      userExpression,
      suggestion,
      quote,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0] // Always use today's date
    };

    setAnalysis(analysisResult);
    setShowAnalysis(true);
    setShowExpression(false);
  };

  const handleSubmit = () => {
    onSubmit(analysis);
    // Reset form
    setCurrentQuestion(0);
    setAnswers({});
    setShowAnalysis(false);
    setShowExpression(false);
    setAnalysis(null);
    setUserExpression("");
  };

  const progress = ((currentQuestion + 1) / moodQuestions.length) * 100;

  if (showExpression) {
    return (
      <div className="expression-section">
        <div className="expression-header">
          <h3>💭 Express Yourself</h3>
          <p>Take a moment to describe how you're feeling in your own words...</p>
        </div>
        
        <div className="expression-input">
          <textarea
            value={userExpression}
            onChange={(e) => setUserExpression(e.target.value)}
            placeholder="How are you really feeling today? What's on your mind? What made you smile or worried you? This is your space to express anything without judgment..."
            rows={6}
            className="expression-textarea"
          />
          <div className="expression-tips">
            <p>💡 <strong>Tips:</strong> Write about your thoughts, feelings, hopes, worries, or anything that matters to you right now.</p>
          </div>
        </div>

        <div className="expression-buttons">
          <button 
            className="skip-btn"
            onClick={analyzeMood}
          >
            Skip & Analyze
          </button>
          <button 
            className="submit-expression-btn"
            onClick={handleExpressionSubmit}
          >
            Continue to Analysis →
          </button>
        </div>
      </div>
    );
  }

  if (showAnalysis && analysis) {
    return (
      <div className="mood-analysis">
        <div className="analysis-header">
          <h3>🎯 Your Comprehensive Mood Analysis</h3>
          <div className="mood-score-display">
            <div className="mood-score-circle">
              <span className={`mood-score-number mood-${analysis.moodLevel}`}>
                {analysis.moodScore}
              </span>
              <span className="mood-score-label">/10</span>
            </div>
            <div className="mood-score-text">
              <h4>Overall Wellbeing Score</h4>
              <p className={`mood-level-text mood-${analysis.moodLevel}`}>
                {analysis.moodLevel.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mood-analysis-details">
          <h4>📊 Area Breakdown</h4>
          <div className="breakdown-grid">
            <div className="mood-detail-item">
              <span className="breakdown-label">Emotional State</span>
              <span className="mood-value">{analysis.primaryMood}</span>
            </div>
            <div className="mood-detail-item">
              <span className="breakdown-label">Sleep Quality</span>
              <span className="mood-value">{analysis.sleepQuality}</span>
            </div>
            <div className="mood-detail-item">
              <span className="breakdown-label">Energy Level</span>
              <span className="mood-value">{analysis.energyLevel}</span>
            </div>
            <div className="mood-detail-item">
              <span className="breakdown-label">Stress Level</span>
              <span className="mood-value">{analysis.stressLevel}</span>
            </div>
            <div className="mood-detail-item">
              <span className="breakdown-label">Social Connection</span>
              <span className="mood-value">{analysis.socialConnection}</span>
            </div>
            <div className="mood-detail-item">
              <span className="breakdown-label">Physical Health</span>
              <span className="mood-value">{analysis.physicalHealth}</span>
            </div>
          </div>
        </div>

        {analysis.userExpression && (
          <div className="user-expression-display">
            <h4>📝 Your Reflections</h4>
            <div className="expression-content">
              <p>"{analysis.userExpression}"</p>
            </div>
          </div>
        )}

        <div className="mood-suggestion-card">
          <div className="suggestion-header">
            <h4>💡 Personalized Wellbeing Plan</h4>
          </div>
          <div className="suggestion-content">
            <h5>{analysis.suggestion.title}</h5>
            <p>{analysis.suggestion.content}</p>
            <div className="suggested-activities">
              <h6>🎯 Recommended Activities:</h6>
              <ul>
                {analysis.suggestion.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mood-quote-card">
          <div className="quote-content">
            <p className="quote-text">"{analysis.quote.text}"</p>
            <p className="quote-author">- {analysis.quote.author}</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          className="mood-submit-analysis-btn"
          disabled={loading}
        >
          {loading ? 'Saving Your Entry...' : 'Save My Mood Journal'}
        </button>
      </div>
    );
  }

  const question = moodQuestions[currentQuestion];

  return (
    <div className="enhanced-mood-form">
      <div className="mood-form-header">
        <h3>Daily Wellbeing Check-in</h3>
        <div className="mood-progress-container">
          <div className="mood-progress-bar">
            <div 
              className="mood-progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="mood-progress-text">
            {currentQuestion + 1} of {moodQuestions.length}
          </span>
        </div>
      </div>

      <div className="mood-question-container">
        <div className="mood-question-number">Question {currentQuestion + 1}</div>
        <h4 className="mood-question-text">{question.question}</h4>
        <div className="mood-options-grid">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`mood-option ${answers[question.id]?.value === option.value ? 'selected' : ''}`}
              onClick={() => handleAnswer(question.id, option.value, option.score)}
            >
              <span className="mood-option-emoji">{option.label.split(' ')[0]}</span>
              <span className="mood-option-text">
                {option.label.split(' ').slice(1).join(' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mood-navigation-buttons">
        {currentQuestion > 0 && (
          <button 
            className="mood-nav-btn prev-btn"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            ← Previous
          </button>
        )}
        <div className="mood-question-counter">
          {currentQuestion + 1}/{moodQuestions.length}
        </div>
      </div>
    </div>
  );
};

export default MoodForm;