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

const getReminderOverdueTemplate = (data) => {
    return `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: auto; background-color: #fff;">
            <div style="text-align: center; background-color: #9e1b1bff; padding: 14px;">
                <span style="font-size: 22px; color: #ffffff;">TH&Ocirc;NG B&Aacute;O QU&Aacute; HẠN Đ&Oacute;NG L&Atilde;I</span>
            </div>
            <div style="padding: 14px;">
                <p>Xin ch&agrave;o qu&yacute; kh&aacute;ch ${data.customer_name}</p>
                <p>Kỳ đ&oacute;ng l&atilde;i của hợp đồng ${data.contract_code} đ&atilde; qu&aacute; hạn, mong qu&yacute; kh&aacute;ch đọc được nội dung dung n&agrave;y để đến đ&oacute;ng l&atilde;i sớm nhất.</p>
                <p>*Lưu &yacute; sau 7 ng&agrave;y, cửa h&agrave;ng sẽ tiến h&agrave;nh thanh l&yacute; t&agrave;i sản (Hợp đồng Cầm Đồ)</p>
                <p>Th&acirc;n gửi ${data.customer_name}<br>Cửa h&agrave;ng Cầm Đồ...</p>
            </div>
        </div>
    </div>
    `
}

const getReminderDueTodayTemplate = (data) => {
    return `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: auto; background-color: #fff;">
            <div style="text-align: center; background-color: #1a7a6e; padding: 14px;">
                <span style="font-size: 22px; color: #ffffff;">TH&Ocirc;NG B&Aacute;O ĐẾN HẠN Đ&Oacute;NG L&Atilde;I</span>
            </div>
            <div style="padding: 14px;">
                <p>Xin ch&agrave;o qu&yacute; kh&aacute;ch ${data.customer_name}</p>
                <p>H&ocirc;m nay l&agrave; ng&agrave;y đ&oacute;ng l&atilde;i của kỳ đ&oacute;ng l&atilde;i của hợp đồng ${data.contract_code}, mong qu&yacute; kh&aacute;ch đọc được nội dung dung n&agrave;y để đến đ&oacute;ng l&atilde;i sớm nhất.</p>
                <p>*Lưu &yacute; sau 7 ng&agrave;y (kể từ ng&agrave;y h&ocirc;m nay) , cửa h&agrave;ng sẽ tiến h&agrave;nh thanh l&yacute; t&agrave;i sản (Hợp đồng Cầm Đồ)</p>
                <p>Th&acirc;n gửi ${data.customer_name}<br>Cửa h&agrave;ng Cầm Đồ...</p>
            </div>
        </div>
    </div>
    `
}

// const sendOverDueZaloZNS = (contract) => {
//     console.log(`Sending Zalo ZNS for contract ${contract.id} of type ${type}`);
// }

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

module.exports = { sendOverDueEmail, sendDueTodayEmail };