import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Lightbulb, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ✅ Fix: Deployment ke liye dynamic URL setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function StrategyEngine() {
  const { user, setUser, token } = useAppContext();
  const [isApplying, setIsApplying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Strategy Execution Logic with Backend Sync
  const handleApplyStrategy = async () => {
    if (!user || !token) return;
    
    setIsApplying(true);
    setIsSuccess(false);

    const currentGoal = Number(user.savings_goal || user.savingsGoal) || 10000;
    const increment = 1.12; // 12% Growth Mode
    const newGoal = Math.round(currentGoal * increment);

    try {
      // ✅ Fix: Hardcoded localhost ko API_BASE_URL se replace kiya
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ savingsGoal: newGoal }),
      });

      if (!response.ok) throw new Error('Failed to sync with database');

      const updatedUser = await response.json();

      // ✅ Frontend State Update
      setUser(updatedUser);
      
      // ✅ Success Animation
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      
      console.log(`Success: Goal updated to ₹${newGoal}`);
    } catch (err) {
      console.error("Strategy Sync Error:", err);
      alert("Failed to update goal. Please check your connection.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className={`p-8 rounded-[2.5rem] transition-all duration-500 border relative overflow-hidden group ${
      isSuccess ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#051109] border-emerald-500/20'
    }`}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Section: Strategy Details */}
        <div className="space-y-8 flex-1">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border transition-colors ${
              isSuccess ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
            }`}>
              {isSuccess ? <Sparkles className="w-6 h-6 animate-spin-slow" /> : <CheckCircle className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Weekly Strategy</p>
              <h3 className="text-3xl font-black text-white">
                {isSuccess ? 'Strategy Applied!' : 'High Utility Spending'}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">The Problem</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Routine Subscriptions & Unused Services</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Lightbulb className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">The Strategy</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <p className="text-white font-bold">Growth Mode</p>
                <p className="text-emerald-500/80 text-xs font-bold">Savings Goal +12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Impact & Action */}
        <div className="flex flex-col justify-between items-end gap-6 min-w-[280px]">
          <div className="flex gap-4 w-full">
            <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Weekly Savings</p>
              <p className="text-xl font-black text-white">₹500</p>
            </div>
            <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Target Goal</p>
              <p className="text-xl font-black text-indigo-400">
                ₹{(Number(user?.savingsGoal || user?.savings_goal) || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button 
            onClick={handleApplyStrategy}
            disabled={isApplying || isSuccess}
            className={`w-full px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 group/btn ${
              isApplying 
              ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed' 
              : isSuccess
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-white text-black hover:bg-emerald-400 hover:scale-[1.02] shadow-xl shadow-emerald-500/10'
            }`}
          >
            {isApplying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Syncing Database...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Goal Updated
              </>
            ) : (
              <>
                Apply Strategy
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">
            Data persists to MongoDB Atlas via Secure API
          </p>
        </div>
      </div>
    </div>
  );
}