
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { api, AppMessage } from '../services/apiService';
import { AccessLog, EventStats } from '../types/index';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from '../components/NotificationCenter';

const chartData = [
  { time: '14:00', value: 30 },
  { time: '14:15', value: 45 },
  { time: '14:30', value: 35 },
  { time: '14:45', value: 65 },
  { time: '15:00', value: 55 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [userStats, setUserStats] = useState({ totalScans: 0, successRate: 100, lastHour: 0 });
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [tierData, setTierData] = useState<any[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshPulse, setRefreshPulse] = useState(false);

  const fetchData = async () => {
    const [s, l, t, m] = await Promise.all([
      api.getStats(),
      api.getLogs(),
      api.getTierBreakdown(),
      api.getMessages()
    ]);
    
    if (currentUser) {
      const uStats = await api.getUserStats(currentUser.id);
      setUserStats(uStats);
    }
    
    setStats(s);
    setLogs(l.slice(0, 5));
    setTierData(t);
    setMessages(m);
    setLoading(false);
    setRefreshPulse(true);
    setTimeout(() => setRefreshPulse(false), 1000);
  };

  useEffect(() => {
    fetchData();
    const unsubScan = api.subscribe('new_scan', fetchData);
    const unsubStaff = api.subscribe('staff_presence', fetchData);
    return () => { unsubScan(); unsubStaff(); };
  }, [currentUser]);

  const handleMarkRead = async (id: string) => {
    await api.markMessageRead(id);
    const m = await api.getMessages();
    setMessages(m);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-background-dark">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-dark pb-24">
      <NotificationCenter 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        messages={messages} 
        onMarkRead={handleMarkRead}
      />

      <header className="px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Staff Monitor</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`h-2 w-2 rounded-full bg-green-500 ${refreshPulse ? 'scale-150' : 'animate-pulse'} transition-transform duration-300`}></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live Connection</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl hidden sm:flex items-center">
              <span className="material-icons-round text-[14px] text-emerald-500 mr-1.5">check_circle</span>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">System Healthy</span>
           </div>
           <button 
             onClick={() => setIsNotifOpen(true)}
             className="bg-slate-800 p-3 rounded-2xl text-slate-300 active:bg-slate-700 relative"
           >
             <span className="material-icons-round">notifications</span>
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full ring-4 ring-background-dark">
                 {unreadCount}
               </span>
             )}
           </button>
        </div>
      </header>

      <main className="flex-1 px-6 space-y-6 overflow-y-auto hide-scrollbar">
        {/* Performance Overview */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[32px] p-6 shadow-2xl shadow-primary/20 relative overflow-hidden group">
           <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000"></div>
           <div className="flex justify-between items-start mb-6">
              <div>
                 <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">My Performance</p>
                 <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Active Session</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                 <span className="material-icons-round text-white">query_stats</span>
              </div>
           </div>
           <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                 <p className="text-2xl font-black text-white">{userStats.totalScans}</p>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Total Scans</p>
              </div>
              <div className="text-center border-x border-white/10">
                 <p className="text-2xl font-black text-white">{userStats.successRate.toFixed(0)}%</p>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Accuracy</p>
              </div>
              <div className="text-center">
                 <p className="text-2xl font-black text-white">{userStats.lastHour}</p>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Last Hour</p>
              </div>
           </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Capacity</p>
            <p className="text-xl font-bold">{stats?.capacity.toLocaleString()}</p>
          </div>
          <div className={`border p-4 rounded-2xl transition-all duration-500 ${refreshPulse ? 'bg-primary/30 border-primary shadow-[0_0_20px_rgba(19,91,236,0.2)]' : 'bg-primary/10 border-primary/20'}`}>
            <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-1">Check-in</p>
            <p className="text-xl font-bold text-primary">{stats?.checkIn.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Rate</p>
            <p className="text-xl font-bold">{stats?.rate}<span className="text-sm font-medium">/m</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-wide font-display text-slate-300">Traffic Analysis</h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Data</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="value" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 pb-12">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-slate-500 font-display">Live Auditing</h3>
            <button onClick={() => navigate('/logs')} className="text-[11px] font-bold text-primary uppercase">Full Logs</button>
          </div>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-slate-700 active:scale-95 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${log.status === 'FAILED' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-700 text-slate-400'}`}>
                    <span className="material-icons-round">{log.status === 'FAILED' ? 'security' : 'person'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight font-display text-white">{log.braceletId}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{log.gate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {log.status === 'SUCCESS' ? 'Valid' : 'Denied'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1 font-bold">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
