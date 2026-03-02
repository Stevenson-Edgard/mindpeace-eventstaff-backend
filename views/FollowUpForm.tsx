import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, UserPlus, CheckCircle2, Heart } from 'lucide-react';

interface FollowUpEntry {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  ageGroup: string;
  neighborhood: string;
  notes: string;
}

const FollowUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FollowUpEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    ageGroup: '',
    neighborhood: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('followUpEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: FollowUpEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ...formData
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('followUpEntries', JSON.stringify(updatedEntries));

    setFormData({
      fullName: '',
      phone: '',
      email: '',
      ageGroup: '',
      neighborhood: '',
      notes: ''
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const exportToCSV = () => {
    if (entries.length === 0) return alert('No entries to export yet.');

    const headers = ['Date', 'Full Name', 'Phone', 'Email', 'Age Group', 'Neighborhood', 'Notes'];
    const csvRows = [
      headers.join(','),
      ...entries.map(entry => [
        new Date(entry.timestamp).toLocaleString().replace(/,/g, ''),
        `"${entry.fullName}"`,
        `"${entry.phone}"`,
        `"${entry.email}"`,
        `"${entry.ageGroup}"`,
        `"${entry.neighborhood}"`,
        `"${entry.notes.replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `discipleship_followup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full text-white active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display flex items-center">
              New Believer <Heart className="w-4 h-4 text-rose-500 ml-2 fill-rose-500" />
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Discipleship Follow-up</p>
          </div>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center space-x-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          CSV ({entries.length})
        </button>
      </header>

      <main className="flex-1 px-6 py-6 overflow-y-auto hide-scrollbar">
        {showSuccess && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center text-emerald-400 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">Information saved successfully! Praise God.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
            <input 
              type="text" 
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
            <input 
              type="tel" 
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age Group</label>
              <select 
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                <option value="" disabled>Select...</option>
                <option value="Under 18">Under 18</option>
                <option value="18-25">18 - 25</option>
                <option value="26-35">26 - 35</option>
                <option value="36-50">36 - 50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Neighborhood / City</label>
              <input 
                type="text" 
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Downtown"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prayer Requests / Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific prayer requests or details from the conversation..."
              rows={4}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Save Information</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FollowUpForm;
