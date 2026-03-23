const { Contract, Collateral, Relative, Image, PaymentSchedules, Transactions } = require('../models');

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
            const collateral = Collateral.getByContractId(req.params.id);
            const relative = Relative.getById(req.params.id);
            const paymentSchedules = PaymentSchedules.getById(req.params.id);
            const transactions = Transactions.getByContractId(req.params.id);
            res.json({ contract, collateral, relative, paymentSchedules, transactions });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const dataContract = req.body.contract;
            const dataCollateral = req.body.collateral;
            let dataRelative = null;
            let dataImage = null;
            if (req.body.relative && req.body.image) {
                dataRelative = req.body.relative;
                dataImage = req.body.image;
                const collateral = Collateral.create(dataCollateral);
                const relative = Relative.create(dataRelative);
                const image = Image.create(dataImage);
            }

            if (!dataContract || !dataCollateral) {
                return res.status(400).json({ error: 'Data is required' });
            }

            // Tạo hợp đồng theo ngày
            if(dataContract.term_unit == "Ngày") {
                // tính lãi mỗi kỳ chia theo ngày
                let interestAmount = 0;
                // nếu là lãi theo %
                // percent*term: lãi mỗi kỳ VD: 30tr x 5% = 1tr5 cho 1 kỳ
                // percent/term: lãi mỗi kỳ chia cho số kỳ VD: 30tr x 5% = 1tr5 tổng lãi chia cho 3 kỳ = 500k/kỳ
                // daily_amount: lãi mỗi ngày nhân với số ngày VD: lãi 50k/ngày nhân với số ngày 
                if(dataContract.interest_type === "percent*term"){
                    interestAmount = dataContract.loan_amount * dataContract.interest_rate / 100;
                } else if(dataContract.interest_type === "percent/term"){
                    interestAmount = (dataContract.loan_amount * dataContract.interest_rate / 100) / dataContract.payment_term;
                } else if(dataContract.interest_type === "daily_amount"){
                    interestAmount = dataContract.interest_rate * dataContract.payment_term;
                }
                
                // tính ngày trả cho từng kỳ
                const startDate = new Date(dataContract.start_date);
                const paymentTerm = parseInt(dataContract.payment_term);
                const totalPeriods = parseInt(dataContract.total_periods);

                let principalAmount = 0;
                // tiền gốc mỗi kỳ chỉ áp dụng cho HĐ trả góp
                if(dataContract.id_contract_type == 3 ) {
                    principalAmount = dataContract.loan_amount / dataContract.payment_term;
                }

                for (let i = 1; i <= totalPeriods; i++) {
                    let expectedDate = new Date(startDate);
                    // lấy ngày bắt đầu cộng với (i nhân với số ngày trả theo kỳ)
                    expectedDate.setDate(expectedDate.getDate() + (i * paymentTerm));

                    // Định dạng lại thành YYYY-MM-DD để lưu vào SQLite
                    const formattedDate = expectedDate.toISOString().split('T')[0];

                    const paymentSchedule = PaymentSchedules.create({
                        id_contract: dataContract.id,
                        period_number: i,
                        expected_date: formattedDate,
                        is_paid: 0,
                        interest_amount: interestAmount,
                        principal_amount: principalAmount
                    });
                }
            } 
            // tạo hợp đồng theo tháng
            else if(dataContract.term_unit == "Tháng") {
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
                if(dataContract.id_contract_type == 3 ) {
                    principalAmount = dataContract.loan_amount / dataContract.payment_term;
                }

                for( let  i = 1; i <= totalPeriods; i++){
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
                    if(dataContract.interest_type === "percent*term"){
                        interestAmount = dataContract.loan_amount * dataContract.interest_rate / 100;
                    } else if(dataContract.interest_type === "percent/term"){
                        interestAmount = (dataContract.loan_amount * dataContract.interest_rate / 100) / dataContract.payment_term;
                    } else if(dataContract.interest_type === "daily_amount"){
                        interestAmount = dataContract.interest_rate * daysInThisMonth;
                    } 
                    
                    const paymentSchedule = PaymentSchedules.create({
                        id_contract: dataContract.id,
                        period_number: i,
                        expected_date: formattedDate,
                        is_paid: 0,
                        interest_amount: interestAmount,
                        principal_amount: principalAmount
                    });
                }
            }
            const contract = Contract.create(dataContract);
            res.json(contract);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const contract = Contract.delete(req.params.id);
            res.json(contract);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContractController;