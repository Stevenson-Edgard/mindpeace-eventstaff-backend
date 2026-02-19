
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: 'analytics', label: 'Monitor', path: '/dashboard' },
    { icon: 'groups', label: 'Staff', path: '/staff' },
    { icon: 'history', label: 'Logs', path: '/logs' },
    { icon: 'account_circle', label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background-dark/80 ios-blur border-t border-slate-800 px-6 pt-3 pb-8 z-50">
      <div className="flex justify-between items-center">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-slate-500'}`}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}

        {/* Center Scanner Button */}
        <div className="relative -top-8">
          <button 
            onClick={() => navigate('/scan')}
            className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-background-dark active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-3xl">qr_code_scanner</span>
          </button>
        </div>

        {navItems.slice(2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-slate-500'}`}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </div>
      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full"></div>
    </nav>
  );
};

export default BottomNav;
