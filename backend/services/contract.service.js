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
    },
    createContract: (contractData, staffData, collateralData, relativesData, files) => {
        const dataContract = JSON.parse(contractData);
        const dataStaff = JSON.parse(staffData);

        if (!dataContract) {
            return res.status(400).json({ error: 'Data is required' });
        }

        dataContract.id_staff = dataStaff.id;
        const contract = Contract.create(dataContract);
        let dataCollateral = null;
        let dataRelatives = null;
        let collateral = null;

        if (collateralData) {
            dataCollateral = JSON.parse(collateralData);
            dataCollateral.id_contract = contract.id;
            collateral = Collaterals.create(dataCollateral);
            AuditLogs.create({
                action: 'Thêm mới tài sản cầm cố',
                details: `Tạo tài sản cầm cố ${collateral.name} với hợp đồng ${contract.id} bởi nhân viên ${dataStaff.id}`,
                id_staff: dataStaff.id,
                
            });
        }
        if (relativesData) {
            // FE gửi mảng 2 người
            dataRelatives = relativesData
            const relatives = JSON.parse(dataRelatives);
            relatives.forEach(item => {
                if (item.name && item.name.trim() !== '') {
                    Relative.create({ ...item, id_customer: dataContract.id_customer });
                }
            });
        }

        if (collateral && files && files.length > 0) {
            files.forEach(file => {
                const imageUrl = `/uploads/${file.filename}`;
                Image.create({
                    url: imageUrl,
                    id_collateral: collateral.id
                });
            });
        }

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
                interestAmount = Math.round(dataContract.loan_amount * dataContract.interest_rate / 100);
            } else if (dataContract.interest_type === "percent/term") {
                interestAmount = Math.round((dataContract.loan_amount * (dataContract.interest_rate / 100)) / dataContract.total_periods);
            } else if (dataContract.interest_type === "daily_amount") {
                interestAmount = Math.round(dataContract.interest_rate * dataContract.payment_term);
            }

            // tính ngày trả cho từng kỳ
            const startDate = new Date(dataContract.start_date);
            const paymentTerm = parseInt(dataContract.payment_term);
            let totalPeriods = parseInt(dataContract.total_periods);

            let principalAmount = 0;
            // tiền gốc mỗi kỳ chỉ áp dụng cho HĐ trả góp
            if (dataContract.id_contract_type == 3) {
                principalAmount = Math.round(dataContract.loan_amount / dataContract.total_periods);
            }

            // lưu tạm thời cho kỳ đầu tiên

            let currentFromDate = dataContract.start_date;
            for (let i = 1; i <= totalPeriods; i++) {
                let expectedDate = new Date(startDate);
                expectedDate.setDate(expectedDate.getDate() + (i * paymentTerm));
                const formattedDate = dayjs(expectedDate).format('YYYY-MM-DD');

                PaymentSchedules.create({
                    id_contract: contract.id,
                    period_number: i,
                    from_date: currentFromDate,
                    expected_date: formattedDate,
                    is_paid: 0,
                    interest_amount: interestAmount,
                    principal_amount: principalAmount
                });

                // sang kỳ tiếp theo thì ngày bắt đầu = ngày kết thúc kỳ trước
                currentFromDate = formattedDate;

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
                principalAmount = Math.round(dataContract.loan_amount / dataContract.total_periods);
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
                const formattedDate = dayjs(expectedDate).format('YYYY-MM-DD');

                let daysInThisMonth = countDaysBetween(currentFromDate, expectedDate);

                // tính lãi mỗi kỳ chia theo ngày
                let interestAmount = 0;
                // nếu là lãi theo %
                // percent*term: lãi mỗi kỳ VD: 30tr x 5% = 1tr5 cho 1 kỳ
                // percent/term: lãi mỗi kỳ chia cho số kỳ VD: 30tr x 5% = 1tr5 tổng lãi chia cho 3 kỳ = 500k/kỳ
                // daily_amount: lãi mỗi ngày nhân với số ngày VD: lãi 50k/ngày nhân với số ngày 
                if (dataContract.interest_type === "percent*term") {
                    interestAmount = Math.round(dataContract.loan_amount * (dataContract.interest_rate / 100));
                } else if (dataContract.interest_type === "percent/term") {
                    interestAmount = Math.round((dataContract.loan_amount * (dataContract.interest_rate / 100) / dataContract.total_periods));
                } else if (dataContract.interest_type === "daily_amount") {
                    interestAmount = Math.round(dataContract.interest_rate * daysInThisMonth);
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
                currentFromDate = formattedDate;

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

        return { contract, paymentSchedule, transaction, auditLog };
    },
    printReceiptService: (id, id_template) => {
        const template = Template.getById(id_template);
        const contract = Contract.getDetailForPrint(id);
        const countDaysBetween = (startDate, endDate) => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Tính khoảng cách
            const diffInMs = end - start;

            // Đổi sang ngày (1 ngày = 24h * 60p * 60s * 1000ms)
            return Math.round(diffInMs / (1000 * 60 * 60 * 24));
        };

        // số ngày
        const total_days = countDaysBetween(contract.Start_date, contract.End_date);
        contract.total_days = total_days;

        // tổng lãi
        const paymentSchedules = PaymentSchedules.getByContractId(id);
        contract.interest = paymentSchedules.reduce((acc, item) => acc + item.interest_amount, 0);

        const LoanText = doReadNumber(String(contract.Loan_amount)) + " đồng";
        contract.Loan_amount_text = LoanText.charAt(0).toUpperCase() + LoanText.slice(1);

        // số tiền lãi bằng chữ
        const interestText = doReadNumber(String(contract.interest)) + " đồng";
        contract.interest_text = interestText.charAt(0).toUpperCase() + interestText.slice(1);

        // kiểu lãi
        const Interest_type = contract.Interest_type === "percent*term" ? "Lãi suất định kỳ" : contract.Interest_type === "percent/term" ? "Lãi suất chia đều" : "Lãi suất hàng ngày";
        contract.Interest_type = Interest_type;

        // lãi suất
        const Interest_rate = contract.Interest_type === "daily_amount" ? contract.Interest_rate.toLocaleString('vi-VN') + " đồng/ngày" : contract.Interest_rate + "%";

        contract.Interest_rate = Interest_rate;

        const { buf, fileName } = generateContractDoc(contract, template);
        AuditLogs.create({
            action: 'In hợp đồng',
            details: `In hợp đồng ${contract.Code} bởi nhân viên ${contract.staff_name}`,
            id_staff: contract.id_staff,
        });

        return {buf, fileName};
    }
}

module.exports = ContractService;