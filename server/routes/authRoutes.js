const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');
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

// Generate unique ID
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MW${timestamp}${random}`;
};

// User Registration
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, dateOfBirth, gender, height, weight } = req.body;
    
    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const uniqueId = generateUniqueId();
    
    // Create user
    const [result] = await pool.execute(
      `INSERT INTO users (unique_id, email, password_hash, name, date_of_birth, gender, height, weight) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uniqueId, email, hashedPassword, name, dateOfBirth, gender, height, weight]
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      uniqueId: uniqueId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        sessionId: generateUniqueId() // Add unique session ID
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        uniqueId: user.unique_id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token Validation Endpoint
router.post('/validate-token', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        valid: false,
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const [users] = await pool.execute(
      'SELECT id, unique_id, email, name FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        valid: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    const user = users[0];
    
    res.json({ 
      valid: true, 
      user: {
        id: user.id,
        uniqueId: user.unique_id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        valid: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        valid: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('Token validation error:', error);
    return res.status(500).json({ 
      valid: false,
      error: 'Token validation failed',
      code: 'VALIDATION_FAILED'
    });
  }
});

// Forgot Password - Step 1: Verify Email and Unique ID
router.post('/verify-user', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('uniqueId').notEmpty().withMessage('Unique ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, uniqueId } = req.body;
    
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND unique_id = ?',
      [email, uniqueId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found with provided credentials' });
    }
    
    res.json({ 
      message: 'User verified successfully',
      userId: users[0].id
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password
router.post('/reset-password', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, newPassword } = req.body;
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.json({ message: 'Password reset successfully' });
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;