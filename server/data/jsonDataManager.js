const fs = require('fs').promises;
const path = require('path');

class JSONDataManager {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.usersDir = path.join(this.dataDir, 'users');
        console.log('📁 JSON Data Manager initialized');
        console.log('📂 Data directory:', this.dataDir);
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            await fs.mkdir(this.usersDir, { recursive: true });
            console.log('✅ Data directories created');
            
            const files = {
                'mood_entries.json': [],
                'nutrition_entries.json': [],
                'activity_entries.json': []
            };

            for (const [filename, defaultData] of Object.entries(files)) {
                const filePath = path.join(this.dataDir, filename);
                try {
                    await fs.access(filePath);
                    console.log(`✅ ${filename} exists`);
                } catch {
                    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
                    console.log(`📄 Created ${filename}`);
                }
            }
        } catch (error) {
            console.error('❌ Error initializing data directory:', error);
        }
    }

    // Mood entries methods
    async addMoodEntry(entry) {
        console.log('💾 Adding mood entry to JSON:', entry);
        try {
            const result = await this.addEntry('mood_entries', entry);
            console.log('✅ Mood entry added to JSON:', result ? 'Success' : 'Failed');
            return result;
        } catch (error) {
            console.error('❌ Error adding mood entry to JSON:', error);
            return null;
        }
    }

    async getMoodEntriesByUser(userId) {
        try {
            const entries = await this.readData('mood_entries');
            const userEntries = entries.filter(entry => entry.user_id === userId);
            console.log(`👤 Found ${userEntries.length} mood entries for user ${userId}`);
            return userEntries;
        } catch (error) {
            console.error('❌ Error getting mood entries:', error);
            return [];
        }
    }

    // Nutrition entries methods
    async addNutritionEntry(entry) {
        console.log('💾 Adding nutrition entry to JSON:', entry);
        try {
            const result = await this.addEntry('nutrition_entries', entry);
            console.log('✅ Nutrition entry added to JSON:', result ? 'Success' : 'Failed');
            return result;
        } catch (error) {
            console.error('❌ Error adding nutrition entry to JSON:', error);
            return null;
        }
    }

    async getNutritionEntriesByUser(userId) {
        try {
            const entries = await this.readData('nutrition_entries');
            return entries.filter(entry => entry.user_id === userId);
        } catch (error) {
            console.error('❌ Error getting nutrition entries:', error);
            return [];
        }
    }

    // Activity entries methods
    async addActivityEntry(entry) {
        console.log('💾 Adding activity entry to JSON:', entry);
        try {
            const result = await this.addEntry('activity_entries', entry);
            console.log('✅ Activity entry added to JSON:', result ? 'Success' : 'Failed');
            return result;
        } catch (error) {
            console.error('❌ Error adding activity entry to JSON:', error);
            return null;
        }
    }

    async getActivityEntriesByUser(userId) {
        try {
            const entries = await this.readData('activity_entries');
            return entries.filter(entry => entry.user_id === userId);
        } catch (error) {
            console.error('❌ Error getting activity entries:', error);
            return [];
        }
    }

    // Generic methods
    async readData(type) {
        try {
            const filePath = path.join(this.dataDir, `${type}.json`);
            console.log(`📖 Reading ${filePath}`);
            const data = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(data);
            console.log(`✅ Read ${parsed.length} entries from ${type}`);
            return parsed;
        } catch (error) {
            console.error(`❌ Error reading ${type}:`, error);
            return [];
        }
    }

    async writeData(type, data) {
        try {
            const filePath = path.join(this.dataDir, `${type}.json`);
            console.log(`📝 Writing ${data.length} entries to ${type}`);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Successfully wrote to ${type}`);
            return true;
        } catch (error) {
            console.error(`❌ Error writing ${type}:`, error);
            return false;
        }
    }

    async addEntry(type, entry) {
        try {
            const entries = await this.readData(type);
            const newEntry = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                ...entry,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            entries.push(newEntry);
            const success = await this.writeData(type, entries);
            
            if (success) {
                await this.updateUserFile(entry.user_id, type, newEntry);
            }
            
            return success ? newEntry : null;
        } catch (error) {
            console.error(`❌ Error in addEntry for ${type}:`, error);
            return null;
        }
    }

    async updateUserFile(userId, type, entry) {
        try {
            const userFilePath = path.join(this.usersDir, `${userId}.json`);
            let userData = {};
            
            try {
                const data = await fs.readFile(userFilePath, 'utf8');
                userData = JSON.parse(data);
                console.log(`✅ Loaded existing user file for ${userId}`);
            } catch {
                userData = {
                    user_id: userId,
                    mood_entries: [],
                    nutrition_entries: [],
                    activity_entries: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                console.log(`📄 Created new user file for ${userId}`);
            }
            
            const entryType = type.replace('_entries', '_entries');
            if (!userData[entryType]) userData[entryType] = [];
            
            userData[entryType].push(entry);
            userData.updated_at = new Date().toISOString();
            
            await fs.writeFile(userFilePath, JSON.stringify(userData, null, 2));
            console.log(`✅ Updated user file for ${userId}`);
            
        } catch (error) {
            console.error(`❌ Error updating user file for ${userId}:`, error);
        }
    }

    // Get analytics data
    async getMoodAnalytics(userId, period = 'week') {
        try {
            const entries = await this.getMoodEntriesByUser(userId);
            const now = new Date();
            let startDate = new Date();
            
            if (period === 'week') startDate.setDate(now.getDate() - 7);
            else if (period === 'month') startDate.setDate(now.getDate() - 30);
            else if (period === 'year') startDate.setDate(now.getDate() - 365);
            
            const filteredEntries = entries.filter(entry => 
                new Date(entry.created_at) >= startDate
            );

            // Mood distribution
            const moodDistribution = filteredEntries.reduce((acc, entry) => {
                acc[entry.mood_type] = (acc[entry.mood_type] || 0) + 1;
                return acc;
            }, {});

            // Averages
            const averages = {
                avg_mood: this.calculateAverage(filteredEntries, 'mood_intensity'),
                avg_sleep: this.calculateAverage(filteredEntries, 'sleep_hours'),
                avg_stress: this.calculateAverage(filteredEntries, 'stress_level'),
                avg_energy: this.calculateAverage(filteredEntries, 'energy_level')
            };

            // Weekly trends
            const weeklyTrends = this.groupByDate(filteredEntries);

            return {
                moodDistribution: Object.entries(moodDistribution).map(([mood_type, count]) => ({ mood_type, count })),
                averages,
                weeklyTrends,
                period
            };
        } catch (error) {
            console.error('❌ Error in getMoodAnalytics:', error);
            return {
                moodDistribution: [],
                averages: {},
                weeklyTrends: [],
                period,
                error: error.message
            };
        }
    }

    calculateAverage(entries, field) {
        const values = entries.map(entry => entry[field]).filter(val => val != null);
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    groupByDate(entries) {
        const grouped = {};
        entries.forEach(entry => {
            const date = entry.created_at.split('T')[0];
            if (!grouped[date]) {
                grouped[date] = {
                    date,
                    entries: []
                };
            }
            grouped[date].entries.push(entry);
        });

        return Object.values(grouped).map(group => ({
            date: group.date,
            avg_mood: this.calculateAverage(group.entries, 'mood_intensity'),
            avg_energy: this.calculateAverage(group.entries, 'energy_level')
        }));
    }

    // Get all user data for debugging
    async getAllUserData(userId) {
        try {
            const moodEntries = await this.getMoodEntriesByUser(userId);
            const nutritionEntries = await this.getNutritionEntriesByUser(userId);
            const activityEntries = await this.getActivityEntriesByUser(userId);
            
            return {
                user_id: userId,
                mood_entries: moodEntries,
                nutrition_entries: nutritionEntries,
                activity_entries: activityEntries,
                summary: {
                    total_mood_entries: moodEntries.length,
                    total_nutrition_entries: nutritionEntries.length,
                    total_activity_entries: activityEntries.length
                }
            };
        } catch (error) {
            console.error('❌ Error getting all user data:', error);
            return null;
        }
    }
}

module.exports = new JSONDataManager();