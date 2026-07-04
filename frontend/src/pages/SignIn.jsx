import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCircle } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

export default function SignIn() {
  usePageTitle('Sign In');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');

    if (!loginId.trim() || !password.trim()) {
      setError('Please enter both your Login ID and Password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Default to employee if manual login used
    login({ role: 'employee', employeeId: loginId, email: 'user@aeroleave.com' });
    navigate('/employees');
  };

  const handleAdminDemo = () => {
    setLoginId('admin@aeroleave.com');
    setPassword('demo123');
    // Simulate typing/submitting visually for a split second
    setTimeout(() => {
      login({ role: 'admin', employeeId: 'admin-demo', email: 'admin@aeroleave.com', name: 'Admin Demo' });
      localStorage.setItem('demoTour', 'true');
      navigate('/employees');
    }, 600);
  };

  const handleEmployeeDemo = () => {
    setLoginId('employee@aeroleave.com');
    setPassword('demo123');
    setTimeout(() => {
      login({ role: 'employee', employeeId: 'emp-demo', email: 'employee@aeroleave.com', name: 'Employee Demo' });
      navigate('/employees');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card w-full max-w-[400px] p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white text-lg font-bold shadow-sm mx-auto mb-4 tracking-tight">
            HR
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Welcome back</h1>
          <p className="text-textSecondary mt-1.5 text-sm">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1.5">Login ID</label>
            <input 
              type="text" 
              placeholder="e.g. EMP20250001" 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-textPrimary">Password</label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primaryHover transition-colors">Forgot password?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-2">
            Sign In
          </button>
        </form>

        <div className="mt-6 border-t border-borderLight pt-6">
          <p className="text-xs text-textSecondary text-center mb-4 uppercase tracking-wider font-semibold">Hackathon Demo Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleAdminDemo}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-[#714B67]/10 hover:bg-[#714B67]/20 text-[#714B67] text-sm font-semibold rounded-lg transition-colors"
            >
              <ShieldCheck size={16} />
              Admin Demo
            </button>
            <button 
              onClick={handleEmployeeDemo}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
            >
              <UserCircle size={16} />
              Employee Demo
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-textSecondary">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primaryHover transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
