import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertTriangle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Decision } from '../types';
import { useAppContext } from '../context/AppContext';

export default function WeeklyAnalyzer() {
  // ✅ FIX 1: Pulled insightData (real DB data) and categoryData from Context
  const { 
    insightData,
    user, 
    setActiveTab,
    addNotification 
  } = useAppContext();

  // Helper to get category value from our real DB data
  const getAmount = (catName: string) => {
    const found = insightData.categoryBreakdown.find(
      c => c.name.toLowerCase() === catName.toLowerCase()
    );
    return found ? found.value : 0;
  };

  const onAdjustBudget = () => setActiveTab?.('dashboard');

  // Calculate budget (Monthly / 4)
  const weeklyBudget = (Number(user?.monthlyIncome) || 0) / 4;

  // ✅ FIX 2: Use actual total from insightData
  const total = insightData.totalSpending;
  const diff = weeklyBudget - total;
  const isOver = diff < 0;

  // Interactive Decisions Engine
  const decisions = useMemo((): Decision[] => {
    const res: Decision[] = [];
    if (total === 0) return res;

    if (isOver) {
      res.push({ 
        type: 'warning', 
        message: `You exceeded your weekly budget by ₹${Math.abs(diff).toLocaleString('en-IN')}`,
        action: 'View Detailed Breakdown'
      });
    } else {
      res.push({ 
        type: 'positive', 
        message: `Great job! You are ₹${diff.toLocaleString('en-IN')} under budget this week.`,
      });
    }

    // Food Analysis
    const foodValue = getAmount('Food');
    const foodPerc = (foodValue / total) * 100;
    
    if (foodPerc > 30) {
      res.push({
        type: 'suggestion',
        message: `Food accounts for ${foodPerc.toFixed(0)}% of your spending. Try meal prepping to save ₹${(foodValue * 0.2).toFixed(0)} next week.`,
        action: 'Set Food Alert'
      });
    }

    return res;
  }, [total, diff, isOver, insightData, weeklyBudget]);

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
            <p className="text-[10px] text-gray-500 font-bold uppercase">Weekly Budget Target</p>
            <p className="text-lg font-black text-white">₹{weeklyBudget.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* --- Category Progress Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {['Food', 'Travel', 'Shopping', 'Bills'].map((cat) => {
            const value = getAmount(cat);
            const percentage = total > 0 ? (value / total) * 100 : 0;
            
            return (
              <div key={cat} className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{cat}</label>
                <p className="text-xl font-black text-white">₹{value.toLocaleString('en-IN')}</p>
                
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[9px] text-gray-500 font-bold">{percentage.toFixed(1)}% of total</p>
              </div>
            );
          })}
        </div>

        {/* --- Summary Bar --- */}
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
              className="w-full md:w-auto px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- Smart Decisions --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decisions.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center glass-card border border-white/5 rounded-[2.5rem] bg-white/5">
            <p className="text-gray-500 font-bold italic">Add some expenses to unlock AI-powered spending insights.</p>
          </div>
        ) : (
          decisions.map((decision, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
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
                <div>
                  <p className="font-black text-xs uppercase mb-1 tracking-widest opacity-70">AI Insight</p>
                  <p className="font-bold leading-relaxed">{decision.message}</p>
                </div>
              </div>
              {decision.action && (
                <button 
                  onClick={() => addNotification("Insight Saved", "We'll remind you to optimize this category.")}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    decision.type === 'warning' ? 'bg-pink-500 text-white' : 'bg-indigo-500 text-white'
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