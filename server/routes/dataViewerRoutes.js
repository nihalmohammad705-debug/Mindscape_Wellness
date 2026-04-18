const express = require('express');
const jsonDataManager = require('../data/jsonDataManager');
const router = express.Router();

// Get all JSON data (for debugging)
router.get('/all', async (req, res) => {
    try {
        const moodEntries = await jsonDataManager.readData('mood_entries');
        const nutritionEntries = await jsonDataManager.readData('nutrition_entries');
        const activityEntries = await jsonDataManager.readData('activity_entries');
        
        res.json({
            success: true,
            data: {
                mood_entries: moodEntries,
                nutrition_entries: nutritionEntries,
                activity_entries: activityEntries
            },
            counts: {
                mood_entries: moodEntries.length,
                nutrition_entries: nutritionEntries.length,
                activity_entries: activityEntries.length
            }
        });
    } catch (error) {
        console.error('Error fetching all data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get data for specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userData = await jsonDataManager.getAllUserData(parseInt(userId));
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found'
            });
        }
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get specific type of entries for a user
router.get('/user/:userId/:type', async (req, res) => {
    try {
        const { userId, type } = req.params;
        
        let entries;
        switch (type) {
            case 'mood':
                entries = await jsonDataManager.getMoodEntriesByUser(parseInt(userId));
                break;
            case 'nutrition':
                entries = await jsonDataManager.getNutritionEntriesByUser(parseInt(userId));
                break;
            case 'activity':
                entries = await jsonDataManager.getActivityEntriesByUser(parseInt(userId));
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data type. Use: mood, nutrition, or activity'
                });
        }
        
        res.json({
            success: true,
            data: {
                user_id: parseInt(userId),
                type: type,
                entries: entries,
                count: entries.length
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;