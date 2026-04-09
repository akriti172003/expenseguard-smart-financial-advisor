import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure this matches your motion library
import { X, User, IndianRupee, Target, Bell, CheckCircle2, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserProfile } from '../types';

// ✅ Added 'default' keyword to fix Vite export error
export default function ProfileEditModal() {
  const { 
    user, 
    updateProfile, 
    showProfileModal, 
    setShowProfileModal, 
    addNotification, 
    // restartOnboarding // Ensure this exists in your AppContext
  } = useAppContext();

  // State initialization
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [goal, setGoal] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Sync state when modal opens or user data changes
  useEffect(() => {
    if (showProfileModal && user) {
      setName(user.name || '');
      setIncome(user.monthlyIncome?.toString() || '0');
      setGoal(user.savingsGoal?.toString() || '0');
    }
  }, [showProfileModal, user]);

  if (!showProfileModal) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // ✅ Strict data formatting for Backend
      const updates: Partial<UserProfile> = {
        name: name.trim(),
        monthlyIncome: Number(income) || 0,
        savingsGoal: Number(goal) || 0
      };

      // Calling the optimized updateProfile from AppContext
      await updateProfile(updates);
      
      // Modal close logic
      setShowProfileModal(false);
    } catch (error) {
      console.error('Save Error:', error);
      addNotification('Error', 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        addNotification('Notifications Enabled', 'You will now receive alerts.');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowProfileModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#0A0A0A]"
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-b border-white/5">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-xl border border-white/10">
                <User className="w-8 h-8 text-indigo-400" />
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <h3 className="text-3xl font-black mb-2 text-white">Edit Profile</h3>
            <p className="text-gray-400 font-medium text-sm">Keep your financial profile up to date.</p>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                    placeholder="Enter Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Income Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Income (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="number" 
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Savings Goal Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Goal (₹)</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="number" 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className="pt-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${notificationsEnabled ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
                      <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-emerald-400' : 'text-indigo-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Alerts</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">Real-time tracking</p>
                    </div>
                  </div>
                  {!notificationsEnabled ? (
                    <button 
                      type="button"
                      onClick={requestNotificationPermission}
                      className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all text-white"
                    >
                      Enable
                    </button>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSaving}
              className={`w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black text-white text-lg shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}