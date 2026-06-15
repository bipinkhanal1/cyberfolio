const jwt = require('jsonwebtoken');
const { User, AuditLog } = require('../models');

// ========================
// MIDDLEWARE
// ========================

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+isActive');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const auditLog = (action, resource) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const success = res.statusCode < 400;
    AuditLog.create({
      user: req.user?._id,
      action,
      resource,
      resourceId: req.params.id,
      details: { method: req.method, path: req.path },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      success
    }).catch(() => {});
    return originalJson(data);
  };
  next();
};

module.exports = { authenticate, requireAdmin, auditLog };
