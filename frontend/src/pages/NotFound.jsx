import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black text-primary/20 tracking-tighter">404</h1>
        <div className="-mt-12 mb-8">
          <h2 className="text-3xl font-bold text-textPrimary tracking-tight">Looks like you're lost.</h2>
          <p className="text-textSecondary mt-2">The page you are looking for doesn't exist or has been moved.</p>
        </div>
        
        <Link to="/employees" className="btn-primary inline-flex items-center gap-2">
          <span>←</span> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
