
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Import MOCK_ATTENDEES from the correct location
import { MOCK_ATTENDEES } from '../lib/constants';

const ScanResult: React.FC = () => {
  const navigate = useNavigate();
  // We mock a successful VIP scan
  const attendee = MOCK_ATTENDEES[0];

  return (
    <div className="flex-1 flex flex-col bg-background-dark min-h-screen">
      {/* Result Status Header */}
      <div className="bg-emerald-500 h-[35vh] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Abstract shapes for visual flair */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
          <span className="material-icons-round text-6xl">check_circle</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Access Granted</h1>
        <p className="text-emerald-100 font-bold uppercase tracking-widest text-[11px] mt-2 opacity-80">VIP Verified • Gate A</p>
      </div>

      <div className="flex-1 px-8 -mt-10 relative z-10 space-y-6">
        {/* Attendee Card */}
        <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-[40px] p-8 flex flex-col items-center">
          <div className="relative mb-6">
             <img 
               src={attendee.photo} 
               alt={attendee.name} 
               className="w-32 h-32 rounded-[32px] object-cover border-4 border-slate-800 shadow-xl"
             />
             <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
                <span className="material-icons-round text-sm">stars</span>
             </div>
          </div>
          
          <h2 className="text-2xl font-bold font-display text-center">{attendee.name}</h2>
          <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-2">Bracelet UID: {attendee.braceletUid}</p>

          <div className="grid grid-cols-2 gap-4 w-full mt-10">
             <div className="bg-slate-800/50 p-4 rounded-3xl text-center">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-emerald-500">Active</p>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-3xl text-center">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Entries</p>
                <p className="text-sm font-bold">1 / 4</p>
             </div>
          </div>
        </div>

        {/* History Note */}
        <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800/50 flex items-start space-x-4">
           <span className="material-icons-round text-slate-500">info</span>
           <p className="text-xs text-slate-400 leading-relaxed font-medium">
             First entry recorded at 12:45 PM today. Valid for Backstage and VIP Lounges.
           </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pb-12 space-y-4">
         <button 
           onClick={() => navigate('/scan')}
           className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center space-x-3 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
         >
           <span className="material-icons-round">qr_code_scanner</span>
           <span>Scan Next</span>
         </button>
         <button 
           onClick={() => navigate('/dashboard')}
           className="w-full bg-slate-800 text-slate-400 font-black py-5 rounded-[28px] flex items-center justify-center active:scale-[0.98] transition-all uppercase tracking-widest text-[11px]"
         >
           Dismiss Result
         </button>
      </div>
    </div>
  );
};

export default ScanResult;
