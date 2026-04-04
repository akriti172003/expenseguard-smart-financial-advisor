import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { totalBalance, totalExpenses, user } = useAppContext();
  const saved = user?.monthlyIncome ? Math.max(0, user.monthlyIncome - totalExpenses) : 0;
  const savingsProgress = user?.savingsGoal ? Math.min(100, (saved / user.savingsGoal) * 100) : 0;
  const budgetProgress = user?.monthlyIncome ? Math.min(100, (totalExpenses / user.monthlyIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card lg:col-span-2 relative overflow-hidden group border-indigo-500/20"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold tracking-wider uppercase text-[10px]">
              <Wallet className="w-4 h-4" />
              Available Balance
            </div>
            <h2 className="text-6xl font-black tracking-tighter text-white">
              ₹{totalBalance.toLocaleString('en-IN')}
            </h2>
            <div className="flex gap-4">
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-bold">+12.5%</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-sm font-medium">
                Real-time updates
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start sm:items-end gap-2">
            <div className="w-16 h-10 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">**** 4242</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card flex flex-col justify-between border-pink-500/20 py-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-semibold text-[10px] uppercase tracking-wider mb-1">Monthly Expenses</p>
              <h3 className="text-3xl font-bold text-pink-400">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-2 bg-pink-500/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 transition-all duration-1000" style={{ width: `${budgetProgress}%` }} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card flex flex-col justify-between border-emerald-500/20 py-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-semibold text-[10px] uppercase tracking-wider mb-1">Current Savings</p>
              <h3 className="text-3xl font-bold text-emerald-400">
                ₹{saved.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${savingsProgress}%` }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
