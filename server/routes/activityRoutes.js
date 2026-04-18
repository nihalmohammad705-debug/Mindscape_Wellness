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

// Get activity types
router.get('/activity-types', authenticateToken, async (req, res) => {
  try {
    const [activityTypes] = await pool.execute(
      'SELECT * FROM activity_types ORDER BY name'
    );
    
    res.json({ activityTypes });
    
  } catch (error) {
    console.error('Get activity types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add activity entry
router.post('/entries', authenticateToken, [
  body('activityTypeId').isInt().withMessage('Valid activity type ID is required'),
  body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('activityDate').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { activityTypeId, durationMinutes, activityDate, intensity, notes } = req.body;
    
    // Get activity type to calculate calories
    const [activities] = await pool.execute(
      'SELECT * FROM activity_types WHERE id = ?',
      [activityTypeId]
    );
    
    if (activities.length === 0) {
      return res.status(404).json({ error: 'Activity type not found' });
    }
    
    const activity = activities[0];
    const caloriesBurned = Math.round((activity.calories_burned_per_hour * durationMinutes) / 60);
    
    // Store in MySQL
    const [result] = await pool.execute(
      `INSERT INTO activity_log (user_id, activity_type_id, duration_minutes, calories_burned, activity_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, activityTypeId, durationMinutes, caloriesBurned, activityDate, notes]
    );
    
    // ALSO STORE IN JSON FILE
    const jsonEntry = await jsonDataManager.addActivityEntry({
      user_id: req.user.id,
      activity_type_id: activityTypeId,
      activity_name: activity.name,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      activity_date: activityDate,
      notes: notes,
      category: activity.category,
      calories_burned_per_hour: activity.calories_burned_per_hour,
      intensity: intensity,
      mysql_entry_id: result.insertId
    });
    
    res.status(201).json({ 
      message: 'Activity logged successfully',
      entryId: result.insertId,
      jsonEntryId: jsonEntry ? jsonEntry.id : null,
      caloriesBurned
    });
    
  } catch (error) {
    console.error('Activity entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity entries
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const { date, limit = 10, offset = 0 } = req.query;
    let query = `
      SELECT al.*, at.name as activity_name, at.calories_burned_per_hour, at.category
      FROM activity_log al
      JOIN activity_types at ON al.activity_type_id = at.id
      WHERE al.user_id = ?
    `;
    let params = [req.user.id];
    
    if (date) {
      query += ' AND al.activity_date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY al.activity_date DESC, al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [entries] = await pool.execute(query, params);
    
    const [total] = await pool.execute(
      'SELECT COUNT(*) as count FROM activity_log WHERE user_id = ?' + (date ? ' AND activity_date = ?' : ''),
      date ? [req.user.id, date] : [req.user.id]
    );
    
    // ALSO GET FROM JSON
    const jsonEntries = await jsonDataManager.getActivityEntriesByUser(req.user.id);
    
    res.json({
      entries,
      jsonEntriesCount: jsonEntries.length,
      pagination: {
        total: total[0].count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    console.error('Get activity entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { period = 'day' } = req.query;
    let dateCondition = 'activity_date = CURDATE()';
    
    if (period === 'week') dateCondition = 'activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    if (period === 'month') dateCondition = 'activity_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    
    const [summary] = await pool.execute(
      `SELECT 
         al.activity_date,
         SUM(al.duration_minutes) as total_minutes,
         SUM(al.calories_burned) as total_calories,
         COUNT(*) as activity_count
       FROM activity_log al
       WHERE al.user_id = ? AND ${dateCondition}
       GROUP BY al.activity_date
       ORDER BY al.activity_date`,
      [req.user.id]
    );
    
    // Activity type breakdown
    const [typeBreakdown] = await pool.execute(
      `SELECT 
         at.name as activity_name,
         at.category,
         SUM(al.duration_minutes) as total_minutes,
         SUM(al.calories_burned) as total_calories,
         COUNT(*) as count
       FROM activity_log al
       JOIN activity_types at ON al.activity_type_id = at.id
       WHERE al.user_id = ? AND ${dateCondition}
       GROUP BY at.id, at.name, at.category
       ORDER BY total_calories DESC`,
      [req.user.id]
    );
    
    // Get JSON data for comparison
    const jsonEntries = await jsonDataManager.getActivityEntriesByUser(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const todayJsonEntries = jsonEntries.filter(entry => entry.activity_date === today);
    const jsonTotalCalories = todayJsonEntries.reduce((sum, entry) => sum + entry.calories_burned, 0);
    const jsonTotalMinutes = todayJsonEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0);
    
    res.json({
      summary,
      typeBreakdown,
      period,
      jsonComparison: {
        totalEntries: jsonEntries.length,
        todayEntries: todayJsonEntries.length,
        todayCalories: jsonTotalCalories,
        todayMinutes: jsonTotalMinutes
      }
    });
    
  } catch (error) {
    console.error('Activity summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete activity entry
router.delete('/entries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from MySQL
    const [result] = await pool.execute(
      'DELETE FROM activity_log WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Activity entry not found' });
    }
    
    res.json({ 
      message: 'Activity entry deleted successfully',
      deletedId: id
    });
    
  } catch (error) {
    console.error('Delete activity entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;