const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Fallback auth & role check middleware
let auth = (req, res, next) => {
  if (!req.user) {
    req.user = {
      userId: req.query.userId || req.headers['x-user-id'] || 'mock-user-id',
      employeeId: req.query.employeeId || req.headers['x-employee-id'] || 'mock-employee-id',
      role: req.query.role || req.headers['x-role'] || 'admin',
      name: 'Mock User'
    };
  }
  next();
};

let roleCheck = (roles) => (req, res, next) => {
  const userRole = req.user?.role || 'employee';
  if (roles.includes(userRole)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access Denied: Insufficient Permissions'
  });
};

try {
  const realAuth = require('../middleware/auth');
  const realRoleCheck = require('../middleware/roleCheck');
  if (realAuth) auth = realAuth;
  if (realRoleCheck) roleCheck = realRoleCheck;
} catch (e) {
  // Middlewares not yet scaffolded by Member 1
}

// Check-in endpoint
router.post('/check-in', auth, attendanceController.checkIn);

module.exports = router;
