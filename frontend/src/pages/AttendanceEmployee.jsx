import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AttendanceEmployee() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || localStorage.getItem('employeeId') || 'mock-employee-id';
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchLogs();
  }, [currentMonth, currentYear, employeeId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

      const res = await fetch(`/api/attendance/my?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'x-employee-id': employeeId
        }
      });
      const result = await res.json();
      if (result.success) {
        setRecords(result.data || []);
      }
    } catch (e) {
      console.warn("API Error, using fallback mock data:", e);
      // Fallback mockup data for dashboard testing
      const mockData = [
        {
          _id: '1',
          date: new Date(currentYear, currentMonth, 4).toISOString(),
          checkIn: new Date(currentYear, currentMonth, 4, 9, 0).toISOString(),
          checkOut: new Date(currentYear, currentMonth, 4, 18, 0).toISOString(),
          workHours: 8,
          extraHours: 0,
          status: 'Present'
        },
        {
          _id: '2',
          date: new Date(currentYear, currentMonth, 3).toISOString(),
          checkIn: new Date(currentYear, currentMonth, 3, 9, 30).toISOString(),
          checkOut: new Date(currentYear, currentMonth, 3, 19, 0).toISOString(),
          workHours: 8.5,
          extraHours: 0.5,
          status: 'Present'
        },
        {
          _id: '3',
          date: new Date(currentYear, currentMonth, 2).toISOString(),
          checkIn: new Date(currentYear, currentMonth, 2, 10, 0).toISOString(),
          checkOut: new Date(currentYear, currentMonth, 2, 13, 0).toISOString(),
          workHours: 2,
          extraHours: 0,
          status: 'Halfday'
        }
      ];
      setRecords(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Calculations for summary stats
  const presentDays = records.filter(r => r.status === 'Present').length;
  const halfDays = records.filter(r => r.status === 'Halfday').length;
  const totalDays = records.length;
  
  const totalHoursWorked = records.reduce((acc, r) => acc + (r.workHours || 0), 0);
  const totalOvertime = records.reduce((acc, r) => acc + (r.extraHours || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Attendance Logs</h1>
          <p className="text-textSecondary mt-1 text-sm">Track your daily working hours, logs, and status history.</p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center space-x-3 bg-surface px-4 py-2 border border-borderLight rounded-xl shadow-sm">
          <button 
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-background text-textSecondary hover:text-textPrimary transition-all"
          >
            &larr;
          </button>
          <span className="text-sm font-semibold text-textPrimary min-w-[120px] text-center select-none">
            {months[currentMonth]} {currentYear}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-background text-textSecondary hover:text-textPrimary transition-all"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Days Present</span>
          <h3 className="text-2xl font-bold text-textPrimary mt-2">{presentDays} Days</h3>
          <span className="text-[11px] text-green-600 font-medium mt-1">🟢 Logged standard shifts</span>
        </div>

        <div className="card p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Half Days</span>
          <h3 className="text-2xl font-bold text-textPrimary mt-2">{halfDays} Days</h3>
          <span className="text-[11px] text-amber-600 font-medium mt-1">🟠 Less than 4 hours logged</span>
        </div>

        <div className="card p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Total Work Hours</span>
          <h3 className="text-2xl font-bold text-textPrimary mt-2">{totalHoursWorked.toFixed(1)} Hrs</h3>
          <span className="text-[11px] text-textSecondary mt-1">Excludes break times</span>
        </div>

        <div className="card p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Overtime Accumulation</span>
          <h3 className="text-2xl font-bold text-primary mt-2">{totalOvertime.toFixed(1)} Hrs</h3>
          <span className="text-[11px] text-primary font-medium mt-1">✨ Extra hours recorded</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-borderLight flex justify-between items-center">
          <h2 className="text-lg font-bold text-textPrimary">Daily Shifts</h2>
          <span className="text-xs font-semibold text-textSecondary uppercase">{totalDays} Logs Found</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-borderLight text-textSecondary text-xs font-semibold uppercase">
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Check In</th>
                <th className="px-6 py-3.5">Check Out</th>
                <th className="px-6 py-3.5">Work Hours</th>
                <th className="px-6 py-3.5">Overtime</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-textSecondary font-medium">
                    Loading attendance entries...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-textSecondary font-medium">
                    No logs recorded for this month.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4 font-semibold text-textPrimary">
                      {new Date(record.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-medium">
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-medium">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-textPrimary font-semibold">
                      {record.workHours !== undefined ? `${record.workHours.toFixed(1)} hrs` : '—'}
                    </td>
                    <td className="px-6 py-4 text-primary font-bold">
                      {record.extraHours > 0 ? `+${record.extraHours.toFixed(1)} hrs` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'Present' 
                          ? 'bg-green-50 text-green-700'
                          : record.status === 'Halfday'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
