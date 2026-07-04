const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Mock/Fallback auth middleware to handle cases where M1's auth.js is not yet present
let auth = (req, res, next) => {
  // If req.user is undefined, we can stub a default or extract from query parameters for dev/testing
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
  // Middlewares not yet scaffolded by Member 1, using fallback stubs
}

router.post('/apply', auth, leaveController.applyLeave);
router.put('/:id/approve', auth, roleCheck(['admin']), leaveController.approveLeave);
router.put('/:id/reject', auth, roleCheck(['admin']), leaveController.rejectLeave);
router.get('/calendar', auth, leaveController.getCalendarLeaves);
router.get('/my', auth, leaveController.getMyLeaves);
router.get('/all', auth, roleCheck(['admin']), leaveController.getAllLeaves);

module.exports = router;
