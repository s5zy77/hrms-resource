import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
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

    // Mock successful login - route to employee dashboard
    navigate('/employees');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgWhite p-4 relative overflow-hidden">
      {/* Decorative background blobs for glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pastelBlueLight/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-softYellow/60 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-10 z-10 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pastelBlueLight to-pastelBlue flex items-center justify-center text-white text-xl font-bold shadow-sm mx-auto mb-4">
            HR
          </div>
          <h1 className="text-3xl font-bold text-pastelBlueDark tracking-tight">Sign In</h1>
          <p className="text-textMuted mt-2 text-sm font-medium">Welcome back to AeroLeave!</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold text-center shadow-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-semibold text-textMain mb-1.5 ml-1">Login ID</label>
            <input 
              type="text" 
              placeholder="e.g. EMP20250001" 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="input-field bg-white/50 backdrop-blur-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
              <label className="block text-sm font-semibold text-textMain">Password</label>
              <a href="#" className="text-xs text-pastelBlue font-bold hover:text-pastelBlueDark transition-colors">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field bg-white/50 backdrop-blur-sm"
            />
          </div>

          <button type="submit" className="btn-primary w-full text-base py-3 mt-4">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textMuted font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pastelBlue font-bold hover:text-pastelBlueDark transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
