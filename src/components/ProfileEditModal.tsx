import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, IndianRupee, Target, Bell, CheckCircle2, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserProfile } from '../types';

export default function ProfileEditModal() {
  const { user, setUser, showProfileModal, setShowProfileModal, addNotification, restartOnboarding } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [income, setIncome] = useState(user?.monthlyIncome.toString() || '');
  const [goal, setGoal] = useState(user?.savingsGoal.toString() || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Sync state when modal opens
  React.useEffect(() => {
    if (showProfileModal && user) {
      setName(user.name);
      setIncome(user.monthlyIncome.toString());
      setGoal(user.savingsGoal.toString());
    }
  }, [showProfileModal, user]);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Final save logic (already updated in real-time now, but we close the modal)
    addNotification('Profile Updated', 'Your profile information has been successfully updated.');
    setShowProfileModal(false);
  };

  const updateProfileRealtime = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    updateProfileRealtime({ name: val });
  };

  const handleIncomeChange = (val: string) => {
    setIncome(val);
    updateProfileRealtime({ monthlyIncome: Number(val) || 0 });
  };

  const handleGoalChange = (val: string) => {
    setGoal(val);
    updateProfileRealtime({ savingsGoal: Number(val) || 0 });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        addNotification('Notifications Enabled', 'You will now receive important financial alerts.');
      }
    } else {
      alert('This browser does not support desktop notifications.');
    }
  };

  return (
    <AnimatePresence>
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-xl">
                  <User className="w-8 h-8 text-indigo-400" />
                </div>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <h3 className="text-3xl font-black mb-2">Edit Profile</h3>
              <p className="text-gray-400 font-medium">Keep your financial profile up to date.</p>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Monthly Income</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="number" 
                        value={income}
                        onChange={(e) => handleIncomeChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Savings Goal</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="number" 
                        value={goal}
                        onChange={(e) => handleGoalChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${notificationsEnabled ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
                        <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-emerald-400' : 'text-indigo-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Push Notifications</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Get real-time alerts</p>
                      </div>
                    </div>
                    {notificationsEnabled ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Enabled</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => addNotification('Test Notification', 'This is a test notification to confirm everything is working!')}
                          className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest underline"
                        >
                          Send Test
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={requestNotificationPermission}
                        className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      restartOnboarding();
                      setShowProfileModal(false);
                    }}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                  >
                    <Zap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Restart Onboarding</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
