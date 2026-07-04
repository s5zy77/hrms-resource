import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PrivateInfoTab() {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    if (isEditing) {
      toast.success('Private information updated successfully!');
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="opacity-100 transition-opacity duration-300 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-textPrimary tracking-tight">Private Information</h2>
        <button 
          onClick={handleToggleEdit}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
            isEditing 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-surface border border-borderLight text-textSecondary hover:text-primary hover:border-primary/30'
          }`}
        >
          {isEditing ? 'Save Changes' : '✎ Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Column */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-textSecondary uppercase tracking-wider border-b border-borderLight pb-2">
            Personal Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5">Date of Birth</label>
              <input 
                type="date" 
                className="input-field w-full bg-surface shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                defaultValue="1990-05-15" 
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5">Social Security Number</label>
              <input 
                type="password" 
                className="input-field w-full bg-surface shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                defaultValue="123456789" 
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5">Home Address</label>
              <textarea 
                className="input-field w-full min-h-[100px] bg-surface shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                defaultValue="123 Tech Lane, Apt 4B&#10;San Francisco, CA 94105"
                disabled={!isEditing}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Column */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-textSecondary uppercase tracking-wider border-b border-borderLight pb-2">
            Emergency Contacts
          </h3>
          
          <div className="bg-background border border-borderLight p-4 rounded-xl shadow-sm space-y-3 transition-transform hover:-translate-y-0.5 relative group">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-textPrimary">Jane Doe</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-bold">Spouse</span>
            </div>
            <div className="text-sm text-textSecondary font-medium flex items-center gap-2">
              <span>📞</span> (555) 123-4567
            </div>
            {isEditing && (
              <button className="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Contact">
                🗑️
              </button>
            )}
          </div>

          <div className="bg-background border border-borderLight p-4 rounded-xl shadow-sm space-y-3 transition-transform hover:-translate-y-0.5 relative group">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-textPrimary">Robert Doe</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-bold">Father</span>
            </div>
            <div className="text-sm text-textSecondary font-medium flex items-center gap-2">
              <span>📞</span> (555) 987-6543
            </div>
            {isEditing && (
              <button className="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Contact">
                🗑️
              </button>
            )}
          </div>

          {isEditing && (
            <button className="w-full py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary font-bold text-sm hover:bg-primary/5 transition-colors">
              + Add Contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
