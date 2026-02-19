
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { AccessLog } from '../types/index';

const GlobalAlerts: React.FC = () => {
  const [alert, setAlert] = useState<AccessLog | null>(null);

  useEffect(() => {
    const unsubscribe = api.subscribe('security_alert', (data: AccessLog) => {
      setAlert(data);
      // Auto-dismiss after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    });
    return () => unsubscribe();
  }, []);

  if (!alert) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[380px] animate-in slide-in-from-top-4 duration-500">
      <div className="bg-rose-500 rounded-[28px] p-4 shadow-2xl shadow-rose-500/30 flex items-center space-x-4 border border-white/20">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
          <span className="material-icons-round text-2xl animate-pulse">security</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-0.5">Security Alert • {alert.gate}</p>
          <p className="text-sm font-bold text-white truncate uppercase tracking-tight">
            {alert.errorType || 'Unauthorized Access Attempt'}
          </p>
          <p className="text-[10px] font-bold text-white/40 uppercase mt-0.5">UID: {alert.braceletId}</p>
        </div>
        <button onClick={() => setAlert(null)} className="text-white/60 hover:text-white">
          <span className="material-icons-round">close</span>
        </button>
      </div>
    </div>
  );
};

export default GlobalAlerts;
