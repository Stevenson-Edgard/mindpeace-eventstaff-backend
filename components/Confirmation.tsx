import React from 'react';
import { ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TICKET_TIERS } from '../constants';
import { TicketTier } from '../types';
import { Button } from '../views/Button';
import { Card } from '../views/Card';

interface TicketSelectionProps {
  selectedTier: TicketTier | null;
  onSelectTier: (tier: TicketTier) => void;
  onContinue: () => void;
  key?: string;
}

export default function TicketSelection({ selectedTier, onSelectTier, onContinue }: TicketSelectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center p-4 sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-50">
        <button className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold pr-8">Select Tickets</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
        {/* Event Banner */}
        <div className="px-4 py-3">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full min-h-[220px] rounded-3xl overflow-hidden bg-cover bg-center shadow-lg"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-black text-white uppercase tracking-[0.2em] bg-primary rounded-md">
                Confirmed Event
              </span>
              <h1 className="text-3xl font-black text-white leading-tight mb-1">Summer Pulse Festival</h1>
              <p className="text-sm text-slate-300 font-medium">August 24-26 • Downtown Arena</p>
            </div>
          </motion.div>
        </div>

        <div className="px-4 pt-6 pb-2">
          <h2 className="text-xl font-black tracking-tight text-slate-900">Available Tiers</h2>
          <p className="text-sm text-slate-500 font-medium">Choose the experience that fits you best</p>
        </div>

        <div className="flex flex-col gap-5 px-4 pb-8 mt-4">
          {TICKET_TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                onClick={() => onSelectTier(tier)}
                className={`relative flex flex-col gap-5 transition-all cursor-pointer border-2 ${
                  selectedTier?.id === tier.id 
                    ? 'border-primary bg-primary-light/40 ring-4 ring-primary/5' 
                    : 'border-slate-100 bg-white hover:border-primary/20'
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 right-4 px-4 py-1.5 rounded-full shadow-md z-10 ${
                    tier.isPopular ? 'bg-primary text-white' : 'bg-white text-primary border border-primary/10'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tier.badge}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-slate-900">{tier.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-primary tracking-tight">${tier.price}</span>
                    <span className="text-sm font-bold text-slate-400">{tier.description}</span>
                  </div>
                </div>

                <div className="space-y-3 py-1">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 text-[14px] font-semibold text-slate-700 items-center">
                      <CheckCircle2 size={18} className="text-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  fullWidth
                  variant={selectedTier?.id === tier.id ? 'primary' : 'outline'}
                  size="lg"
                  className="rounded-2xl"
                >
                  {selectedTier?.id === tier.id ? 'Selected' : 'Select Tier'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selection</span>
              <span className="text-sm font-black text-slate-900">
                {selectedTier ? `1x ${selectedTier.name}` : 'No ticket selected'}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black text-primary">
                ${selectedTier?.price.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
          <Button 
            disabled={!selectedTier}
            onClick={onContinue}
            fullWidth
            size="xl"
            className="rounded-2xl h-16"
            rightIcon={<ArrowRight size={20} />}
          >
            Go to Checkout
          </Button>
        </div>
        <div className="h-4" />
      </div>
    </motion.div>
  );
}
