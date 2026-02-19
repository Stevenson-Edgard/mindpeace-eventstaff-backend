
import React from 'react';
import { AppMessage } from '../services/apiService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AppMessage[];
  onMarkRead: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, messages, onMarkRead }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-[340px] bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/5 flex flex-col">
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display">Operations Hub</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-6">
              <span className="material-icons-round text-4xl mb-3 opacity-20">upcoming</span>
              <p className="text-sm font-bold uppercase tracking-widest">No Active Updates</p>
              <p className="text-xs mt-1">System is clear. Stand by for instructions.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => onMarkRead(msg.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  msg.isRead ? 'bg-white/5 border-white/5 opacity-60' : 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${msg.type === 'urgent' ? 'text-rose-500' : 'text-primary'}`}>
                    {msg.sender} • {msg.time}
                  </span>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{msg.subject}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{msg.body}</p>
              </div>
            ))
          )}
        </div>
        <footer className="p-6 border-t border-white/5 bg-slate-950/50">
           <button onClick={onClose} className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400">Clear All Notifications</button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationCenter;
