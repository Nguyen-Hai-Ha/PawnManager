const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const formatCollateralMetadata = (metadataString) => {
    try {
        if (!metadataString || metadataString === "{}") return "Không có mô tả chi tiết";
        
        let validJsonString = metadataString.replace(/'/g, '"');
        
        const metadata = JSON.parse(validJsonString);
        
        const details = Object.entries(metadata).map(([key, value]) => {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            return `${formattedKey}: ${value}`;
        });

        return details.join(", ");
    } catch (e) {
        console.error("Lỗi parse JSON tài sản:", e.message);
        return metadataString.replace(/[{}]/g, "");
    }
};

// const generateContractDoc = (data) => {
//     const content = fs.readFileSync(
//         path.resolve(__dirname, "../templates/mau-hop-dong-cam-co-tai-san.docx"),
//         "binary"
//     );

//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip, {
//         paragraphLoop: true,
//         linebreaks: true,
//     });

//     doc.render({
//         full_name: data.full_name,
//         phone: data.phone,
//         cccd: data.cccd,
//         address: data.address,
//         birth_date: data.birth_date,
//         loan_amount: data.Loan_amount.toLocaleString('vi-VN'),
//         amount_raw: Number(data.Loan_amount || 0),
//         interest_rate: data.Interest_rate,
//         start_date: data.Start_date,
//         end_date: data.End_date,
//         payment_term: data.Payment_term,
//         term_unit: data.Term_unit,
//         total_periods: data.Total_periods,
//         interest_type: data.Interest_type,
//         contract_type: data.Contract_type,
//         collateral_name: data.collateral_name,
//         collateral_metadata: formatCollateralMetadata(data.collateral_metadata),
//     });

//     const buf = doc.getZip().generate({
//         type: "nodebuffer",
//         compression: "DEFLATE",
//     });

//     const fileName = `HopDong_${data.full_name}.docx`;
//     // const outputPath = path.resolve(__dirname, `../output/${fileName}`);
//     // fs.writeFileSync(outputPath, buf);

//     return { buf, fileName };
// };

const generateContractDoc = (data, template) => {
    const content = fs.readFileSync(
        path.resolve(__dirname, template.file_path),
        "binary"
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    const now = dayjs();

    const day = now.format("DD");
    const month = now.format("MM");
    const year = now.format("YYYY");

    doc.render({
        Ma_HD: data.Code,
        Ten_KH: data.full_name,
        SDT_KH: data.phone,
        Dia_chi_KH: data.address,
        CMND_CCCD: data.cccd,
        Ngay_sinh: data.birth_date,
        Tien_vay: (data.Loan_amount || 0).toLocaleString('vi-VN')  + " đồng",
        Kieu_lai: data.Interest_type,
        Lai_suat: data.Interest_rate,
        Ngay_vay: data.Start_date,
        Ngay_het_han: data.End_date,
        Ky_han: data.Payment_term,
        Don_vi_ky_han: data.Term_unit,
        Tong_ky_han: data.Total_periods,
        Tai_san_cam_co: data.collateral_name,
        Thong_tin_tai_san: formatCollateralMetadata(data.collateral_metadata),
        So_ngay: data.total_days,
        Tien_lai: data.interest.toLocaleString('vi-VN') + " đồng",
        Tien_lai_bang_chu: data.interest_text,
        Ngay: day,
        Thang: month,
        Nam: year
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    const fileName = `BienBan_HĐ_${data.full_name}.docx`;
    return { buf, fileName };
};

// const generatePaymentReceiptDoc = (data) => {
//     const content = fs.readFileSync(
//         path.resolve(__dirname, "../templates/mau-phieu-thu-2026.docx"),
//         "binary"
//     );

//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip, {
//         paragraphLoop: true,
//         linebreaks: true,
//     });

//     const now = dayjs();

//     const day = now.format("DD");
//     const month = now.format("MM");
//     const year = now.format("YYYY");

//     doc.render({
//         full_name: data.Full_name,
//         phone: data.phone,
//         Address: data.Address,
//         Code: data.Code,
//         amount: (data.amount || 0).toLocaleString('vi-VN')  + " đồng",
//         amount_text: data.amount_text,
//         day: day,
//         month: month,
//         year: year
//     });

//     const buf = doc.getZip().generate({
//         type: "nodebuffer",
//         compression: "DEFLATE",
//     });

//     const fileName = `BienLai_HĐ_${data.full_name}.docx`;
    
//     return { buf, fileName };
// };

module.exports = { generateContractDoc };