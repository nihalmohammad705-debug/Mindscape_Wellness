const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mindscape_wellness',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Query helper functions
const db = {
  // Execute a query with parameters
  async execute(query, params = []) {
    try {
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Execute a query and return the first row
  async executeOne(query, params = []) {
    const rows = await this.execute(query, params);
    return rows[0] || null;
  },

  // Begin transaction
  async beginTransaction() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  },

  // Commit transaction
  async commit(connection) {
    await connection.commit();
    connection.release();
  },

  // Rollback transaction
  async rollback(connection) {
    await connection.rollback();
    connection.release();
  }
};

module.exports = {
  pool,
  db,
  testConnection
};