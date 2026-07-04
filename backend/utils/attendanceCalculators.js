/**
 * Calculates work hours based on check-in and check-out times, minus break time
 * @param {Date|string} checkIn - The check-in timestamp
 * @param {Date|string} checkOut - The check-out timestamp
 * @param {number} breakTimeHours - Break time in hours to deduct (default 1)
 * @returns {number} Calculated work hours, rounded to 2 decimal places
 */
function calculateWorkHours(checkIn, checkOut, breakTimeHours = 1) {
  if (!checkIn || !checkOut) return 0;
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  const diffMs = end - start;
  if (diffMs <= 0) return 0;
  
  const diffHours = diffMs / (1000 * 60 * 60);
  const totalHours = diffHours - parseFloat(breakTimeHours);
  
  return Math.max(0, Math.round(totalHours * 100) / 100);
}

/**
 * Calculates overtime hours (hours worked beyond the standard work day)
 * @param {number} workHours - The total hours worked
 * @param {number} standardHours - Standard hours per day (default 8)
 * @returns {number} Calculated overtime hours, rounded to 2 decimal places
 */
function calculateExtraHours(workHours, standardHours = 8) {
  const hours = parseFloat(workHours) || 0;
  const standard = parseFloat(standardHours) || 0;
  
  return Math.max(0, Math.round((hours - standard) * 100) / 100);
}

module.exports = {
  calculateWorkHours,
  calculateExtraHours
};
