const express = require('express');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jsonDataManager = require('../data/jsonDataManager');

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

// Add mood entry - COMPATIBLE WITH YOUR FRONTEND DATA STRUCTURE
router.post('/entries', authenticateToken, [
  body('primaryMood').notEmpty().withMessage('Primary mood is required'),
  body('moodScore').isInt({ min: 1, max: 10 }).withMessage('Mood score must be between 1 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      primaryMood, 
      moodScore, 
      moodLevel, 
      sleepQuality, 
      energyLevel, 
      stressLevel, 
      productivity, 
      userExpression, 
      suggestion,
      date 
    } = req.body;

    console.log('📝 Adding mood entry for user:', req.user.id);
    console.log('📦 Mood data received:', { 
      primaryMood, 
      moodScore, 
      moodLevel, 
      sleepQuality, 
      energyLevel, 
      stressLevel, 
      productivity, 
      userExpression 
    });
    
    // Map frontend fields to database fields
    const moodType = primaryMood || 'neutral';
    const moodIntensity = parseInt(moodScore) || 5;
    const sleepHours = sleepQuality ? parseFloat(sleepQuality) : null;
    const exerciseDuration = null; // Your frontend doesn't send this
    const stressLevelValue = stressLevel ? parseInt(stressLevel) : null;
    const energyLevelValue = energyLevel ? parseInt(energyLevel) : null;
    const notes = userExpression || '';

    // Store in MySQL
    const [result] = await pool.execute(
      `INSERT INTO mood_entries (user_id, mood_type, mood_intensity, sleep_hours, exercise_duration, stress_level, energy_level, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, moodType, moodIntensity, sleepHours, exerciseDuration, stressLevelValue, energyLevelValue, notes]
    );
    
    console.log('✅ MySQL insert successful, ID:', result.insertId);
    
    // ALSO STORE IN JSON FILE with frontend-compatible structure
    try {
      const jsonEntry = {
        id: result.insertId, // Use MySQL ID for consistency
        user_id: req.user.id,
        userId: req.user.id, // Keep both for compatibility
        primaryMood: primaryMood,
        moodType: moodType,
        moodScore: parseInt(moodScore),
        moodIntensity: parseInt(moodScore),
        moodLevel: moodLevel,
        sleepQuality: sleepQuality,
        sleep_hours: sleepQuality ? parseFloat(sleepQuality) : null,
        energyLevel: energyLevel,
        energy_level: energyLevel ? parseInt(energyLevel) : null,
        stressLevel: stressLevel,
        stress_level: stressLevel ? parseInt(stressLevel) : null,
        productivity: productivity,
        userExpression: userExpression,
        notes: userExpression || '',
        suggestion: suggestion,
        date: date || new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        mysql_entry_id: result.insertId
      };
      
      console.log('💾 Saving to JSON:', jsonEntry);
      
      const jsonResult = await jsonDataManager.addMoodEntry(jsonEntry);
      
      if (jsonResult) {
        console.log('✅ JSON save successful');
      } else {
        console.log('❌ JSON save failed');
      }
      
    } catch (jsonError) {
      console.error('❌ JSON save error:', jsonError);
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Mood entry added successfully',
      entryId: result.insertId,
      storedInJSON: true,
      data: {
        id: result.insertId,
        userId: req.user.id,
        primaryMood,
        moodScore,
        moodLevel,
        sleepQuality,
        energyLevel,
        stressLevel,
        productivity,
        userExpression,
        suggestion,
        date: date || new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Mood entry error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get mood entries - COMPATIBLE WITH YOUR FRONTEND
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const { date, limit = 50, offset = 0 } = req.query;
    
    console.log('📖 Fetching mood entries for user:', req.user.id, 'date:', date);
    
    let query = `
      SELECT * FROM mood_entries 
      WHERE user_id = ?
    `;
    let params = [req.user.id];
    
    if (date) {
      query += ' AND DATE(created_at) = ?';
      params.push(date);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Get from MySQL
    const [entries] = await pool.execute(query, params);
    
    // Transform to frontend-compatible format
    const transformedEntries = entries.map(entry => ({
      id: entry.id,
      userId: entry.user_id,
      primaryMood: entry.mood_type,
      moodType: entry.mood_type,
      moodScore: entry.mood_intensity,
      moodLevel: getMoodLevel(entry.mood_intensity),
      sleepQuality: entry.sleep_hours ? entry.sleep_hours.toString() : null,
      energyLevel: entry.energy_level ? entry.energy_level.toString() : null,
      stressLevel: entry.stress_level ? entry.stress_level.toString() : null,
      productivity: null, // Your DB doesn't have this field
      userExpression: entry.notes,
      suggestion: null, // Your DB doesn't have this field
      date: entry.created_at.toISOString().split('T')[0],
      timestamp: entry.created_at.toISOString(),
      created_at: entry.created_at.toISOString(),
      updated_at: entry.updated_at ? entry.updated_at.toISOString() : entry.created_at.toISOString()
    }));
    
    // ALSO GET FROM JSON (for verification)
    let jsonEntries = [];
    let jsonError = null;
    try {
      jsonEntries = await jsonDataManager.getMoodEntriesByUser(req.user.id);
      console.log('📊 JSON entries found:', jsonEntries.length);
    } catch (error) {
      jsonError = error.message;
      console.error('❌ Error reading JSON:', error);
    }
    
    res.json({
      success: true,
      entries: transformedEntries,
      jsonDebug: {
        jsonEntriesCount: jsonEntries.length,
        jsonError: jsonError
      },
      pagination: {
        total: transformedEntries.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get mood analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    console.log('📊 Getting mood analytics for user:', req.user.id, 'period:', period);
    
    // Get analytics from JSON files (more compatible with your frontend)
    const jsonAnalytics = await jsonDataManager.getMoodAnalytics(req.user.id, period);
    
    // Also get from MySQL for comparison
    let interval = '7 DAY';
    if (period === 'month') interval = '30 DAY';
    if (period === 'year') interval = '365 DAY';
    
    const [moodDistribution] = await pool.execute(
      `SELECT mood_type, COUNT(*) as count 
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY mood_type`,
      [req.user.id]
    );
    
    const [averages] = await pool.execute(
      `SELECT 
         AVG(mood_intensity) as avg_mood,
         AVG(sleep_hours) as avg_sleep,
         AVG(stress_level) as avg_stress,
         AVG(energy_level) as avg_energy
       FROM mood_entries 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      ...jsonAnalytics,
      mysqlMoodDistribution: moodDistribution,
      mysqlAverages: averages[0],
      source: 'JSON + MySQL'
    });
    
  } catch (error) {
    console.error('Mood analytics error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Debug endpoint to check JSON files directly
router.get('/debug/json', authenticateToken, async (req, res) => {
  try {
    const moodEntries = await jsonDataManager.readData('mood_entries');
    const userEntries = await jsonDataManager.getMoodEntriesByUser(req.user.id);
    
    res.json({
      success: true,
      allMoodEntries: moodEntries,
      userMoodEntries: userEntries,
      counts: {
        all: moodEntries.length,
        user: userEntries.length
      }
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Helper function to convert mood score to level (compatible with your frontend)
function getMoodLevel(score) {
  if (score >= 9) return 'excellent';
  if (score >= 7) return 'good';
  if (score >= 5) return 'average';
  if (score >= 3) return 'needs_attention';
  return 'critical';
}

module.exports = router;