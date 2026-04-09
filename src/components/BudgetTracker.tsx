import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function BudgetTracker() {
  const { user, totalExpenses, totalBalance } = useAppContext();

  // Safety check: Agar values undefined hain toh 0 maanein
  const income = user?.monthlyIncome || 0;
  const spent = totalExpenses || 0;
  const balance = totalBalance || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Income Card */}
      <div className="glass p-6 rounded-[2rem] border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <Wallet className="w-6 h-6" />
          </div>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Income</p>
        </div>
        <h3 className="text-3xl font-black text-white">
          ₹{income.toLocaleString('en-IN')}
        </h3>
      </div>

      {/* Expenses Card */}
      <div className="glass p-6 rounded-[2rem] border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-500/20 rounded-2xl text-red-400">
            <ArrowDownCircle className="w-6 h-6" />
          </div>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Spent</p>
        </div>
        <h3 className="text-3xl font-black text-white">
          ₹{spent.toLocaleString('en-IN')}
        </h3>
      </div>

      {/* Balance Card */}
      <div className="glass p-6 rounded-[2rem] border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Balance</p>
        </div>
        <h3 className="text-3xl font-black text-white">
          ₹{balance.toLocaleString('en-IN')}
        </h3>
      </div>
    </div>
  );
}