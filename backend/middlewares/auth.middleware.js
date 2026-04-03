const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"]?.split(' ')[1];
    if (!token) return res.status(403).json({ error: "Không tìm thấy Token!" });

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userPermissions = decoded.permissions;
        next();
    });
};

// Middleware check quyền cụ thể
const hasPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (req.userRole === 'admin') return next(); // Admin có toàn quyền

        const hasRequired = Array.isArray(requiredPermission)
            ? requiredPermission.some(p => req.userPermissions?.includes(p))
            : req.userPermissions?.includes(requiredPermission);

        if (!hasRequired) {
            return res.status(403).json({ 
                error: `Bạn không có quyền thực hiện hành động này. Yêu cầu một trong các quyền: ${Array.isArray(requiredPermission) ? requiredPermission.join(', ') : requiredPermission}` 
            });
        }
        next();
    };
};

module.exports = {
  verifyToken,
  hasPermission
};
