// ============================================
// middleware/auth.js
// ============================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── حماية إلزامية ────────────────────────────
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError')  return res.status(401).json({ success: false, message: 'Invalid token.' });
    if (error.name === 'TokenExpiredError')  return res.status(401).json({ success: false, message: 'Token expired.' });
    res.status(500).json({ success: false, message: 'Server error in auth middleware.' });
  }
};

// ─── حماية اختيارية (guest مسموح) ────────────
// يُستخدم في POST /api/orders
// لو في token صحيح → يربط المستخدم
// لو ما في token → يكمل بدون مستخدم (guest)
exports.optionalProtect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null; // guest
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);

    req.user = (user && user.isActive) ? user : null;
    next();

  } catch (error) {
    // أي خطأ في التوكن → نكمل كـ guest
    req.user = null;
    next();
  }
};

// ─── أدمن فقط ─────────────────────────────────
exports.adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
};