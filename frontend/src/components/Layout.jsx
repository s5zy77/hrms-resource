import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();
  // Hide navbar on auth screens
  const hideNavbar = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/';

  return (
    <div className="min-h-screen bg-bgWhite flex flex-col font-sans">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
