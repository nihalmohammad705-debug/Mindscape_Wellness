import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ActivityForm from '../components/forms/ActivityForm';
import ActivityChart from '../components/charts/ActivityChart';
import Navigation from '../components/common/Navigation';
import './ActivityTracker.css';

const ActivityTracker = () => {
  const { user } = useAuth();
  const [activityEntries, setActivityEntries] = useState([]);
  const [allUserEntries, setAllUserEntries] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
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

  // Load activity entries from localStorage
  useEffect(() => {
    loadActivityEntries();
  }, [selectedDate, user]);

  const loadActivityEntries = () => {
    try {
      setLoading(true);
      const savedEntries = localStorage.getItem(`activityEntries_${user?.id}`);
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        setAllUserEntries(entries);
        
        // Filter entries for selected date
        const dateEntries = entries.filter(entry => entry.date === selectedDate);
        setActivityEntries(dateEntries);
      } else {
        setActivityEntries([]);
        setAllUserEntries([]);
      }
    } catch (error) {
      console.error('Error loading activity entries:', error);
      setActivityEntries([]);
      setAllUserEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivitySubmit = async (activityData) => {
    try {
      const newEntry = {
        id: Date.now(),
        userId: user?.id,
        ...activityData,
        timestamp: new Date().toLocaleString(),
        date: getTodayDate()
      };
      
      // Save to localStorage
      const savedEntries = localStorage.getItem(`activityEntries_${user?.id}`);
      let allEntries = [];
      
      if (savedEntries) {
        allEntries = JSON.parse(savedEntries);
      }
      
      allEntries.push(newEntry);
      localStorage.setItem(`activityEntries_${user?.id}`, JSON.stringify(allEntries));
      
      // Update both states
      setAllUserEntries(allEntries);
      
      // Only add to current entries if viewing today
      if (selectedDate === getTodayDate()) {
        setActivityEntries(prev => [newEntry, ...prev]);
      }
      
      setShowForm(false);
      setTimeout(() => {
        setShowForm(true);
      }, 2000);
    } catch (error) {
      console.error('Error saving activity entry:', error);
      alert('Error saving activity entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        // Remove from localStorage
        const savedEntries = localStorage.getItem(`activityEntries_${user?.id}`);
        if (savedEntries) {
          let allEntries = JSON.parse(savedEntries);
          allEntries = allEntries.filter(entry => entry.id !== entryId);
          localStorage.setItem(`activityEntries_${user?.id}`, JSON.stringify(allEntries));
        }
        
        // Update state
        setActivityEntries(prev => prev.filter(entry => entry.id !== entryId));
        setAllUserEntries(prev => prev.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Error deleting activity. Please try again.');
      }
    }
  };

  // Calculate activity totals for selected date
  const getDailyTotals = () => {
    return {
      caloriesBurned: activityEntries.reduce((total, entry) => total + (parseInt(entry.caloriesBurned) || 0), 0),
      totalMinutes: activityEntries.reduce((total, entry) => total + (parseInt(entry.duration) || 0), 0),
      activitiesCount: activityEntries.length
    };
  };

  // Get weekly data for chart (current week of selected date)
  const getWeeklyActivityData = () => {
    const weekRange = getWeekRange(selectedDate);
    
    return weekRange.days.map(date => {
      const dayEntries = allUserEntries.filter(entry => entry.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      const totalCalories = dayEntries.reduce((total, entry) => total + (parseInt(entry.caloriesBurned) || 0), 0);
      const totalMinutes = dayEntries.reduce((total, entry) => total + (parseInt(entry.duration) || 0), 0);

      return {
        day: dayName,
        date: date,
        calories: totalCalories,
        minutes: totalMinutes,
        activities: dayEntries.length
      };
    });
  };

  // Get activity breakdown by type
  const getActivityBreakdown = () => {
    const breakdown = {};
    
    activityEntries.forEach(entry => {
      const activityName = entry.activityName;
      
      if (!breakdown[activityName]) {
        breakdown[activityName] = {
          name: activityName,
          calories: 0,
          minutes: 0,
          count: 0,
          color: getActivityColor(activityName),
          emoji: getActivityEmoji(activityName)
        };
      }
      
      breakdown[activityName].calories += parseInt(entry.caloriesBurned) || 0;
      breakdown[activityName].minutes += parseInt(entry.duration) || 0;
      breakdown[activityName].count += 1;
    });
    
    return Object.values(breakdown);
  };

  // Helper functions for activity display
  const getActivityColor = (activityName) => {
    const colors = {
      'Walking': '#667eea',
      'Running': '#48bb78',
      'Cycling': '#ed8936',
      'Yoga': '#9f7aea',
      'Weight Training': '#f56565',
      'Swimming': '#4299e1',
      'Office Work': '#a0aec0',
      'House Cleaning': '#68d391',
      'Sleeping': '#b794f4'
    };
    
    return colors[activityName] || '#d69e2e'; // Default color for custom activities
  };

  const getActivityEmoji = (activityName) => {
    const emojis = {
      'Walking': '🚶',
      'Running': '🏃',
      'Cycling': '🚴',
      'Yoga': '🧘',
      'Weight Training': '💪',
      'Swimming': '🏊',
      'Office Work': '💼',
      'House Cleaning': '🧹',
      'Sleeping': '😴'
    };
    
    return emojis[activityName] || '⚡'; // Default emoji for custom activities
  };

  const dailyTotals = getDailyTotals();
  const activityBreakdown = getActivityBreakdown();
  const weeklyData = getWeeklyActivityData();
  const currentWeek = getWeekRange(selectedDate);

  return (
    <div className="activity-tracker-page">
      <div className="tracker-container">
        <aside className="tracker-sidebar">
          <Navigation />
        </aside>

        <main className="tracker-main">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <h1>💪 Activity Tracker</h1>
              <p>Monitor your physical activities and calories burned</p>
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
          <div className="activity-summary">
            <div className="summary-card total-calories">
              <div className="summary-icon">🔥</div>
              <div className="summary-content">
                <h3>Calories Burned</h3>
                <div className="summary-value">{dailyTotals.caloriesBurned}</div>
                <p>Total {isToday(selectedDate) ? 'today' : 'on selected date'}</p>
              </div>
            </div>

            <div className="summary-card protein">
              <div className="summary-icon">⏱️</div>
              <div className="summary-content">
                <h3>Activity Time</h3>
                <div className="summary-value">{dailyTotals.totalMinutes}</div>
                <p>minutes {isToday(selectedDate) ? 'today' : 'on selected date'}</p>
              </div>
            </div>

            <div className="summary-card carbs">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>Activities Logged</h3>
                <div className="summary-value">{dailyTotals.activitiesCount}</div>
                <p>{isToday(selectedDate) ? 'today' : 'on selected date'}</p>
              </div>
            </div>

            <div className="summary-card fat">
              <div className="summary-icon">⚡</div>
              <div className="summary-content">
                <h3>Avg. Intensity</h3>
                <div className="summary-value">
                  {activityEntries.length > 0 ? 
                    activityEntries.filter(entry => entry.intensity === 'vigorous').length > 0 ? 'High' :
                    activityEntries.filter(entry => entry.intensity === 'moderate').length > 0 ? 'Medium' : 'Low'
                    : 'N/A'
                  }
                </div>
                <p>{isToday(selectedDate) ? "Today's effort" : 'Selected date effort'}</p>
              </div>
            </div>
          </div>

          <div className="tracker-content">
            {/* Form Section - Only show for today */}
            <div className="form-section">
              {showForm ? (
                isToday(selectedDate) ? (
                  <ActivityForm onSubmit={handleActivitySubmit} />
                ) : (
                  <div className="success-message">
                    <div className="success-icon">📅</div>
                    <h3>Viewing Past Data</h3>
                    <p>You can only add new activities for today. Switch to today's date to add a new activity.</p>
                  </div>
                )
              ) : (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3>Activity Logged!</h3>
                  <p>Your activity has been recorded successfully.</p>
                </div>
              )}
            </div>

            {/* Data Section */}
            <div className="data-section">
              {/* Activity Breakdown */}
              <div className="meal-breakdown-section">
                <h3>Activity Breakdown - {isToday(selectedDate) ? 'Today' : selectedDate}</h3>
                <div className="meal-cards">
                  {activityBreakdown.length > 0 ? (
                    activityBreakdown.map((activity, index) => (
                      <div key={index} className="meal-card" style={{ borderLeftColor: activity.color }}>
                        <div className="meal-header">
                          <span className="meal-icon">{activity.emoji}</span>
                          <span className="meal-name">{activity.name}</span>
                        </div>
                        <div className="meal-stats">
                          <div className="meal-stat">
                            <span className="stat-value">{activity.minutes}</span>
                            <span className="stat-label">min</span>
                          </div>
                          <div className="meal-macros">
                            <span>{activity.calories} cal</span>
                            <span>{activity.count} sessions</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No activities logged for this date.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Entries */}
              <div className="recent-entries">
                <div className="section-header">
                  <h3>{isToday(selectedDate) ? "Today's Activities" : `Activities on ${selectedDate}`}</h3>
                  <span className="entries-count">{activityEntries.length} entries</span>
                </div>
                
                {loading ? (
                  <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your activities...</p>
                  </div>
                ) : activityEntries.length === 0 ? (
                  <div className="empty-state">
                    <p>No activities logged {isToday(selectedDate) ? 'for today' : 'for this date'}.</p>
                    {isToday(selectedDate) && <p>Start by adding your first activity!</p>}
                  </div>
                ) : (
                  <div className="entries-list">
                    {activityEntries.map(entry => (
                      <div key={entry.id} className="entry-card">
                        <div className="entry-header">
                          <div className="entry-meal">
                            <span 
                              className="meal-badge"
                              style={{ backgroundColor: getActivityColor(entry.activityName) }}
                            >
                              {getActivityEmoji(entry.activityName)} {entry.activityName}
                            </span>
                          </div>
                          <div className="entry-actions">
                            <span className="entry-calories">{entry.caloriesBurned} cal</span>
                            {isToday(selectedDate) && (
                              <button 
                                className="btn-delete"
                                onClick={() => handleDeleteEntry(entry.id)}
                                title="Delete entry"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="entry-details">
                          <div className="macros-grid">
                            <div className="macro-item">
                              <span className="macro-label">Duration</span>
                              <span className="macro-value">{entry.duration} min</span>
                            </div>
                            <div className="macro-item">
                              <span className="macro-label">Intensity</span>
                              <span className="macro-value" style={{ 
                                color: entry.intensity === 'vigorous' ? '#e53e3e' : 
                                       entry.intensity === 'moderate' ? '#d69e2e' : '#38a169'
                              }}>
                                {entry.intensity}
                              </span>
                            </div>
                            <div className="macro-item">
                              <span className="macro-label">Cal/min</span>
                              <span className="macro-value">
                                {entry.duration > 0 ? Math.round(entry.caloriesBurned / entry.duration) : 0}
                              </span>
                            </div>
                          </div>
                          {entry.notes && (
                            <div className="entry-notes">
                              <strong>Notes:</strong> {entry.notes}
                            </div>
                          )}
                          <div className="entry-time">
                            Added at {entry.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity Chart */}
              <div className="charts-section">
                <div className="section-header">
                  <h3>Weekly Activity Overview</h3>
                  <small>Week of {new Date(currentWeek.start).toLocaleDateString()} - {new Date(currentWeek.end).toLocaleDateString()}</small>
                </div>
                {allUserEntries.length > 0 ? (
                  <ActivityChart data={allUserEntries.filter(entry => 
                    currentWeek.days.includes(entry.date)
                  )} />
                ) : (
                  <div className="chart-placeholder">
                    <p>📊 No activity data available yet</p>
                    <p>Start adding activities to see your distribution</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Tips */}
          <div className="insights-section">
            <h3>💡 Fitness Insights & Tips</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🎯 Consistency Over Intensity</h4>
                <p>Regular moderate activity is more beneficial than occasional intense workouts for long-term health.</p>
              </div>
              <div className="insight-card">
                <h4>🚶‍♀️ Move Throughout the Day</h4>
                <p>Take short activity breaks every hour to reduce sedentary time and boost metabolism.</p>
              </div>
              <div className="insight-card">
                <h4>💤 Recovery Matters</h4>
                <p>Allow time for rest and recovery between intense workout sessions to prevent injury and improve performance.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityTracker;