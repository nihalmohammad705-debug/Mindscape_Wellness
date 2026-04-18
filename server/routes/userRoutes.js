const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.execute(
      'SELECT id, unique_id, email, name FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, unique_id, email, name, date_of_birth, gender, height, weight, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: users[0] });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, height, weight } = req.body;
    
    await pool.execute(
      `UPDATE users SET name = ?, date_of_birth = ?, gender = ?, height = ?, weight = ? 
       WHERE id = ?`,
      [name, dateOfBirth, gender, height, weight, req.user.id]
    );
    
    res.json({ message: 'Profile updated successfully' });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get recent mood entries (last 7 days)
    const [moodEntries] = await pool.execute(
      `SELECT mood_type, mood_intensity, sleep_hours, stress_level, energy_level, created_at 
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    // Get today's calorie intake
    const [calorieData] = await pool.execute(
      `SELECT SUM(fi.calories_per_100g * (fc.quantity/100)) as total_calories
       FROM food_consumption fc
       JOIN food_items fi ON fc.food_item_id = fi.id
       WHERE fc.user_id = ? AND fc.consumption_date = CURDATE()`,
      [req.user.id]
    );
    
    // Get today's calories burned
    const [burnedData] = await pool.execute(
      `SELECT SUM(calories_burned) as total_burned
       FROM activity_log 
       WHERE user_id = ? AND activity_date = CURDATE()`,
      [req.user.id]
    );
    
    // Get average mood for the week
    const [moodAvg] = await pool.execute(
      `SELECT AVG(mood_intensity) as avg_mood
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [req.user.id]
    );
    
    // Get sleep average
    const [sleepAvg] = await pool.execute(
      `SELECT AVG(sleep_hours) as avg_sleep
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND sleep_hours IS NOT NULL`,
      [req.user.id]
    );
    
    res.json({
      recentMoods: moodEntries,
      todayCalories: calorieData[0].total_calories || 0,
      todayBurned: burnedData[0].total_burned || 0,
      weeklyMood: Math.round((moodAvg[0].avg_mood || 0) * 10) / 10,
      sleepQuality: Math.round((sleepAvg[0].avg_sleep || 0) * 10) / 10
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;