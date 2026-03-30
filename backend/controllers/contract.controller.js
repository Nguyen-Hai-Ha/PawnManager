const { json } = require('express');
const { Contract, Collaterals, Relative, Image, PaymentSchedules, Transactions, AuditLogs, Customer } = require('../models');
const generateContractDoc = require('../services/DocumentService');
const dayjs = require('dayjs');

const ContractController = {
    getAll: (req, res) => {
        try {
            const contracts = Contract.getAll();
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const contract = Contract.getById(req.params.id);
            const collateral = Collaterals.getByContractId(req.params.id);
            // const relative = Relative.getById(req.params.id);
            const paymentSchedules = PaymentSchedules.getByContractId(req.params.id);
            const transactions = Transactions.getByContractId(req.params.id);
            const customer = Customer.getById(contract.id_customer);
            res.json({ contract, collateral, paymentSchedules, transactions, customer });
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
    create: (req, res) => {
        try {
            const dataContract = req.body.contract;
            const dataCollateral = JSON.parse(req.body.collateral);
            const dataStaff = req.body.staff;
            let dataRelative = null;
            let dataImage = null;
            if (req.body.relative) {
                dataRelative = req.body.relative;
                const relative = Relative.create(dataRelative);
            }

            if (req.body.images){
                dataImage = req.body.images;
                const images = Image.create(dataImage);
            }
            
            if (!dataContract || !dataCollateral) {
                return res.status(400).json({ error: 'Data is required' });
            }

            const contract = Contract.create(dataContract);
            dataCollateral.id_contract = contract.id;
            const collateral = Collaterals.create(dataCollateral);

            const transaction = Transactions.create({
                amount: dataContract.loan_amount,
                other_fees: 0,
                id_contract: contract.id,
                id_transaction_type: 1,
                id_staff: dataStaff.id,
                id_schedule: null
            });

            const auditLog = AuditLogs.create({
                action: 'Tạo hợp đồng',
                details: `Tạo hợp đồng ${contract.id} với số tiền ${dataContract.loan_amount} bởi nhân viên ${dataStaff.id}`,
                id_staff: dataStaff.id
            });

            let paymentSchedule = [];
            // Tạo hợp đồng theo ngày
            if (dataContract.term_unit == "Ngày") {
                // tính lãi mỗi kỳ chia theo ngày
                let interestAmount = 0;
                // nếu là lãi theo %
                // percent*term: lãi mỗi kỳ VD: 30tr x 5% = 1tr5 cho 1 kỳ
                // percent/term: lãi mỗi kỳ chia cho số kỳ VD: 30tr x 5% = 1tr5 tổng lãi chia cho 3 kỳ = 500k/kỳ
                // daily_amount: lãi mỗi ngày nhân với số ngày VD: lãi 50k/ngày nhân với số ngày 
                if (dataContract.interest_type === "percent*term") {
                    interestAmount = dataContract.loan_amount * dataContract.interest_rate / 100;
                } else if (dataContract.interest_type === "percent/term") {
                    interestAmount = (dataContract.loan_amount * (dataContract.interest_rate / 100)) / dataContract.total_periods;
                } else if (dataContract.interest_type === "daily_amount") {
                    interestAmount = dataContract.interest_rate * (dataContract.payment_term * dataContract.total_periods);
                }

                // tính ngày trả cho từng kỳ
                const startDate = new Date(dataContract.start_date);
                const paymentTerm = parseInt(dataContract.payment_term);
                let totalPeriods = parseInt(dataContract.total_periods);

                let principalAmount = 0;
                // tiền gốc mỗi kỳ chỉ áp dụng cho HĐ trả góp
                if (dataContract.id_contract_type == 3) {
                    principalAmount = dataContract.loan_amount / dataContract.total_periods;
                }

                // lưu tạm thời cho kỳ đầu tiên

                let prevExpectedDate = startDate;
                for (let i = 1; i <= totalPeriods; i++) {
                    let expectedDate = new Date(startDate);
                    expectedDate.setDate(expectedDate.getDate() + (i * paymentTerm));
                    const formattedDate = expectedDate.toISOString().split('T')[0];

                    let currentFromDate;
                    if (i === 1) {
                        currentFromDate = startDate.toISOString().split('T')[0];
                    } else {
                        currentFromDate = dayjs(prevExpectedDate).add(1, 'day').format('YYYY-MM-DD');
                    }

                    PaymentSchedules.create({
                        id_contract: contract.id,
                        period_number: i,
                        from_date: currentFromDate,
                        expected_date: formattedDate,
                        is_paid: 0,
                        interest_amount: interestAmount,
                        principal_amount: principalAmount
                    });

                    prevExpectedDate = dayjs(formattedDate).add(1, 'day').format('YYYY-MM-DD');

                    // i = kỳ cuối cùng và tạo thêm 1 kỳ nữa cho hợp đồng cầm đồ và trả góp thì tiền gốc = tiền vay, tiền lãi = 0
                    if (i == totalPeriods && (dataContract.id_contract_type == 1 || dataContract.id_contract_type == 2)) {
                        PaymentSchedules.create({
                            id_contract: contract.id,
                            period_number: i + 1,
                            from_date: formattedDate,
                            expected_date: formattedDate,
                            interest_amount: 0,
                            principal_amount: dataContract.loan_amount,
                            is_paid: 0
                        });
                    }
                }
            }
            // tạo hợp đồng theo tháng
            else if (dataContract.term_unit == "Tháng") {
                // tính ngày trả cho từng kỳ
                const startDate = new Date(dataContract.start_date);
                const totalPeriods = dataContract.total_periods;

                // hàm tính số ngày giữa 2 tháng
                const countDaysBetween = (startDate, endDate) => {
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    // Tính khoảng cách
                    const diffInMs = end - start;

                    // Đổi sang ngày (1 ngày = 24h * 60p * 60s * 1000ms)
                    return Math.round(diffInMs / (1000 * 60 * 60 * 24));
                };

                let principalAmount = 0;
                // tiền gốc mỗi kỳ chỉ áp dụng cho HĐ trả góp
                if (dataContract.id_contract_type == 3) {
                    principalAmount = dataContract.loan_amount / dataContract.total_periods;
                }

                // lưu tạm thời cho kỳ đầu tiên
                let currentFromDate = dataContract.start_date;

                for (let i = 1; i <= totalPeriods; i++) {
                    let expectedDate = new Date(startDate);
                    expectedDate.setMonth(expectedDate.getMonth() + i);

                    // Xử lý trường hợp ngày trong HĐ là tháng kia có ngày 31 mà tháng đó không có ngày 31 thì ta sẽ lấy ngày cuối cùng của tháng đó
                    if (expectedDate.getDate() != startDate.getDate()) {
                        expectedDate.setDate(0);
                    }
                    // format lại cho chuẩn sqlite
                    const formattedDate = expectedDate.toISOString().split('T')[0];

                    let daysInThisMonth = countDaysBetween(startDate, expectedDate);

                    // tính lãi mỗi kỳ chia theo ngày
                    let interestAmount = 0;
                    // nếu là lãi theo %
                    // percent*term: lãi mỗi kỳ VD: 30tr x 5% = 1tr5 cho 1 kỳ
                    // percent/term: lãi mỗi kỳ chia cho số kỳ VD: 30tr x 5% = 1tr5 tổng lãi chia cho 3 kỳ = 500k/kỳ
                    // daily_amount: lãi mỗi ngày nhân với số ngày VD: lãi 50k/ngày nhân với số ngày 
                    if (dataContract.interest_type === "percent*term") {
                        interestAmount = dataContract.loan_amount * dataContract.interest_rate / 100;
                    } else if (dataContract.interest_type === "percent/term") {
                        interestAmount = (dataContract.loan_amount * dataContract.interest_rate / 100) / dataContract.payment_term;
                    } else if (dataContract.interest_type === "daily_amount") {
                        interestAmount = dataContract.interest_rate * daysInThisMonth;
                    }

                    paymentSchedule = PaymentSchedules.create({
                        id_contract: contract.id,
                        period_number: i,
                        from_date: currentFromDate,
                        expected_date: formattedDate,
                        is_paid: 0,
                        interest_amount: interestAmount,
                        principal_amount: principalAmount
                    });

                    // sang kỳ tiếp theo thì ngày bắt đầu = ngày kết thúc kỳ trước + 1 ngày
                    currentFromDate = dayjs(formattedDate).add(1, 'day').format('YYYY-MM-DD');

                    // i = kỳ cuối cùng và tạo thêm 1 kỳ nữa cho hợp đồng cầm đồ và trả góp thì tiền gốc = tiền vay, tiền lãi = 0
                    if (i == totalPeriods && (dataContract.id_contract_type == 1 || dataContract.id_contract_type == 2)) {
                        PaymentSchedules.create({
                            id_contract: contract.id,
                            period_number: i + 1,
                            from_date: formattedDate,
                            expected_date: formattedDate,
                            interest_amount: 0,
                            principal_amount: dataContract.loan_amount,
                            is_paid: 0
                        });
                    }
                }
            }

            // const image = Image.create(dataImage);
            res.json({ contract, collateral, paymentSchedule, transaction, auditLog });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const paymentSchedules = PaymentSchedules.deleteByContractId(req.params.id);
            const collateral = Collaterals.deleteByContractId(req.params.id);
            const contract = Contract.delete(req.params.id);
            res.json({ contract, paymentSchedules, collateral });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    print: (req, res) => {
        try {
            const { id } = req.params;
            const contract = Contract.getDetailForPrint(id);
            const filePath = generateContractDoc(contract);
            res.download(filePath, (err) => {
                if (err) {
                    if (!res.headersSent) {
                        res.status(500).json({ error: err.message });
                    }
                }

            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContractController;