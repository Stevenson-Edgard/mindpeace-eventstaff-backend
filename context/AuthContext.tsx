import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StaffMember } from '../types/index';
import { loginUser } from '../services/apiService';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: StaffMember | null;
  selectedGate: string | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  assignGate: (gateId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State from LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user && user !== 'undefined') {
      try {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem('auth_user');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
    const storedGate = localStorage.getItem('selected_gate');
    if (storedGate) {
      setSelectedGate(storedGate);
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    const result = await loginUser(phone, password);
    setIsAuthenticated(true);
    setCurrentUser(result.user || null);
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('auth_user', JSON.stringify(result.user));
    // Optionally: setSelectedGate if user has a last gate
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedGate(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('selected_gate');
  };

  const assignGate = (gateId: string) => {
    setSelectedGate(gateId);
    localStorage.setItem('selected_gate', gateId);
    
    // Update local database record for this session
    if (currentUser) {
       const updatedUser = { ...currentUser, currentGateId: gateId };
       setCurrentUser(updatedUser);
       localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, selectedGate, login, logout, assignGate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
