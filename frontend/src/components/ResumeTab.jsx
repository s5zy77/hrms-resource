import { useState } from 'react';

export default function ResumeTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("I am a passionate engineering manager with over 10 years of experience in building scalable web applications and leading high-performing teams.");
  const [skills, setSkills] = useState("JavaScript, React, Node.js, Python, AWS, System Architecture, Agile Leadership");

  return (
    <div className="opacity-100 transition-opacity duration-300 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-textPrimary tracking-tight">Professional Resume</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
            isEditing ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm' : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          {isEditing ? 'Save Changes' : 'Edit Resume'}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">About Me</h3>
          {isEditing ? (
            <textarea 
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="input-field min-h-[120px] w-full"
            />
          ) : (
            <p className="text-textPrimary leading-relaxed bg-background/50 border border-borderLight p-5 rounded-xl shadow-sm text-sm">
              {about}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">Key Skills</h3>
          {isEditing ? (
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input-field w-full"
              placeholder="Comma separated skills..."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.split(',').map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-primary text-white font-medium text-xs rounded-full shadow-sm">
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
