import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const navLinks = [
    { name: 'Employees', path: '/employees' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/time-off' },
  ];

  return (
    <nav className="bg-surface border-b border-borderLight px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-12">
        {/* Brand Logo */}
        <Link to="/employees" className="text-xl font-bold text-textPrimary flex items-center gap-2.5 hover:opacity-80 transition-opacity tracking-tight">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white shadow-sm text-sm">
            HR
          </div>
          AeroLeave
        </Link>
        
        {/* Navigation Tabs */}
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
      </div>

      <div className="flex items-center space-x-6 relative">
        {/* Check In Button */}
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

        {/* Avatar Dropdown Wrapper */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {/* The Light Yellow Profile DP as requested */}
            <div className="w-10 h-10 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-sm font-semibold shadow-sm border border-borderLight hover:border-gray-300 transition-all">
              JD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-soft border border-borderLight overflow-hidden z-50 py-1">
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-textPrimary hover:bg-background transition-colors">
                My Profile
              </Link>
              <div className="h-px bg-borderLight w-full my-1"></div>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
