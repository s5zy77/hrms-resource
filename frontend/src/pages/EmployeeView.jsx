import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function EmployeeView() {
  const { id } = useParams();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [localTime, setLocalTime] = useState('');
  
  // Modal form states inline
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const employeesData = {
    '1': { id: '1', name: 'Anushka Ghosh', department: 'Engineering', role: 'Senior Software Engineer', status: 'online', avatar: 'AG', email: 'anushka@aeroleave.com', employeeId: 'EMP-2026-0001', phone: '+91 98765 43210', joiningDate: '2024-03-15', timezone: 'Asia/Kolkata', location: 'Kolkata, India', about: "I am a passionate engineer with a strong focus on frontend architecture, UI/UX, and building highly scalable user interfaces. Always eager to collaborate and learn.", skills: ["JavaScript", "React", "Node.js", "System Architecture", "UI/UX Design"] },
    '2': { id: '2', name: 'Ranish D', department: 'Design', role: 'Lead Product Designer', status: 'online', avatar: 'RD', email: 'ranish@aeroleave.com', employeeId: 'EMP-2026-0002', phone: '+91 91234 56789', joiningDate: '2024-04-10', timezone: 'Asia/Kolkata', location: 'Kolkata, India', about: "Passionate product designer specializing in creating clean user interfaces, typography, and premium micro-interactions. Always striving for aesthetic and functional perfection.", skills: ["Figma", "UI/UX Design", "CSS/HTML", "Motion Design", "Prototyping"] },
    '3': { id: '3', name: 'John Doe', department: 'HR', role: 'Human Resources Lead', status: 'offline', avatar: 'JD', email: 'john.doe@aeroleave.com', employeeId: 'EMP-2026-0003', phone: '+1 (555) 019-2834', joiningDate: '2023-01-15', timezone: 'America/New_York', location: 'New York, USA', about: "Human resources professional dedicated to talent acquisition, employee experience, onboarding, and fostering a collaborative organizational culture.", skills: ["Recruiting", "Talent Management", "Conflict Resolution", "HR Compliance", "Employee Relations"] },
  };

  const mockEmployee = employeesData[id] || {
    id: id,
    name: 'John Doe',
    department: 'Engineering',
    role: 'Software Engineer',
    email: `emp${id}@aeroleave.com`,
    employeeId: `EMP-2026-000${id}`,
    phone: '+1 (555) 000-1111',
    joiningDate: '2025-01-10',
    timezone: 'America/New_York',
    location: 'Remote',
    avatar: 'JD',
    status: 'offline',
    about: "I am a passionate engineer with a strong focus on frontend architecture, UI/UX, and building highly scalable user interfaces. Always eager to collaborate and learn.",
    skills: ["JavaScript", "React", "Node.js", "System Architecture", "UI/UX Design"]
  };

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Date().toLocaleTimeString('en-US', {
          timeZone: mockEmployee.timezone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        setLocalTime(timeStr + ' (' + mockEmployee.timezone.split('/')[1]?.replace('_', ' ') + ')');
      } catch (e) {
        setLocalTime('');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [mockEmployee.timezone]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendEmailSubmit = (e) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      alert(`Email sent successfully to ${mockEmployee.name} at ${mockEmployee.email}!\n\nSubject: ${emailSubject}`);
      setIsEmailModalOpen(false);
      setEmailSubject('');
      setEmailBody('');
    }, 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <Link to="/employees" className="inline-flex items-center gap-2 text-sm font-bold text-textSecondary hover:text-primary transition-colors mb-6">
        <span>←</span> Back to Directory
      </Link>

      {/* Profile Header Component (Read-Only) */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-3xl font-bold border border-avatarText/10 shadow-sm">
            {mockEmployee.avatar}
          </div>
          <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-surface shadow-sm ${
            mockEmployee.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-bold text-textPrimary tracking-tight">{mockEmployee.name}</h1>
                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded font-mono font-bold flex items-center gap-1.5">
                  ID: {mockEmployee.employeeId}
                  <button onClick={() => handleCopy(mockEmployee.employeeId, 'id')} className="opacity-60 hover:opacity-100" title="Copy ID">
                    {copiedField === 'id' ? '✓' : '📋'}
                  </button>
                </span>
              </div>
              <p className="text-primary font-medium mt-1">{mockEmployee.role} • {mockEmployee.department}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-4 text-sm text-textSecondary font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📧</span> {mockEmployee.email}
                  <button onClick={() => handleCopy(mockEmployee.email, 'email')} className="opacity-60 hover:opacity-100 text-xs" title="Copy Email">
                    {copiedField === 'email' ? '✓ Copied!' : '📋'}
                  </button>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📞</span> {mockEmployee.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📍</span> {mockEmployee.location}
                </span>
              </div>
              
              <div className="mt-3 text-xs text-textSecondary font-medium flex items-center justify-center md:justify-start gap-1.5">
                <span>🕒 Local Time:</span>
                <span className="text-textPrimary font-bold">{localTime}</span>
              </div>
            </div>
            
            <button onClick={() => { alert('Opening Send Message Modal!'); setIsEmailModalOpen(true); }} className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primaryHover transition-all shadow-sm relative z-20">
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation (Only Resume for public view) */}
      <div className="flex space-x-2 border-b border-borderLight mb-6">
        <button className="px-6 py-3 font-medium text-sm text-primary relative">
          Resume
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
        </button>
      </div>

      {/* Public Resume Content (Read-Only) */}
      <div className="glass-card p-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">About</h3>
            <p className="text-textPrimary leading-relaxed bg-background/50 border border-borderLight p-5 rounded-xl shadow-sm text-sm">
              {mockEmployee.about}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-background/50 border border-borderLight p-5 rounded-xl shadow-sm text-sm">
              <div>
                <span className="block text-xs text-textSecondary font-semibold uppercase">Joining Date</span>
                <span className="text-textPrimary font-bold mt-1 block">
                  {new Date(mockEmployee.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="block text-xs text-textSecondary font-semibold uppercase">Timezone</span>
                <span className="text-textPrimary font-semibold mt-1 block">{mockEmployee.timezone}</span>
              </div>
              <div>
                <span className="block text-xs text-textSecondary font-semibold uppercase">Primary Location</span>
                <span className="text-textPrimary font-semibold mt-1 block">{mockEmployee.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {mockEmployee.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 font-bold text-xs rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal rendered directly inline */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-surface w-full max-w-lg p-6 m-4 shadow-2xl border border-borderLight rounded-xl flex flex-col gap-4" style={{ position: 'relative', zIndex: 100000 }}>
            <div className="flex justify-between items-center border-b border-borderLight pb-3">
              <h3 className="text-lg font-bold text-textPrimary">Send Direct Email</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-textSecondary hover:text-textPrimary text-xl">×</button>
            </div>
            <form onSubmit={handleSendEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">To</label>
                <input type="text" value={`${mockEmployee.name} (${mockEmployee.email})`} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">Subject</label>
                <input type="text" required value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Enter email subject" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5">Message Body</label>
                <textarea required rows={5} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Type your message here..." className="input-field resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 border border-gray-200 text-textSecondary text-sm rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSendingEmail} className="btn-primary text-sm py-2">
                  {isSendingEmail ? 'Sending...' : '📧 Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
