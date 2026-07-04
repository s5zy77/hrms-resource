import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const mockEmployees = [
  { id: 1, name: 'Anushka Ghosh', department: 'Engineering', status: 'online', avatar: 'AG' },
  { id: 2, name: 'Ranish D', department: 'Design', status: 'online', avatar: 'RD' },
  { id: 3, name: 'John Doe', department: 'HR', status: 'offline', avatar: 'JD' },
  { id: 4, name: 'Jane Smith', department: 'Marketing', status: 'busy', avatar: 'JS' },
  { id: 5, name: 'Alice Johnson', department: 'Sales', status: 'online', avatar: 'AJ' },
  { id: 6, name: 'Bob Brown', department: 'Engineering', status: 'offline', avatar: 'BB' },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate API fetch delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading for effect
    return () => clearTimeout(timer);
  }, []);

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const query = searchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(query) || 
        emp.department.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Employee Dashboard</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search by name or dept..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full md:w-72"
          />
          <button className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <span>+</span> New Employee
          </button>
        </div>
      </div>

      {isLoading ? (
        // Skeleton Loaders
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
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              onClick={() => navigate(`/employee/${emp.id}`)}
              className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* The Light Yellow Profile DP */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-lg font-bold border border-avatarText/10 shadow-sm">
                  {emp.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-surface shadow-sm ${
                  emp.status === 'online' ? 'bg-green-500' : 
                  emp.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
              </div>
              
              <div>
                <h3 className="text-base font-bold text-textPrimary">{emp.name}</h3>
                <p className="text-sm text-textSecondary font-medium mt-0.5">{emp.department}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
