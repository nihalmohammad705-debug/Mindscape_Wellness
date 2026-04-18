-- Sample wellness recommendations
INSERT INTO wellness_recommendations (condition_type, recommendation_type, title, description, severity) VALUES
('low_mood', 'suggestion', 'Get Some Sunlight', 'Spend 15-20 minutes outside in natural sunlight to boost your mood and vitamin D levels.', 'low'),
('high_stress', 'warning', 'Practice Deep Breathing', 'Try 5 minutes of deep breathing exercises to reduce stress and anxiety levels.', 'medium'),
('poor_sleep', 'suggestion', 'Establish Sleep Routine', 'Go to bed and wake up at the same time every day to improve sleep quality.', 'low'),
('low_energy', 'suggestion', 'Stay Hydrated', 'Drink plenty of water throughout the day to maintain energy levels and mental clarity.', 'low'),
('consistent_high_stress', 'doctor', 'Consult Professional', 'Consider speaking with a mental health professional about persistent stress.', 'high');

-- Sample book recommendations
INSERT INTO book_recommendations (mood_condition, book_title, author, description) VALUES
('anxiety', 'The Anxiety and Phobia Workbook', 'Edmund Bourne', 'A comprehensive workbook with practical techniques for managing anxiety.'),
('depression', 'Feeling Good: The New Mood Therapy', 'David D. Burns', 'Cognitive behavioral therapy techniques for overcoming depression.'),
('stress', 'Why Zebras Don''t Get Ulcers', 'Robert Sapolsky', 'Understanding stress and its effects on the body and mind.'),
('mindfulness', 'The Power of Now', 'Eckhart Tolle', 'A guide to spiritual enlightenment and living in the present moment.');