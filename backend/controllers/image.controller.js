const { Image } = require('../models');

const ImageController = {
    create: (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const imageUrl = `/uploads/${req.file.filename}`;
            const imageId = Image.create({ 
                url: imageUrl, 
                id_collateral: req.body.id_collateral 
            });
            res.json({ success: true, id: imageId, url: imageUrl });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const imageUrl = `/uploads/${req.file.filename}`;
            const image = Image.update(req.params.id, { url: imageUrl });
            res.json({ success: true, url: imageUrl });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const image = Image.delete(req.params.id);
            res.json(image);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ImageController;
