
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const Authenticating: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, selectedGate } = useAuth();
  const [dots, setDots] = useState('');

  const uid = location.state?.uid || '#BR-882901';

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const performVerification = async () => {
      try {
        if (!currentUser) throw new Error('Unauthorized');
        
        const result = await api.verifyBracelet(uid, currentUser.id, selectedGate || 'Main Gate');
        
        // Short additional delay for the "processing" feel
        setTimeout(() => {
          if (result.status === 'SUCCESS') {
            navigate('/scan-success', { state: { attendee: result.attendee, uid } });
          } else {
            navigate('/scan-failure', { state: { error: result.error, uid } });
          }
        }, 1000);
      } catch (err) {
        navigate('/scan-failure', { state: { error: 'System Communication Error' } });
      }
    };

    performVerification();

    return () => {
      clearInterval(dotInterval);
    };
  }, [navigate, currentUser, selectedGate, uid]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background-deep font-display">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      
      <div className="relative flex flex-col items-center z-10">
        <div className="relative w-48 h-48 mb-20">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-ping"></div>
          <div className="relative w-full h-full bg-slate-900 border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(19,91,236,0.3)]">
             <span className="material-icons-round text-primary text-7xl">qr_code_2</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
          Authenticating<span className="inline-block w-8">{dots}</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Verifying UID: {uid}
        </p>
      </div>

      <div className="absolute bottom-24 w-full px-10 space-y-8">
        <div className="space-y-4">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[85%] shadow-[0_0_15px_#135bec] transition-all duration-2000"></div>
          </div>
        </div>

        <div className="pt-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-full border border-slate-700 bg-slate-800/20 text-slate-300 text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
          >
            Cancel Scan
          </button>
        </div>
      </div>
    </main>
  );
};

export default Authenticating;
