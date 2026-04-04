import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const { notifications, clearNotifications } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;

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
            className="absolute right-0 mt-2 w-80 glass border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button 
                onClick={clearNotifications}
                className="text-[10px] uppercase font-black text-gray-500 hover:text-indigo-400 transition-colors"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 p-1.5 rounded-lg ${n.title.includes('Budget') ? 'bg-orange-500/10 text-orange-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {n.title.includes('Budget') ? <Info className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">{n.title}</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-gray-500 font-medium uppercase tracking-tighter">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">No new notifications</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
              <button className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
