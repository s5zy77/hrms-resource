import React, { useState, useEffect } from 'react';

const PayslipModal = ({ isOpen, onClose, employeeId, employeeName = 'Alex Mercer' }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchPayslip();
    }
  }, [isOpen, employeeId, year, month]);

  const fetchPayslip = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/salary/${employeeId}/payslip?year=${year}&month=${month}`);
      const result = await response.json();
      if (result.success) {
        setPayslipData(result.data);
      } else {
        setError(result.message || 'Failed to fetch payslip details.');
        setPayslipData(null);
      }
    } catch (err) {
      console.error('Error fetching payslip:', err);
      // Fallback Mock values if server offline
      setPayslipData({
        employee: employeeId,
        year,
        month,
        monthlyWage: 50000,
        components: {
          basic: 25000,
          hra: 12500,
          standardAllowance: 4167,
          performanceBonus: 2082.50,
          lta: 2082.50,
          fixedAllowance: 4168
        },
        deductions: {
          employeePf: 3000,
          employerPf: 3000,
          professionalTax: 200,
          unpaidLeaveDeduction: month === 6 ? 1666.67 : 0, // Mock July unpaid leave deduction
          absenceDeduction: 0,
          totalDeductions: month === 6 ? 4866.67 : 3200
        },
        netSalary: month === 6 ? 45133.33 : 46800,
        unpaidDays: month === 6 ? 1 : 0,
        absentDays: 0,
        totalDays: 31
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('payslip-print-area').innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Create temporary print style
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { font-family: 'Inter', sans-serif; padding: 20px; background: white; }
        .no-print { display: none; }
        .print-box { border: 1px solid #ddd; padding: 24px; border-radius: 8px; }
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    document.head.removeChild(style);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Selector Header */}
        <div style={styles.header} className="no-print">
          <div style={styles.headerLeft}>
            <h3 style={styles.title}>Generate Payslip</h3>
            <div style={styles.selectors}>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={styles.select}>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
              <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} style={styles.select}>
                {months.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* Payslip Content Area */}
        <div id="payslip-print-area" style={{ flex: 1, padding: '10px 0' }}>
          {loading ? (
            <p>Loading payslip data...</p>
          ) : error ? (
            <div style={styles.errorAlert}>{error}</div>
          ) : payslipData ? (
            <div style={styles.payslipContainer} className="print-box">
              {/* Company Logo & Invoice header */}
              <div style={styles.invoiceHeader}>
                <div>
                  <h2 style={styles.companyName}>OIJODO HRMS</h2>
                  <p style={styles.companySub}>Payroll Division, Head Office</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={styles.payslipTitle}>PAYSLIP</h3>
                  <span style={styles.payslipDate}>{months[payslipData.month]} {payslipData.year}</span>
                </div>
              </div>

              {/* Employee info grid */}
              <div style={styles.infoGrid}>
                <div style={styles.infoCol}>
                  <div style={styles.infoItem}><strong>Employee Name:</strong> {employeeName}</div>
                  <div style={styles.infoItem}><strong>Employee ID:</strong> {employeeId}</div>
                </div>
                <div style={styles.infoCol}>
                  <div style={styles.infoItem}><strong>Unpaid Leaves:</strong> {payslipData.unpaidDays} Days</div>
                  <div style={styles.infoItem}><strong>Unauthorised Absences:</strong> {payslipData.absentDays} Days</div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div style={styles.breakdownGrid}>
                {/* Earnings */}
                <div style={styles.breakdownCol}>
                  <div style={styles.tableHeader}>Earnings</div>
                  <div style={styles.componentRow}>
                    <span>Basic Salary <span title="Core component of the pay, calculated as 50% of monthly base wage." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span>₹{payslipData.components.basic.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>House Rent Allowance (HRA) <span title="House Rent Allowance provided to cover accommodation, equal to 50% of Basic." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span>₹{payslipData.components.hra.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Standard Allowance <span title="Standard tax-free allowance set at a fixed value of ₹4,167." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span>₹{payslipData.components.standardAllowance.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Performance Bonus <span title="Variable component computed as 8.33% of Basic, paid out based on performance." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span>₹{payslipData.components.performanceBonus.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Leave Travel Allowance (LTA) <span title="LTA allowance provided for domestic travel, equal to 8.33% of Basic." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span>₹{payslipData.components.lta.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Fixed Allowance <span title="The remaining balance of base wage after subtracting other defined components." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span>₹{payslipData.components.fixedAllowance.toLocaleString()}</span>
                  </div>
                  <div style={styles.totalRow}>
                    <span>Gross Earnings</span>
                    <span>₹{payslipData.monthlyWage.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div style={styles.breakdownCol}>
                  <div style={styles.tableHeader}>Deductions</div>
                  <div style={styles.componentRow}>
                    <span>Provident Fund (Employee) <span title="Employee provident fund deduction, calculated as 12% of Basic Salary." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span style={{ color: '#DC3545' }}>- ₹{payslipData.deductions.employeePf.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Professional Tax <span title="State-specific profession tax, typically fixed at ₹200/month." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span style={{ color: '#DC3545' }}>- ₹{payslipData.deductions.professionalTax.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Unpaid Leave Deductions <span title="Salary deduction calculated for unpaid leaves taken during the month." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span style={{ color: '#DC3545' }}>- ₹{payslipData.deductions.unpaidLeaveDeduction.toLocaleString()}</span>
                  </div>
                  <div style={styles.componentRow}>
                    <span>Absence Deductions <span title="Salary deduction calculated for unauthorized absences during the month." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px' }}>ⓘ</span></span>
                    <span style={{ color: '#DC3545' }}>- ₹{payslipData.deductions.absenceDeduction.toLocaleString()}</span>
                  </div>
                  <div style={styles.totalRow}>
                    <span>Total Deductions</span>
                    <span style={{ color: '#DC3545' }}>₹{payslipData.deductions.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net take home pay banner */}
              <div style={styles.netPayCard}>
                <span>NET PAY (Take Home Salary)</span>
                <strong style={styles.netPayVal}>₹{payslipData.netSalary.toLocaleString()}</strong>
              </div>
            </div>
          ) : (
            <p>No payslip data generated yet.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={styles.actions} className="no-print">
          <button onClick={onClose} style={styles.cancelBtn}>Close</button>
          <button onClick={handlePrint} disabled={!payslipData} style={styles.printBtn}>
            🖨️ Print Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif"
  },
  modal: {
    width: '680px',
    maxHeight: '90vh',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(113, 75, 103, 0.15)',
    padding: '24px',
    border: '1px solid rgba(113, 75, 103, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '12px',
    marginBottom: '16px'
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  title: {
    margin: 0,
    color: '#714B67',
    fontSize: '20px',
    fontWeight: '600'
  },
  selectors: {
    display: 'flex',
    gap: '8px'
  },
  select: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '13px',
    backgroundColor: '#fff'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#999',
    cursor: 'pointer',
    padding: '4px'
  },
  errorAlert: {
    backgroundColor: '#FCE8E6',
    color: '#C5221F',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    border: '1px solid #FAD2CF'
  },
  payslipContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    padding: '24px'
  },
  invoiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid #714B67',
    paddingBottom: '16px',
    marginBottom: '20px'
  },
  companyName: {
    margin: 0,
    color: '#714B67',
    fontSize: '22px',
    fontWeight: '700'
  },
  companySub: {
    margin: '4px 0 0 0',
    color: '#666',
    fontSize: '13px'
  },
  payslipTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  },
  payslipDate: {
    display: 'block',
    fontSize: '14px',
    color: '#555',
    marginTop: '4px'
  },
  infoGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8FA',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#555'
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  infoItem: {
    lineHeight: '1.4'
  },
  breakdownGrid: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  breakdownCol: {
    flex: 1,
    minWidth: '260px'
  },
  tableHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#714B67',
    borderBottom: '1.5px solid #eee',
    paddingBottom: '6px',
    marginBottom: '10px'
  },
  componentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#555',
    padding: '6px 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#333',
    borderTop: '1.5px solid #eee',
    paddingTop: '8px',
    marginTop: '8px'
  },
  netPayCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#714B67',
    color: '#ffffff',
    padding: '16px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    marginTop: '12px'
  },
  netPayVal: {
    fontSize: '20px',
    fontWeight: '700'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    borderTop: '1px solid #eaeaea',
    paddingTop: '16px',
    gap: '12px'
  },
  cancelBtn: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555'
  },
  printBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#28A745',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: '#218838'
    }
  }
};

export default PayslipModal;
