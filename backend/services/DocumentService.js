const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { Template } = require("../models");


// format metadata tài sản
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


// Hàm render hợp đồng theo mẫu
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


//Hàm Tải hợp đồng theo mẫu
const downloadTemplateDoc = (template) => {
    const content = fs.readFileSync(
        path.resolve(__dirname, template.file_path),
        "binary"
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    const fileName = `${template.name}.docx`;
    return { buf, fileName };
}

module.exports = { generateContractDoc, downloadTemplateDoc };