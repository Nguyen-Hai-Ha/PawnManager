const { Image } = require('../models');

const ImageController = {
    create: (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const imageId = Image.create({ 
            url: imageUrl, 
            id_collateral: req.body.id_collateral 
        });
        res.json({ success: true, id: imageId, url: imageUrl });
    },
    update: (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const image = Image.update(req.params.id, { url: imageUrl });
        res.json({ success: true, url: imageUrl });
    },
    delete: (req, res) => {
        const image = Image.delete(req.params.id);
        res.json(image);
    }
}

module.exports = ImageController;
