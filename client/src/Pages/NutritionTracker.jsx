import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FoodForm from '../components/forms/FoodForm';
import NutritionChart from '../components/charts/NutritionChart';
import Navigation from '../components/common/Navigation';
import './NutritionTracker.css';

const NutritionTracker = () => {
  const { user } = useAuth();
  const [foodEntries, setFoodEntries] = useState([]);
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

  // Load nutrition entries from localStorage
  useEffect(() => {
    loadNutritionEntries();
  }, [selectedDate, user]);

  const loadNutritionEntries = () => {
    try {
      setLoading(true);
      const savedEntries = localStorage.getItem(`nutritionEntries_${user?.id}`);
      console.log('Loading nutrition entries from localStorage:', savedEntries);
      
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        console.log('Parsed nutrition entries:', entries);
        setAllUserEntries(entries);
        
        // Filter entries for selected date
        const dateEntries = entries.filter(entry => entry.date === selectedDate);
        console.log('Filtered entries for date:', selectedDate, dateEntries);
        setFoodEntries(dateEntries);
      } else {
        console.log('No saved nutrition entries found');
        setFoodEntries([]);
        setAllUserEntries([]);
      }
    } catch (error) {
      console.error('Error loading nutrition entries:', error);
      setFoodEntries([]);
      setAllUserEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSubmit = async (foodData) => {
    try {
      const newEntry = {
        id: Date.now(),
        userId: user?.id,
        ...foodData,
        timestamp: new Date().toLocaleString(),
        date: getTodayDate(),
        // Ensure numeric values for chart compatibility
        calories: parseInt(foodData.calories) || 0,
        protein: parseFloat(foodData.protein) || 0,
        carbs: parseFloat(foodData.carbs) || 0,
        fat: parseFloat(foodData.fat) || 0
      };
      
      console.log('Saving new food entry:', newEntry);
      
      // Save to localStorage
      const savedEntries = localStorage.getItem(`nutritionEntries_${user?.id}`);
      let allEntries = [];
      
      if (savedEntries) {
        allEntries = JSON.parse(savedEntries);
      }
      
      allEntries.push(newEntry);
      localStorage.setItem(`nutritionEntries_${user?.id}`, JSON.stringify(allEntries));
      
      // Update both states
      setAllUserEntries(allEntries);
      
      // Only add to current entries if viewing today
      if (selectedDate === getTodayDate()) {
        setFoodEntries(prev => [newEntry, ...prev]);
      }
      
      setShowForm(false);
      setTimeout(() => {
        setShowForm(true);
      }, 2000);
    } catch (error) {
      console.error('Error saving food entry:', error);
      alert('Error saving food entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this food entry?')) {
      try {
        // Remove from localStorage
        const savedEntries = localStorage.getItem(`nutritionEntries_${user?.id}`);
        if (savedEntries) {
          let allEntries = JSON.parse(savedEntries);
          allEntries = allEntries.filter(entry => entry.id !== entryId);
          localStorage.setItem(`nutritionEntries_${user?.id}`, JSON.stringify(allEntries));
        }
        
        // Update state
        setFoodEntries(prev => prev.filter(entry => entry.id !== entryId));
        setAllUserEntries(prev => prev.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Error deleting food entry:', error);
        alert('Error deleting food entry. Please try again.');
      }
    }
  };

  // Calculate nutrition totals for selected date
  const getDailyTotals = () => {
    const totals = {
      calories: foodEntries.reduce((total, entry) => total + (parseInt(entry.calories) || 0), 0),
      protein: foodEntries.reduce((total, entry) => total + (parseFloat(entry.protein) || 0), 0),
      carbs: foodEntries.reduce((total, entry) => total + (parseFloat(entry.carbs) || 0), 0),
      fat: foodEntries.reduce((total, entry) => total + (parseFloat(entry.fat) || 0), 0)
    };
    
    console.log('Daily totals:', totals);
    return totals;
  };

  const getMealTotals = (mealType) => {
    const mealEntries = foodEntries.filter(entry => entry.mealType === mealType);
    const totals = {
      calories: mealEntries.reduce((total, entry) => total + (parseInt(entry.calories) || 0), 0),
      protein: mealEntries.reduce((total, entry) => total + (parseFloat(entry.protein) || 0), 0),
      carbs: mealEntries.reduce((total, entry) => total + (parseFloat(entry.carbs) || 0), 0),
      fat: mealEntries.reduce((total, entry) => total + (parseFloat(entry.fat) || 0), 0)
    };
    
    console.log(`Meal totals for ${mealType}:`, totals);
    return totals;
  };

  // Get weekly data for chart (current week of selected date)
  const getWeeklyNutritionData = () => {
    const weekRange = getWeekRange(selectedDate);
    
    const weeklyData = weekRange.days.map(date => {
      const dayEntries = allUserEntries.filter(entry => entry.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayData = {
        day: dayName,
        date: date,
        calories: dayEntries.reduce((sum, entry) => sum + (parseInt(entry.calories) || 0), 0),
        protein: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0),
        carbs: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.carbs) || 0), 0),
        fat: dayEntries.reduce((sum, entry) => sum + (parseFloat(entry.fat) || 0), 0)
      };
      
      return dayData;
    });

    console.log('Weekly nutrition data for chart:', weeklyData);
    return weeklyData;
  };

  const mealTypes = [
    { value: 'breakfast', label: '🍳 Breakfast', color: '#FBBF24' },
    { value: 'lunch', label: '🍲 Lunch', color: '#10B981' },
    { value: 'dinner', label: '🍽️ Dinner', color: '#3B82F6' },
    { value: 'snacks', label: '🍎 Snacks', color: '#8B5CF6' },
    { value: 'other', label: '🥤 Other', color: '#6B7280' }
  ];

  const dailyTotals = getDailyTotals();
  const currentWeek = getWeekRange(selectedDate);
  const weeklyNutritionData = getWeeklyNutritionData();

  return (
    <div className="nutrition-tracker-page">
      <div className="tracker-container">
        <aside className="tracker-sidebar">
          <Navigation />
        </aside>

        <main className="tracker-main">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <h1>🍎 Nutrition Tracker</h1>
              <p>Monitor your daily food intake and nutritional balance</p>
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
          <div className="nutrition-summary">
            <div className="summary-card total-calories">
              <div className="summary-icon">🔥</div>
              <div className="summary-content">
                <h3>Total Calories</h3>
                <div className="summary-value">{dailyTotals.calories}</div>
                <p>Total {isToday(selectedDate) ? 'today' : 'on selected date'}</p>
              </div>
            </div>

            <div className="summary-card protein">
              <div className="summary-icon">💪</div>
              <div className="summary-content">
                <h3>Protein</h3>
                <div className="summary-value">{dailyTotals.protein.toFixed(1)}g</div>
                <p>Muscle building</p>
              </div>
            </div>

            <div className="summary-card carbs">
              <div className="summary-icon">🍞</div>
              <div className="summary-content">
                <h3>Carbs</h3>
                <div className="summary-value">{dailyTotals.carbs.toFixed(1)}g</div>
                <p>Energy source</p>
              </div>
            </div>

            <div className="summary-card fat">
              <div className="summary-icon">🥑</div>
              <div className="summary-content">
                <h3>Fat</h3>
                <div className="summary-value">{dailyTotals.fat.toFixed(1)}g</div>
                <p>Essential nutrients</p>
              </div>
            </div>
          </div>

          <div className="tracker-content">
            {/* Form Section - Only show for today */}
            <div className="form-section">
              {showForm ? (
                isToday(selectedDate) ? (
                  <FoodForm onSubmit={handleFoodSubmit} />
                ) : (
                  <div className="success-message">
                    <div className="success-icon">📅</div>
                    <h3>Viewing Past Data</h3>
                    <p>You can only add new food entries for today. Switch to today's date to add a new entry.</p>
                  </div>
                )
              ) : (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3>Food Entry Saved!</h3>
                  <p>Your nutrition data has been updated.</p>
                </div>
              )}
            </div>

            {/* Data Section */}
            <div className="data-section">
              {/* Meal Breakdown */}
              <div className="meal-breakdown-section">
                <h3>Meal Breakdown - {isToday(selectedDate) ? 'Today' : selectedDate}</h3>
                <div className="meal-cards">
                  {mealTypes.map(meal => {
                    const mealTotal = getMealTotals(meal.value);
                    return (
                      <div key={meal.value} className="meal-card" style={{ borderLeftColor: meal.color }}>
                        <div className="meal-header">
                          <span className="meal-icon">{meal.label.split(' ')[0]}</span>
                          <span className="meal-name">{meal.label.split(' ')[1]}</span>
                        </div>
                        <div className="meal-stats">
                          <div className="meal-stat">
                            <span className="stat-value">{mealTotal.calories}</span>
                            <span className="stat-label">cal</span>
                          </div>
                          <div className="meal-macros">
                            <span>P: {mealTotal.protein.toFixed(1)}g</span>
                            <span>C: {mealTotal.carbs.toFixed(1)}g</span>
                            <span>F: {mealTotal.fat.toFixed(1)}g</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Entries */}
              <div className="recent-entries">
                <div className="section-header">
                  <h3>{isToday(selectedDate) ? "Today's Food Entries" : `Food Entries on ${selectedDate}`}</h3>
                  <span className="entries-count">{foodEntries.length} entries</span>
                </div>
                
                {loading ? (
                  <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your food entries...</p>
                  </div>
                ) : foodEntries.length === 0 ? (
                  <div className="empty-state">
                    <p>No food entries {isToday(selectedDate) ? 'for today' : 'for this date'}.</p>
                    {isToday(selectedDate) && <p>Start by adding your first meal!</p>}
                  </div>
                ) : (
                  <div className="entries-list">
                    {foodEntries.map(entry => {
                      const mealConfig = mealTypes.find(m => m.value === entry.mealType);
                      return (
                        <div key={entry.id} className="entry-card">
                          <div className="entry-header">
                            <div className="entry-meal">
                              <span 
                                className="meal-badge"
                                style={{ backgroundColor: mealConfig?.color }}
                              >
                                {mealConfig?.label.split(' ')[0]} {mealConfig?.label.split(' ')[1]}
                              </span>
                              <span className="food-name">{entry.foodName}</span>
                              {entry.isCustom && <small style={{color: '#718096', fontSize: '0.7rem'}}> (Custom)</small>}
                            </div>
                            <div className="entry-actions">
                              <span className="entry-calories">{entry.calories} cal</span>
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
                                <span className="macro-label">Protein</span>
                                <span className="macro-value">{entry.protein}g</span>
                              </div>
                              <div className="macro-item">
                                <span className="macro-label">Carbs</span>
                                <span className="macro-value">{entry.carbs}g</span>
                              </div>
                              <div className="macro-item">
                                <span className="macro-label">Fat</span>
                                <span className="macro-value">{entry.fat}g</span>
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
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nutrition Chart */}
              <div className="charts-section">
                <div className="section-header">
                  <h3>Weekly Nutrition Overview</h3>
                  <small>Week of {new Date(currentWeek.start).toLocaleDateString()} - {new Date(currentWeek.end).toLocaleDateString()}</small>
                </div>
                {allUserEntries.length > 0 ? (
                  <NutritionChart data={weeklyNutritionData} />
                ) : (
                  <div className="chart-placeholder">
                    <p>📊 No nutrition data available yet</p>
                    <p>Start adding food entries to see your weekly trends</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nutrition Tips */}
          <div className="insights-section">
            <h3>💡 Nutrition Insights & Tips</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🥦 Balanced Diet</h4>
                <p>Aim for a mix of protein, carbs, and healthy fats in each meal for sustained energy throughout the day.</p>
              </div>
              <div className="insight-card">
                <h4>💧 Stay Hydrated</h4>
                <p>Drink water before meals to help with digestion and portion control. Aim for 8 glasses daily.</p>
              </div>
              <div className="insight-card">
                <h4>⏰ Regular Meals</h4>
                <p>Eat at consistent times to maintain stable energy levels and avoid overeating later.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NutritionTracker;