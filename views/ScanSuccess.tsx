
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ScanSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid || '#BR-00000';
  const isOverridden = location.state?.manuallyOverridden || false;

  return (
    <div className={`flex-1 flex flex-col ${isOverridden ? 'bg-[#0f1d2a]' : 'bg-[#102216]'} min-h-screen font-display`}>
      <div className="w-full h-12 flex items-center justify-between px-8 pt-4">
        <span className="text-sm font-semibold">Live Mode</span>
        <div className="flex items-center gap-1.5">
          <span className="material-icons-round text-sm">signal_cellular_alt</span>
          <span className="material-icons-round text-sm">wifi</span>
          <span className="material-icons-round text-sm">battery_full</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-8 relative">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isOverridden ? 'bg-primary/10' : 'bg-[#13ec5b15]'} rounded-full blur-[100px]`}></div>
        
        <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-500">
          <div className={`w-32 h-32 rounded-full ${isOverridden ? 'bg-primary/10 border-primary' : 'bg-[#13ec5b15] border-[#13ec5b]'} border-4 flex items-center justify-center mb-6 shadow-2xl`}>
            <span className={`material-icons-round ${isOverridden ? 'text-primary' : 'text-[#13ec5b]'} text-7xl`}>
              {isOverridden ? 'verified' : 'check_circle'}
            </span>
          </div>
          <h1 className={`text-4xl font-extrabold tracking-tight ${isOverridden ? 'text-primary' : 'text-[#13ec5b]'} uppercase`}>
            {isOverridden ? 'Approved' : 'Valid Entry'}
          </h1>
          <p className="text-white/60 mt-2 font-medium">{isOverridden ? 'Manual Override Success' : 'Access Granted'}</p>
        </div>

        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl mb-10 space-y-6">
          <div className="text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Bracelet ID</p>
            <p className="text-3xl font-mono font-bold tracking-tighter text-white">{uid}</p>
          </div>
          <div className="flex justify-center">
            <div className={`${isOverridden ? 'bg-primary/10 border-primary/40' : 'bg-[#13ec5b15] border-[#13ec5b40]'} border px-6 py-2 rounded-full`}>
              <span className={`${isOverridden ? 'text-primary' : 'text-[#13ec5b]'} font-extrabold text-sm tracking-widest uppercase`}>
                {isOverridden ? 'Override' : 'Verified'}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <button 
            onClick={() => navigate('/scan')}
            className={`w-full ${isOverridden ? 'bg-primary' : 'bg-[#13ec5b]'} text-white font-extrabold py-5 rounded-2xl text-lg tracking-tight shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3`}
          >
            <span className="material-icons-round">qr_code_scanner</span>
            SCAN NEXT
          </button>
          <button onClick={() => navigate('/dashboard')} className="w-full text-white/40 font-medium py-2 text-sm hover:text-white/60 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default ScanSuccess;
