const db = require('../config/db');

const getSettings = async () => {
    try {
        const settings = db.prepare('SELECT * FROM settings').all();
        return Object.fromEntries(settings.map(s => [s.key, JSON.parse(s.value)]));
    } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
    }
}

const updateSettings = async (payload) => {
    try {
        const update = db.prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?');
        for (const [key, value] of Object.entries(payload)) {
            update.run(JSON.stringify(value), key);
        }
        return true;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

module.exports = {
    getSettings,
    updateSettings
}