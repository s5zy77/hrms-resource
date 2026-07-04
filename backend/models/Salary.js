const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  monthlyWage: {
    type: Number,
    required: true
  },
  workingDaysPerWeek: {
    type: Number,
    default: 5
  },
  breakTimeHours: {
    type: Number,
    default: 1
  },
  components: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    standardAllowance: { type: Number, default: 4167 },
    performanceBonus: { type: Number, default: 0 },
    lta: { type: Number, default: 0 },
    fixedAllowance: { type: Number, default: 0 }
  },
  pfRate: {
    type: Number,
    default: 12 // 12%
  },
  profTax: {
    type: Number,
    default: 200 // ₹200
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Salary', SalarySchema);
