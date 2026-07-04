import React from 'react';

const mockEmployees = [
  { id: 1, name: 'Anushka Ghosh', department: 'Engineering', status: 'online', avatar: 'AG' },
  { id: 2, name: 'Ranish D', department: 'Design', status: 'online', avatar: 'RD' },
  { id: 3, name: 'John Doe', department: 'HR', status: 'offline', avatar: 'JD' },
  { id: 4, name: 'Jane Smith', department: 'Marketing', status: 'busy', avatar: 'JS' },
  { id: 5, name: 'Alice Johnson', department: 'Sales', status: 'online', avatar: 'AJ' },
  { id: 6, name: 'Bob Brown', department: 'Engineering', status: 'offline', avatar: 'BB' },
  { id: 7, name: 'Charlie Davis', department: 'Support', status: 'online', avatar: 'CD' },
  { id: 8, name: 'Diana Evans', department: 'HR', status: 'busy', avatar: 'DE' },
  { id: 9, name: 'Evan Foster', department: 'Finance', status: 'online', avatar: 'EF' },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-pastelBlueDark tracking-tight">Employee Dashboard</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="input-field w-64 bg-white"
            />
            {/* Simple search icon text representation */}
            <span className="absolute right-4 top-3 text-pastelBlueDark opacity-50">🔍</span>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> NEW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEmployees.map((emp) => (
          <div key={emp.id} className="glass-card p-6 flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group cursor-pointer bg-white">
            {/* Status Dot */}
            <div className={`absolute top-4 right-4 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
              emp.status === 'online' ? 'bg-green-400' : 
              emp.status === 'busy' ? 'bg-red-400' : 'bg-gray-300'
            }`}></div>
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pastelBlueLight to-pastelBlue flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-sm border-4 border-white group-hover:border-pastelBlue/30 transition-all">
              {emp.avatar}
            </div>
            
            <h3 className="text-lg font-bold text-textMain mb-1">{emp.name}</h3>
            <span className="px-3 py-1 bg-pastelBlue/10 text-pastelBlueDark rounded-full text-xs font-semibold">
              {emp.department}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
