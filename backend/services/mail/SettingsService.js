const db = require('../../config/database');

const getSettingsInternal = () => {
    const rows = db.prepare(`SELECT * FROM settings`).all();
    const settingsObject = {};
    rows.forEach(row => {
        try {
            settingsObject[row.key] = JSON.parse(row.value);
        } catch (e) {
            settingsObject[row.key] = row.value;
        }
    });
    return settingsObject;
};

const getSettings = (req, res) => {
    try {
        const settings = getSettingsInternal();
        return res.status(200).json(settings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateSettings = (req, res) => {
    try {
        const payload = req.body;
        const updateStmt = db.prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?');
        const transaction = db.transaction((data) => {
            for (const [key, value] of Object.entries(data)) {
                updateStmt.run(JSON.stringify(value), key);
            }
        });
        transaction(payload);
        return res.status(200).json({ message: 'Thành công' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getSettings, updateSettings, getSettingsInternal };
