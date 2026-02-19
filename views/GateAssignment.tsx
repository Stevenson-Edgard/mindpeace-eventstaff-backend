import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const GateAssignment: React.FC = () => {
  const { assignGate, currentUser, selectedGate: initialGate } = useAuth();
  const navigate = useNavigate();
  const [gates, setGates] = useState<any[]>([]);
  const [selectedGateId, setSelectedGateId] = useState(initialGate || '');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGates = async () => {
      const data = await api.getGates();
      setGates(data);
      if (!selectedGateId && data.length > 0) setSelectedGateId(data[0].id);
      setLoading(false);
    };
    fetchGates();
  }, [selectedGateId]);

  const handleConfirm = async () => {
    console.log('handleConfirm called', { currentUser, selectedGateId });
    if (currentUser && selectedGateId) {
      setIsSaving(true);
      try {
        console.log('Assigning gate...');
        // Simulate a high-end enterprise API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        await api.assignGate(currentUser.id, selectedGateId);
        console.log('Gate assigned, calling assignGate');
        assignGate(selectedGateId);
        console.log('Navigating to /dashboard');
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to assign gate:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      console.warn('Missing currentUser or selectedGateId', { currentUser, selectedGateId });
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-background-dark">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-dark min-h-screen">
      <div className="pt-12 px-6 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/login')}
            disabled={isSaving}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 active:bg-slate-700 disabled:opacity-50"
          >
            <span className="material-icons-round text-xl">chevron_left</span>
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Staff Session</span>
            <span className="text-sm font-medium">{currentUser?.name || 'Alex Johnson'}</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-display">Gate Assignment</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Select your current duty station to ensure scan data is accurately attributed.
        </p>
      </div>

      <div className="flex-1 px-6 space-y-3 pb-32">
        {gates.map((gate) => (
          <label key={gate.id} className={`relative block group ${isSaving ? 'pointer-events-none opacity-80' : ''}`}>
            <input 
              type="radio" 
              name="gate" 
              value={gate.id}
              checked={selectedGateId === gate.id}
              onChange={() => setSelectedGateId(gate.id)}
              className="peer hidden" 
            />
            <div className="p-5 rounded-2xl border-2 border-transparent bg-slate-800/40 shadow-sm peer-checked:border-primary peer-checked:bg-primary/5 transition-all duration-200 cursor-pointer active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedGateId === gate.id ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-400'}`}>
                    <span className="material-icons-round">
                      {gate.id === 'gate-a' ? 'stars' : 
                       gate.id === 'backstage' ? 'meeting_room' : 
                       gate.id === 'staff' ? 'badge' : 'door_front'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{gate.name}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`flex h-2 w-2 rounded-full ${gate.staffCount > 0 ? 'bg-green-500' : 'bg-slate-600'}`}></span>
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
                        {gate.staffCount > 0 ? `${gate.staffCount} staff currently active` : 'No staff currently active'}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedGateId === gate.id && (
                  <span className="material-icons-round text-primary text-2xl animate-in zoom-in duration-300">check_circle</span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-12 max-w-[430px] mx-auto w-full z-20">
        <button 
          onClick={handleConfirm}
          disabled={isSaving || !selectedGateId || !currentUser}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-3xl shadow-2xl flex items-center justify-center space-x-3 active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="tracking-wide uppercase text-sm">Syncing Post...</span>
            </>
          ) : (
            <>
              <span className="material-icons-round">qr_code_scanner</span>
              <span className="tracking-wide uppercase text-sm">Confirm & Start Scanning</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-tighter">
          Security protocols active • Live tracking enabled
        </p>
      </div>
    </div>
  );
};

export default GateAssignment;
