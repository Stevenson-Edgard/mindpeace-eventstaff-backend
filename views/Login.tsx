import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.phone, formData.password);
      navigate('/assign');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background-dark min-h-screen">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary/20">
            <span className="material-icons-round text-white text-4xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">Staff Portal</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed text-balance">Secure event access management via phone</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Work Phone Number</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">phone_iphone</span>
                <input 
                  type="tel"
                  required
                  disabled={loading}
                  className="w-full bg-slate-800/50 border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm disabled:opacity-50"
                  placeholder="+509 0000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security PIN / Password</label>
                <button type="button" className="text-[10px] font-bold text-primary uppercase">Reset</button>
              </div>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">lock_open</span>
                <input 
                  type="password"
                  required
                  disabled={loading}
                  className="w-full bg-slate-800/50 border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm disabled:opacity-50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center space-x-2 active:scale-95 transition-transform mt-8 disabled:opacity-50 disabled:scale-100"
            >
              <span>{loading ? 'Verifying...' : 'Login to Staff Portal'}</span>
              {!loading && <span className="material-icons-round text-lg">arrow_forward</span>}
            </button>
          </form>
        </div>

        <div className="px-4">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex items-start space-x-3">
            <span className="material-icons-round text-primary text-xl mt-0.5">verified_user</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Staff Tip:</span> Use the phone number associated with your official MindPeace contract.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
