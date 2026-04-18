const { db } = require('../config/database');

class FoodItem {
  // Get all food items
  static async findAll(options = {}) {
    const { category, search, limit = 50, offset = 0 } = options;
    
    let query = `
      SELECT fi.*, fc.name as category_name 
      FROM food_items fi 
      LEFT JOIN food_categories fc ON fi.category_id = fc.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (category) {
      query += ' AND fc.name LIKE ?';
      params.push(`%${category}%`);
    }
    
    if (search) {
      query += ' AND fi.name LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY fi.name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const foodItems = await db.execute(query, params);
    
    const totalResult = await db.executeOne(
      'SELECT COUNT(*) as count FROM food_items fi LEFT JOIN food_categories fc ON fi.category_id = fc.id WHERE 1=1' + 
      (category ? ' AND fc.name LIKE ?' : '') + 
      (search ? ' AND fi.name LIKE ?' : ''),
      params.slice(0, -2) // Remove limit and offset for count
    );
    
    return {
      foodItems,
      total: totalResult.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
  }

  // Find food item by ID
  static async findById(id) {
    return await db.executeOne(
      `SELECT fi.*, fc.name as category_name 
       FROM food_items fi 
       LEFT JOIN food_categories fc ON fi.category_id = fc.id 
       WHERE fi.id = ?`,
      [id]
    );
  }

  // Get food categories
  static async getCategories() {
    return await db.execute('SELECT * FROM food_categories ORDER BY name');
  }

  // Search food items
  static async search(query, limit = 10) {
    return await db.execute(
      `SELECT fi.*, fc.name as category_name 
       FROM food_items fi 
       LEFT JOIN food_categories fc ON fi.category_id = fc.id 
       WHERE fi.name LIKE ? 
       ORDER BY fi.name 
       LIMIT ?`,
      [`%${query}%`, parseInt(limit)]
    );
  }
}

module.exports = FoodItem;