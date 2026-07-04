/**
 * Strict salary calculation engine
 * @param {number} monthlyWage - The total base monthly wage
 * @param {number} pfRate - PF rate percentage (default 12%)
 * @param {number} profTax - Professional Tax (default ₹200)
 * @returns {object} Calculated components and deductions
 */
function calculateSalary(monthlyWage, pfRate = 12, profTax = 200) {
  const wage = parseFloat(monthlyWage) || 0;
  
  // Basic is 50% of Wage
  const basic = Math.round((wage * 0.50) * 100) / 100;
  
  // HRA is 50% of Basic
  const hra = Math.round((basic * 0.50) * 100) / 100;
  
  // Standard Allowance is fixed (e.g. 4167)
  const standardAllowance = 4167;
  
  // Performance Bonus is 8.33% of Basic
  const performanceBonus = Math.round((basic * 0.0833) * 100) / 100;
  
  // LTA is 8.33% of Basic
  const lta = Math.round((basic * 0.0833) * 100) / 100;
  
  // Fixed Allowance = Wage - (Basic + HRA + Standard + Perf Bonus + LTA)
  const calculatedSum = basic + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.round((wage - calculatedSum) * 100) / 100;
  
  // Deductions
  const employeePf = Math.round((basic * (pfRate / 100)) * 100) / 100;
  const employerPf = Math.round((basic * (pfRate / 100)) * 100) / 100;
  const professionalTax = parseFloat(profTax) || 0;
  
  return {
    monthlyWage: wage,
    components: {
      basic,
      hra,
      standardAllowance,
      performanceBonus,
      lta,
      fixedAllowance
    },
    deductions: {
      employeePf,
      employerPf,
      professionalTax
    }
  };
}

module.exports = { calculateSalary };
