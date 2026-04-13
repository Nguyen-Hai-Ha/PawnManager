const { json } = require('express');
const { Contract, Collaterals, Relative, Image, PaymentSchedules, Transactions, AuditLogs, Customer, Template } = require('../models');
const { generateContractDoc } = require('../services/DocumentService');
const dayjs = require('dayjs');
const  { doReadNumber }  = require('read-vietnamese-number');
const ExcelJS = require('exceljs');

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
            const contract = Contract.getById(req.params.id);
            if (!contract) {
                return res.status(404).json({ error: 'Hợp đồng không tồn tại' });
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

            const interestTotalToday = Math.ceil(interestPerDay * dayCount);

            const history = Transactions.getHistoryPayment(req.params.id);
            const totalPaidSoFar = history.reduce((acc, item) => acc + item.amount, 0);

            const totalBill = interestTotalToday + contract.loan_amount;
            const totalRemaining = totalBill - totalPaidSoFar;

            res.json({ 
                contract,
                customer,
                total_pay: totalBill,               
                total_remaining: totalRemaining,    
                total_interest_paid: totalPaidSoFar, 
                day_count: dayCount,                
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const dataContract = JSON.parse(req.body.contract);
            const dataStaff = JSON.parse(req.body.staff);

            if (!dataContract) {
                return res.status(400).json({ error: 'Data is required' });
            }

            dataContract.id_staff = dataStaff.id;
            const contract = Contract.create(dataContract);
            let dataCollateral = null;
            let dataRelatives = null;
            let collateral = null;

            if (req.body.collateral) {
                dataCollateral = JSON.parse(req.body.collateral);
                dataCollateral.id_contract = contract.id;
                collateral = Collaterals.create(dataCollateral);
                AuditLogs.create({
                    action: 'Thêm mới tài sản cầm cố',
                    details: `Tạo tài sản cầm cố ${collateral.name} với hợp đồng ${contract.id} bởi nhân viên ${dataStaff.id}`,
                    id_staff: dataStaff.id,
                    
                });
            }
            if (req.body.relatives) {
                // FE gửi mảng 2 người
                dataRelatives = req.body.relatives
                const relatives = JSON.parse(dataRelatives);
                relatives.forEach(item => {
                    if (item.name && item.name.trim() !== '') {
                        Relative.create({ ...item, id_customer: dataContract.id_customer });
                    }
                });
            }

            if (collateral && req.files && req.files.length > 0) {
                req.files.forEach(file => {
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
                    interestAmount = Math.ceil(dataContract.loan_amount * dataContract.interest_rate / 100);
                } else if (dataContract.interest_type === "percent/term") {
                    interestAmount = Math.ceil((dataContract.loan_amount * (dataContract.interest_rate / 100)) / dataContract.total_periods);
                } else if (dataContract.interest_type === "daily_amount") {
                    interestAmount = Math.ceil(dataContract.interest_rate * dataContract.payment_term);
                }

                // tính ngày trả cho từng kỳ
                const startDate = new Date(dataContract.start_date);
                const paymentTerm = parseInt(dataContract.payment_term);
                let totalPeriods = parseInt(dataContract.total_periods);

                let principalAmount = 0;
                // tiền gốc mỗi kỳ chỉ áp dụng cho HĐ trả góp
                if (dataContract.id_contract_type == 3) {
                    principalAmount = Math.ceil(dataContract.loan_amount / dataContract.total_periods);
                }

                // lưu tạm thời cho kỳ đầu tiên

                let currentFromDate = dataContract.start_date;
                for (let i = 1; i <= totalPeriods; i++) {
                    let expectedDate = new Date(startDate);
                    expectedDate.setDate(expectedDate.getDate() + (i * paymentTerm));
                    const formattedDate = expectedDate.toISOString().split('T')[0];

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
                    principalAmount = Math.ceil(dataContract.loan_amount / dataContract.total_periods);
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

                    let daysInThisMonth = countDaysBetween(currentFromDate, expectedDate);

                    // tính lãi mỗi kỳ chia theo ngày
                    let interestAmount = 0;
                    // nếu là lãi theo %
                    // percent*term: lãi mỗi kỳ VD: 30tr x 5% = 1tr5 cho 1 kỳ
                    // percent/term: lãi mỗi kỳ chia cho số kỳ VD: 30tr x 5% = 1tr5 tổng lãi chia cho 3 kỳ = 500k/kỳ
                    // daily_amount: lãi mỗi ngày nhân với số ngày VD: lãi 50k/ngày nhân với số ngày 
                    if (dataContract.interest_type === "percent*term") {
                        interestAmount = Math.ceil(dataContract.loan_amount * (dataContract.interest_rate / 100));
                    } else if (dataContract.interest_type === "percent/term") {
                        interestAmount = Math.ceil((dataContract.loan_amount * (dataContract.interest_rate / 100) / dataContract.total_periods));
                    } else if (dataContract.interest_type === "daily_amount") {
                        interestAmount = Math.ceil(dataContract.interest_rate * daysInThisMonth);
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

            // const image = Image.create(dataImage);
            res.json({ contract, paymentSchedule, transaction, auditLog });
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
            const transaction = Transactions.deleteByContractId(req.params.id);
            const paymentSchedules = PaymentSchedules.deleteByContractId(req.params.id);
            const collateral = Collaterals.deleteByContractId(req.params.id);
            const images = Image.deleteByCollateralId(req.params.id);
            const contract = Contract.delete(req.params.id);
            
            res.json({ contract, paymentSchedules, collateral, transaction, images });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    printReceipt: (req, res) => {
        try {
            const { id } = req.params;
            const { id_template } = req.query;
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

            // số tiền bằng chữ
            const interestText = doReadNumber(String(contract.interest)) + " đồng";
            contract.interest_text = interestText.charAt(0).toUpperCase() + interestText.slice(1);

            // kiểu lãi
            const Interest_type = contract.Interest_type === "percent*term" ? "Lãi suất định kỳ" : contract.Interest_type === "percent/term" ? "Lãi suất chia đều" : "Lãi suất hàng ngày";
            contract.Interest_type = Interest_type;

            // lãi suất
            const Interest_rate = contract.Interest_type === "daily_amount" ? contract.Interest_rate.toLocaleString('vi-VN') + " đồng/ngày" : contract.Interest_rate + "%";

            contract.Interest_rate = Interest_rate;

            const { buf, fileName } = generateContractDoc(contract, template);
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
                'Content-Length': buf.length
            });
            AuditLogs.create({
                action: 'In hợp đồng',
                details: `In hợp đồng ${contract.Code} bởi nhân viên ${contract.staff_name}`,
                id_staff: contract.id_staff,
            });
            res.send(buf);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    exportExcel: async (req, res) => {
        try {
            const { id_contract_type } = req.query;
            const contracts = Contract.getByIdContractType(id_contract_type);
            
            // Hàm tiện ích format tiền
            const formatMoney = (amount) => {
                if (!amount) return '0 ₫';
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
            };

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Danh sách hợp đồng');

            // Định nghĩa cột (ExcelJS dùng header, key và width)
            worksheet.columns = [
                { header: 'Mã HĐ', key: 'code', width: 15 },
                { header: 'Tên KH', key: 'customer_name', width: 25 },
                { header: 'Số điện thoại', key: 'customer_phone', width: 15 },
                { header: 'Số CCCD', key: 'customer_cccd', width: 18 },
                { header: 'Địa chỉ', key: 'customer_address', width: 30 },
                { header: 'Ngày sinh', key: 'customer_birth_date', width: 15 },
                { header: 'Số tiền vay', key: 'loan_amount', width: 18 },
                { header: 'Lãi suất', key: 'interest_rate_display', width: 18 },
                { header: 'Ngày bắt đầu', key: 'start_date', width: 15 },
                { header: 'Ngày kết thúc', key: 'end_date', width: 15 },
                { header: 'Số kỳ', key: 'total_periods', width: 10 },
                { header: 'Trạng thái', key: 'status', width: 18 },
                { header: 'Loại HĐ', key: 'contract_type_name', width: 15 },
                { header: 'Tên tài sản', key: 'collateral_name', width: 25 },
                { header: 'Số tiền đã trả', key: 'had_paid', width: 18 },
                { header: 'Số tiền còn lại', key: 'remaining_amount', width: 18 }
            ];

            // Thêm dữ liệu vào worksheet
            contracts.forEach(contract => {
                worksheet.addRow({
                    code: contract.code,
                    customer_name: contract.customer_name,
                    customer_phone: contract.customer_phone,
                    customer_cccd: contract.customer_cccd,
                    customer_address: contract.customer_address,
                    customer_birth_date: contract.customer_birth_date,
                    loan_amount: formatMoney(contract.loan_amount),
                    interest_rate_display: contract.interest_type === 'daily_amount' ? formatMoney(contract.interest_rate) + '/ngày' : contract.interest_rate + '%',
                    start_date: contract.start_date,
                    end_date: contract.end_date,
                    total_periods: contract.total_periods,
                    status: contract.status,
                    contract_type_name: contract.contract_type_name,
                    collateral_name: contract.collateral_name || 'Không có',
                    had_paid: formatMoney(contract.had_paid),
                    remaining_amount: formatMoney(contract.remaining_amount)
                });
            });

            // Định dạng header (Dòng 1)
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '1A7A6E' } // Màu xanh đậm
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Kẻ viền và căn lề cho tất cả các ô dữ liệu
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // Bỏ qua dòng header đã style ở trên
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    });
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="DanhSachHopDong.xlsx"`,
                'Content-Length': buffer.length
            });

            AuditLogs.create({
                action: 'Export hợp đồng',
                details: `Export ${contracts.length} hợp đồng loại ${id_contract_type} bởi admin`,
                id_staff: 1,
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

            const workbook = new ExcelJS.Workbook();
            // Đọc file từ đường dẫn lưu tạm trên ổ cứng (req.file.path) thay vì buffer
            await workbook.xlsx.readFile(req.file.path);
            
            // Đọc xong thì xoá file tạm đi cho đỡ nặng máy
            const fs = require('fs');
            fs.unlinkSync(req.file.path);

            const worksheet = workbook.getWorksheet(1);
            const contracts = [];
            
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const customer_name = row.getCell('B').text.trim();
                    if (!customer_name) return; 

                    const contract = {
                        code: row.getCell('A').text,
                        customer_name: customer_name,
                        customer_phone: row.getCell('C').text,
                        customer_email: row.getCell('D').text,
                        customer_cccd: row.getCell('E').text,
                        customer_address: row.getCell('F').text,
                        customer_birth_date: row.getCell('G').text,
                        loan_amount: row.getCell('H').text,
                        interest_rate: row.getCell('I').text,
                        start_date: row.getCell('J').text,
                        end_date: row.getCell('K').text,
                        total_periods: row.getCell('L').text,
                        status: row.getCell('M').text,
                        collateral_name: row.getCell('N').text,
                        collateral_code: row.getCell('O').text,
                        collateral_metadata: row.getCell('P').text,
                        collateral_type: row.getCell('Q').text,
                    };
                    contracts.push(contract);
                }
            });
            
            // Lấy trước tất cả khách hàng để kiểm tra xem đã tồn tại chưa (tránh query lặp lại nhiều lần)
            const allCustomers = Customer.getAll();

            for (const data of contracts) {
                // Chuyển về số điện thoại hoặc cccd dạng chuỗi để so sánh
                const phone = String(data.customer_phone || '').trim();
                const cccd = String(data.customer_cccd || '').trim();
                
                // Chỉ map với khách hàng cũ nếu có thông tin SĐT hoặc CCCD hợp lệ (tránh việc so sánh chuỗi rỗng '' === '')
                let existCustomer = allCustomers.find(c => 
                    (cccd !== '' && c.cccd === cccd) || 
                    (phone !== '' && c.phone === phone)
                );
                let id_customer = null;

                if (existCustomer) {
                    id_customer = existCustomer.id;
                } else {
                    // Nếu chưa có thì tạo mới
                    const newCustomer = Customer.create({
                        name: data.customer_name,
                        phone: phone,
                        address: data.customer_address,
                        cccd: cccd,
                        birth_date: data.customer_birth_date,
                        images_cccd: null
                    });
                    id_customer = newCustomer.id;
                    // Đẩy vào mảng cục bộ để dòng sau đọc Excel có trùng thì không tạo mới nữa
                    allCustomers.push({ ...data, phone: phone, cccd: cccd, id: id_customer });
                }

                const loan_amount = Number(String(data.loan_amount || "0").replace(/[^0-9]/g, "")) || 0;
                let interest_rate = data.interest_rate;
                if (typeof interest_rate === 'string') {
                    interest_rate = Number(interest_rate.replace(/[^0-9.]/g, "")) || 0;
                }
                const total_periods = Number(data.total_periods) || 1;

                const newContract = Contract.create({
                    code: data.code,
                    loan_amount: loan_amount,
                    interest_rate: interest_rate,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    payment_term: 1, // Mặc định chu kỳ 1
                    term_unit: "Tháng", // Mặc định đơn vị tháng (để tránh lỗi)
                    total_periods: total_periods,
                    interest_type: "percent/term", // Mặc định lãi phần trăm
                    status: data.status || 'Đang vay',
                    id_customer: id_customer,
                    id_contract_type: id_contract_type,
                    id_staff: 1
                });

                const processMetadata = (metadata) => {
                    if (!metadata) return '{}';
                    const pairs = metadata.split(';');
                    const result = {};
                    pairs.forEach(pair => {
                        const [key, value] = pair.split(':');
                        if (key && value) {
                            result[key.trim()] = value.trim();
                        }
                    });
                    return JSON.stringify(result);
                }

                if (data.collateral_name) {
                    Collaterals.create({
                        code: data.collateral_code,
                        name: data.collateral_name,
                        metadata: processMetadata(data.collateral_metadata),
                        status: 'Đang cầm',
                        id_contract: newContract.id,
                        id_collateral_type: data.collateral_type || 1
                    });
                }

                // 4. Sinh lịch đóng lãi (PaymentSchedules) theo tháng
                const startDate = new Date(data.start_date);
                let currentFromDate = data.start_date;
                let principalAmount = 0;
                
                // Tiền gốc mỗi kỳ chỉ áp dụng cho HĐ trả góp (Loại 3)
                if (id_contract_type == 3) {
                    principalAmount = Math.ceil(loan_amount / total_periods);
                }

                for (let i = 1; i <= total_periods; i++) {
                    let expectedDate = new Date(startDate);
                    expectedDate.setMonth(expectedDate.getMonth() + i);

                    if (expectedDate.getDate() != startDate.getDate()) {
                        expectedDate.setDate(0);
                    }
                    const formattedDate = expectedDate.toISOString().split('T')[0];

                    // Tính Lãi chia đều (percent/term)
                    let interestAmount = Math.ceil((loan_amount * (interest_rate / 100)) / total_periods);

                    PaymentSchedules.create({
                        id_contract: newContract.id,
                        period_number: i,
                        from_date: currentFromDate,
                        expected_date: formattedDate,
                        is_paid: 0,
                        interest_amount: interestAmount,
                        principal_amount: principalAmount
                    });

                    currentFromDate = formattedDate;

                    // Kỳ cuối cùng và tạo thêm 1 kỳ nữa cho hợp đồng cầm đồ và tín chấp (1, 2) thì tiền gốc = tiền vay, tiền lãi = 0
                    if (i == total_periods && (id_contract_type == 1 || id_contract_type == 2)) {
                        PaymentSchedules.create({
                            id_contract: newContract.id,
                            period_number: i + 1,
                            from_date: formattedDate,
                            expected_date: formattedDate,
                            interest_amount: 0,
                            principal_amount: loan_amount,
                            is_paid: 0
                        });
                    }
                }

                // 5. Lưu giao dịch thu chi để hệ thống ghi nhận hợp đồng hợp lệ
                Transactions.create({
                    amount: loan_amount,
                    other_fees: 0,
                    id_contract: newContract.id,
                    id_transaction_type: 1,
                    id_staff: 1,
                    id_schedule: null
                });
            }

            AuditLogs.create({
                action: 'Import hợp đồng',
                details: `Import ${contracts.length} hợp đồng loại ${id_contract_type} bởi admin`,
                id_staff: 1,
            });

            res.status(200).json({ message: `Đã import thành công ${contracts.length} hợp đồng.` });
        } catch (error) {
            console.error("Lỗi khi import excel:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContractController;