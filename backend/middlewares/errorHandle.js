// backend/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Nếu lỗi có kèm statusCode (ví dụ ta tự ném lỗi 404, 400), thì lấy mã đó. 
    // Nếu không, mặc định là 500 (Lỗi hệ thống/Server)
    const statusCode = err.status || 500;
    
    // Ghi log lỗi ra màn hình đen (để Dev dễ debug)
    console.error(`[Error] ${err.message}`);

    // Trả JSON lỗi về cho Frontend
    res.status(statusCode).json({
        error: err.message || 'Lỗi máy chủ nội bộ',
        // (Tùy chọn) Chỉ hiện chi tiết lỗi stack trace nếu đang ở môi trường dev
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;
