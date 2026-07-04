import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { Calendar, User, Clock, LogOut, Users, UserCheck, UserMinus } from 'lucide-react';
import { Joyride, STATUS } from 'react-joyride';

const mockEmployees = [
  { id: 1, name: 'Anushka Ghosh', department: 'Engineering', status: 'online', avatar: 'AG', email: 'anushka@aeroleave.com', employeeId: 'EMP-2026-0001', phone: '+91 98765 43210', joiningDate: '2024-03-15', timezone: 'Asia/Kolkata', location: 'Kolkata, India' },
  { id: 2, name: 'Ranish D', department: 'Design', status: 'online', avatar: 'RD', email: 'ranish@aeroleave.com', employeeId: 'EMP-2026-0002', phone: '+91 91234 56789', joiningDate: '2024-04-10', timezone: 'Asia/Kolkata', location: 'Kolkata, India' },
  { id: 3, name: 'John Doe', department: 'HR', status: 'offline', avatar: 'JD', email: 'john.doe@aeroleave.com', employeeId: 'EMP-2026-0003', phone: '+1 (555) 019-2834', joiningDate: '2023-01-15', timezone: 'America/New_York', location: 'New York, USA' },
  { id: 4, name: 'Jane Smith', department: 'Marketing', status: 'busy', avatar: 'JS', email: 'jane.smith@aeroleave.com', employeeId: 'EMP-2026-0004', phone: '+1 (555) 765-4321', joiningDate: '2025-06-01', timezone: 'America/Los_Angeles', location: 'Los Angeles, USA' },
  { id: 5, name: 'Alice Johnson', department: 'Sales', status: 'online', avatar: 'AJ', email: 'alice.j@aeroleave.com', employeeId: 'EMP-2026-0005', phone: '+44 20 7946 0958', joiningDate: '2025-09-12', timezone: 'Europe/London', location: 'London, UK' },
  { id: 6, name: 'Bob Brown', department: 'Engineering', status: 'offline', avatar: 'BB', email: 'bob.brown@aeroleave.com', employeeId: 'EMP-2026-0006', phone: '+49 30 901820', joiningDate: '2024-11-20', timezone: 'Europe/Berlin', location: 'Berlin, Germany' },
];

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || localStorage.getItem('role') || 'employee';

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [runTour, setRunTour] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [timeTick, setTimeTick] = useState(0);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 5000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    if (role === 'admin' && localStorage.getItem('demoTour') === 'true') {
      setRunTour(true);
      localStorage.removeItem('demoTour'); // Clear immediately so it never repeats
    }
  }, [role]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.removeItem('demoTour');
    }
  };

  const steps = [
    {
      target: '.admin-directory-header',
      content: 'Welcome to AeroLeave Admin! Here is your employee directory.',
      disableBeacon: true,
      placement: 'bottom-start'
    },
    {
      target: '.employee-card-0',
      content: 'Click on any employee to view their detailed attendance and profile information.',
      disableBeacon: true,
    },
    {
      target: '.admin-search-bar',
      content: 'Quickly find employees here, or use the navigation tabs above to manage time off and attendance.',
      disableBeacon: true,
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      // Exclude currently logged-in user (John Doe) from the employee directory
      if (user?.email && emp.email.toLowerCase() === user.email.toLowerCase()) {
        return false;
      }
      const query = searchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(query) || 
        emp.department.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, user]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // --- ADMIN VIEW ---
  if (role === 'admin') {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Joyride
          steps={steps}
          run={runTour}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#7BC9F5',
              textColor: '#1E293B',
              zIndex: 10000,
            },
          }}
        />
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight admin-directory-header">Admin Directory</h1>
          <div className="flex gap-3 w-full md:w-auto admin-search-bar">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search by name or dept... (Ctrl+K)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full md:w-72"
            />
            <button onClick={() => navigate('/signup')} className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
              <span>+</span> New Employee
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Employees</p>
              <p className="text-3xl font-bold text-textPrimary mt-1">{mockEmployees.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Present Today</p>
              <p className="text-3xl font-bold text-green-600 mt-1">4</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <UserCheck size={24} />
            </div>
          </div>
          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">On Leave</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">2</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserMinus size={24} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-borderLight animate-pulse"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-borderLight rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-borderLight rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-20 text-textSecondary bg-surface rounded-xl border border-borderLight shadow-sm animate-fade-in">
            No employees found matching "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredEmployees.map((emp, index) => {
              const getLocalTime = (tz) => {
                try {
                  return new Date().toLocaleTimeString('en-US', {
                    timeZone: tz,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) + ' (' + tz.split('/')[1]?.replace('_', ' ') + ')';
                } catch (e) {
                  return '';
                }
              };

              const handleCopyEmail = (e, email, id) => {
                e.stopPropagation();
                navigator.clipboard.writeText(email);
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000);
              };

              return (
                <div 
                  key={emp.id} 
                  onClick={() => navigate(`/employee/${emp.id}`)}
                  className={`glass-card overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer employee-card-${index}`}
                >
                  <div className="h-16 bg-gradient-to-r from-primary/20 to-transparent"></div>
                  <div className="p-6 pt-0">
                    <div className="-mt-10 mb-3">
                      <div className="w-20 h-20 rounded-full bg-surface p-1 shadow-sm relative inline-block">
                        <div className="w-full h-full rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-xl font-bold border border-avatarText/10">
                          {emp.avatar}
                        </div>
                        <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-surface shadow-sm ${
                          emp.status === 'online' ? 'bg-green-500' : 
                          emp.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-textPrimary">{emp.name}</h3>
                          <p className="text-sm text-textSecondary font-medium mt-0.5">{emp.department}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-textSecondary rounded font-mono">
                          {emp.employeeId}
                        </span>
                      </div>
                      
                      <div className="mt-3 text-xs text-textSecondary font-medium flex items-center gap-1">
                        <span>🕒 Local:</span>
                        <span className="text-textPrimary font-semibold">{getLocalTime(emp.timezone)}</span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-borderLight flex items-center justify-between text-xs text-textSecondary">
                        <div className="flex items-center gap-1.5" onClick={(e) => handleCopyEmail(e, emp.email, emp.id)}>
                          <span className="truncate max-w-[150px]">{emp.email}</span>
                          <span className="cursor-pointer text-primary opacity-60 hover:opacity-100 text-[10px]" title="Copy Email">
                            {copiedId === emp.id ? '✓ Copied' : '📋'}
                          </span>
                        </div>
                        <span className="font-semibold text-primary">View Profile &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- EMPLOYEE VIEW ---
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-borderLight pb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Welcome back, {user?.name || 'Employee'}! 👋</h1>
          <p className="text-textSecondary mt-1 text-sm">Here is your daily summary and quick links.</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-textPrimary mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => navigate('/profile')} className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <User size={24} />
          </div>
          <span className="font-semibold text-textPrimary">My Profile</span>
        </button>

        <button onClick={() => navigate('/attendance')} className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <span className="font-semibold text-textPrimary">My Attendance</span>
        </button>

        <button onClick={() => navigate('/time-off')} className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <span className="font-semibold text-textPrimary">Leave Requests</span>
        </button>

        <button onClick={handleLogout} className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all border-red-100 hover:border-red-200">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <LogOut size={24} />
          </div>
          <span className="font-semibold text-red-600">Logout</span>
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-textPrimary mb-4">Recent Activity & Alerts</h2>
        <div className="glass-card p-6 divide-y divide-borderLight">
          <div className="py-4 flex items-center gap-4 first:pt-0">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm font-semibold text-textPrimary">Successfully Checked In</p>
              <p className="text-xs text-textSecondary mt-1">Today at 09:00 AM</p>
            </div>
          </div>
          <div className="py-4 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div>
              <p className="text-sm font-semibold text-textPrimary">Paid Leave Request Approved</p>
              <p className="text-xs text-textSecondary mt-1">Your request for Jul 06 - Jul 08 was approved by HR.</p>
            </div>
          </div>
          <div className="py-4 flex items-center gap-4 last:pb-0">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div>
              <p className="text-sm font-semibold text-textPrimary">Monthly Payslip Generated</p>
              <p className="text-xs text-textSecondary mt-1">June 2026 payslip is now available in your profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
