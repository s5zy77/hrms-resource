const Salary = require('../models/Salary');
const { calculateSalary } = require('../utils/salaryCalculator');
const Leave = require('../models/Leave');

// Helper to get total days in a given month and year
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// GET /api/salary/:id
exports.getSalary = async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Ensure only admins or the employee themselves can access this profile
    if (req.user && req.user.role !== 'admin' && req.user.employeeId !== employeeId) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You cannot view another employee\'s salary configuration'
      });
    }
    let salary = await Salary.findOne({ employee: employeeId });
    
    if (!salary) {
      // Return a default zero-initialized salary structure if it doesn't exist
      return res.status(200).json({
        success: true,
        data: {
          employee: employeeId,
          monthlyWage: 0,
          workingDaysPerWeek: 5,
          breakTimeHours: 1,
          components: {
            basic: 0,
            hra: 0,
            standardAllowance: 4167,
            performanceBonus: 0,
            lta: 0,
            fixedAllowance: 0
          },
          pfRate: 12,
          profTax: 200
        },
        message: 'Default salary profile returned (not saved)'
      });
    }

    res.status(200).json({
      success: true,
      data: salary,
      message: 'Salary profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/salary/:id
exports.updateSalary = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { monthlyWage, workingDaysPerWeek, breakTimeHours, pfRate, profTax } = req.body;

    if (monthlyWage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Monthly wage is required'
      });
    }

    const wage = parseFloat(monthlyWage);
    const ratePF = pfRate !== undefined ? parseFloat(pfRate) : 12;
    const taxProf = profTax !== undefined ? parseFloat(profTax) : 200;

    // Trigger strict calculator utility
    const calculated = calculateSalary(wage, ratePF, taxProf);

    let salary = await Salary.findOne({ employee: employeeId });
    if (!salary) {
      salary = new Salary({
        employee: employeeId,
        monthlyWage: wage,
        workingDaysPerWeek: workingDaysPerWeek || 5,
        breakTimeHours: breakTimeHours || 1,
        components: calculated.components,
        pfRate: ratePF,
        profTax: taxProf
      });
    } else {
      salary.monthlyWage = wage;
      if (workingDaysPerWeek !== undefined) salary.workingDaysPerWeek = workingDaysPerWeek;
      if (breakTimeHours !== undefined) salary.breakTimeHours = breakTimeHours;
      salary.components = calculated.components;
      salary.pfRate = ratePF;
      salary.profTax = taxProf;
    }

    await salary.save();

    res.status(200).json({
      success: true,
      data: salary,
      message: 'Salary profile updated and components recalculated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/salary/:id/payslip
exports.getPayslip = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { year, month } = req.query; // Expecting year (e.g. 2026) and 0-indexed month (0-11)

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month query parameters are required'
      });
    }

    const yr = parseInt(year);
    const mn = parseInt(month);

    const salary = await Salary.findOne({ employee: employeeId });
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary profile not found. Please set wage first.'
      });
    }

    const daysInMonth = getDaysInMonth(yr, mn);
    const startOfMonth = new Date(yr, mn, 1);
    const endOfMonth = new Date(yr, mn, daysInMonth, 23, 59, 59);

    // Fetch approved Unpaid leaves during this month
    const unpaidLeaves = await Leave.find({
      employee: employeeId,
      type: 'Unpaid',
      status: 'Approved',
      startDate: { $lte: endOfMonth },
      endDate: { $gte: startOfMonth }
    });

    let unpaidDays = 0;
    unpaidLeaves.forEach(leave => {
      // Calculate overlapping days with this month
      const startOverlap = new Date(Math.max(leave.startDate, startOfMonth));
      const endOverlap = new Date(Math.min(leave.endDate, endOfMonth));
      
      // Calculate weekday count in overlap
      let cur = new Date(startOverlap);
      while (cur <= endOverlap) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) { // Mon-Fri
          unpaidDays++;
        }
        cur.setDate(cur.getDate() + 1);
      }
    });

    // Fetch attendance payroll data from M3's models or API if available
    let totalWorkingDays = 0;
    let presentDays = 0;
    let absentDays = 0; // absences without leave

    try {
      const Attendance = require('../models/Attendance');
      if (Attendance) {
        const attendanceRecords = await Attendance.find({
          employee: employeeId,
          date: {
            $gte: startOfMonth.toISOString().split('T')[0],
            $lte: endOfMonth.toISOString().split('T')[0]
          }
        });

        // Compute from records
        attendanceRecords.forEach(record => {
          if (record.status === 'present' || record.status === 'halfday') {
            presentDays += (record.status === 'halfday' ? 0.5 : 1);
          } else if (record.status === 'absent') {
            absentDays++;
          }
        });
      }
    } catch (attErr) {
      // Fallback if Attendance model isn't populated/ready
    }

    // Check for mid-month hire proration
    let prorationFactor = 1.0;
    try {
      const Employee = require('../models/Employee');
      if (Employee) {
        const emp = await Employee.findById(employeeId);
        if (emp && emp.dateOfJoining) {
          const doJ = new Date(emp.dateOfJoining);
          if (doJ > startOfMonth && doJ <= endOfMonth) {
            const activeDays = daysInMonth - doJ.getDate() + 1;
            prorationFactor = activeDays / daysInMonth;
          }
        }
      }
    } catch (e) {
      // Employee model not ready or imported
    }

    const adjustedWage = Math.round((salary.monthlyWage * prorationFactor) * 100) / 100;
    
    // Daily rate for unpaid deduction: Wage / Total calendar days in month
    const dailyRate = salary.monthlyWage / daysInMonth;
    // Unpaid leave deduction
    const unpaidDeduction = Math.round((dailyRate * unpaidDays) * 100) / 100;
    
    // Absence deduction (absences with no approved leave)
    const absenceDeduction = Math.round((dailyRate * absentDays) * 100) / 100;

    // Recalculate components using adjusted wage due to proration
    const calculated = calculateSalary(adjustedWage, salary.pfRate, salary.profTax);

    const basic = calculated.components.basic;
    const employeePf = calculated.deductions.employeePf;
    const professionalTax = calculated.deductions.professionalTax;

    const totalDeductions = Math.round((employeePf + professionalTax + unpaidDeduction + absenceDeduction) * 100) / 100;
    const netSalary = Math.max(0, Math.round((adjustedWage - totalDeductions) * 100) / 100);

    res.status(200).json({
      success: true,
      data: {
        employee: employeeId,
        year: yr,
        month: mn,
        monthlyWage: salary.monthlyWage,
        components: calculated.components,
        deductions: {
          employeePf,
          employerPf: calculated.deductions.employerPf,
          professionalTax,
          unpaidLeaveDeduction: unpaidDeduction,
          absenceDeduction: absenceDeduction,
          totalDeductions
        },
        netSalary,
        unpaidDays,
        absentDays,
        totalDays: daysInMonth
      },
      message: 'Payslip data generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
