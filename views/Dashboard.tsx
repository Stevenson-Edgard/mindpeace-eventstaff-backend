import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { api, AppMessage } from '../services/apiService';
import { AccessLog, EventStats } from '../types/index';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from '../components/NotificationCenter';
import { TrendingUp, TrendingDown, Wallet, Users, ShieldAlert, CheckCircle2, Heart, Sparkles } from 'lucide-react';

const financialData = [
  { time: '10:00', income: 5000, outcome: 2000 },
  { time: '12:00', income: 15000, outcome: 5000 },
  { time: '14:00', income: 28000, outcome: 12000 },
  { time: '16:00', income: 35000, outcome: 15000 },
  { time: '18:00', income: 42100, outcome: 18500 },
];

const outcomeBreakdown = [
  { name: 'Venue & Logistics', value: 10000 },
  { name: 'Staff & Security', value: 5000 },
  { name: 'Marketing & Misc', value: 3500 },
];
const OUTCOME_COLORS = ['#f43f5e', '#fb923c', '#fbbf24'];

const zoneData = [
  { name: 'Main Stage', value: 450 },
  { name: 'VIP Lounge', value: 120 },
  { name: 'Food Court', value: 200 },
  { name: 'Restrooms', value: 30 },
];
const ZONE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#64748b'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [userStats, setUserStats] = useState({ totalScans: 0, successRate: 100, lastHour: 0 });
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshPulse, setRefreshPulse] = useState(false);

  // Constants for financial transparency
  const TICKET_PRICE = 50;
  const CAPACITY = 1000;
  const TICKETS_SOLD = 842; // Mock data for tickets sold
  const INCOME = TICKETS_SOLD * TICKET_PRICE;
  const OUTCOME = 18500; // Mock fixed + variable costs
  const NET_PROFIT = INCOME - OUTCOME;

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
          <h1 className="text-3xl font-bold tracking-tight font-display">Mission Control</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`h-2 w-2 rounded-full bg-emerald-500 ${refreshPulse ? 'scale-150' : 'animate-pulse'} transition-transform duration-300`}></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live Connection</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl hidden sm:flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">System Healthy</span>
           </div>
           <button 
             onClick={() => setIsNotifOpen(true)}
             className="bg-slate-800 p-3 rounded-2xl text-slate-300 active:bg-slate-700 relative transition-colors"
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

      <main className="flex-1 px-6 space-y-8 overflow-y-auto hide-scrollbar">
        
        {/* Ministry Tools */}
        <div 
          onClick={() => navigate('/followup')}
          className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-6 shadow-2xl shadow-rose-500/20 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
        >
           <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000"></div>
           <div className="flex justify-between items-center relative z-10">
              <div>
                 <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Ministry & Evangelism</p>
                 <h2 className="text-2xl font-black text-white tracking-tight">New Believer Follow-up</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                 <Heart className="w-6 h-6 text-white fill-white" />
              </div>
           </div>
        </div>

        {/* Financial Command Center */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-slate-500 font-display">Financial Transparency</h3>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">Staff Visible</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Income Card */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Income</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">${INCOME.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">{TICKETS_SOLD} tickets @ ${TICKET_PRICE}</p>
            </div>

            {/* Outcome Card */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/20">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Outcome</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">${OUTCOME.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Fixed & Variable Costs</p>
            </div>
          </div>

          {/* Net Profit & Outcome Breakdown */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/20 rounded-xl border border-primary/30">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Net Profit</p>
                  <p className="text-xl font-black text-white tracking-tight">${NET_PROFIT.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Margin</p>
                <p className="text-lg font-bold text-emerald-400">{((NET_PROFIT / INCOME) * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* Outcome Breakdown Chart */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex items-center">
              <div className="w-24 h-24 mr-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomeBreakdown}
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {outcomeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={OUTCOME_COLORS[index % OUTCOME_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outcome Breakdown</p>
                {outcomeBreakdown.map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: OUTCOME_COLORS[idx] }}></div>
                      <span className="text-[10px] text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Attendance & Flow */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-slate-500 font-display">Live Operations & Zones</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col justify-between">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Capacity</p>
              <div>
                <p className="text-xl font-black text-white">{CAPACITY.toLocaleString()}</p>
                <p className="text-[9px] text-emerald-400 font-bold mt-1">{(TICKETS_SOLD/CAPACITY * 100).toFixed(0)}% SOLD</p>
              </div>
            </div>
            <div className={`border p-4 rounded-2xl flex flex-col justify-between transition-all duration-500 ${refreshPulse ? 'bg-primary/30 border-primary shadow-[0_0_20px_rgba(19,91,236,0.2)]' : 'bg-primary/10 border-primary/30'}`}>
              <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-2">Checked In</p>
              <div>
                <p className="text-xl font-black text-primary">{stats?.checkIn.toLocaleString() || 0}</p>
                <p className="text-[9px] text-primary/70 font-bold mt-1">LIVE</p>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col justify-between">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Flow Rate</p>
              <div>
                <p className="text-xl font-black text-white">{stats?.rate || 0}<span className="text-sm font-medium text-slate-500">/m</span></p>
                <p className="text-[9px] text-slate-400 font-bold mt-1">AVG SPEED</p>
              </div>
            </div>
          </div>

          {/* Zone Distribution */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Attendee Distribution</p>
            <div className="space-y-3">
              {zoneData.map((zone, idx) => (
                <div key={zone.name}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-300">{zone.name}</span>
                    <span className="font-bold text-white">{zone.value} <span className="text-slate-500 font-normal">pax</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${(zone.value / (stats?.checkIn || 800)) * 100}%`, backgroundColor: ZONE_COLORS[idx] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Chart */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-wide font-display text-slate-300">Financial Trajectory</h3>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cumulative</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="outcome" name="Outcome" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorOutcome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 pb-12">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-slate-500 font-display">Live Auditing</h3>
            <button onClick={() => navigate('/logs')} className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-full">Full Logs</button>
          </div>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-slate-600 active:scale-95 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${log.status === 'FAILED' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'}`}>
                    {log.status === 'FAILED' ? <ShieldAlert className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight font-display text-white">{log.braceletId}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{log.gate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                    {log.status === 'SUCCESS' ? 'Valid' : 'Denied'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1.5 font-bold">{log.timestamp}</p>
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

