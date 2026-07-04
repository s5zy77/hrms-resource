const Attendance = require('../models/Attendance');

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
