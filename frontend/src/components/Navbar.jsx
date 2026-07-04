import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Employees', path: '/employees' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/time-off' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setIsMobileMenuOpen(false);
  };

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

        {isAuthenticated ? (
          <>
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-6 relative">
              <button 
                onClick={() => setIsCheckedIn(!isCheckedIn)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isCheckedIn 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {isCheckedIn ? 'Check Out' : 'Check In →'}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-sm font-semibold shadow-sm border border-borderLight hover:border-gray-300 transition-all">
                    AG
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
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
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-current"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
              </div>
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

      {/* Mobile Menu Dropdown */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-borderLight animate-fade-in">
          <div className="flex flex-col space-y-2 mt-4">
            <button 
              onClick={() => setIsCheckedIn(!isCheckedIn)}
              className={`px-4 py-3 rounded-lg text-sm font-bold text-center transition-all ${
                isCheckedIn 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {isCheckedIn ? 'Check Out' : 'Check In →'}
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
