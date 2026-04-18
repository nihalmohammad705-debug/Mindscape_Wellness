import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MoodForm from '../components/forms/MoodForm';
import MoodChart from '../components/charts/MoodChart';
import Navigation from '../components/common/Navigation';
import './MoodTracker.css';

const MoodTracker = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState([]);
  const [allUserEntries, setAllUserEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check if a date is today
  const isToday = (dateString) => {
    return dateString === getTodayDate();
  };

  // Get week range for a given date (Monday to Sunday)
  const getWeekRange = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(date);
    monday.setDate(diff);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0],
      days: Array.from({ length: 7 }, (_, i) => {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + i);
        return dayDate.toISOString().split('T')[0];
      })
    };
  };

  // Load user's mood entries
  useEffect(() => {
    loadMoodEntries();
  }, [user, selectedDate]);

  const loadMoodEntries = async () => {
    try {
      setLoading(true);
      const savedEntries = localStorage.getItem(`moodEntries_${user?.id}`);
      console.log('Loading mood entries from localStorage:', savedEntries);
      
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        console.log('Parsed entries:', entries);
        setAllUserEntries(entries);
        
        // Filter entries for selected date
        const dateEntries = entries.filter(entry => 
          entry.date === selectedDate
        );
        console.log('Filtered entries for date:', selectedDate, dateEntries);
        setMoodEntries(dateEntries);
      } else {
        console.log('No saved entries found');
        setMoodEntries([]);
        setAllUserEntries([]);
      }
    } catch (error) {
      console.error('Error loading mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async (moodData) => {
    setLoading(true);
    try {
      const newEntry = {
        id: Date.now(),
        userId: user?.id,
        ...moodData,
        timestamp: new Date().toISOString(),
        date: getTodayDate(),
        // Ensure moodScore is a number for chart compatibility
        moodScore: parseInt(moodData.moodScore) || 0
      };
      
      console.log('Saving new mood entry:', newEntry);
      
      const savedEntries = localStorage.getItem(`moodEntries_${user?.id}`);
      let allEntries = [];
      
      if (savedEntries) {
        allEntries = JSON.parse(savedEntries);
      }
      
      allEntries.push(newEntry);
      localStorage.setItem(`moodEntries_${user?.id}`, JSON.stringify(allEntries));
      
      // Update both states
      setAllUserEntries(allEntries);
      
      // Only add to current entries if viewing today
      if (selectedDate === getTodayDate()) {
        setMoodEntries([newEntry, ...moodEntries]);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving mood entry:', error);
      alert('Error saving mood entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = (entryId) => {
    const updatedEntries = moodEntries.filter(entry => entry.id !== entryId);
    setMoodEntries(updatedEntries);
    
    // Update localStorage with all entries except deleted one
    const savedEntries = localStorage.getItem(`moodEntries_${user?.id}`);
    if (savedEntries) {
      let allEntries = JSON.parse(savedEntries);
      allEntries = allEntries.filter(entry => entry.id !== entryId);
      localStorage.setItem(`moodEntries_${user?.id}`, JSON.stringify(allEntries));
      setAllUserEntries(allEntries);
    }
    
    setDeleteConfirm(null);
  };

  const confirmDelete = (entryId) => {
    setDeleteConfirm(entryId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Calculate mood statistics
  const getTodayStats = () => {
    if (moodEntries.length === 0) {
      return {
        averageScore: 0,
        totalEntries: 0,
        moodLevel: 'No data'
      };
    }

    const totalScore = moodEntries.reduce((sum, entry) => sum + (entry.moodScore || 0), 0);
    const averageScore = totalScore / moodEntries.length;

    return {
      averageScore: Math.round(averageScore * 10) / 10,
      totalEntries: moodEntries.length,
      moodLevel: moodEntries[0]?.moodLevel || 'No data'
    };
  };

  // Get weekly data for chart (current week of selected date)
  const getWeeklyMoodData = () => {
    const weekRange = getWeekRange(selectedDate);
    
    const weeklyData = weekRange.days.map(date => {
      const dayEntries = allUserEntries.filter(entry => entry.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      const averageScore = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + (entry.moodScore || 0), 0) / dayEntries.length
        : 0;

      return {
        day: dayName,
        date: date,
        mood: Math.round(averageScore * 10) / 10,
        entries: dayEntries.length
      };
    });

    console.log('Weekly mood data for chart:', weeklyData);
    return weeklyData;
  };

  const todayStats = getTodayStats();
  const weeklyData = getWeeklyMoodData();
  const currentWeek = getWeekRange(selectedDate);

  return (
    <div className="mood-tracker-page">
      <div className="tracker-container">
        <aside className="tracker-sidebar">
          <Navigation />
        </aside>

        <main className="tracker-main">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <h1>😊 Mood Tracker</h1>
              <p>Complete your daily check-in and track your emotional wellness</p>
            </div>
            <div className="date-selector">
              <label htmlFor="date-picker">Select Date:</label>
              <input
                type="date"
                id="date-picker"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
                max={getTodayDate()}
              />
              <small style={{color: '#718096', fontSize: '0.8rem', marginTop: '0.25rem'}}>
                {isToday(selectedDate) ? "Today - You can add new entries" : "Viewing history - Read only"}
                <br />
                Week: {new Date(currentWeek.start).toLocaleDateString()} - {new Date(currentWeek.end).toLocaleDateString()}
              </small>
            </div>
          </div>

          {/* Daily Summary Cards */}
          <div className="mood-summary">
            <div className="summary-card mood-score">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>Average Score</h3>
                <div className="summary-value">{todayStats.averageScore}</div>
                <p>/10 {isToday(selectedDate) ? 'today' : 'on selected date'}</p>
              </div>
            </div>

            <div className="summary-card entries-count">
              <div className="summary-icon">📝</div>
              <div className="summary-content">
                <h3>Entries</h3>
                <div className="summary-value">{todayStats.totalEntries}</div>
                <p>check-ins</p>
              </div>
            </div>

            <div className="summary-card mood-level">
              <div className="summary-icon">🎯</div>
              <div className="summary-content">
                <h3>Mood Level</h3>
                <div className="summary-value">{todayStats.moodLevel}</div>
                <p>current state</p>
              </div>
            </div>

            <div className="summary-card weekly-trend">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>Weekly Avg</h3>
                <div className="summary-value">
                  {weeklyData.filter(day => day.mood > 0).length > 0 
                    ? Math.round(weeklyData.reduce((sum, day) => sum + day.mood, 0) / weeklyData.filter(day => day.mood > 0).length * 10) / 10 
                    : 0
                  }
                </div>
                <p>7-day average</p>
              </div>
            </div>
          </div>

          <div className="tracker-content">
            {/* Form Section - Only show for today */}
            <div className="form-section">
              {showSuccess ? (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3>Mood Entry Saved!</h3>
                  <p>Your daily mood has been recorded successfully.</p>
                </div>
              ) : isToday(selectedDate) ? (
                <MoodForm 
                  onSubmit={handleMoodSubmit} 
                  loading={loading}
                />
              ) : (
                <div className="success-message">
                  <div className="success-icon">📅</div>
                  <h3>Viewing Past Data</h3>
                  <p>You can only add new mood entries for today. Switch to today's date to add a new entry.</p>
                </div>
              )}
            </div>

            {/* Data Section */}
            <div className="data-section">
              {/* Recent Entries */}
              <div className="recent-entries">
                <div className="section-header">
                  <h3>
                    {isToday(selectedDate) ? "Today's Mood Entries" : `Mood Entries for ${selectedDate}`}
                  </h3>
                  <span className="entries-count">{moodEntries.length} entries</span>
                </div>
                
                {loading ? (
                  <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your mood entries...</p>
                  </div>
                ) : moodEntries.length === 0 ? (
                  <div className="empty-state">
                    <p>No mood entries for {isToday(selectedDate) ? 'today' : 'this date'}.</p>
                    {isToday(selectedDate) && <p>Start with your daily check-in!</p>}
                  </div>
                ) : (
                  <div className="entries-list">
                    {moodEntries.map(entry => (
                      <div key={entry.id} className="entry-card">
                        <div className="entry-header">
                          <div className="entry-mood">
                            <span 
                              className={`mood-badge mood-${entry.moodLevel}`}
                              style={{ 
                                backgroundColor: getMoodColor(entry.moodLevel),
                                color: 'white'
                              }}
                            >
                              {entry.primaryMood}
                            </span>
                            <span className="mood-score-display">{entry.moodScore}/10</span>
                          </div>
                          <div className="entry-actions">
                            <span className="entry-time">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            {isToday(selectedDate) && (
                              <button 
                                className="btn-delete"
                                onClick={() => confirmDelete(entry.id)}
                                title="Delete entry"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>

                        {deleteConfirm === entry.id && (
                          <div className="delete-confirmation">
                            <p>Are you sure you want to delete this mood entry?</p>
                            <div className="confirmation-buttons">
                              <button 
                                className="confirm-delete-btn"
                                onClick={() => handleDeleteEntry(entry.id)}
                              >
                                Yes, Delete
                              </button>
                              <button 
                                className="cancel-delete-btn"
                                onClick={cancelDelete}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="entry-details">
                          <div className="mood-stats-grid">
                            <div className="stat-item">
                              <span className="stat-label">Sleep</span>
                              <span className="stat-value">{entry.sleepQuality}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Energy</span>
                              <span className="stat-value">{entry.energyLevel}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Stress</span>
                              <span className="stat-value">{entry.stressLevel}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Productivity</span>
                              <span className="stat-value">{entry.productivity}</span>
                            </div>
                          </div>
                          
                          {entry.userExpression && (
                            <div className="entry-notes">
                              <strong>Reflections:</strong> {entry.userExpression}
                            </div>
                          )}
                          
                          {entry.suggestion && (
                            <div className="entry-suggestion">
                              <small><strong>Tip:</strong> {entry.suggestion.title}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mood Chart - Show weekly data from all entries */}
              <div className="charts-section">
                <div className="section-header">
                  <h3>Weekly Mood Overview</h3>
                  <small>Week of {new Date(currentWeek.start).toLocaleDateString()} - {new Date(currentWeek.end).toLocaleDateString()}</small>
                </div>
                <MoodChart data={weeklyData} />
              </div>
            </div>
          </div>

          {/* Mood Tips */}
          <div className="insights-section">
            <h3>💡 Emotional Wellness Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🎯 Daily Check-ins</h4>
                <p>Regular mood tracking helps you identify patterns and understand your emotional wellbeing better.</p>
              </div>
              <div className="insight-card">
                <h4>💭 Mindful Reflection</h4>
                <p>Taking time to express your feelings can provide clarity and reduce emotional burden.</p>
              </div>
              <div className="insight-card">
                <h4>📈 Track Progress</h4>
                <p>Monitor your mood trends over time to recognize improvements and areas needing attention.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to get mood colors
const getMoodColor = (moodLevel) => {
  const colors = {
    excellent: '#48bb78',
    good: '#38b2ac',
    average: '#ed8936',
    needs_attention: '#e53e3e',
    critical: '#c53030'
  };
  return colors[moodLevel] || '#718096';
};

export default MoodTracker;