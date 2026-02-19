
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/apiService';

const ScanFailure: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, selectedGate } = useAuth();
  const [overriding, setOverriding] = useState(false);

  const error = location.state?.error || 'Invalid Bracelet';
  const uid = location.state?.uid || 'Unknown';
  const isSupervisor = currentUser?.role === 'SUPERVISOR';

  const handleOverride = async () => {
    if (!currentUser || !selectedGate) return;
    setOverriding(true);
    await api.manualOverride(uid, currentUser.id, selectedGate);
    setTimeout(() => {
      navigate('/scan-success', { state: { uid, manuallyOverridden: true } });
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a0a0a] min-h-screen font-display text-white">
      <div className="h-12 w-full"></div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-[#ec1313]/20 blur-3xl rounded-full scale-150"></div>
          <div className="relative bg-[#ec1313]/10 border-4 border-[#ec1313] rounded-full p-10 flex items-center justify-center">
            <span className="material-icons-round text-[#ec1313] text-8xl">close</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#ec1313] mb-4">ACCESS DENIED</h1>
          <div className="inline-block bg-[#ec1313] px-6 py-2 rounded-full">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white">{error}</p>
          </div>
        </div>

        <div className="w-full max-w-sm bg-[#2d1616] border border-[#3d1c1c] rounded-3xl p-8 shadow-2xl mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-[#ec1313]/60 uppercase tracking-widest mb-1 block">Bracelet ID</label>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold tracking-tighter text-white">{uid}</span>
                <span className="material-icons-round text-[#ec1313]/40">fingerprint</span>
              </div>
            </div>
            
            <div className="h-px bg-[#3d1c1c] w-full"></div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-[#ec1313]/20 p-2.5 rounded-xl">
                  <span className="material-icons-round text-[#ec1313] text-sm">history</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#ec1313]/60 uppercase tracking-widest block">Last Attempt</label>
                  <p className="text-sm font-semibold text-white/90">Just now</p>
                  <p className="text-xs text-white/40 mt-0.5">Gate: {selectedGate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isSupervisor && (
          <button 
            onClick={handleOverride}
            disabled={overriding}
            className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl w-full max-w-sm mb-4 active:scale-95 transition-transform disabled:opacity-50"
          >
            <span className="material-icons-round text-emerald-500">{overriding ? 'sync' : 'verified_user'}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Supervisor Override</p>
              <p className="text-[10px] text-white/60">Approve this entrance manually</p>
            </div>
          </button>
        )}

        {!isSupervisor && (
          <div className="flex items-center gap-3 bg-[#ec1313]/10 border border-[#ec1313]/20 p-5 rounded-2xl w-full max-w-sm">
            <span className="material-icons-round text-[#ec1313]">warning</span>
            <p className="text-xs font-medium text-white/70 leading-relaxed">
              Security Alert: This bracelet is flagged. Please refer to your supervisor for manual override.
            </p>
          </div>
        )}
      </main>

      <footer className="p-6 pb-10 space-y-4 w-full max-w-md mx-auto">
        <button 
          onClick={() => navigate('/scan')}
          className="w-full bg-[#ec1313] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#ec1313]/20 active:scale-95 transition-transform"
        >
          <span className="material-icons-round">qr_code_scanner</span>
          <span className="uppercase tracking-widest text-sm">Scan Next Bracelet</span>
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-white/5 text-white/60 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-transform"
        >
          <span className="material-icons-round text-sm">arrow_back</span>
          <span className="uppercase text-xs tracking-widest">Return to Dashboard</span>
        </button>
      </footer>
    </div>
  );
};

export default ScanFailure;
