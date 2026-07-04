import { useState, useMemo } from 'react';

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

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-20 text-textSecondary bg-surface rounded-xl border border-borderLight shadow-sm">
          No employees found matching "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer">
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
