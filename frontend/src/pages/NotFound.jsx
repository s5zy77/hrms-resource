import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center transition-all duration-500 ease-out opacity-100 translate-y-0">
        <h1 className="text-9xl font-black text-primary opacity-20 tracking-tighter">404</h1>
        <div className="-mt-12 mb-8">
          <h2 className="text-3xl font-bold text-textPrimary tracking-tight">Looks like you're lost.</h2>
          <p className="text-textSecondary mt-2">The page you are looking for doesn't exist or has been moved.</p>
        </div>
        
        <Link to="/employees" className="btn-primary inline-flex items-center gap-2">
          <span>←</span> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
