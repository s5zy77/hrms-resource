import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasCheckedOutToday, setHasCheckedOutToday] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const { isAuthenticated, logout, user } = useAuth();
  const employeeId = user?.employeeId || localStorage.getItem('employeeId') || 'mock-employee-id';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodayStatus();
    }
  }, [employeeId, isAuthenticated]);

  const fetchTodayStatus = async () => {
    try {
      const res = await fetch(`https://hrms-resource.onrender.com/api/attendance/my?employeeId=${employeeId}`, {
        headers: {
          'x-employee-id': employeeId
        }
      });
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        const latest = result.data[0];
        const recordDate = new Date(latest.date).toDateString();
        const todayDate = new Date().toDateString();
        
        if (recordDate === todayDate) {
          if (latest.checkIn && !latest.checkOut) {
            setIsCheckedIn(true);
            setHasCheckedOutToday(false);
          } else if (latest.checkOut) {
            setIsCheckedIn(false);
            setHasCheckedOutToday(true);
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch real attendance status, using local storage fallback:", e);
      const localStatus = localStorage.getItem('isCheckedIn') === 'true';
      const localOut = localStorage.getItem('hasCheckedOutToday') === 'true';
      setIsCheckedIn(localStatus);
      setHasCheckedOutToday(localOut);
    }
  };

  const handleCheckInOut = async () => {
    if (hasCheckedOutToday) {
      alert("You have already checked out today.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isCheckedIn ? '/api/attendance/check-out' : '/api/attendance/check-in';
      const method = isCheckedIn ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-employee-id': employeeId
        },
        body: JSON.stringify({ employeeId })
      });
      const result = await res.json();
      
      if (result.success) {
        if (!isCheckedIn) {
          setIsCheckedIn(true);
          setHasCheckedOutToday(false);
          localStorage.setItem('isCheckedIn', 'true');
          localStorage.setItem('hasCheckedOutToday', 'false');
          alert("Checked in successfully! 👋");
        } else {
          setIsCheckedIn(false);
          setHasCheckedOutToday(true);
          localStorage.setItem('isCheckedIn', 'false');
          localStorage.setItem('hasCheckedOutToday', 'true');
          alert("Checked out successfully! Have a great day.");
        }
        fetchTodayStatus();
      } else {
        alert(result.message || 'Operation failed');
      }
    } catch (e) {
      const nextState = !isCheckedIn;
      setIsCheckedIn(nextState);
      if (nextState) {
        setHasCheckedOutToday(false);
        localStorage.setItem('isCheckedIn', 'true');
        localStorage.setItem('hasCheckedOutToday', 'false');
      } else {
        setHasCheckedOutToday(true);
        localStorage.setItem('isCheckedIn', 'false');
        localStorage.setItem('hasCheckedOutToday', 'true');
      }
      alert(`Demo Mode: Check-${nextState ? 'in' : 'out'} recorded locally!`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Employees', path: '/employees' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/time-off' },
  ];

  return (
    <nav className="bg-surface border-b border-borderLight px-4 md:px-8 py-3.5 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? "/employees" : "/signin"} className="text-xl font-bold text-textPrimary flex items-center gap-2.5 hover:opacity-80 transition-opacity tracking-tight">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white shadow-sm text-sm">
              HR
            </div>
            AeroLeave
          </Link>
          
          {/* Navigation Tabs (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive 
                        ? 'bg-background text-primary' 
                        : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Theme Toggle (Always visible) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-textSecondary hover:bg-background rounded-lg transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Desktop Controls */}
              <div className="hidden md:flex items-center space-x-6 relative">
                <button 
                  onClick={handleCheckInOut}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    hasCheckedOutToday
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                      : isCheckedIn 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30' 
                        : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30'
                  }`}
                >
                  {loading ? 'Processing...' : hasCheckedOutToday ? 'Checked Out' : isCheckedIn ? 'Check Out' : 'Check In →'}
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-sm font-semibold shadow-sm border border-borderLight hover:border-gray-300 transition-all">
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AG'}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-soft border border-borderLight overflow-hidden z-50 py-1">
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-textPrimary hover:bg-background transition-colors">
                        My Profile
                      </Link>
                      <div className="h-px bg-borderLight w-full my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden flex items-center p-2 text-textSecondary hover:bg-background rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/signin" className="hidden sm:block text-sm font-medium text-textSecondary hover:text-textPrimary">Sign In</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:bg-primaryHover transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-borderLight animate-fade-in">
          <div className="flex flex-col space-y-2 mt-4">
            <button 
              onClick={handleCheckInOut}
              disabled={loading}
              className={`px-4 py-3 rounded-lg text-sm font-bold text-center transition-all ${
                hasCheckedOutToday
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                  : isCheckedIn 
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/30' 
                    : 'bg-green-50 text-green-700 dark:bg-green-900/30'
              }`}
            >
              {loading ? 'Processing...' : hasCheckedOutToday ? 'Checked Out' : isCheckedIn ? 'Check Out' : 'Check In →'}
            </button>
            
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-textSecondary hover:bg-background"
              >
                {link.name}
              </Link>
            ))}
            
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-textSecondary hover:bg-background border-t border-borderLight mt-2">
              My Profile
            </Link>
            <button onClick={handleLogout} className="px-4 py-3 rounded-lg text-sm font-medium text-red-600 text-left hover:bg-red-50">
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
