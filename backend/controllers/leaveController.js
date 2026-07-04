const Leave = require('../models/Leave');
// Dynamically try to load Employee model to avoid crash if M1/M2 haven't committed yet
let Employee;
try {
  Employee = require('../models/Employee');
} catch (e) {
  // Fallback mock model placeholder
}

// Helper to count working days (excluding weekends)
function getWeekdayCount(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  let cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) { // Exclude Sunday (0) and Saturday (6)
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// POST /api/leave/apply
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, attachment } = req.body;
    
    if (!employeeId || !type || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const allocationDays = getWeekdayCount(startDate, endDate);
    if (allocationDays <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Leave period must include at least one working day (Mon-Fri)'
      });
    }

    // If Employee model is available, validate balance
    if (Employee) {
      const emp = await Employee.findOne({ _id: employeeId });
      if (!emp) {
        return res.status(404).json({
          success: false,
          message: 'Employee record not found'
        });
      }

      if (type === 'Paid' && emp.paidBalance < allocationDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient paid leave balance. Available: ${emp.paidBalance} days, requested: ${allocationDays} days.`
        });
      }

      if (type === 'Sick' && emp.sickBalance < allocationDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient sick leave balance. Available: ${emp.sickBalance} days, requested: ${allocationDays} days.`
        });
      }
    }

    const newLeave = new Leave({
      employee: employeeId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'Pending',
      allocationDays,
      attachment
    });

    await newLeave.save();

    res.status(201).json({
      success: true,
      data: newLeave,
      message: 'Leave applied successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/leave/:id/approve
exports.approveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Leave has already been ${leave.status.toLowerCase()}`
      });
    }

    // Atomic update preventing double deduction or balance going negative
    if (Employee && (leave.type === 'Paid' || leave.type === 'Sick')) {
      const balanceField = leave.type === 'Paid' ? 'paidBalance' : 'sickBalance';
      const updatedEmployee = await Employee.findOneAndUpdate(
        { 
          _id: leave.employee, 
          [balanceField]: { $gte: leave.allocationDays } 
        },
        { 
          $inc: { [balanceField]: -leave.allocationDays },
          $set: { attendanceStatus: 'leave' }
        },
        { new: true }
      );
      
      if (!updatedEmployee) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance to approve this leave request'
        });
      }
    }

    // Sync with Attendance model (dynamically loading to prevent import crash)
    try {
      const Attendance = require('../models/Attendance');
      if (Attendance) {
        let cur = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        while (cur <= end) {
          const day = cur.getDay();
          if (day !== 0 && day !== 6) { // Mon-Fri
            const dateStr = cur.toISOString().split('T')[0];
            await Attendance.findOneAndUpdate(
              { employee: leave.employee, date: dateStr },
              { status: 'leave' },
              { upsert: true, new: true }
            );
          }
          cur.setDate(cur.getDate() + 1);
        }
      }
    } catch (attendanceErr) {
      // Attendance model or module not ready yet, skip sync
    }

    leave.status = 'Approved';
    await leave.save();

    res.status(200).json({
      success: true,
      data: leave,
      message: 'Leave approved and balances updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/leave/:id/reject
exports.rejectLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Leave has already been ${leave.status.toLowerCase()}`
      });
    }

    leave.status = 'Rejected';
    await leave.save();

    res.status(200).json({
      success: true,
      data: leave,
      message: 'Leave request rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/leave/calendar
exports.getCalendarLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'Approved' }).populate('employee', 'name employeeId');
    res.status(200).json({
      success: true,
      data: leaves,
      message: 'Calendar leave records retrieved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/leave/my
exports.getMyLeaves = async (req, res) => {
  try {
    // Falls back to employeeId query param if auth middleware user payload is not fully set up
    const employeeId = req.user?.employeeId || req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID required'
      });
    }

    const leaves = await Leave.find({ employee: employeeId }).sort({ startDate: -1 });
    res.status(200).json({
      success: true,
      data: leaves,
      message: 'Personal leave records retrieved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/leave/all
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name employeeId').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: leaves,
      message: 'All leave records retrieved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /api/leave/allocate
exports.allocateLeave = async (req, res) => {
  try {
    const { employeeId, type, days } = req.body;
    if (!employeeId || !type || days === undefined) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    
    // Dynamically load Employee model
    let Emp;
    try {
      Emp = require('../models/Employee');
    } catch(e) {}

    if (Emp) {
      const balanceField = type === 'Paid' ? 'paidBalance' : 'sickBalance';
      const updated = await Emp.findOneAndUpdate(
        { employeeId: employeeId },
        { $inc: { [balanceField]: days } },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
    }
    
    res.status(200).json({ success: true, message: `Successfully allocated ${days} ${type} leave days.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
