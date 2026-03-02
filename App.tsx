import React from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './components/AppRoutes';
import Login from './views/Login';
import GateAssignment from './views/GateAssignment';
import Dashboard from './views/Dashboard';
import StaffList from './views/StaffList';
import AccessLogs from './views/AccessLogs';
import Authenticating from './views/Authenticating';
import ScanSuccess from './views/ScanSuccess';
import ScanFailure from './views/ScanFailure';
import ScanResult from './views/ScanResult';
import AttendeeInfo from './views/AttendeeInfo';
import SplashScreen from './views/SplashScreen';
import Profile from './views/Profile';
import BottomNav from './components/BottomNav';
import GlobalAlerts from './components/GlobalAlerts';

const AppContent: React.FC = () => {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative flex flex-col bg-background-dark shadow-2xl border-x border-slate-800 font-sans text-slate-100 overflow-hidden">
      <GlobalAlerts />
      <AppRoutes />
      <BottomNavWrapper />
    </div>
  );
};

const BottomNavWrapper = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  //const hideNavOn = ['/', '/login', '/splash', '/assign', '/scan', '/authenticating', '/scan-success', '/scan-failure', '/scan-result'];
  const hideNavOn = ['/', '/reservation', '/receipt', '/login', '/splash', '/assign', '/scan', '/authenticating', '/scan-success', '/scan-failure', '/scan-result', '/ai-assistant'];
  if (!isAuthenticated || hideNavOn.includes(location.pathname)) return null;
  return <BottomNav />;
}

const App: React.FC = () => (
  <AuthProvider>
    <HashRouter>
      <AppContent />
    </HashRouter>
  </AuthProvider>
);

export default App;
