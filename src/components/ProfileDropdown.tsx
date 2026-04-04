import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut, CreditCard, Shield, HelpCircle, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const { user, logout, restartOnboarding, setShowUpgradeModal, setShowProfileModal } = useAppContext();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
    onClose();
  };

  const handleEditProfile = () => {
    setShowProfileModal(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-2 w-64 glass border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                    {user.plan === 'premium' ? '💎 Pro Member' : 'Free Plan'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button 
                onClick={handleEditProfile}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
              >
                <User className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                Account Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                <CreditCard className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                Billing & Subscription
              </button>
              {user.plan === 'free' && (
                <button 
                  onClick={handleUpgrade}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all group"
                >
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Upgrade to Pro
                </button>
              )}
              <div className="h-px bg-white/5 my-2 mx-2" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                <HelpCircle className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
                Help Center
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Sign Out
              </button>
              <button 
                onClick={restartOnboarding}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-400 hover:bg-white/5 transition-all group"
              >
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Reset App
              </button>
            </div>

            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                ExpenseGuard v2.4.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
