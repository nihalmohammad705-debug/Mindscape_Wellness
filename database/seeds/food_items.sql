-- Seed data for food categories
INSERT INTO food_categories (name, description) VALUES 
('Grains & Cereals', 'Bread, rice, pasta, and other grain products'),
('Proteins', 'Meat, poultry, fish, eggs, and plant-based proteins'),
('Fruits', 'Fresh and dried fruits'),
('Vegetables', 'Fresh and cooked vegetables'),
('Dairy', 'Milk, cheese, yogurt, and other dairy products'),
('Beverages', 'Drinks and beverages'),
('Snacks & Sweets', 'Snacks, desserts, and sweet treats');

-- Seed data for food items
INSERT INTO food_items (name, category_id, calories_per_100g, protein, carbs, fat) VALUES
-- Grains & Cereals
('Idly', 1, 35, 2.0, 8.0, 0.2),
('Dosa', 1, 120, 3.0, 18.0, 4.0),
('Rice (cooked)', 1, 130, 2.7, 28.0, 0.3),
('Chapati', 1, 70, 3.0, 15.0, 0.5),
('Bread (white)', 1, 265, 9.0, 49.0, 3.2),
('Oats', 1, 389, 16.9, 66.0, 6.9),

-- Proteins
('Egg', 2, 155, 13.0, 1.1, 11.0),
('Chicken Breast', 2, 165, 31.0, 0.0, 3.6),
('Salmon', 2, 208, 20.0, 0.0, 13.0),
('Tofu', 2, 76, 8.0, 1.9, 4.8),
('Lentils (cooked)', 2, 116, 9.0, 20.0, 0.4),

-- Fruits
('Apple', 3, 52, 0.3, 14.0, 0.2),
('Banana', 3, 89, 1.1, 23.0, 0.3),
('Orange', 3, 47, 0.9, 12.0, 0.1),
('Mango', 3, 60, 0.8, 15.0, 0.4),

-- Vegetables
('Potato (boiled)', 4, 87, 1.9, 20.0, 0.1),
('Carrot (raw)', 4, 41, 0.9, 10.0, 0.2),
('Broccoli (steamed)', 4, 35, 2.4, 7.0, 0.4),
('Spinach (raw)', 4, 23, 2.9, 3.6, 0.4),

-- Dairy
('Milk (whole)', 5, 61, 3.2, 4.8, 3.3),
('Yogurt', 5, 61, 3.5, 4.7, 3.3),
('Cheese (cheddar)', 5, 404, 25.0, 1.3, 33.0),

-- Beverages
('Coffee (black)', 6, 1, 0.1, 0.0, 0.0),
('Tea (without sugar)', 6, 1, 0.0, 0.0, 0.0),
('Orange Juice', 6, 45, 0.7, 10.0, 0.2),

-- Snacks & Sweets
('Chocolate (dark)', 7, 546, 4.9, 61.0, 31.0),
('Biscuits', 7, 460, 6.0, 70.0, 18.0);