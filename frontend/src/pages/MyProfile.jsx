import { useState, useEffect } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import ResumeTab from '../components/ResumeTab';
import PrivateInfoTab from '../components/PrivateInfoTab';
import SalaryInfoTab from '../components/SalaryInfoTab';

export default function MyProfile() {
  usePageTitle('My Profile');
  const [activeTab, setActiveTab] = useState('resume');
  const [localTime, setLocalTime] = useState('');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const defaultProfile = {
    name: 'John Doe',
    role: 'Senior Engineering Manager',
    email: 'john.doe@nexus.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    avatar: 'JD'
  };

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('myProfile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  // Modal editing form state inline
  const [editName, setEditName] = useState(profileData.name);
  const [editRole, setEditRole] = useState(profileData.role);
  const [editPhone, setEditPhone] = useState(profileData.phone);
  const [editLocation, setEditLocation] = useState(profileData.location);

  // Sync edit form states when modal opens
  const openEditModal = () => {
    setEditName(profileData.name);
    setEditRole(profileData.role);
    setEditPhone(profileData.phone);
    setEditLocation(profileData.location);
    setIsEditProfileOpen(true);
  };

  useEffect(() => {
    const updateTime = () => {
      try {
        setLocalTime(new Date().toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' (New York)');
      } catch (e) {}
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveProfileSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...profileData,
      name: editName,
      role: editRole,
      phone: editPhone,
      location: editLocation
    };
    setProfileData(updated);
    try {
      localStorage.setItem('myProfile', JSON.stringify(updated));
    } catch {}
    setIsEditProfileOpen(false);
    alert('Profile saved successfully!');
  };

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
            {profileData.avatar}
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-surface bg-green-500 shadow-sm"></div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full gap-4">
            <div>
              <h1 className="text-3xl font-bold text-textPrimary tracking-tight">{profileData.name}</h1>
              <p className="text-primary font-medium mt-1">{profileData.role}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-4 text-sm text-textSecondary font-medium">
                <span className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-mono font-bold">
                  ID: EMP-2026-0003
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📧</span> {profileData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📞</span> {profileData.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📍</span> {profileData.location}
                </span>
              </div>

              <div className="mt-3 text-xs text-textSecondary font-medium flex items-center justify-center md:justify-start gap-1.5">
                <span>🕒 Local Time:</span>
                <span className="text-textPrimary font-bold">{localTime}</span>
              </div>
            </div>

            <button onClick={openEditModal} className="btn-primary w-full md:w-auto mt-2 md:mt-0 relative z-20">
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
          <PrivateInfoTab />
        )}

        {activeTab === 'salary' && (
          <SalaryInfoTab employeeId="EMP-2026-0003" isAdmin={true} />
        )}
      </div>

      {/* Edit Profile Modal inline */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-left" style={{ zIndex: 99999 }}>
          <div className="bg-surface w-full max-w-lg p-6 m-4 shadow-2xl border border-borderLight rounded-xl flex flex-col gap-4" style={{ position: 'relative', zIndex: 100000 }}>
            <div className="flex justify-between items-center border-b border-borderLight pb-3">
              <h3 className="text-lg font-bold text-textPrimary">Edit Profile Details</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-textSecondary hover:text-textPrimary text-xl">×</button>
            </div>
            <form onSubmit={handleSaveProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">Full Name</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">Job Title</label>
                <input type="text" required value={editRole} onChange={(e) => setEditRole(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">Phone Number</label>
                <input type="text" required value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">Location</label>
                <input type="text" required value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="input-field" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-4 py-2 border border-gray-200 text-textSecondary text-sm rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="btn-primary text-sm py-2">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
