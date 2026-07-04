import React, { useState, useEffect } from 'react';

const SalaryInfoTab = ({ employeeId = 'mock-employee-id', isAdmin = true }) => {
  const [monthlyWage, setMonthlyWage] = useState(0);
  const [yearlyWage, setYearlyWage] = useState(0);
  const [workingDays, setWorkingDays] = useState(5);
  const [breakHours, setBreakHours] = useState(1);
  const [pfRate, setPfRate] = useState(12);
  const [profTax, setProfTax] = useState(200);

  const [components, setComponents] = useState({
    basic: 0,
    hra: 0,
    standardAllowance: 4167,
    performanceBonus: 0,
    lta: 0,
    fixedAllowance: 0
  });

  const [deductions, setDeductions] = useState({
    employeePf: 0,
    employerPf: 0,
    professionalTax: 200
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch initial salary details
  useEffect(() => {
    fetchSalaryInfo();
  }, [employeeId]);

  const fetchSalaryInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://hrms-resource.onrender.com/api/salary/${employeeId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const data = result.data;
        setMonthlyWage(data.monthlyWage);
        setYearlyWage(data.monthlyWage * 12);
        setWorkingDays(data.workingDaysPerWeek);
        setBreakHours(data.breakTimeHours);
        setPfRate(data.pfRate ?? 12);
        setProfTax(data.profTax ?? 200);
        
        if (data.components) {
          setComponents(data.components);
        }
      }
    } catch (err) {
      console.error('Error loading salary profile:', err);
      // Load default mock values if not found or server offline
      updateCalculations(50000, 12, 200);
    } finally {
      setLoading(false);
    }
  };

  // Perform client-side live calculation
  const updateCalculations = (wage, pf, tax) => {
    const basic = Math.round((wage * 0.50) * 100) / 100;
    const hra = Math.round((basic * 0.50) * 100) / 100;
    const standardAllowance = 4167;
    const performanceBonus = Math.round((basic * 0.0833) * 100) / 100;
    const lta = Math.round((basic * 0.0833) * 100) / 100;
    
    const sum = basic + hra + standardAllowance + performanceBonus + lta;
    const fixedAllowance = Math.round((wage - sum) * 100) / 100;

    const employeePf = Math.round((basic * (pf / 100)) * 100) / 100;
    const employerPf = Math.round((basic * (pf / 100)) * 100) / 100;

    setComponents({
      basic,
      hra,
      standardAllowance,
      performanceBonus,
      lta,
      fixedAllowance
    });

    setDeductions({
      employeePf,
      employerPf,
      professionalTax: tax
    });
  };

  const handleMonthlyWageChange = (val) => {
    const wage = parseFloat(val) || 0;
    setMonthlyWage(wage);
    setYearlyWage(wage * 12);
    updateCalculations(wage, pfRate, profTax);
  };

  const handleYearlyWageChange = (val) => {
    const yearly = parseFloat(val) || 0;
    setYearlyWage(yearly);
    const wage = Math.round((yearly / 12) * 100) / 100;
    setMonthlyWage(wage);
    updateCalculations(wage, pfRate, profTax);
  };

  const handlePfRateChange = (val) => {
    const rate = parseFloat(val) || 0;
    setPfRate(rate);
    updateCalculations(monthlyWage, rate, profTax);
  };

  const handleProfTaxChange = (val) => {
    const tax = parseFloat(val) || 0;
    setProfTax(tax);
    updateCalculations(monthlyWage, pfRate, tax);
  };

  const handleSave = async () => {
    if (!isAdmin) return;
    try {
      setMessage('Saving...');
      const response = await fetch(`https://hrms-resource.onrender.com/api/salary/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyWage,
          workingDaysPerWeek: workingDays,
          breakTimeHours: breakHours,
          pfRate,
          profTax
        })
      });
      const result = await response.json();
      if (result.success) {
        setMessage('Salary settings updated successfully.');
      } else {
        setMessage(result.message || 'Failed to update salary.');
      }
    } catch (err) {
      console.error('Error saving salary settings:', err);
      setMessage('Mock save complete (locally updated).');
    }
  };

  return (
    <div style={styles.tabContainer}>
      <h3 style={styles.sectionTitle}>Salary & Contribution Settings</h3>
      {loading ? (
        <p>Loading salary details...</p>
      ) : (
        <div>
          {message && <div style={styles.banner}>{message}</div>}

          {/* Core Configuration Inputs */}
          <div style={styles.topConfigGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Monthly Wage (INR)</label>
              <input
                type="number"
                value={monthlyWage}
                onChange={(e) => handleMonthlyWageChange(e.target.value)}
                disabled={!isAdmin}
                style={isAdmin ? styles.input : styles.disabledInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Yearly Wage (INR)</label>
              <input
                type="number"
                value={yearlyWage}
                onChange={(e) => handleYearlyWageChange(e.target.value)}
                disabled={!isAdmin}
                style={isAdmin ? styles.input : styles.disabledInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Working Days / Week</label>
              <input
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(parseInt(e.target.value) || 5)}
                disabled={!isAdmin}
                style={isAdmin ? styles.input : styles.disabledInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Daily Break Hours</label>
              <input
                type="number"
                value={breakHours}
                onChange={(e) => setBreakHours(parseFloat(e.target.value) || 1)}
                disabled={!isAdmin}
                style={isAdmin ? styles.input : styles.disabledInput}
              />
            </div>
          </div>

          <div style={styles.columnsWrapper}>
            {/* Left Column: Components list */}
            <div style={styles.column}>
              <h4 style={styles.columnHeader}>Salary Components</h4>
              <div style={styles.componentList}>
                <div style={styles.componentItem}>
                  <span>Basic Salary (50% of Wage) <span title="Core component of the pay, calculated as 50% of monthly base wage." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong>₹{components.basic.toLocaleString()}</strong>
                </div>
                <div style={styles.componentItem}>
                  <span>House Rent Allowance (50% of Basic) <span title="House Rent Allowance provided to cover accommodation, equal to 50% of Basic." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong>₹{components.hra.toLocaleString()}</strong>
                </div>
                <div style={styles.componentItem}>
                  <span>Standard Allowance (Fixed) <span title="Standard tax-free allowance set at a fixed value of ₹4,167." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong>₹{components.standardAllowance.toLocaleString()}</strong>
                </div>
                <div style={styles.componentItem}>
                  <span>Performance Bonus (8.33% of Basic) <span title="Variable component computed as 8.33% of Basic, paid out based on performance." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong>₹{components.performanceBonus.toLocaleString()}</strong>
                </div>
                <div style={styles.componentItem}>
                  <span>Leave Travel Allowance (8.33% of Basic) <span title="LTA allowance provided for domestic travel, equal to 8.33% of Basic." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong>₹{components.lta.toLocaleString()}</strong>
                </div>
                <div style={{ ...styles.componentItem, borderTop: '2px dashed #eee', marginTop: '8px' }}>
                  <span>Fixed Allowance (Remainder) <span title="The remaining balance of base wage after subtracting other defined components." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong>₹{components.fixedAllowance.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Deductions, Tax & PF */}
            <div style={styles.column}>
              <h4 style={styles.columnHeader}>Deductions & Benefits</h4>
              
              <div style={{ ...styles.field, marginBottom: '16px' }}>
                <label style={styles.label}>PF Rate (%)</label>
                <input
                  type="number"
                  value={pfRate}
                  onChange={(e) => handlePfRateChange(e.target.value)}
                  disabled={!isAdmin}
                  style={isAdmin ? styles.input : styles.disabledInput}
                />
              </div>

              <div style={styles.componentList}>
                <div style={styles.componentItem}>
                  <span>Employee PF Contribution ({pfRate}%) <span title="Employee provident fund deduction, calculated as a percentage of Basic Salary." style={{ cursor: 'help', opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>ⓘ</span></span>
                  <strong style={{ color: '#DC3545' }}>- ₹{deductions.employeePf.toLocaleString()}</strong>
                </div>
                <div style={styles.componentItem}>
                  <span>Employer PF Contribution ({pfRate}%)</span>
                  <strong style={{ color: '#666' }}>₹{deductions.employerPf.toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ ...styles.field, marginTop: '20px', marginBottom: '16px' }}>
                <label style={styles.label}>Professional Tax (Fixed INR)</label>
                <input
                  type="number"
                  value={profTax}
                  onChange={(e) => handleProfTaxChange(e.target.value)}
                  disabled={!isAdmin}
                  style={isAdmin ? styles.input : styles.disabledInput}
                />
              </div>

              <div style={styles.componentList}>
                <div style={styles.componentItem}>
                  <span>Professional Tax</span>
                  <strong style={{ color: '#DC3545' }}>- ₹{deductions.professionalTax.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div style={styles.actions}>
              <button onClick={handleSave} style={styles.saveBtn}>
                Save Salary Configurations
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  tabContainer: {
    fontFamily: "'Inter', sans-serif",
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '8px'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#714B67',
    fontSize: '20px',
    fontWeight: '600'
  },
  banner: {
    padding: '10px 14px',
    backgroundColor: 'rgba(113, 75, 103, 0.08)',
    color: '#714B67',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
    border: '1px solid rgba(113, 75, 103, 0.15)'
  },
  topConfigGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
    backgroundColor: '#FAF8FA',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(113, 75, 103, 0.05)'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#777'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#714B67'
    }
  },
  disabledInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #eee',
    backgroundColor: '#f9f9f9',
    color: '#555',
    fontSize: '14px'
  },
  columnsWrapper: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap'
  },
  column: {
    flex: 1,
    minWidth: '280px',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
  },
  columnHeader: {
    margin: '0 0 16px 0',
    color: '#333',
    borderBottom: '2px solid #714B67',
    paddingBottom: '8px',
    fontSize: '16px',
    fontWeight: '600'
  },
  componentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  componentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13.5px',
    color: '#555'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
    borderTop: '1px solid #eee',
    paddingTop: '16px'
  },
  saveBtn: {
    padding: '10px 20px',
    backgroundColor: '#714B67',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: '#583a50'
    }
  }
};

export default SalaryInfoTab;
