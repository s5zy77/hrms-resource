import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

const TimeOffAdmin = () => {
  usePageTitle('Time Off Administration');
  const [activeTab, setActiveTab] = useState('Time Off');
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Action Modal State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    requestId: null,
    actionType: null, // 'approve' | 'reject'
    comment: ''
  });

  // Allocation forms state
  const [allocEmployeeId, setAllocEmployeeId] = useState('');
  const [allocType, setAllocType] = useState('Paid');
  const [allocDays, setAllocDays] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://hrms-resource.onrender.com/api/leave/all');
      const result = await response.json();
      if (result.success) {
        if (result.data && result.data.length > 0) {
          setRequests(result.data);
        } else {
          // Pre-populate with realistic mock requests for presentation
          setRequests([
            {
              _id: '1',
              employee: { name: 'Anushka Ghosh', employeeId: 'EMP-2026-0001' },
              type: 'Paid',
              startDate: '2026-07-06',
              endDate: '2026-07-08',
              allocationDays: 3,
              status: 'Pending',
              attachment: null
            },
            {
              _id: '2',
              employee: { name: 'Ranish D', employeeId: 'EMP-2026-0002' },
              type: 'Sick',
              startDate: '2026-07-15',
              endDate: '2026-07-16',
              allocationDays: 2,
              status: 'Approved',
              attachment: 'medical_excuse.pdf'
            },
            {
              _id: '3',
              employee: { name: 'John Doe', employeeId: 'EMP-2026-0003' },
              type: 'Unpaid',
              startDate: '2026-07-22',
              endDate: '2026-07-24',
              allocationDays: 3,
              status: 'Pending',
              attachment: null
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching admin leave requests:', error);
      // Fallback mock records
      setRequests([
        {
          _id: '1',
          employee: { name: 'Alex Mercer', employeeId: 'OIJ20260001' },
          type: 'Paid',
          startDate: '2026-07-06',
          endDate: '2026-07-08',
          allocationDays: 3,
          status: 'Pending',
          attachment: null
        },
        {
          _id: '2',
          employee: { name: 'Sarah Connor', employeeId: 'OIJ20260002' },
          type: 'Sick',
          startDate: '2026-07-15',
          endDate: '2026-07-16',
          allocationDays: 2,
          status: 'Approved',
          attachment: 'medical_excuse.pdf'
        },
        {
          _id: '3',
          employee: { name: 'John Doe', employeeId: 'OIJ20260003' },
          type: 'Unpaid',
          startDate: '2026-07-22',
          endDate: '2026-07-24',
          allocationDays: 3,
          status: 'Pending',
          attachment: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to Approve this leave request?")) {
      try {
        const response = await fetch(`https://hrms-resource.onrender.com/api/leave/${id}/approve`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminComment: 'Approved via Quick Action' })
        });
        const result = await response.json();
        if (result.success) {
          alert("Request successfully approved!");
          fetchRequests();
        } else {
          alert(result.message || 'Action failed.');
        }
      } catch (error) {
        console.error(`Error processing leave approve:`, error);
        setRequests(prev =>
          prev.map(r => (r._id === id ? { ...r, status: 'Approved' } : r))
        );
        alert("Mock Request successfully Approved.");
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter a reason for rejection (optional):");
    if (reason !== null) {
      try {
        const response = await fetch(`https://hrms-resource.onrender.com/api/leave/${id}/reject`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminComment: reason || 'Rejected via Quick Action' })
        });
        const result = await response.json();
        if (result.success) {
          alert("Request successfully rejected!");
          fetchRequests();
        } else {
          alert(result.message || 'Action failed.');
        }
      } catch (error) {
        console.error(`Error processing leave reject:`, error);
        setRequests(prev =>
          prev.map(r => (r._id === id ? { ...r, status: 'Rejected', adminComment: reason } : r))
        );
        alert("Mock Request successfully Rejected.");
      }
    }
  };

  const handleCreateAllocation = async (e) => {
    e.preventDefault();
    if (!allocEmployeeId || allocDays <= 0) {
      setMessage('Please fill in valid Employee ID and Days.');
      return;
    }

    try {
      const response = await fetch('https://hrms-resource.onrender.com/api/leave/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: allocEmployeeId,
          type: allocType,
          days: allocDays
        })
      });
      const result = await response.json();
      if (result.success) {
        setMessage('Leave allocation created successfully.');
        setAllocEmployeeId('');
        setAllocDays(0);
      } else {
        setMessage(result.message || 'Failed to allocate.');
      }
    } catch (err) {
      console.error('Error allocating leaves:', err);
      setMessage(`Mock Allocation: ${allocDays} ${allocType} days assigned to employee ${allocEmployeeId}.`);
      setAllocEmployeeId('');
      setAllocDays(0);
    }
  };

  const filteredRequests = requests.filter(r => {
    const name = r.employee?.name || '';
    const empId = r.employee?.employeeId || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || empId.toLowerCase().includes(query);
  });

  const downloadCSV = () => {
    if (filteredRequests.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = ['Employee Name', 'Employee ID', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Admin Comment'];
    const rows = filteredRequests.map(r => [
      r.employee?.name || 'N/A',
      r.employee?.employeeId || 'N/A',
      r.type || 'N/A',
      new Date(r.startDate).toLocaleDateString(),
      new Date(r.endDate).toLocaleDateString(),
      r.allocationDays || 0,
      r.status || 'Unknown',
      r.adminComment || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "leave_requests_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Time Off Dashboard (Admin)</h2>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('Time Off')}
            style={activeTab === 'Time Off' ? styles.activeTab : styles.tab}
          >
            Time Off Requests
          </button>
          <button
            onClick={() => setActiveTab('Allocation')}
            style={activeTab === 'Allocation' ? styles.activeTab : styles.tab}
          >
            Leave Allocations
          </button>
        </div>
        <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primaryHover transition-colors">
          <Download size={16} />
          Download Report
        </button>
      </div>

      {message && <div style={styles.notification}>{message}</div>}

      {activeTab === 'Time Off' ? (
        <div style={styles.contentCard}>
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="Search by Employee Name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {loading ? (
            <p>Loading requests...</p>
          ) : filteredRequests.length === 0 ? (
            <p style={{ color: '#888', padding: '12px' }}>No leave requests found.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Leave Type</th>
                    <th style={styles.th}>Period</th>
                    <th style={styles.th}>Days</th>
                    <th style={styles.th}>Document</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r._id} style={styles.tableRow}>
                      <td style={{ ...styles.td, fontWeight: '600', color: '#714B67' }}>
                        {r.employee?.name}
                      </td>
                      <td style={styles.td}>{r.employee?.employeeId}</td>
                      <td style={styles.td}>{r.type}</td>
                      <td style={styles.td}>
                        {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>{r.allocationDays}</td>
                      <td style={styles.td}>
                        {r.attachment ? (
                          <a href={`/uploads/${r.attachment}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
                            📄 View File
                          </a>
                        ) : (
                          <span style={{ color: '#aaa' }}>None</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={
                          r.status === 'Approved' ? styles.statusApproved :
                          r.status === 'Rejected' ? styles.statusRejected :
                          styles.statusPending
                        }>
                          {r.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {r.status === 'Pending' ? (
                          <div style={styles.actionGroup}>
                            <button
                              onClick={() => handleApprove(r._id)}
                              style={styles.approveBtn}
                              title="Approve Leave"
                            >
                              🟢 Approve
                            </button>
                            <button
                              onClick={() => handleReject(r._id)}
                              style={styles.rejectBtn}
                              title="Reject Leave"
                            >
                              🔴 Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '13px' }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Allocation Tab */
        <div style={styles.contentCard}>
          <h3 style={styles.sectionTitle}>Add Leave Balance Allocation</h3>
          <form onSubmit={handleCreateAllocation} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Employee ID</label>
              <input
                type="text"
                placeholder="e.g. OIJ20260001"
                value={allocEmployeeId}
                onChange={(e) => setAllocEmployeeId(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Time Off Type</label>
              <select
                value={allocType}
                onChange={(e) => setAllocType(e.target.value)}
                style={styles.select}
              >
                <option value="Paid">Paid Time Off</option>
                <option value="Sick">Sick Time Off</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Allocation Days</label>
              <input
                type="number"
                value={allocDays}
                onChange={(e) => setAllocDays(parseInt(e.target.value) || 0)}
                min="1"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitBtn}>
              Allocate Days
            </button>
          </form>
        </div>
      )}

      {/* Action Modal with Comment Field */}
      {actionModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.sectionTitle}>
              {actionModal.actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Admin Comment (Optional)</label>
              <textarea
                placeholder="Enter a reason or comment..."
                value={actionModal.comment}
                onChange={(e) => setActionModal({ ...actionModal, comment: e.target.value })}
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              />
            </div>
            <div style={styles.modalActions}>
              <button onClick={closeActionModal} style={styles.cancelBtn}>Cancel</button>
              <button 
                onClick={confirmAction} 
                style={actionModal.actionType === 'approve' ? styles.approveBtnModal : styles.rejectBtnModal}
              >
                Confirm {actionModal.actionType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
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
    marginBottom: '24px',
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '12px'
  },
  pageTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#714B67',
    fontWeight: '700'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px'
  },
  tab: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#666',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  activeTab: {
    padding: '8px 16px',
    backgroundColor: '#714B67',
    border: '1px solid #714B67',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s'
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
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
  },
  filterBar: {
    marginBottom: '20px'
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
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
    color: '#333',
    verticalAlign: 'middle'
  },
  link: {
    color: '#714B67',
    textDecoration: 'none',
    fontWeight: '500'
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
  },
  actionGroup: {
    display: 'flex',
    gap: '8px'
  },
  approveBtn: {
    padding: '6px 12px',
    border: '1px solid #28A745',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#28A745',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#28A745',
      color: '#fff'
    }
  },
  rejectBtn: {
    padding: '6px 12px',
    border: '1px solid #DC3545',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#DC3545',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#DC3545',
      color: '#fff'
    }
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  form: {
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#666'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff'
  },
  submitBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#714B67',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background 0.2s',
    alignSelf: 'flex-start',
    marginTop: '8px',
    ':hover': {
      backgroundColor: '#583a50'
    }
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px'
  },
  cancelBtn: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  approveBtnModal: {
    padding: '8px 16px',
    backgroundColor: '#28A745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  rejectBtnModal: {
    padding: '8px 16px',
    backgroundColor: '#DC3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default TimeOffAdmin;
