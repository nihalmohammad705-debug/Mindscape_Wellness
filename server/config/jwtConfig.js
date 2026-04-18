require('dotenv').config();

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  issuer: 'mindscape-wellness-api',
  audience: 'mindscape-wellness-users'
};

// Validate JWT configuration
const validateJWTConfig = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback_secret_key_change_in_production') {
    console.warn('⚠️  WARNING: Using default JWT secret. Change JWT_SECRET in production!');
  }
  
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production environment');
  }
};

validateJWTConfig();

module.exports = jwtConfig;