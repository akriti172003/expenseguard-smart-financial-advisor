import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, AlertTriangle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Decision } from '../types';
import { useAppContext } from '../context/AppContext';

export default function WeeklyAnalyzer() {
  // ✅ FIX 1: Provide a default empty object to prevent "undefined" crash
  const { 
    weeklyData = { food: 0, travel: 0, shopping: 0, bills: 0 }, 
    setWeeklyData, 
    user, 
    setActiveTab 
  } = useAppContext();

  const onOptimize = (cat: string) => {
    if (!setWeeklyData) return;
    setWeeklyData(prev => ({
      ...prev,
      [cat]: Math.max(0, (prev[cat as keyof typeof prev] || 0) * 0.8)
    }));
  };

  const onAdjustBudget = () => setActiveTab?.('dashboard');

  const weeklyBudget = (user?.monthlyIncome || 0) / 4;

  // ✅ FIX 2: Use Optional Chaining (?.) and Fallbacks (|| 0)
  const total = useMemo(() => {
    const food = weeklyData?.food || 0;
    const travel = weeklyData?.travel || 0;
    const shopping = weeklyData?.shopping || 0;
    const bills = weeklyData?.bills || 0;
    return food + travel + shopping + bills;
  }, [weeklyData]);

  const diff = weeklyBudget - total;
  const isOver = diff < 0;

  const decisions = useMemo((): Decision[] => {
    const res: Decision[] = [];
    if (total === 0) return res;

    if (isOver) {
      res.push({ 
        type: 'warning', 
        message: `You exceeded your weekly budget by ₹${Math.abs(diff).toLocaleString('en-IN')}`,
        action: 'Optimize Spending'
      });
    } else {
      res.push({ 
        type: 'positive', 
        message: `Great job! You are ₹${diff.toLocaleString('en-IN')} under budget this week.`,
      });
    }

    const foodValue = weeklyData?.food || 0;
    const foodPerc = (foodValue / total) * 100;
    
    if (foodPerc > 30) {
      res.push({
        type: 'suggestion',
        message: `Food accounts for ${foodPerc.toFixed(0)}% of your spending. Reducing this could save ₹${(foodValue * 0.2).toFixed(0)} weekly.`,
        action: 'Reduce Food Expenses'
      });
    }

    return res;
  }, [total, diff, isOver, weeklyData, weeklyBudget]);

  const handleInputChange = (key: string, value: number) => {
    if (!setWeeklyData) return;
    setWeeklyData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-white/5"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <BarChart3 className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Weekly Financial Analysis</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Smart Behavioral Insights</p>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Weekly Budget</p>
            <p className="text-lg font-black text-white">₹{weeklyBudget.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {Object.entries(weeklyData).map(([key, value]) => (
            <div key={key} className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">{key}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number"
                  value={value || ''}
                  onChange={(e) => handleInputChange(key, Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-8 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-white"
                />
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${total > 0 ? ((value as number) / total) * 100 : 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Spent</p>
                <p className={`text-3xl font-black ${isOver ? 'text-pink-500' : 'text-emerald-500'}`}>
                  ₹{total.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div className="text-center md:text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Status</p>
                <div className={`flex items-center gap-2 font-black ${isOver ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {isOver ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  {isOver ? 'Over Budget' : 'On Track'}
                </div>
              </div>
            </div>
            <button 
              onClick={onAdjustBudget}
              className="w-full md:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-white"
            >
              Adjust Weekly Budget
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decisions.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center glass-card border border-white/5 rounded-[2.5rem]">
            <p className="text-gray-500 font-bold">Enter your weekly spending to see smart insights.</p>
          </div>
        ) : (
          decisions.map((decision, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-[2rem] border flex flex-col justify-between gap-6 shadow-xl ${
                decision.type === 'warning' 
                  ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' 
                  : decision.type === 'suggestion'
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  decision.type === 'warning' ? 'bg-pink-500/20' : decision.type === 'suggestion' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
                }`}>
                  {decision.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <p className="font-bold leading-relaxed">{decision.message}</p>
              </div>
              {decision.action && (
                <button 
                  onClick={() => onOptimize(decision.action === 'Reduce Food Expenses' ? 'food' : 'general')}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    decision.type === 'warning' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {decision.action}
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}