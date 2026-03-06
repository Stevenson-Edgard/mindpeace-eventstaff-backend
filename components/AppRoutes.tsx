import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../views/Login';
import GateAssignment from '../views/GateAssignment';
import Dashboard from '../views/Dashboard';
import StaffList from '../views/StaffList';
import AccessLogs from '../views/AccessLogs';
import Authenticating from '../views/Authenticating';
import ScanSuccess from '../views/ScanSuccess';
import ScanFailure from '../views/ScanFailure';
import ScanResult from '../views/ScanResult';
import AttendeeInfo from '../views/AttendeeInfo';
import ReservationPayment from '../views/ReservationPayment';
import SplashScreen from '../views/SplashScreen';
import Profile from '../views/Profile';

import AiAssistant from '../views/AiAssistant';
import FollowUpForm from '../views/FollowUpForm';
import Confirmation from './Confirmation';
import Checkout from './Checkout';
import TicketSelection from './TicketSelection';


const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = React.useState<any>(null);

  const handleSelectTier = (tier: any) => {
    setSelectedTier(tier);
  };

  const handleContinue = () => {
    navigate('/checkout');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePay = (paymentInfo?: any) => {
    // perform payment logic here or forward paymentInfo to a service
    navigate('/confirmation');
  };

  return (
    <Routes>
      <Route path="/" element={<AttendeeInfo />} />
      <Route path="/reservation" element={<ReservationPayment />} />
      <Route
        path="/tickets"
        element={
          <TicketSelection
            selectedTier={selectedTier}
            onSelectTier={handleSelectTier}
            onContinue={handleContinue}
          />
        }
      />
      <Route
        path="/checkout"
        element={
          selectedTier ? (
            <Checkout
              selectedTier={selectedTier}
              onBack={handleBack}
              onPay={handlePay}
            />
          ) : (
            <Navigate to="/tickets" replace />
          )
        }
      />
      <Route
        path="/confirmation"
        element={
          selectedTier ? (
            <Confirmation
              selectedTier={selectedTier}
              onSelectTier={handleSelectTier}
              onContinue={handleContinue}
            />
          ) : (
            <Navigate to="/tickets" replace />
          )
        }
      />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/assign" /> : <Login />} /> 
      <Route path="/assign" element={isAuthenticated ? <GateAssignment /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/staff" element={isAuthenticated ? <StaffList /> : <Navigate to="/login" />} />
      <Route path="/logs" element={isAuthenticated ? <AccessLogs /> : <Navigate to="/login" />} />
      {/* <Route path="/scan" element={isAuthenticated ? <Scanning /> : <Navigate to="/login" />} /> */}
      <Route path="/authenticating" element={isAuthenticated ? <Authenticating /> : <Navigate to="/login" />} />
      <Route path="/scan-success" element={isAuthenticated ? <ScanSuccess /> : <Navigate to="/login" />} />
      <Route path="/scan-failure" element={isAuthenticated ? <ScanFailure /> : <Navigate to="/login" />} />
      <Route path="/scan-result" element={isAuthenticated ? <ScanResult /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/ai-assistant" element={isAuthenticated ? <AiAssistant /> : <Navigate to="/login" />} />
      <Route path="/followup" element={isAuthenticated ? <FollowUpForm /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
