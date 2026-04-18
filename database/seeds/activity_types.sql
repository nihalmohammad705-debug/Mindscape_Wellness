-- Seed data for activity types
INSERT INTO activity_types (name, calories_burned_per_hour, category, description) VALUES
-- Exercise activities
('Walking', 280, 'exercise', 'Brisk walking at moderate pace'),
('Running', 600, 'exercise', 'Running at moderate pace (10 min/mile)'),
('Cycling', 500, 'exercise', 'Cycling at moderate pace (12-14 mph)'),
('Yoga', 240, 'exercise', 'Hatha or Vinyasa yoga practice'),
('Weight Training', 400, 'exercise', 'Strength training with weights'),
('Swimming', 550, 'exercise', 'Moderate pace swimming'),
('Dancing', 400, 'exercise', 'Social or aerobic dancing'),

-- Work activities
('Office Work', 100, 'work', 'Sitting at desk, computer work'),
('House Cleaning', 200, 'work', 'Cleaning, vacuuming, mopping'),
('Cooking', 150, 'work', 'Food preparation and cooking'),

-- Leisure activities
('Reading', 85, 'leisure', 'Sitting and reading'),
('Watching TV', 70, 'leisure', 'Sitting and watching television'),
('Socializing', 110, 'leisure', 'Talking with friends or family'),

-- Rest
('Sleeping', 50, 'sleep', 'Resting and sleeping'),
('Meditating', 70, 'sleep', 'Sitting meditation');