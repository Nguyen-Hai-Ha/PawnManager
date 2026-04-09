const { Template } = require("../models");


const SettingController = {
    getAllTemplates : (req, res) => {
        try {
            const templates = Template.getAll();
            res.status(200).json(templates);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createTemplates : (req, res) => {
        try {
            const Templetas = {
                name_file : req.body.name_file,
                file_path : '/templates/' + req.file.filename,
                active : req.body.active,
                type : req.body.type
            }

            const template = Template.create(Templetas);
            res.status(200).json(template);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = SettingController