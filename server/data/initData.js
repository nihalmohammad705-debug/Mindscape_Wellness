const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const usersDir = path.join(dataDir, 'users');

// Initialize data directory structure
const initDataDirectory = async () => {
    try {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.mkdir(usersDir, { recursive: true });
        
        // Initialize JSON files if they don't exist
        const files = {
            'mood_entries.json': [],
            'nutrition_entries.json': [],
            'activity_entries.json': []
        };

        for (const [filename, defaultData] of Object.entries(files)) {
            const filePath = path.join(dataDir, filename);
            try {
                await fs.access(filePath);
            } catch {
                await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
                console.log(`Created ${filename}`);
            }
        }
        
        console.log('Data directory initialized successfully');
    } catch (error) {
        console.error('Error initializing data directory:', error);
    }
};

module.exports = { initDataDirectory, dataDir, usersDir };