const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Generate unique ID
  static generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `MW${timestamp}${random}`;
  }

  // Create new user
  static async create(userData) {
    const { name, email, password, dateOfBirth, gender, height, weight } = userData;
    
    // Check if email already exists
    const existingUser = await db.executeOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const uniqueId = this.generateUniqueId();
    
    // Create user
    const result = await db.execute(
      `INSERT INTO users (unique_id, email, password_hash, name, date_of_birth, gender, height, weight) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uniqueId, email, hashedPassword, name, dateOfBirth, gender, height, weight]
    );
    
    return {
      id: result.insertId,
      uniqueId,
      email,
      name
    };
  }

  // Find user by email
  static async findByEmail(email) {
    return await db.executeOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
  }

  // Find user by ID
  static async findById(id) {
    return await db.executeOne(
      'SELECT id, unique_id, email, name, date_of_birth, gender, height, weight, created_at FROM users WHERE id = ?',
      [id]
    );
  }

  // Find user by unique ID
  static async findByUniqueId(uniqueId) {
    return await db.executeOne(
      'SELECT id, unique_id, email, name FROM users WHERE unique_id = ?',
      [uniqueId]
    );
  }

  // Verify user credentials
  static async verifyCredentials(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return null;
    }
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    const { name, dateOfBirth, gender, height, weight } = updateData;
    
    await db.execute(
      `UPDATE users SET name = ?, date_of_birth = ?, gender = ?, height = ?, weight = ? 
       WHERE id = ?`,
      [name, dateOfBirth, gender, height, weight, userId]
    );
    
    return await this.findById(userId);
  }

  // Reset password
  static async resetPassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await db.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    return true;
  }

  // Verify user for password reset
  static async verifyForPasswordReset(email, uniqueId) {
    return await db.executeOne(
      'SELECT id FROM users WHERE email = ? AND unique_id = ?',
      [email, uniqueId]
    );
  }
}

module.exports = User;