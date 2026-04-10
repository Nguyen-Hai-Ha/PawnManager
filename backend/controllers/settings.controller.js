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
    getTemplateById : (req, res) => {
        try {
            const template = Template.getById(req.params.id);
            res.status(200).json(template);
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
    },
    updateTemplate : (req, res) => {
        try {
            const Templetas = {
                name_file : req.body.name_file,
                file_path : '/templates/' + req.file.filename,
                active : req.body.active,
                type : req.body.type
            }
            const template = Template.update(req.params.id, Templetas);
            res.status(200).json(template);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteTemplate : (req, res) => {
        try {
            const template = Template.delete(req.params.id);
            res.status(200).json(template);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = SettingController