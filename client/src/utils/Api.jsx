// client/src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mood API functions
export const moodAPI = {
  // Save mood entry
  async saveMoodEntry(moodData) {
    const response = await fetch(`${API_BASE_URL}/mood/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(moodData)
    });

    if (!response.ok) {
      throw new Error('Failed to save mood entry');
    }

    return await response.json();
  },

  // Get user's mood entries
  async getUserMoodEntries() {
    const response = await fetch(`${API_BASE_URL}/mood/entries`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mood entries');
    }

    return await response.json();
  },

  // Get mood analytics
  async getMoodAnalytics(timeframe = 'week') {
    const response = await fetch(`${API_BASE_URL}/mood/analytics?timeframe=${timeframe}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mood analytics');
    }

    return await response.json();
  }
};