import { useState } from 'react';
import ResumeTab from '../components/ResumeTab';

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState('resume');

  const tabs = [
    { id: 'resume', label: 'Resume' },
    { id: 'private', label: 'Private Info' },
    { id: 'salary', label: 'Salary Info' }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Profile Header Component */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-3xl font-bold border border-avatarText/10 shadow-sm">
            JD
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-surface bg-green-500 shadow-sm"></div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full gap-4">
            <div>
              <h1 className="text-3xl font-bold text-textPrimary tracking-tight">John Doe</h1>
              <p className="text-primary font-medium mt-1">Senior Engineering Manager</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-4 text-sm text-textSecondary font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📧</span> john.doe@aeroleave.com
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📍</span> San Francisco, CA
                </span>
              </div>
            </div>

            <button className="btn-primary w-full md:w-auto mt-2 md:mt-0">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stateful Tab Navigation */}
      <div className="flex space-x-2 border-b border-borderLight mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-textSecondary hover:text-textPrimary hover:bg-surface/50 rounded-t-lg'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="glass-card p-8 min-h-[400px]">
        {activeTab === 'resume' && (
          <ResumeTab />
        )}

        {activeTab === 'private' && (
          <div className="opacity-100 transition-opacity duration-300">
            <h2 className="text-xl font-bold text-textPrimary mb-4 tracking-tight">Private Information</h2>
            <p className="text-textSecondary text-sm">Emergency contacts and personal details go here.</p>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="opacity-100 transition-opacity duration-300">
            <h2 className="text-xl font-bold text-textPrimary mb-4 tracking-tight">Salary Information</h2>
            <p className="text-textSecondary text-sm">Payslip integration will be built later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
