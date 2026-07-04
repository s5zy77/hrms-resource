import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import EmployeeView from './pages/EmployeeView';
import AttendancePage from './pages/AttendancePage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/signin" element={<PageWrapper><SignIn /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignUp /></PageWrapper>} />
        
        {/* Protected Routes */}
        <Route path="/employees" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><MyProfile /></PageWrapper></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><PageWrapper><EmployeeView /></PageWrapper></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><PageWrapper><AttendancePage /></PageWrapper></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#1a1f36',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.75rem',
                fontWeight: '500'
              },
            }}
          />
          <Navbar />
          <div className="pt-16">
            <AnimatedRoutes />
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
