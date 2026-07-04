import React, { useState, useEffect } from 'react';
import LeaveRequestModal from '../components/LeaveRequestModal';

const TimeOffEmployee = ({ employeeId = 'mock-employee-id', employeeName = 'Alex Mercer' }) => {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState({ paid: 24, sick: 7 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch leave history and balances
  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      // Fetch leaves for currently logged in employee
      const response = await fetch(`/api/leave/my?employeeId=${employeeId}`);
      const result = await response.json();
      if (result.success) {
        setLeaves(result.data);
      }
      
      // Fetch employee balance info
      const empResponse = await fetch(`/api/employees/${employeeId}`);
      const empResult = await empResponse.json();
      if (empResult.success && empResult.data) {
        setBalances({
          paid: empResult.data.paidBalance ?? 24,
          sick: empResult.data.sickBalance ?? 7
        });
      }
    } catch (error) {
      console.error('Error fetching time-off data:', error);
      // Mock data for fallback testing
      setLeaves([
        { _id: '1', type: 'Paid', startDate: '2026-07-06', endDate: '2026-07-08', allocationDays: 3, status: 'Approved', attachment: null },
        { _id: '2', type: 'Sick', startDate: '2026-07-20', endDate: '2026-07-21', allocationDays: 2, status: 'Pending', attachment: 'medical_cert.pdf' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (leaveForm) => {
    try {
      const response = await fetch('/api/leave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveForm)
      });
      const result = await response.json();
      if (result.success) {
        setMessage('Application submitted successfully!');
        setIsModalOpen(false);
        fetchLeaveData();
      } else {
        setMessage(result.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Error applying for leave:', error);
      // Mock submission for fallback
      setLeaves([
        {
          _id: Date.now().toString(),
          type: leaveForm.type,
          startDate: leaveForm.startDate,
          endDate: leaveForm.endDate,
          allocationDays: leaveForm.allocationDays,
          status: 'Pending',
          attachment: leaveForm.attachment
        },
        ...leaves
      ]);
      if (leaveForm.type === 'Paid') {
        setBalances(prev => ({ ...prev, paid: prev.paid - leaveForm.allocationDays }));
      } else if (leaveForm.type === 'Sick') {
        setBalances(prev => ({ ...prev, sick: prev.sick - leaveForm.allocationDays }));
      }
      setIsModalOpen(false);
      setMessage('Mock Application added successfully!');
    }
  };

  // Calendar render functions
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isDayOnLeave = (day) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0,0,0,0);
    
    // We search through approved leaves
    const match = leaves.find(l => {
      if (l.status !== 'Approved') return false;
      const start = new Date(l.startDate);
      start.setHours(0,0,0,0);
      const end = new Date(l.endDate);
      end.setHours(23,59,59,999);
      return checkDate >= start && checkDate <= end;
    });

    return !!match;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    // Empty cells before start day of week
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={styles.calendarCellEmpty}></div>);
    }

    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const onLeave = isDayOnLeave(day);
      const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;

      cells.push(
        <div key={`day-${day}`} style={styles.calendarCell}>
          <span style={styles.dayNumber}>{day}</span>
          <div style={styles.dotContainer}>
            {isWeekend ? (
              <span style={styles.weekendDot} title="Weekend"></span>
            ) : onLeave ? (
              <span style={styles.leaveDot} title="On Approved Leave"></span>
            ) : (
              <span style={styles.workDot} title="Working Day"></span>
            )}
          </div>
        </div>
      );
    }

    return cells;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Time Off</h2>
        <button onClick={() => setIsModalOpen(true)} style={styles.newBtn}>
          + NEW REQUEST
        </button>
      </div>

      {message && <div style={styles.notification}>{message}</div>}

      {/* Summary Cards */}
      <div style={styles.cardsGrid}>
        <div style={{ ...styles.card, borderLeft: '6px solid #714B67' }}>
          <div style={styles.cardHeader}>Paid Time Off</div>
          <div style={styles.cardValue}>{balances.paid} Days</div>
          <div style={styles.cardSub}>Available Balance</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '6px solid #FD7E14' }}>
          <div style={styles.cardHeader}>Sick Time Off</div>
          <div style={styles.cardValue}>{balances.sick} Days</div>
          <div style={styles.cardSub}>Available Balance</div>
        </div>
      </div>

      <div style={styles.layoutSplit}>
        {/* Left Column: Leave Calendar */}
        <div style={styles.calendarSection}>
          <div style={styles.calendarHeader}>
            <button onClick={handlePrevMonth} style={styles.navBtn}>&lt;</button>
            <h3 style={styles.currentMonthLabel}>{monthNames[month]} {year}</h3>
            <button onClick={handleNextMonth} style={styles.navBtn}>&gt;</button>
          </div>
          <div style={styles.calendarLegend}>
            <div style={styles.legendItem}><span style={styles.workDotLegend}></span> Working Day</div>
            <div style={styles.legendItem}><span style={styles.leaveDotLegend}></span> Time Off</div>
            <div style={styles.legendItem}><span style={styles.weekendDotLegend}></span> Weekend</div>
          </div>
          <div style={styles.calendarGridHeader}>
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div style={styles.calendarGrid}>
            {renderCalendar()}
          </div>
        </div>

        {/* Right Column: History Table */}
        <div style={styles.tableSection}>
          <h3 style={styles.sectionTitle}>Request History</h3>
          {loading ? (
            <p>Loading records...</p>
          ) : leaves.length === 0 ? (
            <p style={{ color: '#888' }}>No requests submitted yet.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Dates</th>
                    <th style={styles.th}>Days</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l._id} style={styles.tableRow}>
                      <td style={styles.td}>{l.type}</td>
                      <td style={styles.td}>
                        {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>{l.allocationDays}</td>
                      <td style={styles.td}>
                        <span style={
                          l.status === 'Approved' ? styles.statusApproved :
                          l.status === 'Rejected' ? styles.statusRejected :
                          styles.statusPending
                        }>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplyLeave}
        employeeName={employeeName}
        employeeId={employeeId}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#fcfcfc',
    minHeight: '100vh'
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pageTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#714B67',
    fontWeight: '700'
  },
  newBtn: {
    padding: '10px 18px',
    backgroundColor: '#714B67',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    boxShadow: '0 4px 12px rgba(113, 75, 103, 0.15)',
    ':hover': {
      backgroundColor: '#583a50'
    }
  },
  notification: {
    padding: '12px 16px',
    backgroundColor: 'rgba(113, 75, 103, 0.1)',
    color: '#714B67',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '20px',
    border: '1px solid rgba(113, 75, 103, 0.2)'
  },
  cardsGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  cardHeader: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    margin: '8px 0'
  },
  cardSub: {
    fontSize: '12px',
    color: '#999'
  },
  layoutSplit: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap'
  },
  calendarSection: {
    flex: '1.2',
    minWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  navBtn: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#555',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  currentMonthLabel: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  calendarLegend: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '12px',
    color: '#666'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  calendarGridHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px'
  },
  calendarCell: {
    height: '60px',
    border: '1px solid #f0f0f0',
    borderRadius: '6px',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa'
  },
  calendarCellEmpty: {
    height: '60px'
  },
  dayNumber: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#555'
  },
  dotContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  workDot: {
    height: '8px',
    width: '8px',
    backgroundColor: '#28A745', // Present/Working
    borderRadius: '50%'
  },
  leaveDot: {
    height: '8px',
    width: '8px',
    backgroundColor: '#DC3545', // Absent/Leave
    borderRadius: '50%'
  },
  weekendDot: {
    height: '8px',
    width: '8px',
    backgroundColor: '#ddd',
    borderRadius: '50%'
  },
  workDotLegend: {
    display: 'inline-block',
    height: '8px',
    width: '8px',
    backgroundColor: '#28A745',
    borderRadius: '50%'
  },
  leaveDotLegend: {
    display: 'inline-block',
    height: '8px',
    width: '8px',
    backgroundColor: '#DC3545',
    borderRadius: '50%'
  },
  weekendDotLegend: {
    display: 'inline-block',
    height: '8px',
    width: '8px',
    backgroundColor: '#ddd',
    borderRadius: '50%'
  },
  tableSection: {
    flex: '1',
    minWidth: '350px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  tableHeadRow: {
    borderBottom: '2px solid #eee',
    textAlign: 'left'
  },
  th: {
    padding: '12px 10px',
    color: '#666',
    fontWeight: '600'
  },
  tableRow: {
    borderBottom: '1px solid #f2f2f2'
  },
  td: {
    padding: '12px 10px',
    color: '#333'
  },
  statusApproved: {
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    color: '#28A745',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusRejected: {
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    color: '#DC3545',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusPending: {
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#FD7E14',
    fontSize: '12px',
    fontWeight: '600'
  }
};

export default TimeOffEmployee;
