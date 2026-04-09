import React, { useMemo } from 'react';
import { Brain, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SmartInsights() {
  const { user, expenses } = useAppContext();

  const analysis = useMemo(() => {
    const income = Number(user?.monthlyIncome) || 0;
    const goal = Number(user?.savingsGoal) || 0;
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const balance = income - totalSpent;
    const safeToSpend = balance - goal;
    const progress = goal > 0 ? (balance / goal) * 100 : 0;

    return {
      safeToSpend: safeToSpend > 0 ? safeToSpend : 0,
      progress: Math.min(100, Math.max(0, progress)),
      isOnTrack: balance >= goal,
      balance
    };
  }, [user, expenses]);

  return (
    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <Brain className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">Smart Analysis</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Insights</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Safe to Spend Extra</p>
          <p className={`text-2xl font-black ${analysis.isOnTrack ? 'text-emerald-400' : 'text-orange-400'}`}>
            ₹{analysis.safeToSpend.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-gray-500 text-[10px] font-bold uppercase">Savings Goal Progress</span>
            <span className="text-white text-xs font-black">{Math.round(analysis.progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${analysis.progress}%` }}
            />
          </div>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-xl border ${
          analysis.isOnTrack ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'
        }`}>
          {analysis.isOnTrack ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-400" />
          )}
          <p className="text-[10px] font-bold text-gray-300">
            {analysis.isOnTrack 
              ? "Strategy: Your savings goal is secured." 
              : "Warning: High spending is affecting your savings goal."}
          </p>
        </div>
      </div>
    </div>
  );
}