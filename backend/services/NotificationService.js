const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const nodemailer = require('nodemailer');
const db = require('../config/database');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Email,
        pass: process.env.Password
    }
});


const getReminderOverdueTemplate = (data) => {
    return `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: auto; background-color: #fff;">
            <div style="text-align: center; background-color: #1a7a6e; padding: 14px;">
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

const sendOverDueZaloZNS = (contract) => {
    console.log(`Sending Zalo ZNS for contract ${contract.id} of type ${type}`);
}

const sendOverDueEmail = async (contract) => {

    try {
        const mailOptions = {
            from: process.env.Email,
            to: contract.customer_email,
            subject: 'Hợp đồng quá hạn',
            html: getReminderOverdueTemplate(contract)
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent:', contract.customer_email);
    } catch (error) {
        console.log(error);
    }

    // const ServiceID = 'service_km6r1pn'
    // const TemplateID = 'template_9esdfvk'
    // const PublicKey = '3NNagfdTtfI_CW8bf'
    // const PrivateKey = 'DrB9OtVQy8GC7peNE-sqN'

    // try {
    //     const response = await emailjs.send(ServiceID, TemplateID, {
    //         email: 'hanguyen032325@gmail.com',
    //         full_name: contract.customer_name,
    //         contract_code: contract.contract_code,
    //         subject: 'Hợp đồng quá hạn',
    //         message: `Hợp đồng ${contract.contract_code} đã quá hạn`
    //     }, {
    //         publicKey: PublicKey,
    //         privateKey: PrivateKey,
    //     });
    //     console.log('Email sent:', response.status, response.text);
    // } catch (error) {
    //     console.log(error);
    // }
}

module.exports = { sendOverDueZaloZNS, sendOverDueEmail };