const { Template, AuditLogs } = require("../models");
const { downloadTemplateDoc } = require('../services/DocumentService');


const SettingController = {
    getAllTemplates : (req, res) => {
        const templates = Template.getAll();
        res.status(200).json(templates);
    },
    getTemplateById : (req, res) => {
        const template = Template.getById(req.params.id);
        res.status(200).json(template);
    },
    createTemplates : (req, res) => {
        const Templetas = {
            name_file : req.body.name_file,
            file_path : '/templates/' + req.file.filename,
            active : req.body.active,
            type : req.body.type
        }

        const log = AuditLogs.create({
            action: 'Thêm mới mẫu hợp đồng',
            details: `Thêm mới mẫu hợp đồng ${Templetas.name_file} bởi admin`,
            id_staff: 1,
        });

        const template = Template.create(Templetas);
        res.status(200).json(template);
    },
    updateTemplate : (req, res) => {
        const Templetas = {
            name_file : req.body.name_file,
            file_path : req.file ? '/templates/' + req.file.filename : req.body.existing_file_path,
            active : req.body.active,
            type : req.body.type
        }

        const log = AuditLogs.create({
            action: 'Cập nhật mẫu hợp đồng',
            details: `Cập nhật mẫu hợp đồng ${Templetas.name_file} bởi admin`,
            id_staff: 1,
        });

        const template = Template.update(req.params.id, Templetas);
        res.status(200).json(template);
    },
    deleteTemplate : (req, res) => {
        const template = Template.getById(req.params.id);
        const log = AuditLogs.create({
            action: 'Xóa mẫu hợp đồng',
            details: `Xóa mẫu hợp đồng ${template.name_file} bởi admin`,
            id_staff: 1,
        });

        const templatedelete = Template.delete(req.params.id);

        res.status(200).json(templatedelete);
    },
    downLoadTemplate: (req, res) => {
        const { id } = req.params;
        const template = Template.getById(id);
        const { buf, fileName } = downloadTemplateDoc(template);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
            'Content-Length': buf.length
        });
        res.send(buf);
    }
}
module.exports = SettingController