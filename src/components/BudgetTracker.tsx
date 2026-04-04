import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, PiggyBank, ArrowRight, Edit3, Check, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function BudgetTracker() {
  const { user, setUser, totalExpenses } = useAppContext();
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempBudget, setTempBudget] = useState('');
  const [tempGoal, setTempGoal] = useState('');

  if (!user) return null;

  const budget = user.monthlyIncome;
  const spent = totalExpenses;
  const savingsGoal = user.savingsGoal;
  const saved = Math.max(0, budget - spent);

  const budgetProgress = Math.min((spent / budget) * 100, 100);
  const savingsProgress = Math.min((saved / savingsGoal) * 100, 100);
  const isExceeded = spent > budget;

  const onUpdateBudget = () => {
    if (tempBudget && !isNaN(Number(tempBudget))) {
      setUser({ ...user, monthlyIncome: Number(tempBudget) });
      setEditingBudget(false);
    }
  };

  const onUpdateGoal = () => {
    if (tempGoal && !isNaN(Number(tempGoal))) {
      setUser({ ...user, savingsGoal: Number(tempGoal) });
      setEditingGoal(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Target className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-bold">Monthly Budget</h3>
          </div>
          {!editingBudget ? (
            <button 
              onClick={() => {
                setTempBudget(budget.toString());
                setEditingBudget(true);
              }}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={onUpdateBudget} className="p-1 text-emerald-400 hover:bg-emerald-400/10 rounded-md"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingBudget(false)} className="p-1 text-red-400 hover:bg-red-400/10 rounded-md"><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">₹{spent.toLocaleString('en-IN')}</p>
              {editingBudget ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">of ₹</span>
                  <input 
                    type="number" 
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-24 bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-xs outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-500">of ₹{budget.toLocaleString('en-IN')} limit</p>
              )}
            </div>
            {isExceeded && (
              <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
                BUDGET EXCEEDED 🚨
              </span>
            )}
          </div>

          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${budgetProgress}%` }}
              className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>0%</span>
            <span>{budgetProgress.toFixed(0)}% Used</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold">Savings Goal</h3>
          </div>
          {!editingGoal ? (
            <button 
              onClick={() => {
                setTempGoal(savingsGoal.toString());
                setEditingGoal(true);
              }}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={onUpdateGoal} className="p-1 text-emerald-400 hover:bg-emerald-400/10 rounded-md"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingGoal(false)} className="p-1 text-red-400 hover:bg-red-400/10 rounded-md"><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">₹{saved.toLocaleString('en-IN')}</p>
              {editingGoal ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">saved for ₹</span>
                  <input 
                    type="number" 
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="w-24 bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-xs outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-500">saved for ₹{savingsGoal.toLocaleString('en-IN')} goal</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <span>{savingsProgress.toFixed(0)}%</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${savingsProgress}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Progress</span>
            <span>₹{(savingsGoal - saved).toLocaleString('en-IN')} Left</span>
          </div>
        </div>
      </div>
    </div>
  );
}
