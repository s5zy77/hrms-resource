const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Mock auth middleware for quick dev
const auth = (req, res, next) => next();

router.get('/:id', auth, employeeController.getEmployeeById);

module.exports = router;
