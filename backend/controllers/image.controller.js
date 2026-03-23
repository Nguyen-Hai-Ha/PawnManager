const { Image } = require('../models');

const ImageController = {
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
