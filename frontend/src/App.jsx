import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/employees" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          {/* Placeholders for M3/M4 */}
          <Route path="/attendance" element={<div className="p-8">Attendance Page Stub</div>} />
          <Route path="/time-off" element={<div className="p-8">Time Off Page Stub</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
