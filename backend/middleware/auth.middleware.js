const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const verifyOptions = {
  algorithms: ['HS256']
};

const authenticateToken = async (req, res, next) => {
  try {
    // 1) Lấy token từ header hoặc cookie
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    // Fallback sang cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Access token is required',
        message: 'Vui lòng đăng nhập để tiếp tục'
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, JWT_SECRET, verifyOptions);

    // 3) Lấy user id
    const userId = decoded && (decoded.id || decoded.sub);
    if (!userId) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token không hợp lệ'
      });
    }

    // 4) Tìm user trong DB
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Người dùng không tồn tại'
      });
    }

    // 5) Gắn user vào request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Token đã hết hạn, vui lòng đăng nhập lại'
      });
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token không hợp lệ'
      });
    }

    console.error('authenticateToken error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Lỗi server khi xác thực token'
    });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Vui lòng đăng nhập trước'
      });
    }

    if (req.user.id_role !== 1) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Bạn không có quyền truy cập chức năng này'
      });
    }

    next();
  } catch (error) {
    console.error('requireAdmin error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Lỗi server khi kiểm tra quyền'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Token không hợp lệ nhưng không bắt buộc
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
