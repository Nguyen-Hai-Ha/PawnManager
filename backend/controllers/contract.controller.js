const { json } = require('express');
const { Contract, Collaterals, Relative, Image, PaymentSchedules, Transactions, AuditLogs, Customer, Template, ContractHistory } = require('../models');
const { generateContractDoc } = require('../services/DocumentService');
const dayjs = require('dayjs');
const  { doReadNumber }  = require('read-vietnamese-number');
const ExcelJS = require('exceljs');
const ContractService = require('../services/contract.service');

const ContractController = {
    getAll: (req, res) => {
        try {
            const contracts = Contract.getAll();
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getByIdContractType: (req, res) => {
        try {
            const contracts = Contract.getByIdContractType(req.params.id);
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const contract = Contract.getById(req.params.id);
            const collateral = Collaterals.getByContractId(req.params.id);
            const relative = Relative.getByIdCustomer(contract.id_customer);
            const paymentSchedules = PaymentSchedules.getPaymentHasPaid(req.params.id);
            const transactions = Transactions.getHistoryReducePrincipal(req.params.id);
            const customer = Customer.getById(contract.id_customer);
            res.json({ contract, collateral, relative, paymentSchedules, transactions, customer });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPaymentDetails: (req, res) => {
        try {
            const paymentDetails = Contract.getPaymentDetails(req.params.id);
            const contract = Contract.getById(req.params.id);
            const customer = Customer.getById(contract.id_customer);
            res.json({ paymentDetails, contract, customer });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getSettlementDetail: (req, res) => {
        try {
            const result = ContractService.getSettlementService(req.params.id)

            res.json(result);
        } catch (error) {
            const statusCode = error.status || 500;
            res.status(statusCode).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const dataContract = req.body.contract ? JSON.parse(req.body.contract) : null;
            const dataStaff = req.body.staff ? JSON.parse(req.body.staff) : null;
            
            if (!dataContract) {
                return res.status(400).json({ error: 'Data is required' });
            }
            const dataCollateral = req.body.collateral ? JSON.parse(req.body.collateral) : null;
            const dataRelatives = req.body.relatives ? JSON.parse(req.body.relatives) : null;

            const result = ContractService.createContract(
                dataContract, 
                dataStaff, 
                dataCollateral, 
                dataRelatives, 
                req.files
            )
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const staff = Contract.getStaffByIdContract(req.params.id);
            AuditLogs.create({
                action: 'Xóa hợp đồng',
                details: `Hợp đồng ${req.params.id} đã được xóa bởi nhân viên ${staff.staff_name}`,
                id_staff: staff.id_staff,
            });
            const contractHistory = ContractHistory.deleteByContractId(req.params.id);
            const transaction = Transactions.deleteByContractId(req.params.id);
            const paymentSchedules = PaymentSchedules.deleteByContractId(req.params.id);
            const images = Image.deleteByCollateralId(req.params.id);
            const collateral = Collaterals.deleteByContractId(req.params.id);
            const contract = Contract.delete(req.params.id);
            
            res.json({ contract, paymentSchedules, collateral, transaction, images, contractHistory });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    printReceipt: (req, res) => {
        try {
            const { id } = req.params;
            const { id_template } = req.query;

            const { buf, fileName } = ContractService.printReceiptService(id, id_template);
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
                'Content-Length': buf.length
            });
            res.send(buf);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    exportExcel: async(req, res) => {
        try {
            const { id_contract_type } = req.query;

            const buffer = await ContractService.exportExcelService(id_contract_type);
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="DanhSachHopDong.xlsx"`,
                'Content-Length': buffer.length
            });

            res.send(buffer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    importExcel: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({message: "không tìm thấy file tải lên"})
            }
            // ID phân loại hợp đồng từ client
            const id_contract_type = req.body.id_contract_type || 1; 

            const file = req.file;

            const result = await ContractService.importExcelService(file, id_contract_type);

            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi import excel:", error);
            res.status(500).json({ error: error.message });
        }
    },
    countContractOverDate: (req, res) => {
        try {
            const count = Contract.countContractOverDate();
            res.status(200).json(count);
        } catch (error) {
            console.error("Lỗi khi đếm hợp đồng quá hạn:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContractController;