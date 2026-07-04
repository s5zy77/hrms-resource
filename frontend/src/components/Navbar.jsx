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
    <nav className="bg-cardWhite border-b border-pastelBlueLight/30 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-12">
        {/* Brand Logo */}
        <Link to="/employees" className="text-xl font-bold text-pastelBlueDark flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pastelBlueLight to-pastelBlue flex items-center justify-center text-white shadow-sm">
            HR
          </div>
          <span className="tracking-wide">AeroLeave</span>
        </Link>
        
        {/* Navigation Tabs */}
        <div className="hidden md:flex space-x-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-pastelBlue/10 text-pastelBlueDark shadow-sm' 
                    : 'text-textMuted hover:bg-pastelBlue/5 hover:text-pastelBlueDark'
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
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
            isCheckedIn 
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
              : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pastelBlue to-pastelBlueLight text-white flex items-center justify-center font-bold shadow-md border-2 border-white hover:border-pastelBlueLight transition-all">
              JD
            </div>
            {/* Status Dot */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-pastelBlueLight/30 overflow-hidden z-50">
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 text-sm text-textMain hover:bg-bgWhite transition-colors font-semibold">
                My Profile
              </Link>
              <div className="h-px bg-bgWhite w-full"></div>
              <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
