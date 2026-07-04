import React from 'react';

const mockEmployees = [
  { id: 1, name: 'Anushka Ghosh', department: 'Engineering', status: 'online', avatar: 'AG' },
  { id: 2, name: 'Ranish D', department: 'Design', status: 'online', avatar: 'RD' },
  { id: 3, name: 'John Doe', department: 'HR', status: 'offline', avatar: 'JD' },
  { id: 4, name: 'Jane Smith', department: 'Marketing', status: 'busy', avatar: 'JS' },
  { id: 5, name: 'Alice Johnson', department: 'Sales', status: 'online', avatar: 'AJ' },
  { id: 6, name: 'Bob Brown', department: 'Engineering', status: 'offline', avatar: 'BB' },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Employee Dashboard</h1>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="input-field w-64"
          />
          <button className="btn-primary flex items-center gap-2">
            <span>+</span> New Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEmployees.map((emp) => (
          <div key={emp.id} className="glass-card p-6 flex items-center gap-5 hover:shadow transition-shadow duration-200 cursor-pointer">
            {/* The Light Yellow Profile DP */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-lg font-semibold border border-borderLight">
                {emp.avatar}
              </div>
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                emp.status === 'online' ? 'bg-green-500' : 
                emp.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div>
              <h3 className="text-base font-semibold text-textPrimary">{emp.name}</h3>
              <p className="text-sm text-textSecondary mt-0.5">{emp.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
