const { getSettingsInternal } = require('./mail/SettingsService');
const nodemailer = require('nodemailer');
const db = require('../config/database');

const createDynamicTransporter = () => {
    const s = getSettingsInternal();
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: s.email_sender,
            pass: s.email_password 
        }
    });
};

// template thông báo khách hàng có hợp đồng quá hạn
const getReminderOverdueTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 550px; margin: 0 auto; border: 1px solid #ffcdd2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(211, 47, 47, 0.1); }
            .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #ffffff; }
            .alert-box { background-color: #fff5f5; border-left: 5px solid #d32f2f; padding: 15px; margin-bottom: 25px; }
            .amount-table { width: 100%; margin-top: 15px; border-collapse: collapse; }
            .amount-table td { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
            .label { color: #757575; font-size: 14px; }
            .value { font-weight: bold; text-align: right; font-size: 15px; }
            .total-row { color: #d32f2f; font-size: 18px; }
            .btn { display: block; text-align: center; background-color: #d32f2f; color: white !important; padding: 12px; text-decoration: none; border-radius: 6px; margin-top: 25px; font-weight: bold; }
            .footer { background-color: #fafafa; color: #9e9e9e; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #eeeeee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0; font-size: 20px; text-transform: uppercase;">Thông báo Quá hạn Thanh toán</h2>
            </div>
            <div class="content">
                <p>Chào bạn <strong>${data.customer_name}</strong>,</p>
                <div class="alert-box">
                    Hợp đồng của bạn đã <strong>quá hạn thanh toán</strong>. Hệ thống bắt đầu ghi nhận phí phạt trễ hạn kể từ ngày hôm nay.
                </div>

                <table class="amount-table">
                    <tr>
                        <td class="label">Mã hợp đồng:</td>
                        <td class="value">${data.contract_code}</td>
                    </tr>
                    <tr>
                        <td class="label">Tài sản:</td>
                        <td class="value">${data.asset_name}</td>
                    </tr>
                    <tr>
                        <td class="label">Ngày đến hạn:</td>
                        <td class="value">${data.expected_date}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label" style="color: #d32f2f; font-weight: bold;">Tổng tiền cần đóng:</td>
                        <td class="value">${data.interest_amount.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                <p><strong>Dịch vụ quản lý PawnManager</strong></p>
            </div>
        </div>
    </body>
    </html>
    `
}

// template thông báo khách hàng có hợp đồng đến hạn đóng lãi
const getReminderDueTodayTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 550px; margin: 0 auto; border: 1px solid #e3f2fd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background-color: #1a7a6e; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #ffffff; }
            .summary-card { background: #1a7a6e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: center; }
            .amount { font-size: 24px; font-weight: bold; display: block; margin-top: 5px; }
            .detail-table { width: 100%; margin-bottom: 20px; }
            .detail-table td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
            .label { color: #757575; }
            .value { font-weight: 600; text-align: right; }
            .footer { background-color: #fafafa; color: #9e9e9e; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #eeeeee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0; font-size: 20px;">NHẮC LỊCH ĐÓNG LÃI</h2>
            </div>
            <div class="content">
                <p>Xin chào <strong>${data.customer_name}</strong>,</p>
                <p>Hệ thống <strong>PawnManager</strong> xin thông báo kỳ đóng lãi tiếp theo của bạn đã đến. Dưới đây là thông tin chi tiết:</p>
                
                <div class="summary-card">
                    <span style="font-size: 14px; opacity: 0.9;">Số tiền lãi cần thanh toán</span>
                    <span class="amount">${data.interest_amount.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <table class="detail-table">
                    <tr>
                        <td class="label">Mã hợp đồng</td>
                        <td class="value">${data.contract_code}</td>
                    </tr>
                    <tr>
                        <td class="label">Tài sản cầm cố</td>
                        <td class="value">${data.asset_name}</td>
                    </tr>
                    <tr>
                        <td class="label">Ngày đến hạn</td>
                        <td class="value" style="color: #d32f2f;">${data.expected_date}</td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                <p><strong>Dịch vụ cầm đồ PawnManager</strong></p>
                <p style="margin-top: 10px; font-style: italic;">Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</p>
            </div>
        </div>
    </body>
    </html>
    `
}

// template thông báo hợp đồng mới đến admin
const getNewContractTemplate = (data) => {
    return `
        <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .header { background-color: #1a7a6e; color: #ffffff; padding: 15px 20px; text-align: center; }
            .status-badge { background-color: #72c9cfff; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .content { padding: 25px; }
            .info-box { background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 15px; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ddd; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #666; font-size: 14px; }
            .value { font-weight: 600; color: #222; text-align: right; }
            .price { color: #d32f2f; font-size: 18px; font-weight: bold; }
            .footer { background-color: #f4f4f4; color: #888; padding: 15px; text-align: center; font-size: 11px; }
            .btn { display: block; text-align: center; background-color: #1a237e; color: #ffffff !important; padding: 12px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="margin-bottom: 5px;"><span class="status-badge">Hợp đồng mới</span></div>
                <h2 style="margin: 0; font-size: 20px;">PawnManager System</h2>
            </div>
            <div class="content">
                <p style="margin-top: 0;">Xin chào <strong>Admin</strong>,</p>
                <p>Hệ thống vừa ghi nhận một hợp đồng mới được tạo thành công vào lúc <strong>${data.created_at}</strong>.</p>
                
                <div class="info-box">
                    <div style="text-align: center; margin-bottom: 10px;">
                        <span class="label">Tổng tiền chi ra</span><br>
                        <span class="price">${data.loan_amount.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Mã HĐ:</span>
                        <span class="value">${data.contract_code}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Khách hàng:</span>
                        <span class="value">${data.customer_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Tài sản:</span>
                        <span class="value">${data.asset_name || 'Không có tài sản'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Thời hạn:</span>
                        <span class="value">${data.start_date} - ${data.end_date}</span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Đây là email tự động từ hệ thống PawnManager.<br>Vui lòng không phản hồi email này.</p>
            </div>
        </div>
    </body>
    </html>
    `
}

// template thông báo khách hàng có hợp đồng quá hạn sẽ bị thanh lý tài sản
const getLiquidationTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 550px; margin: 0 auto; border: 2px solid #ff9800; border-radius: 10px; overflow: hidden; }
            .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 25px; background-color: #ffffff; }
            .warning-box { border: 1px dashed #ff9800; background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; width: 40%; }
            .value { font-weight: bold; color: #000; }
            .footer { background-color: #f5f5f5; color: #888; padding: 15px; text-align: center; font-size: 12px; }
            .notice { color: #d32f2f; font-size: 14px; font-style: italic; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0; text-transform: uppercase;">Thông báo Thanh lý Tài sản</h2>
            </div>
            <div class="content">
                <p>Chào bạn <strong>${data.customer_name}</strong>,</p>
                <p>Hệ thống <strong>PawnManager</strong> xin thông báo: Do hợp đồng của bạn đã quá hạn quá thời gian quy định, tài sản sau đây đã được chuyển sang trạng thái <strong>Chờ thanh lý</strong>.</p>
                
                <div class="warning-box">
                    <table class="info-table">
                        <tr>
                            <td class="label">Mã hợp đồng:</td>
                            <td class="value">${data.contract_code}</td>
                        </tr>
                        <tr>
                            <td class="label">Tài sản:</td>
                            <td class="value">${data.asset_name}</td>
                        </tr>
                        <tr>
                            <td class="label">Ngày quá hạn:</td>
                            <td class="value">${data.overdue_date}</td>
                        </tr>
                        <tr>
                            <td class="label">Tổng còn nợ:</td>
                            <td class="value" style="color: #d32f2f;">${data.total_debt.toLocaleString('vi-VN')} VNĐ</td>
                        </tr>
                    </table>
                </div>

                <p class="notice">⚠️ Lưu ý: Sau 24h kể từ email này, nếu không có phản hồi, tài sản sẽ chính thức được niêm yết thanh lý để thu hồi vốn.</p>
                
                <p>Vui lòng liên hệ trực tiếp với cửa hàng để được hỗ trợ gấp.</p>
            </div>
            <div class="footer">
                <p><strong>Cửa hàng cầm đồ PawnManager</strong></p>
            </div>
        </div>
    </body>
    </html>
    `
}

// template thông báo admin có tài sản cần thanh lý
const getLiquidationTemplateForAdmin = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 20px auto; border: 2px solid #212121; border-radius: 8px; overflow: hidden; }
            .header { background-color: #212121; color: #ffeb3b; padding: 15px; text-align: center; }
            .content { padding: 25px; background-color: #ffffff; }
            .inventory-card { border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; margin: 15px 0; background-color: #fafafa; }
            .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .data-row:last-child { border-bottom: none; }
            .label { color: #757575; font-size: 13px; }
            .value { font-weight: bold; color: #212121; }
            .highlight { color: #d32f2f; font-weight: bold; }
            .btn { display: block; text-align: center; background-color: #ffeb3b; color: #212121 !important; padding: 12px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; text-transform: uppercase; }
            .footer { background-color: #eee; color: #777; padding: 10px; text-align: center; font-size: 11px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0; font-size: 18px;"> TÀI SẢN CẦN ĐƯỢC THANH LÝ</h2>
            </div>
            <div class="content">
                <p style="margin-top: 0;">Chào <strong>Admin</strong>,</p>
                <p>Hệ thống ghi nhận tài sản dưới đây đã vượt quá thời hạn chờ và đủ điều kiện để <strong>thanh lý thu hồi vốn</strong>.</p>
                
                <div class="inventory-card">
                    <div class="data-row">
                        <span class="label">Mã hợp đồng:</span>
                        <span class="value">${data.contract_code}</span>
                    </div>
                    <div class="data-row">
                        <span class="label">Tên tài sản:</span>
                        <span class="value">${data.asset_name}</span>
                    </div>
                    <div class="data-row">
                        <span class="label">Khách hàng:</span>
                        <span class="value">${data.customer_name}</span>
                    </div>
                    <div class="data-row">
                        <span class="label">Vốn đầu tư (Gốc):</span>
                        <span class="value">${data.loan_amount.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div class="data-row">
                        <span class="label">Tổng nợ hiện tại:</span>
                        <span class="highlight">${data.total_debt.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div class="data-row">
                        <span class="label">Ngày quá hạn:</span>
                        <span class="value">${data.overdue_date}</span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>PawnManager Inventory Alert System</p>
            </div>
        </div>
    </body>
    </html>
    `
}

const getReminderEarlyTemplate = (data) =>{
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 550px; margin: 20px auto; border: 1px solid #e8f5e9; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background-color: #1a7a6e; color: #ffffff; padding: 25px; text-align: center; }
            .content { padding: 30px; background-color: #ffffff; }
            .due-box { background-color: #f1f8e9; border: 1px solid #c8e6c9; border-radius: 10px; padding: 20px; margin-bottom: 25px; text-align: center; }
            .due-date { font-size: 20px; color: #1a7a6e; font-weight: bold; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .info-table td { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
            .label { color: #757575; font-size: 14px; }
            .value { font-weight: 600; text-align: right; color: #2c3e50; }
            .highlight-price { color: #e53935; font-size: 18px; font-weight: bold; }
            .footer { background-color: #f9f9f9; color: #999; padding: 20px; text-align: center; font-size: 12px; }
            .btn { display: inline-block; background-color: #2e7d32; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0; font-size: 22px;">NHẮC HẸN THANH TOÁN</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.8;">PawnManager xin thông báo</p>
            </div>
            <div class="content">
                <p>Chào bạn <strong>${data.customer_name}</strong>,</p>
                <p>Đây là bản tin nhắc hẹn tự động. Hợp đồng của bạn sẽ đến hạn đóng lãi trong vài ngày tới. Thông tin chi tiết:</p>
                
                <div class="due-box">
                    <span style="font-size: 14px; color: #666;">Ngày đến hạn thanh toán:</span><br>
                    <span class="due-date">${data.expected_date}</span>
                </div>

                <table class="info-table">
                    <tr>
                        <td class="label">Mã hợp đồng:</td>
                        <td class="value">${data.contract_code}</td>
                    </tr>
                    <tr>
                        <td class="label">Tài sản:</td>
                        <td class="value">${data.asset_name || 'Không có tài sản'}</td>
                    </tr>
                    <tr>
                        <td class="label">Số tiền lãi kỳ này:</td>
                        <td class="value highlight-price">${data.interest_amount.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                <p style="margin-top: 10px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            </div>
        </div>
    </body>
    </html>
    `
}

const sendOverDueEmail = async (contract) => {
    try {
        const s = getSettingsInternal();
        const transporter = createDynamicTransporter();
        const mailOptions = {
            from: s.email_sender,
            to: contract.customer_email,
            subject: 'HỢP ĐỒNG QUÁ HẠN - CỬA HÀNG CẦM ĐỒ',
            html: getReminderOverdueTemplate(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', contract.customer_email);
    } catch (error) {
        console.log(error);
    }
}

const sendDueTodayEmail = async (contract) => {
    try {
        const s = getSettingsInternal();
        const transporter = createDynamicTransporter();
        const mailOptions = {
            from: s.email_sender,
            to: contract.customer_email,
            subject: 'HỢP ĐỒNG ĐẾN HẠN - CỬA HÀNG CẦM ĐỒ',
            html: getReminderDueTodayTemplate(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', contract.customer_email);
    } catch (error) {
        console.log(error);
    }
}

const sendNewContractToAdminEmail = async (contract) => {
    try {
        const s = getSettingsInternal();
        const transporter = createDynamicTransporter();
        const mailOptions = {
            from: s.email_sender,
            to: s.email_sender,
            subject: 'HỢP ĐỒNG MỚI - CỬA HÀNG CẦM ĐỒ',
            html: getNewContractTemplate(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', s.email_sender);
    } catch (error) {
        console.log(error);
    }
}

const sendLiquidationEmail = async (contract) => {
    try {
        const s = getSettingsInternal();
        const transporter = createDynamicTransporter();
        const mailOptions = {
            from: s.email_sender,
            to: contract.customer_email,
            subject: 'THÔNG BÁO THANH LÝ TÀI SẢN - CỬA HÀNG CẦM ĐỒ',
            html: getLiquidationTemplate(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', contract.customer_email);
    } catch (error) {
        console.log(error);
    }
}

const sendLiquidationForAdminEmail = async (contract) => {
    try {
        const s = getSettingsInternal();
        const transporter = createDynamicTransporter();
        const mailOptions = {
            from: s.email_sender,
            to: s.email_sender,
            subject: 'THÔNG BÁO TÀI SẢN CẦN THANH LÝ - CỬA HÀNG CẦM ĐỒ',
            html: getLiquidationTemplateForAdmin(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', s.email_sender);
    } catch (error) {
        console.log(error);
    }
}

const sendReminderEarlyEmail = async (contract) => {
    try {
        const s = getSettingsInternal();
        const transporter = createDynamicTransporter();
        const mailOptions = {
            from: s.email_sender,
            to: contract.customer_email,
            subject: 'NHẮC HẸN THANH TOÁN - CỬA HÀNG CẦM ĐỒ',
            html: getReminderEarlyTemplate(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', contract.customer_email);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { sendOverDueEmail, sendDueTodayEmail, sendNewContractToAdminEmail, sendLiquidationEmail, sendLiquidationForAdminEmail, sendReminderEarlyEmail };