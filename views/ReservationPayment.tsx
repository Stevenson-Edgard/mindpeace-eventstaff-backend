import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStripeCheckoutSession } from '../services/stripeService';

const ReservationPayment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<'GA' | 'VIP'>('GA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const tiers = {
    GA: { name: 'General Admission', price: 45, perks: ['Main Area Entry', 'Standard Bracelet', 'Free Parking'] },
    VIP: { name: 'VIP Revival Pass', price: 125, perks: ['Front Row Access', 'Exclusive VIP Lounge', 'Gourmet Refreshments', 'Premium LED Bracelet'] }
  };

  const handleProceed = async () => {
    if (step === 'select') setStep('details');
    else if (step === 'details') {
      if (!formData.name || !formData.email) {
        alert("Please fill in your name and email.");
        return;
      }
      setStep('confirm');
    }
    else {
      setIsProcessing(true);
      try {
        // Call your backend to create a Stripe Checkout session
        const url = await createStripeCheckoutSession({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          tier: selectedTier,
        });
        window.location.href = url; // Redirect to Stripe Checkout
      } catch (err) {
        alert('Failed to initiate payment. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#05060a] min-h-screen text-slate-100 font-sans">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-50 bg-[#05060a]/80 backdrop-blur-xl">
        <button 
          onClick={() => step === 'select' ? navigate('/') : setStep(step === 'details' ? 'select' : 'details')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Checkout</p>
          <h1 className="text-sm font-bold uppercase tracking-widest text-white">Event Reservation</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 pt-4 pb-32 overflow-y-auto hide-scrollbar">
        {step === 'select' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Select Your Access</h2>
              <p className="text-slate-500 text-xs">Choose the tier that best fits your experience.</p>
            </div>

            <div className="space-y-4">
              {Object.entries(tiers).map(([key, tier]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTier(key as 'GA' | 'VIP')}
                  className={`w-full text-left rounded-[32px] p-6 border-2 transition-all duration-300 relative overflow-hidden group ${
                    selectedTier === key 
                    ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' 
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className={`text-lg font-black uppercase tracking-tight ${selectedTier === key ? 'text-white' : 'text-slate-400'}`}>
                        {tier.name}
                      </h3>
                      <p className="text-xs font-bold text-primary mt-1">${tier.price}.00 USD</p>
                    </div>
                    {selectedTier === key && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                        <span className="material-icons-round text-white text-sm">check</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <span className={`material-icons-round text-[14px] ${selectedTier === key ? 'text-primary' : 'text-slate-600'}`}>check_circle</span>
                        <span className="text-[11px] font-medium text-slate-500">{perk}</span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Attendee Details</h2>
              <p className="text-slate-500 text-xs">Provide information for your official digital bracelet.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Legal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jean-Luc Pierre"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/[0.03] border-white/5 rounded-2xl py-4 px-5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/[0.03] border-white/5 rounded-2xl py-4 px-5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+509 0000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/[0.03] border-white/5 rounded-2xl py-4 px-5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
                <span className="material-icons-round text-4xl">security</span>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Secure Payment</h2>
              <p className="text-slate-500 text-xs">Your transaction is encrypted and protected.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Ticket: {tiers[selectedTier].name}</span>
                  <span className="text-white font-bold">${tiers[selectedTier].price}.00</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Processing Fee</span>
                  <span className="text-white font-bold">$2.50</span>
               </div>
               <div className="h-px bg-white/5 w-full my-2"></div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Total Amount</span>
                  <span className="text-2xl font-black text-white">${tiers[selectedTier].price + 2.50}</span>
               </div>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-2xl flex items-center space-x-4 border border-white/5">
              <span className="material-icons-round text-primary text-2xl">credit_card</span>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Card on File</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">•••• •••• •••• 4242</p>
              </div>
              <button className="text-[10px] font-black text-primary uppercase">Edit</button>
            </div>
          </div>
        )}
      </main>

      {/* Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#05060a] via-[#05060a] to-transparent pt-12 max-w-[430px] mx-auto w-full">
        <button 
          onClick={handleProceed}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center space-x-3 active:scale-[0.98] transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:scale-100"
        >
          {isProcessing ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>{step === 'confirm' ? `Authorize Payment` : 'Continue to Checkout'}</span>
              <span className="material-icons-round text-lg">arrow_forward</span>
            </>
          )}
        </button>
        <p className="text-center text-[9px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">
          <span className="material-icons-round text-[10px] align-middle mr-1 text-emerald-500">verified_user</span>
          Secured by Stripe Infrastructure
        </p>
      </footer>
    </div>
  );
};

export default ReservationPayment;
