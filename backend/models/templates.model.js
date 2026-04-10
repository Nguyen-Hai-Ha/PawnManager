const db = require('../config/database');

const Template = {
    getAll: () => {
        return db.prepare('SELECT * FROM templates').all();
    },
    getById: (id) => {
        return db.prepare('SELECT * FROM templates WHERE id = ?').get(id);
    },
    create: (data) => {
        return db.prepare('INSERT INTO templates (name_file, file_path, type, active) VALUES (?, ?, ?, ?)').run(data.name_file, data.file_path, data.type, data.active);
    },
    update: (id, data) => {
        return db.prepare('UPDATE templates SET name_file = ?, file_path = ?, type = ?, active = ? WHERE id = ?').run(data.name_file, data.file_path, data.type, data.active, id);
    },
    delete: (id) => {
        return db.prepare('DELETE FROM templates WHERE id = ?').run(id);
    }
}

module.exports = Template;