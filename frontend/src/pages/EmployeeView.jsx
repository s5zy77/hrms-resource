import { useParams, Link } from 'react-router-dom';

export default function EmployeeView() {
  const { id } = useParams();

  // Mock employee data based on ID
  const mockEmployee = {
    id: id,
    name: id === '1' ? 'Anushka Ghosh' : id === '2' ? 'Ranish D' : 'John Doe',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    email: `emp${id}@aeroleave.com`,
    location: 'Remote',
    avatar: id === '1' ? 'AG' : id === '2' ? 'RD' : 'JD',
    status: 'online',
    about: "I am a passionate engineer with a strong focus on frontend architecture, UI/UX, and building highly scalable user interfaces. Always eager to collaborate and learn.",
    skills: ["JavaScript", "React", "Node.js", "System Architecture", "UI/UX Design"]
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
              <h1 className="text-3xl font-bold text-textPrimary tracking-tight">{mockEmployee.name}</h1>
              <p className="text-primary font-medium mt-1">{mockEmployee.role} • {mockEmployee.department}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-4 text-sm text-textSecondary font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📧</span> {mockEmployee.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📍</span> {mockEmployee.location}
                </span>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-lg hover:bg-primary/20 transition-all">
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
    </div>
  );
}
