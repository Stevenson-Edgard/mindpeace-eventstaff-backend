import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './components/AppRoutes';
import BottomNav from './components/BottomNav';
import GlobalAlerts from './components/GlobalAlerts';

const publishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_PUBLIC_KEY ||
  '';
const stripePromise = loadStripe(publishableKey);

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

  // Bottom menu is staff-only and visible only on authenticated staff screens.
  const staffNavRoutes = new Set(['/dashboard', '/staff', '/logs', '/profile']);
  if (!isAuthenticated || !staffNavRoutes.has(location.pathname)) return null;

  return <BottomNav />;
};

const App: React.FC = () => (
  <AuthProvider>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Elements>
  </AuthProvider>
);

export default App;
