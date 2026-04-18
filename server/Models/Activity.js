const { db } = require('../config/database');

class Activity {
  // Get all activity types
  static async getActivityTypes() {
    return await db.execute('SELECT * FROM activity_types ORDER BY name');
  }

  // Find activity type by ID
  static async findActivityTypeById(id) {
    return await db.executeOne(
      'SELECT * FROM activity_types WHERE id = ?',
      [id]
    );
  }

  // Log activity
  static async logActivity(userId, activityData) {
    const { activityTypeId, durationMinutes, activityDate, notes } = activityData;
    
    // Get activity type to calculate calories
    const activityType = await this.findActivityTypeById(activityTypeId);
    
    if (!activityType) {
      throw new Error('Activity type not found');
    }
    
    const caloriesBurned = Math.round((activityType.calories_burned_per_hour * durationMinutes) / 60);
    
    const result = await db.execute(
      `INSERT INTO activity_log (user_id, activity_type_id, duration_minutes, calories_burned, activity_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, activityTypeId, durationMinutes, caloriesBurned, activityDate, notes]
    );
    
    return {
      id: result.insertId,
      ...activityData,
      caloriesBurned,
      user_id: userId
    };
  }

  // Get activity entries for user
  static async getEntries(userId, options = {}) {
    const { limit = 10, offset = 0, startDate, endDate } = options;
    
    let query = `
      SELECT al.*, at.name as activity_name, at.calories_burned_per_hour, at.category
      FROM activity_log al
      JOIN activity_types at ON al.activity_type_id = at.id
      WHERE al.user_id = ?
    `;
    const params = [userId];
    
    if (startDate) {
      query += ' AND al.activity_date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND al.activity_date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY al.activity_date DESC, al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const entries = await db.execute(query, params);
    
    const totalResult = await db.executeOne(
      'SELECT COUNT(*) as count FROM activity_log WHERE user_id = ?' + 
      (startDate ? ' AND activity_date >= ?' : '') + 
      (endDate ? ' AND activity_date <= ?' : ''),
      params.slice(0, -2) // Remove limit and offset for count
    );
    
    return {
      entries,
      total: totalResult.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
  }

  // Get activity summary
  static async getSummary(userId, period = 'day') {
    let dateCondition = 'activity_date = CURDATE()';
    
    if (period === 'week') dateCondition = 'activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    if (period === 'month') dateCondition = 'activity_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    
    const summary = await db.execute(
      `SELECT 
         al.activity_date,
         SUM(al.duration_minutes) as total_minutes,
         SUM(al.calories_burned) as total_calories,
         COUNT(*) as activity_count
       FROM activity_log al
       WHERE al.user_id = ? AND ${dateCondition}
       GROUP BY al.activity_date
       ORDER BY al.activity_date`,
      [userId]
    );
    
    const typeBreakdown = await db.execute(
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
      [userId]
    );
    
    return {
      summary,
      typeBreakdown,
      period
    };
  }
}

module.exports = Activity;