import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import aquilaImg from '../assets/aquila.jpg';
import clerveauImg from '../assets/clerveau.jpg';
import jamesImg from '../assets/james.jpg';
import janjanImg from '../assets/janjan.jpg';
import myrdithImg from '../assets/myrdith.jpeg';
import samuelImg from '../assets/samuel.jpg';
import thamareImg from '../assets/thamare.jpg';
import { createStripeCheckoutSession } from '../services/stripeService';

const AttendeeInfo: React.FC = () => {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Official Event Target: April 12, 2026 at 18:00 (6:00 PM)
  const targetDate = new Date('2026-04-12T18:00:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleOpenMap = () => {
    const location = "933 Goodrich St, Uniondale, NY 11553"; 
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleStripePayment = async () => {
    try {
      const url = await createStripeCheckoutSession();
      window.location.href = url;
    } catch (err) {
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const scheduleItems = [
    { time: '4:30 PM', title: 'Host Guest', guest: 'Psalmiste Clerveau Lovenson', img: clerveauImg },
    { time: '9:15 PM', title: 'MC Guest', guest: 'James Pierre', img: jamesImg },
    { time: '5:45 PM', title: 'Special Speaker', guest: 'Pasteur Samuel Robuste', img: samuelImg },
    { time: '6:30 PM', title: 'Special Guest', guest: 'Psalmiste Aquila Dorvil', img: aquilaImg },
    { time: '7:45 PM', title: 'Special Guest', guest: 'Psalmiste Jean Jean', img: janjanImg },
    { time: '8:30 PM', title: 'Special Guest', guest: 'Psalmiste Thamar', img: thamareImg },
    { time: '9:15 PM', title: 'Special Guest', guest: 'Psalmiste Myrdith Melus', img: myrdithImg },
  ];

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col bg-[#05060a] min-h-screen font-sans text-slate-100 overflow-y-auto hide-scrollbar select-none"
    >
      {/* --- HERO SECTION --- */}
      <div className="relative h-[75vh] w-full overflow-hidden bg-black shrink-0">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            transform: `translateY(${scrollY * 0.15}px) scale(1.15)`,
            transition: 'transform 0.05s linear'
          }}
        >
          <img 
            alt="Revival Atmosphere" 
            className="w-full h-full object-cover opacity-40 blur-[1px]" 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-[#05060a]"></div>
        </div>

        {/* Top Header */}
        <div className="relative z-30 pt-10 px-6 flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-xl">
              <span className="text-lg font-black tracking-tighter text-white">MP</span>
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">
              MindPeace Prodz
            </span>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-[10px] text-emerald-400 animate-pulse">verified</span>
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Pass Verified</span>
            </div>
          </div>
        </div>

        {/* Central Layout */}
        <div className="relative z-10 h-full flex flex-col items-center justify-start pt-20 px-8">
          <div className="text-center mb-4">
             <span className="text-[10px] font-black tracking-[0.6em] text-primary uppercase mb-3 block opacity-80">Save the Date</span>
             <div className="flex items-baseline space-x-1.5 justify-center">
                <span className="text-[100px] font-black leading-none tracking-tighter text-white">12</span>
                <div className="flex flex-col items-start -mb-2">
                   <span className="text-[22px] font-black text-orange-500 italic leading-none">th</span>
                   <span className="text-[14px] font-bold text-white/30 uppercase tracking-[0.4em]">April</span>
                </div>
             </div>
          </div>

          <h1 className="text-[60px] font-black leading-none tracking-tighter text-white uppercase italic text-center drop-shadow-2xl mb-8">
            REVIVAL
          </h1>

          <div className="w-full max-w-[280px] animate-in fade-in slide-in-from-bottom-6 duration-1000">
             <div className="bg-white rounded-[24px] px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden active:scale-95 transition-all">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-500"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-black text-center leading-tight">
                  OU SOTI LWEN AVÈM JEZI
                </span>
                <div className="flex items-center space-x-2 mt-2.5">
                   <div className="w-8 h-[1px] bg-black/10"></div>
                   <span className="material-icons-round text-[12px] text-orange-500">auto_awesome</span>
                   <div className="w-8 h-[1px] bg-black/10"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-6 -mt-10 relative z-30 space-y-10 pb-20 shrink-0">
        
        {/* COUNTDOWN SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Countdown to Event</h3>
             <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#ec1313]/10 border border-[#ec1313]/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ec1313] animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#ec1313]">Live</span>
             </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds }
            ].map((t) => (
              <div key={t.label} className="bg-[#0f111a] border border-white/5 rounded-[22px] py-4 flex flex-col items-center shadow-xl ring-1 ring-white/5 relative group">
                <span className="text-[28px] font-black text-white tabular-nums tracking-tighter leading-none mb-1.5">
                  {t.val.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-500">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LOGISTICS SECTION */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 px-1">Event Logistics</h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl">
             <div className="p-6 flex items-center space-x-5 border-b border-white/5 active:bg-white/[0.05] transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-xl">schedule</span>
                </div>
                <div>
                   <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest mb-1">Entry Time</p>
                   <p className="text-sm font-bold text-white uppercase tracking-wider">4:30 PM • DOORS OPEN</p>
                </div>
             </div>
             
             <div className="p-6 flex items-center space-x-5 border-b border-white/5 active:bg-white/[0.05] transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-xl">map</span>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Location</p>
                   <p className="text-sm font-bold text-white uppercase tracking-wider truncate">933 Goodrich St, Uniondale, NY 11553</p>
                </div>
                <button onClick={handleOpenMap} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 active:text-white transition-colors">
                  <span className="material-icons-round text-lg">near_me</span>
                </button>
             </div>

             <button 
                onClick={() => navigate('/reservation')}
                className="w-full text-left p-6 flex items-center space-x-5 active:bg-white/[0.05] transition-colors group relative"
             >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-xl">watch</span>
                </div>
                <div className="flex-1">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Bracelets</p>
                   <div className="flex items-center gap-2">
                     <p className="text-sm font-bold text-white uppercase tracking-wider">RESERVATION</p>
                     <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-500 text-[8px] font-black rounded uppercase tracking-widest border border-orange-500/20">Required</span>
                   </div>
                </div>
                <span className="material-icons-round text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
             </button>
          </div>
        </div>

        {/* LINEUP SECTION */}
        <div className="space-y-4">
          <button 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full bg-white/5 border border-white/10 rounded-[24px] p-5 flex items-center justify-between active:scale-[0.98] transition-all shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-icons-round text-xl">auto_awesome_motion</span>
              </div>
              <div className="text-left">
                <span className="text-sm font-black text-white uppercase tracking-widest block">LINEUP</span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5 block">Full Guest Lineup</span>
              </div>
            </div>
            <span className={`material-icons-round text-xl text-primary/60 transition-transform duration-500 ${isDetailsOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {isDetailsOpen && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-400 shadow-2xl">
               {scheduleItems.map((item, idx) => (
                 <div key={idx} className="flex items-center space-x-5 group">
                    <div className="text-center w-12 shrink-0">
                       <span className="text-[10px] font-black text-white/40 tabular-nums uppercase">{item.time}</span>
                    </div>
                    <div className="relative shrink-0">
                       <img src={item.img} alt={item.guest} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500" />
                       <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0f111a] rounded-full flex items-center justify-center border border-white/5">
                          <span className="material-icons-round text-[10px] text-emerald-500">verified</span>
                       </div>
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[13px] font-black text-white uppercase tracking-wider truncate mb-0.5">{item.guest}</p>
                       <p className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] truncate">{item.title}</p>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* ACTIVE PASS */}
        <div className="bg-gradient-to-br from-[#0a122a] to-[#05060a] border border-primary/10 rounded-[32px] p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px]"></div>
           <div className="relative w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 mb-4 text-primary">
              <span className="material-icons-round text-4xl animate-pulse">qr_code_2</span>
           </div>
           <p className="text-base font-black text-white uppercase tracking-[0.3em] text-center">Active Pass</p>
           <p className="text-[10px] text-primary/40 font-bold uppercase tracking-[0.5em] mt-2">UID: BR-882-VIP-2026</p>
           <div className="mt-6 px-5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Authorized Entry</span>
           </div>
        </div>

        {/* PAYMENT SECTION */}
        <div className="flex justify-center my-8">
          <button
            onClick={handleStripePayment}
            className="bg-primary text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-primary/90 transition-all"
          >
            Buy Ticket ($50)
          </button>
        </div>
      <footer className="mt-auto py-12 flex flex-col items-center justify-center border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
        <button 
          onClick={() => navigate('/splash')}
          className="flex flex-col items-center space-y-2 active:scale-95 transition-transform opacity-60 hover:opacity-100"
          aria-label="Staff Access"
        >
          <div className="text-primary">
            <span className="material-icons-round text-3xl">admin_panel_settings</span>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">
            MINDPEACE PRODZ
          </span>
        </button>
      </footer>
    </div>
  </div>
  );
};

export default AttendeeInfo;