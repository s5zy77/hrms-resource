import { useAuth } from '../context/AuthContext';
import AttendanceEmployee from './AttendanceEmployee';
import AttendanceAdmin from './AttendanceAdmin';

export default function AttendancePage() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AttendanceAdmin />;
  }
  
  return <AttendanceEmployee />;
}
