
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentReceipt: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {
    payerName: "Guest",
    tier: "General Admission",
    amount: 47.50,
    date: new Date().toLocaleDateString(),
    transactionId: "MP-XXXXXXX"
  };

  return (
    <div className="flex-1 flex flex-col bg-[#05060a] min-h-screen text-slate-100 font-sans items-center py-12 px-6">
      {/* Celebration Backdrop */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6">
          <span className="material-icons-round text-white text-5xl">check</span>
        </div>
        
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">
          Payment Confirmed
        </h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">See you at Revival!</p>

        {/* Digital Receipt Card */}
        <div className="w-full mt-10 bg-[#0f111a] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          {/* Receipt Header */}
          <div className="p-8 pb-4 flex flex-col items-center">
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-lg bg-white/5">
                  <span className="text-xs font-black text-white">MP</span>
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">
                  MindPeace Prodz
                </span>
             </div>
             
             <div className="w-full flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Receipt for</p>
                   <h2 className="text-lg font-bold text-white uppercase">{data.payerName}</h2>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Date</p>
                   <p className="text-xs font-bold text-white uppercase">{data.date}</p>
                </div>
             </div>
          </div>

          {/* Receipt Content */}
          <div className="px-8 py-6 space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-[11px] font-medium text-slate-400">Event</p>
                   <p className="text-xs font-bold text-white uppercase">REVIVAL 2026</p>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-[11px] font-medium text-slate-400">Pass Type</p>
                   <p className="text-xs font-bold text-primary uppercase">{data.tier}</p>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-[11px] font-medium text-slate-400">Location</p>
                   <p className="text-xs font-bold text-white uppercase">Uniondale, NY</p>
                </div>
             </div>

             <div className="h-px bg-dashed-white w-full border-t border-dashed border-white/10"></div>

             <div className="flex justify-between items-center">
                <p className="text-xs font-black text-white uppercase tracking-widest">Total Paid</p>
                <p className="text-2xl font-black text-emerald-500">${data.amount.toFixed(2)}</p>
             </div>
          </div>

          {/* Receipt Footer */}
          <div className="bg-white/[0.02] px-8 py-6 text-center border-t border-white/5">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">Transaction ID</p>
             <p className="text-[10px] font-mono font-bold text-white/30 uppercase">{data.transactionId}</p>
             
             <div className="mt-8 flex flex-col items-center">
                <div className="bg-white p-3 rounded-2xl mb-4 opacity-10 blur-[0.5px]">
                   <span className="material-icons-round text-black text-5xl">qr_code_2</span>
                </div>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Official Entry Document</p>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 mt-10">
           <button 
             className="w-full bg-white/5 border border-white/10 text-white font-black py-5 rounded-[28px] flex items-center justify-center space-x-3 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
           >
             <span className="material-icons-round">download</span>
             <span>Save Receipt</span>
           </button>
           <button 
             onClick={() => navigate('/')}
             className="w-full bg-primary text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center space-x-3 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
           >
             <span>Back to Home</span>
           </button>
        </div>

        <p className="text-center text-[9px] text-slate-600 mt-12 uppercase tracking-[0.4em] font-bold">
           MindPeace Production • Event 2026
        </p>
      </div>
    </div>
  );
};

export default PaymentReceipt;