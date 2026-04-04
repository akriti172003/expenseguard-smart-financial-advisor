import React, { useState } from 'react';
import { Shield, Bell, User, Sparkles, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { user, setShowUpgradeModal, notifications } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">ExpenseGuard</h1>
            <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest">Premium Finance</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user.plan === 'free' && (
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all group"
            >
              <Sparkles className="w-3 h-3 text-indigo-400 group-hover:animate-pulse" />
              Upgrade
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 transition-colors relative rounded-xl ${isNotificationsOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-indigo-400' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#050505]"></span>
              )}
            </button>
            <NotificationsDropdown 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
            />
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-white/10 relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-1 rounded-2xl transition-all ${isProfileOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                  {user.plan === 'premium' ? '💎 Pro Member' : 'Free Plan'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
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
