const assert = require('assert');
const { calculateSalary } = require('./salaryCalculator');

function testCalculator() {
  console.log('Starting salary calculator assertions...');

  const monthlyWage = 50000;
  const result = calculateSalary(monthlyWage, 12, 200);

  // Check input wage
  assert.strictEqual(result.monthlyWage, 50000);

  const { basic, hra, standardAllowance, performanceBonus, lta, fixedAllowance } = result.components;
  const { employeePf, employerPf, professionalTax } = result.deductions;

  // Basic = 50% of Wage = 25000
  assert.strictEqual(basic, 25000);

  // HRA = 50% of Basic = 12500
  assert.strictEqual(hra, 12500);

  // Standard Allowance = 4167
  assert.strictEqual(standardAllowance, 4167);

  // Performance Bonus = Basic * 8.33% = 25000 * 0.0833 = 2082.50
  assert.strictEqual(performanceBonus, 2082.50);

  // LTA = Basic * 8.33% = 25000 * 0.0833 = 2082.50
  assert.strictEqual(lta, 2082.50);

  // Sum of components must equal monthlyWage exactly
  const sum = basic + hra + standardAllowance + performanceBonus + lta + fixedAllowance;
  assert.strictEqual(sum, monthlyWage);

  // Fixed Allowance = 50000 - (25000 + 12500 + 4167 + 2082.50 + 2082.50) = 50000 - 45832 = 4168
  assert.strictEqual(fixedAllowance, 4168);

  // Employee PF = 12% of Basic = 25000 * 0.12 = 3000
  assert.strictEqual(employeePf, 3000);

  // Employer PF = 12% of Basic = 25000 * 0.12 = 3000
  assert.strictEqual(employerPf, 3000);

  // Professional Tax = 200
  assert.strictEqual(professionalTax, 200);

  console.log('✅ All salary calculator assertions passed successfully!');
}

testCalculator();
