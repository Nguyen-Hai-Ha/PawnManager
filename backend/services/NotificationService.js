const emailjs = require('@emailjs/browser');

const sendOverDueZaloZNS = (contract) => {
    console.log(`Sending Zalo ZNS for contract ${contract.id} of type ${type}`);
}

const sendOverDueEmail = async (contract) => {
    const ServiceID = 'service_km6r1pn'
    const TemplateID = 'template_9esdfvk'
    const PublicKey = '3NNagfdTtfI_CW8bf'

    try {
        const response = await emailjs.send(ServiceID, TemplateID, {
            to_email: contract.customer_email,
            full_name: contract.customer_name,
            contract_code: contract.contract_code,
            subject: 'Hợp đồng quá hạn',
            message: `Hợp đồng ${contract.contract_code} đã quá hạn`
        }, {
            publicKey: PublicKey,
        });
        console.log('Email sent:', response.status, response.text);
    } catch (error) {
        console.log(error); 
    }
}

module.exports = { sendOverDueZaloZNS, sendOverDueEmail };