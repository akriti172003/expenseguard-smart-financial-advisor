import React, { useState } from 'react';
import { Shield, Bell, User, Sparkles, ChevronDown, Crown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { user, setShowUpgradeModal, notifications } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const isPremium = user.plan === 'premium';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">ExpenseGuard</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Premium Finance</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Upgrade / Premium Badge */}
          {!isPremium ? (
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-[11px] font-black uppercase tracking-wider text-white hover:scale-105 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              Upgrade to Pro
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest text-white">Pro Member</span>
            </div>
          )}
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2.5 transition-all relative rounded-xl border border-white/5 ${
                isNotificationsOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-indigo-400' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#050505]"></span>
              )}
            </button>
            <NotificationsDropdown 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
            />
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/10 relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-1 rounded-2xl transition-all ${isProfileOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="text-right hidden lg:block">
                <p className="text-xs font-black text-white">{user.name}</p>
                <p className={`text-[9px] uppercase font-black tracking-widest mt-0.5 ${isPremium ? 'text-amber-500' : 'text-gray-500'}`}>
                  {isPremium ? '💎 Diamond Tier' : 'Standard Plan'}
                </p>
              </div>
              
              <div className={`w-10 h-10 rounded-full p-[2px] ${isPremium ? 'bg-gradient-to-tr from-amber-400 to-orange-600' : 'bg-white/10'}`}>
                <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden border border-black/50">
                  <User className={`w-5 h-5 ${isPremium ? 'text-amber-500' : 'text-gray-500'}`} />
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <ProfileDropdown 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
}