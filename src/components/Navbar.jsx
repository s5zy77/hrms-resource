import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

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

      <div className="flex items-center space-x-6">
        {/* To be filled in Commit 5: Avatar and Check In Button */}
      </div>
    </nav>
  );
}
