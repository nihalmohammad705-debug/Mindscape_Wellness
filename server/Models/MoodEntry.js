const { db } = require('../config/database');

class MoodEntry {
  // Create new mood entry
  static async create(userId, moodData) {
    const { moodType, moodIntensity, sleepHours, exerciseDuration, stressLevel, energyLevel, notes } = moodData;
    
    const result = await db.execute(
      `INSERT INTO mood_entries (user_id, mood_type, mood_intensity, sleep_hours, exercise_duration, stress_level, energy_level, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, moodType, moodIntensity, sleepHours, exerciseDuration, stressLevel, energyLevel, notes]
    );
    
    return {
      id: result.insertId,
      ...moodData,
      user_id: userId
    };
  }

  // Get mood entries for user
  static async findByUserId(userId, options = {}) {
    const { limit = 10, offset = 0, startDate, endDate } = options;
    
    let query = `
      SELECT * FROM mood_entries 
      WHERE user_id = ?
    `;
    const params = [userId];
    
    if (startDate) {
      query += ' AND created_at >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND created_at <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const entries = await db.execute(query, params);
    
    const totalResult = await db.executeOne(
      'SELECT COUNT(*) as count FROM mood_entries WHERE user_id = ?',
      [userId]
    );
    
    return {
      entries,
      total: totalResult.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
  }

  // Get mood analytics
  static async getAnalytics(userId, period = 'week') {
    let interval = '7 DAY';
    
    if (period === 'month') interval = '30 DAY';
    if (period === 'year') interval = '365 DAY';
    
    // Mood distribution
    const moodDistribution = await db.execute(
      `SELECT mood_type, COUNT(*) as count 
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY mood_type`,
      [userId]
    );
    
    // Average metrics
    const averages = await db.executeOne(
      `SELECT 
         AVG(mood_intensity) as avg_mood,
         AVG(sleep_hours) as avg_sleep,
         AVG(stress_level) as avg_stress,
         AVG(energy_level) as avg_energy
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`,
      [userId]
    );
    
    // Weekly trends
    const weeklyTrends = await db.execute(
      `SELECT 
         DATE(created_at) as date,
         AVG(mood_intensity) as avg_mood,
         AVG(energy_level) as avg_energy
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [userId]
    );
    
    return {
      moodDistribution,
      averages,
      weeklyTrends,
      period
    };
  }

  // Get recent mood entries
  static async getRecentEntries(userId, days = 7) {
    return await db.execute(
      `SELECT * FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY created_at DESC`,
      [userId, days]
    );
  }
}

module.exports = MoodEntry;