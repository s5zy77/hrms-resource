import React, { useState, useEffect } from 'react';

const LeaveRequestModal = ({ isOpen, onClose, onSubmit, employeeName, employeeId }) => {
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [allocationDays, setAllocationDays] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [error, setError] = useState('');

  const [calendarDate, setCalendarDate] = useState(new Date());

  // Helper to calculate working days (excluding weekends)
  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0;
    const sDate = new Date(start);
    const eDate = new Date(end);
    if (sDate > eDate) return 0;
    
    let count = 0;
    let cur = new Date(sDate);
    while (cur <= eDate) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) { // Mon-Fri
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  useEffect(() => {
    const days = calculateWorkingDays(startDate, endDate);
    setAllocationDays(days);
  }, [startDate, endDate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      setAttachmentName(file.name);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select a start and end date on the calendar.');
      return;
    }
    if (startDate > endDate) {
      setError('Start date cannot be after end date.');
      return;
    }
    if (allocationDays === 0) {
      setError('Selected period has no working days (Mon-Fri).');
      return;
    }
    if (leaveType === 'Sick' && !attachment) {
      setError('Sick leave requires an attachment (medical certificate).');
      return;
    }

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    };

    setError('');
    onSubmit({
      employeeId,
      type: leaveType,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      allocationDays,
      attachment: attachmentName || null
    });
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setEndDate(null);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  // Calendar rendering
  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={styles.calendarCellEmpty}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      
      let isSelected = false;
      let isInRange = false;
      
      if (startDate && currentDate.getTime() === startDate.getTime()) isSelected = true;
      if (endDate && currentDate.getTime() === endDate.getTime()) isSelected = true;
      if (startDate && endDate && currentDate > startDate && currentDate < endDate) isInRange = true;
      
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

      let cellStyle = { ...styles.calendarCell };
      if (isSelected) {
        cellStyle = { ...cellStyle, ...styles.calendarCellSelected };
      } else if (isInRange) {
        cellStyle = { ...cellStyle, ...styles.calendarCellRange };
      }
      if (isWeekend && !isSelected && !isInRange) {
        cellStyle = { ...cellStyle, backgroundColor: '#f5f5f5', color: '#999' };
      }

      cells.push(
        <div 
          key={`day-${day}`} 
          style={cellStyle}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }
    return cells;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Apply for Time Off</h3>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.bodySplit}>
          <div style={styles.leftCol}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Time Off Type</label>
              <select 
                value={leaveType} 
                onChange={(e) => setLeaveType(e.target.value)} 
                style={styles.select}
              >
                <option value="Paid">Paid Time Off</option>
                <option value="Sick">Sick Time Off</option>
                <option value="Unpaid">Unpaid Time Off</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Selected Period</label>
              <div style={styles.selectedDatesBox}>
                {startDate ? startDate.toLocaleDateString() : 'Start Date'} 
                {' - '} 
                {endDate ? endDate.toLocaleDateString() : 'End Date'}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Duration (Working Days)</label>
              <div style={styles.daysDisplay}>{allocationDays} {allocationDays === 1 ? 'Day' : 'Days'}</div>
            </div>

            {leaveType === 'Sick' && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Medical Certificate</label>
                <div style={styles.fileUploadContainer}>
                  <label style={styles.fileLabel}>
                    Choose File
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      style={styles.fileInput} 
                    />
                  </label>
                  <span style={styles.fileName}>{attachmentName || 'No file chosen'}</span>
                </div>
              </div>
            )}
          </div>

          <div style={styles.rightCol}>
            <label style={styles.label}>Select Date Range</label>
            <div style={styles.calendarContainer}>
              <div style={styles.calendarHeader}>
                <button 
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                  style={styles.navBtn}
                >&lt;</button>
                <span style={styles.monthLabel}>{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
                <button 
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                  style={styles.navBtn}
                >&gt;</button>
              </div>
              <div style={styles.calendarDaysHeader}>
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div style={styles.calendarGrid}>
                {renderCalendar()}
              </div>
              <p style={{fontSize: '11px', color: '#888', marginTop: '10px', textAlign: 'center'}}>Click a start date, then click an end date.</p>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button type="button" onClick={handleFormSubmit} style={styles.submitBtn}>Apply</button>
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
    width: '750px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(113, 75, 103, 0.15)',
    padding: '24px',
    border: '1px solid rgba(113, 75, 103, 0.1)',
    animation: 'fadeIn 0.3s ease-out'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '12px',
    marginBottom: '16px'
  },
  title: {
    margin: 0,
    color: '#714B67', 
    fontSize: '20px',
    fontWeight: '600'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#999',
    cursor: 'pointer',
    padding: '4px'
  },
  bodySplit: {
    display: 'flex',
    gap: '24px'
  },
  leftCol: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column'
  },
  rightCol: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column'
  },
  fieldGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#666',
    marginBottom: '6px'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    backgroundColor: '#fff'
  },
  selectedDatesBox: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #eaeaea',
    backgroundColor: '#f9f9f9',
    fontSize: '14px',
    color: '#333',
    textAlign: 'center',
    fontWeight: '500'
  },
  daysDisplay: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#714B67',
    backgroundColor: 'rgba(113, 75, 103, 0.08)',
    padding: '10px 12px',
    borderRadius: '6px',
    display: 'inline-block',
    textAlign: 'center'
  },
  calendarContainer: {
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#fff'
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  navBtn: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  monthLabel: {
    fontSize: '14px',
    fontWeight: '600'
  },
  calendarDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '8px'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px'
  },
  calendarCell: {
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.1s'
  },
  calendarCellEmpty: {
    height: '32px'
  },
  calendarCellSelected: {
    backgroundColor: '#714B67',
    color: '#fff',
    fontWeight: 'bold'
  },
  calendarCellRange: {
    backgroundColor: 'rgba(113, 75, 103, 0.15)',
    color: '#714B67'
  },
  fileUploadContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  fileLabel: {
    padding: '8px 16px',
    backgroundColor: 'rgba(113, 75, 103, 0.1)',
    color: '#714B67',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid rgba(113, 75, 103, 0.2)',
    marginRight: '12px'
  },
  fileInput: {
    display: 'none'
  },
  fileName: {
    fontSize: '13px',
    color: '#555',
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
    borderTop: '1px solid #eaeaea',
    paddingTop: '16px'
  },
  cancelBtn: {
    padding: '10px 20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: 'none',
    cursor: 'pointer',
    marginRight: '12px',
    fontSize: '14px',
    color: '#555'
  },
  submitBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#714B67',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  errorMessage: {
    backgroundColor: '#FCE8E6',
    color: '#C5221F',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
    border: '1px solid #FAD2CF'
  }
};

export default LeaveRequestModal;
