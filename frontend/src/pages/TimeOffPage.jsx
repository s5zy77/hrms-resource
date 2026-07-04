import { useAuth } from '../context/AuthContext';
import TimeOffEmployee from './TimeOffEmployee';
import TimeOffAdmin from './TimeOffAdmin';

export default function TimeOffPage() {
  const { user } = useAuth();
  
  // Check user role from context, fallback to localStorage or default
  const role = user?.role || localStorage.getItem('role') || 'admin';
  
  if (role === 'admin') {
    return <TimeOffAdmin />;
  }
  
  return <TimeOffEmployee />;
}
