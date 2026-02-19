
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { StaffMember } from '../types/index';

const StaffList: React.FC = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStaff = async () => {
    const data = await api.getStaff();
    setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();

    const unsubscribe = api.subscribe('staff_presence', () => {
      fetchStaff();
    });

    return () => unsubscribe();
  }, []);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineCount = staff.filter(s => s.status === 'online').length;

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-background-dark">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-dark pb-24">
      <header className="px-6 pt-10 pb-4 sticky top-0 z-40 bg-background-dark/90 ios-blur">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-4xl font-bold tracking-tight font-display">Staff</h1>
          <button className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <span className="material-icons-round">add</span>
          </button>
        </div>
        
        <div className="flex gap-3 mb-2">
          <div className="relative flex-1">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
            <input 
              type="text"
              placeholder="Search name or gate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/60 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-slate-500 transition-all"
            />
          </div>
          <button className="bg-slate-800/60 p-3.5 rounded-2xl flex items-center justify-center text-slate-400">
            <span className="material-icons-round">tune</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 pt-4 space-y-4 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-primary/80">Online Now</p>
            <p className="text-2xl font-bold text-primary">{onlineCount}</p>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-500">Total Staff</p>
            <p className="text-2xl font-bold">{staff.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredStaff.map((member) => (
            <div 
              key={member.id} 
              className={`bg-slate-800/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 active:bg-slate-800 transition-all cursor-pointer ${member.status === 'offline' ? 'opacity-60' : 'animate-in slide-in-from-bottom-2'}`}
            >
              <div className="relative">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 border-background-dark rounded-full ${member.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-500'}`}></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base leading-tight font-display truncate pr-2">{member.name}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${member.role === 'SUPERVISOR' ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-400'}`}>
                    {member.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-[11px] font-medium uppercase tracking-tight">
                  <span className="flex items-center gap-1.5"><span className="material-icons-round text-sm">door_front</span> {member.location}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-icons-round text-sm">{member.status === 'online' ? 'schedule' : 'history'}</span> 
                    {member.status === 'online' ? `Active ${member.activeTime}` : 'Offline'}
                  </span>
                </div>
              </div>
              <span className="material-icons-round text-slate-600">chevron_right</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffList;
