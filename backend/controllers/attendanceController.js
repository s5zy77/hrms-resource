const Attendance = require('../models/Attendance');
const { calculateWorkHours, calculateExtraHours } = require('../utils/attendanceCalculators');

// POST /api/attendance/check-in
exports.checkIn = async (req, res) => {
  try {
    const employeeId = req.body.employeeId || req.user?.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const today = new Date();
    // Normalize date to 00:00:00 to index daily records
    const normalizedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Check if check-in already exists for today
    const existingRecord = await Attendance.findOne({
      employee: employeeId,
      date: normalizedDate
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today.'
      });
    }

    const newRecord = new Attendance({
      employee: employeeId,
      date: normalizedDate,
      checkIn: today,
      status: 'Present'
    });

    await newRecord.save();

    return res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Check-in successful'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error during check-in: ' + error.message
    });
  }
};

// PUT /api/attendance/check-out
exports.checkOut = async (req, res) => {
  try {
    const employeeId = req.body.employeeId || req.user?.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const today = new Date();
    // Normalize date to 00:00:00 to query daily record
    const normalizedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Find today's check-in record
    const record = await Attendance.findOne({
      employee: employeeId,
      date: normalizedDate
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No check-in record found for today. You must check-in first.'
      });
    }

    if (record.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out today.'
      });
    }

    // Default break time parameter can be configured via request parameters or default to 1 hour
    const breakTime = req.body.breakTime !== undefined ? parseFloat(req.body.breakTime) : 1;
    const standardHours = req.body.standardHours !== undefined ? parseFloat(req.body.standardHours) : 8;

    const workHours = calculateWorkHours(record.checkIn, today, breakTime);
    const extraHours = calculateExtraHours(workHours, standardHours);

    record.checkOut = today;
    record.workHours = workHours;
    record.extraHours = extraHours;

    // Status logic: if total work hours is less than 4 hours, mark as Halfday
    if (workHours > 0 && workHours < 4) {
      record.status = 'Halfday';
    } else if (workHours >= 4) {
      record.status = 'Present';
    }

    await record.save();

    return res.status(200).json({
      success: true,
      data: record,
      message: 'Check-out successful'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error during check-out: ' + error.message
    });
  }
};

// GET /api/attendance/my
exports.getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const { startDate, endDate } = req.query;
    let filter = { employee: employeeId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: records,
      message: 'Personal attendance records fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching personal attendance: ' + error.message
    });
  }
};

// GET /api/attendance/all (Admin only)
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    let recordsQuery = Attendance.find(filter).sort({ date: -1 });
    
    try {
      recordsQuery = recordsQuery.populate({
        path: 'employee',
        select: 'name department status'
      });
    } catch (e) {
      // Fallback if Employee collection is not registered yet
    }

    const records = await recordsQuery;

    return res.status(200).json({
      success: true,
      data: records,
      message: 'All attendance records fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching all attendance: ' + error.message
    });
  }
};
