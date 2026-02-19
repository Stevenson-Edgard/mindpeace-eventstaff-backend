
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { AccessLog } from '../types/index';

const AccessLogs: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [filter, setFilter] = useState('All Logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());

  const fetchLogs = async () => {
    const data = await api.getLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    const unsubscribe = api.subscribe('new_scan', (newLog: AccessLog) => {
      setLogs(prev => [newLog, ...prev]);
      setNewLogIds(prev => new Set(prev).add(newLog.id));
      
      // Clear highlight after 2 seconds
      setTimeout(() => {
        setNewLogIds(prev => {
          const next = new Set(prev);
          next.delete(newLog.id);
          return next;
        });
      }, 2000);
    });

    return () => unsubscribe();
  }, []);

  const filters = ['All Logs', 'Success', 'Failed', 'Duplicate'];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter = 
        filter === 'All Logs' || 
        (filter === 'Success' && log.status === 'SUCCESS') ||
        (filter === 'Failed' && log.status === 'FAILED') ||
        (filter === 'Duplicate' && log.status === 'DUPLICATE');

      const matchesSearch = 
        log.braceletId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.scannedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.gate.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [logs, filter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FAILED': return 'rose';
      case 'DUPLICATE': return 'amber';
      case 'SUCCESS': return 'emerald';
      default: return 'slate';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FAILED': return 'error';
      case 'DUPLICATE': return 'file_copy';
      case 'SUCCESS': return 'check_circle';
      default: return 'help_outline';
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-background-dark">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-dark pb-24">
      <header className="sticky top-0 z-30 bg-background-dark/90 ios-blur px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-primary active:scale-90 transition-transform">
            <span className="material-icons-round text-3xl">chevron_left</span>
          </button>
          <h1 className="text-xl font-bold font-display">Access Logs</h1>
          <button className="relative p-2 text-primary">
            <span className="material-icons-round">tune</span>
            { (filter !== 'All Logs' || searchTerm !== '') && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background-dark"></span>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input 
              type="text"
              placeholder="Search Bracelet ID or Staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/60 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-transparent transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${filter === f ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-800/50 text-slate-400 border-slate-800/80 hover:bg-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-4 space-y-6 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-center space-x-2 py-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Updating</span>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4 flex items-center">
              <span>{filteredLogs.length} Entries Found</span>
              <div className="h-px flex-1 bg-slate-800/50 ml-4"></div>
            </div>
            
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <span className="material-icons-round text-5xl mb-4 opacity-20">search_off</span>
                <p className="text-sm font-bold uppercase tracking-widest">No matching logs</p>
                <p className="text-xs mt-1">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  const color = getStatusColor(log.status);
                  const isNew = newLogIds.has(log.id);
                  return (
                    <div 
                      key={log.id} 
                      className={`rounded-3xl p-5 shadow-sm border transition-all active:scale-[0.98] ${
                        isNew ? 'bg-primary/10 border-primary ring-2 ring-primary/20 scale-[1.02]' : 'bg-slate-900/60 border-slate-800/40'
                      } ${
                        log.status === 'FAILED' ? 'border-l-4 border-l-rose-500' : 
                        log.status === 'DUPLICATE' ? 'border-l-4 border-l-amber-500' : 
                        log.status === 'SUCCESS' ? 'border-l-4 border-l-emerald-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center bg-${color}-500/10 text-${color}-500`}>
                          <span className="material-icons-round">
                            {getStatusIcon(log.status)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className={`text-sm font-bold tracking-tight uppercase font-display ${log.status === 'SUCCESS' ? 'text-emerald-500' : log.status === 'FAILED' ? 'text-rose-500' : 'text-amber-500'}`}>
                              {log.braceletId}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{log.timestamp}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs ${log.status === 'FAILED' ? 'text-rose-500 font-bold' : 'text-slate-500 font-medium'}`}>
                              {log.errorType || `Scanned by ${log.scannedBy} (${log.gate})`}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase ${log.type === 'VIP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700/50 text-slate-500'}`}>
                            {log.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessLogs;
