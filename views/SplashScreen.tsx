
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0c14] min-h-screen relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      
      {/* Logo / Icon */}
      <div className="relative z-10 flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12">
          <span className="material-icons-round text-white text-6xl">admin_panel_settings</span>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-black font-display tracking-tight text-white mb-2 uppercase">
            Staff Portal
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
        Authorized Access Only
      </p>
    </div>
  );
};

export default SplashScreen;
