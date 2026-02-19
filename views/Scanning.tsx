
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const Scanning: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, selectedGate } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
      }
    }
    setupCamera();

    // Actual Logic: Trigger verification after "detecting" a code
    const timer = setTimeout(async () => {
      if (currentUser) {
        // Randomly pick an existing UID for demo purposes, or simulate a failure
        const randomUid = Math.random() > 0.1 ? '#BR-882901' : 'UNKNOWN-UID';
        navigate('/authenticating', { state: { uid: randomUid } });
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [navigate, currentUser]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover grayscale opacity-40 blur-[2px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-20 px-8">
        <div className="text-center space-y-4">
          <div className="inline-block bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full backdrop-blur-md mb-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
              Lens Active
            </span>
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight text-white uppercase italic">Scan Pass</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Current Gate: {selectedGate || 'Not Assigned'}</p>
        </div>

        <div className="relative w-80 h-80">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-[40px] shadow-[0_0_20px_rgba(19,91,236,0.5)]"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-[40px] shadow-[0_0_20px_rgba(19,91,236,0.5)]"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-[40px] shadow-[0_0_20px_rgba(19,91,236,0.5)]"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-[40px] shadow-[0_0_20px_rgba(19,91,236,0.5)]"></div>
          
          <div className="absolute inset-4 overflow-hidden rounded-[32px] border border-white/5">
             <div className="scan-line"></div>
             <div className="absolute inset-0 bg-primary/5"></div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-8">
           <button 
             onClick={() => navigate('/dashboard')} 
             className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl backdrop-blur-xl group"
           >
             <span className="material-icons-round text-4xl group-hover:rotate-90 transition-transform">close</span>
           </button>
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-20"></div>
    </main>
  );
};

export default Scanning;
