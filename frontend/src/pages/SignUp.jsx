import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    role: 'Employee',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Mock registration process
    alert(`Employee ${formData.firstName} Registered Successfully!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12 relative overflow-hidden">
      <div className="glass-card w-full max-w-2xl p-8 md:p-10 z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white text-lg font-bold shadow-sm mx-auto mb-4 tracking-tight">
            HR
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Register New Employee</h1>
          <p className="text-textSecondary mt-1.5 text-sm">Create a new account for onboarding.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Profile Photo Upload UI */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-avatarBg text-avatarText flex items-center justify-center text-3xl font-bold shadow-sm border-2 border-dashed border-avatarText/40 group-hover:bg-avatarBg/70 transition-all duration-200">
                +
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs font-semibold tracking-wide transition-all duration-200">
                UPLOAD
              </div>
            </div>
            <span className="text-xs text-textSecondary mt-2.5 font-medium uppercase tracking-wider">Profile Photo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1.5">First Name</label>
              <input type="text" name="firstName" onChange={handleChange} className="input-field" placeholder="Jane" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1.5">Last Name</label>
              <input type="text" name="lastName" onChange={handleChange} className="input-field" placeholder="Doe" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1.5">Department</label>
              <select name="department" onChange={handleChange} className="input-field bg-white" required>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1.5">Role</label>
              <select name="role" onChange={handleChange} className="input-field bg-white" required>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1.5">Email Address</label>
              <input type="email" name="email" onChange={handleChange} className="input-field" placeholder="jane@company.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1.5">Temporary Password</label>
              <input type="password" name="password" onChange={handleChange} className="input-field" placeholder="••••••••" required />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full py-3 text-base">
              Register Employee
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-textSecondary border-t border-borderLight pt-6">
          <Link to="/signin" className="font-medium text-primary hover:text-primaryHover transition-colors flex items-center justify-center gap-1.5">
            <span>←</span> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
