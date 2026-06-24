const { json } = require('express');
const { Contract, Collaterals, Relative, Image, PaymentSchedules, Transactions, AuditLogs, Customer, Template, ContractHistory } = require('../models');
const { generateContractDoc } = require('./DocumentService');
const dayjs = require('dayjs');
const  { doReadNumber }  = require('read-vietnamese-number');
const ExcelJS = require('exceljs');

const ContractService = {
    getSettlementService: (id) => {
        const contract = Contract.getById(id);
        if (!contract) {
            const error = new Error('Hợp đồng không tồn tại');
            error.status = 404;
            throw error;
        }

        const customer = Customer.getById(contract.id_customer);
        const startDate = dayjs(contract.start_date).startOf('day');
        const today = dayjs().startOf('day');
        
        let dayCount = today.diff(startDate, 'day');
        if (dayCount <= 0) dayCount = 1;

        let interestPerDay = 0;
        const loan = contract.loan_amount;
        const rate = contract.interest_rate / 100;

        if (contract.interest_type === "daily_amount") {
            interestPerDay = contract.interest_rate;
        } 
        else if (contract.interest_type === "percent/term") {
            // Lãi % mỗi kỳ (thường 1 kỳ = 30 ngày)
            interestPerDay = (loan * rate) / 30;
        } 
        else if (contract.interest_type === "percent*term") {
            // Lãi % nhân tổng số kỳ (Ví dụ trả góp)
            interestPerDay = ((loan * rate) * contract.total_periods) / (contract.total_periods * 30);
        }

        const interestTotalToday = Math.round(interestPerDay * dayCount);

        const history = Transactions.getHistoryPayment(id);
        const totalPaidSoFar = history.reduce((acc, item) => acc + item.amount, 0);

        const totalBill = interestTotalToday + contract.loan_amount;
        const totalRemaining = totalBill - totalPaidSoFar;

        return { 
            contract,
            customer,
            total_pay: totalBill,               
            total_remaining: totalRemaining,    
            total_interest_paid: totalPaidSoFar, 
            day_count: dayCount,                
        };
    }
}

module.exports = ContractService;