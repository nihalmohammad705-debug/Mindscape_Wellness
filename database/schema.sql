-- MindScape Wellness Database Schema

CREATE DATABASE IF NOT EXISTS mindscape_wellness;
USE mindscape_wellness;

-- Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    unique_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    height DECIMAL(5,2) COMMENT 'Height in cm',
    weight DECIMAL(5,2) COMMENT 'Weight in kg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_unique_id (unique_id)
);

-- Mood Entries Table
CREATE TABLE mood_entries (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    mood_type ENUM('happy', 'relaxed', 'neutral', 'stressed', 'sad', 'anxious', 'angry') NOT NULL,
    mood_intensity INT CHECK (mood_intensity BETWEEN 1 AND 10),
    sleep_hours DECIMAL(3,1) COMMENT 'Hours of sleep',
    exercise_duration INT COMMENT 'Minutes of exercise',
    stress_level INT CHECK (stress_level BETWEEN 1 AND 10),
    energy_level INT CHECK (energy_level BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created_at (created_at)
);

-- Food Categories Table
CREATE TABLE food_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food Items Table
CREATE TABLE food_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    calories_per_100g DECIMAL(6,2),
    protein DECIMAL(5,2) COMMENT 'Protein in grams per 100g',
    carbs DECIMAL(5,2) COMMENT 'Carbohydrates in grams per 100g',
    fat DECIMAL(5,2) COMMENT 'Fat in grams per 100g',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES food_categories(id),
    INDEX idx_name (name),
    INDEX idx_category (category_id)
);

-- Food Consumption Table
CREATE TABLE food_consumption (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    food_item_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks', 'other'),
    quantity DECIMAL(6,2) COMMENT 'Quantity in grams or pieces',
    consumption_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id),
    INDEX idx_user_date (user_id, consumption_date),
    INDEX idx_consumption_date (consumption_date)
);

-- Activity Types Table
CREATE TABLE activity_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    calories_burned_per_hour DECIMAL(6,2),
    category ENUM('exercise', 'work', 'leisure', 'sleep', 'other'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Activity Log Table
CREATE TABLE activity_log (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    activity_type_id INT NOT NULL,
    duration_minutes INT,
    calories_burned DECIMAL(6,2),
    activity_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_type_id) REFERENCES activity_types(id),
    INDEX idx_user_date (user_id, activity_date),
    INDEX idx_activity_date (activity_date)
);

-- Wellness Recommendations Table
CREATE TABLE wellness_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    condition_type VARCHAR(100),
    recommendation_type ENUM('suggestion', 'warning', 'doctor'),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_condition (condition_type),
    INDEX idx_severity (severity)
);

-- Books Recommendations Table
CREATE TABLE book_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mood_condition VARCHAR(100),
    book_title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    amazon_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mood_condition (mood_condition)
);

-- User Settings Table
CREATE TABLE user_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    weekly_reports BOOLEAN DEFAULT TRUE,
    dark_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user (user_id)
);