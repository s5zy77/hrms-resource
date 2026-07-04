import React, { useState, useEffect } from 'react';

const LeaveRequestModal = ({ isOpen, onClose, onSubmit, employeeName, employeeId }) => {
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allocationDays, setAllocationDays] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [error, setError] = useState('');

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
      setError('Please fill in all dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
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

    setError('');
    onSubmit({
      employeeId,
      type: leaveType,
      startDate,
      endDate,
      allocationDays,
      attachment: attachmentName || null
    });
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Apply for Time Off</h3>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleFormSubmit} style={styles.form}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Employee Name</label>
            <input 
              type="text" 
              value={employeeName || 'Logged In Employee'} 
              disabled 
              style={styles.disabledInput} 
            />
          </div>

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

          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>From Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
                style={styles.input} 
              />
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1, marginLeft: '12px' }}>
              <label style={styles.label}>To Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                required 
                style={styles.input} 
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Duration (Working Days)</label>
            <div style={styles.daysDisplay}>{allocationDays} {allocationDays === 1 ? 'Day' : 'Days'}</div>
          </div>

          {leaveType === 'Sick' && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Medical Certificate (Required for Sick Leave)</label>
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

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>Apply</button>
          </div>
        </form>
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
    width: '450px',
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
    color: '#714B67', // Purple accent
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
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#666',
    marginBottom: '6px'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#714B67'
    }
  },
  disabledInput: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #eaeaea',
    backgroundColor: '#f9f9f9',
    color: '#888',
    fontSize: '14px'
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
  daysDisplay: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#714B67',
    backgroundColor: 'rgba(113, 75, 103, 0.08)',
    padding: '10px 12px',
    borderRadius: '6px',
    display: 'inline-block'
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
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
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
    color: '#555',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  submitBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#714B67',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: '#583a50'
    }
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
