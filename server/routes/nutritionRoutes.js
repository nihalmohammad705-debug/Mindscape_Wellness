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

// Get food items
router.get('/food-items', authenticateToken, async (req, res) => {
  try {
    const [foodItems] = await pool.execute(
      `SELECT fi.*, fc.name as category_name 
       FROM food_items fi 
       LEFT JOIN food_categories fc ON fi.category_id = fc.id 
       ORDER BY fi.name`
    );
    
    res.json({ foodItems });
    
  } catch (error) {
    console.error('Get food items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add food consumption entry
router.post('/entries', authenticateToken, [
  body('foodItemId').isInt().withMessage('Valid food item ID is required'),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snacks', 'other']).withMessage('Valid meal type is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('consumptionDate').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { foodItemId, mealType, quantity, consumptionDate, notes } = req.body;
    
    // Get food item details for JSON storage
    const [foodItems] = await pool.execute(
      'SELECT * FROM food_items WHERE id = ?',
      [foodItemId]
    );
    
    if (foodItems.length === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    
    const foodItem = foodItems[0];
    const totalCalories = Math.round((foodItem.calories_per_100g * quantity) / 100);
    const totalProtein = Math.round((foodItem.protein * quantity) / 100);
    const totalCarbs = Math.round((foodItem.carbs * quantity) / 100);
    const totalFat = Math.round((foodItem.fat * quantity) / 100);
    
    // Store in MySQL
    const [result] = await pool.execute(
      `INSERT INTO food_consumption (user_id, food_item_id, meal_type, quantity, consumption_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, foodItemId, mealType, quantity, consumptionDate, notes]
    );
    
    // ALSO STORE IN JSON FILE
    const jsonEntry = await jsonDataManager.addNutritionEntry({
      user_id: req.user.id,
      food_item_id: foodItemId,
      food_name: foodItem.name,
      meal_type: mealType,
      quantity: quantity,
      consumption_date: consumptionDate,
      notes: notes,
      calories_per_100g: foodItem.calories_per_100g,
      protein_per_100g: foodItem.protein,
      carbs_per_100g: foodItem.carbs,
      fat_per_100g: foodItem.fat,
      total_calories: totalCalories,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat,
      mysql_entry_id: result.insertId
    });
    
    res.status(201).json({ 
      message: 'Food entry added successfully',
      entryId: result.insertId,
      jsonEntryId: jsonEntry ? jsonEntry.id : null,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    });
    
  } catch (error) {
    console.error('Food entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nutrition entries
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const { date, limit = 10, offset = 0 } = req.query;
    let query = `
      SELECT fc.*, fi.name as food_name, fi.calories_per_100g, fi.protein, fi.carbs, fi.fat
      FROM food_consumption fc
      JOIN food_items fi ON fc.food_item_id = fi.id
      WHERE fc.user_id = ?
    `;
    let params = [req.user.id];
    
    if (date) {
      query += ' AND fc.consumption_date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY fc.consumption_date DESC, fc.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [entries] = await pool.execute(query, params);
    
    // Calculate total nutrition values
    const entriesWithTotals = entries.map(entry => ({
      ...entry,
      total_calories: Math.round((entry.calories_per_100g * entry.quantity) / 100),
      total_protein: Math.round((entry.protein * entry.quantity) / 100),
      total_carbs: Math.round((entry.carbs * entry.quantity) / 100),
      total_fat: Math.round((entry.fat * entry.quantity) / 100)
    }));
    
    const [total] = await pool.execute(
      'SELECT COUNT(*) as count FROM food_consumption WHERE user_id = ?' + (date ? ' AND consumption_date = ?' : ''),
      date ? [req.user.id, date] : [req.user.id]
    );
    
    // ALSO GET FROM JSON
    const jsonEntries = await jsonDataManager.getNutritionEntriesByUser(req.user.id);
    
    res.json({
      entries: entriesWithTotals,
      jsonEntriesCount: jsonEntries.length,
      pagination: {
        total: total[0].count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    console.error('Get nutrition entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nutrition summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { period = 'day' } = req.query;
    let dateCondition = 'consumption_date = CURDATE()';
    
    if (period === 'week') dateCondition = 'consumption_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    if (period === 'month') dateCondition = 'consumption_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    
    const [summary] = await pool.execute(
      `SELECT 
         fc.consumption_date,
         SUM(fi.calories_per_100g * (fc.quantity/100)) as total_calories,
         SUM(fi.protein * (fc.quantity/100)) as total_protein,
         SUM(fi.carbs * (fc.quantity/100)) as total_carbs,
         SUM(fi.fat * (fc.quantity/100)) as total_fat
       FROM food_consumption fc
       JOIN food_items fi ON fc.food_item_id = fi.id
       WHERE fc.user_id = ? AND ${dateCondition}
       GROUP BY fc.consumption_date
       ORDER BY fc.consumption_date`,
      [req.user.id]
    );
    
    // Meal type breakdown for today
    const [mealBreakdown] = await pool.execute(
      `SELECT 
         fc.meal_type,
         SUM(fi.calories_per_100g * (fc.quantity/100)) as calories
       FROM food_consumption fc
       JOIN food_items fi ON fc.food_item_id = fi.id
       WHERE fc.user_id = ? AND fc.consumption_date = CURDATE()
       GROUP BY fc.meal_type`,
      [req.user.id]
    );
    
    // Get JSON data for comparison
    const jsonEntries = await jsonDataManager.getNutritionEntriesByUser(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const todayJsonEntries = jsonEntries.filter(entry => entry.consumption_date === today);
    const jsonTotalCalories = todayJsonEntries.reduce((sum, entry) => sum + entry.total_calories, 0);
    
    res.json({
      summary,
      mealBreakdown,
      period,
      jsonComparison: {
        totalEntries: jsonEntries.length,
        todayEntries: todayJsonEntries.length,
        todayCalories: jsonTotalCalories
      }
    });
    
  } catch (error) {
    console.error('Nutrition summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete nutrition entry
router.delete('/entries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from MySQL
    const [result] = await pool.execute(
      'DELETE FROM food_consumption WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nutrition entry not found' });
    }
    
    res.json({ 
      message: 'Nutrition entry deleted successfully',
      deletedId: id
    });
    
  } catch (error) {
    console.error('Delete nutrition entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;