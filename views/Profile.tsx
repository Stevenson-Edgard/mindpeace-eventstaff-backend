
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/apiService';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, selectedGate, logout } = useAuth();

  const handleLogout = async () => {
    if (currentUser) {
      await api.logout(currentUser.id);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark pb-24">
      <header className="px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl font-black font-display uppercase tracking-tight italic">My Account</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Personnel Management</p>
      </header>

      <main className="flex-1 px-6 space-y-8 overflow-y-auto hide-scrollbar">
        {/* Digital ID Card */}
        <div className="relative aspect-[1.586/1] w-full rounded-[32px] bg-gradient-to-br from-[#135bec] via-[#1a4192] to-[#0a122a] p-8 shadow-2xl shadow-primary/30 flex flex-col justify-between overflow-hidden border border-white/20 group">
           {/* Glossy Overlay */}
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[50px]"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-[50px]"></div>

           <div className="relative z-10 flex justify-between items-start">
              <div>
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Official ID</p>
                 <h2 className="text-2xl font-black text-white uppercase italic leading-none">{currentUser?.name}</h2>
                 <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">{currentUser?.role}</p>
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl p-1 flex items-center justify-center">
                 <span className="material-icons-round text-primary text-5xl">qr_code_2</span>
              </div>
           </div>

           <div className="relative z-10 flex justify-between items-end">
              <div>
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Duty Station</p>
                 <p className="text-sm font-bold text-white uppercase">{selectedGate || 'Not Assigned'}</p>
              </div>
              <div className="text-right">
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Staff ID</p>
                 <p className="text-sm font-mono font-bold text-white">{currentUser?.id || '---'}</p>
              </div>
           </div>
        </div>

        {/* Action List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-1">Operations</h3>
          
          <button 
            onClick={() => navigate('/assign')}
            className="w-full bg-slate-800/40 border border-slate-800 p-5 rounded-3xl flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-icons-round">door_front</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white uppercase">Change Gate</p>
                <p className="text-xs text-slate-500">Update your current post</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-600">chevron_right</span>
          </button>

          <button className="w-full bg-slate-800/40 border border-slate-800 p-5 rounded-3xl flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <span className="material-icons-round">description</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white uppercase">Download Logs</p>
                <p className="text-xs text-slate-500">Export shift activity (CSV)</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-600">file_download</span>
          </button>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-1">Support</h3>
          <div className="bg-slate-800/40 border border-slate-800 rounded-3xl overflow-hidden">
             <div className="p-5 border-b border-slate-800 flex items-center justify-between active:bg-slate-800/60 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="material-icons-round text-slate-400">help_outline</span>
                  <span className="text-sm font-bold text-slate-300">Operational Guide</span>
                </div>
                <span className="material-icons-round text-slate-600 text-sm">open_in_new</span>
             </div>
             <div className="p-5 flex items-center justify-between active:bg-slate-800/60 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="material-icons-round text-slate-400">support_agent</span>
                  <span className="text-sm font-bold text-slate-300">Contact Supervisor</span>
                </div>
                <span className="material-icons-round text-slate-600 text-sm">chat_bubble_outline</span>
             </div>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
           <button 
             onClick={handleLogout}
             className="w-full py-5 bg-rose-500/10 border border-rose-500/20 rounded-[28px] text-rose-500 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
           >
             <span className="material-icons-round">logout</span>
             Terminate Session
           </button>
           <p className="text-center text-[9px] text-slate-600 mt-6 uppercase tracking-[0.3em]">EventStaff Pro v1.2.4 (Build 4201)</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
