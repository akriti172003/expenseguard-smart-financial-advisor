import React, { useState } from 'react';
import { Plus, Calendar, Tag, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { useAppContext } from '../context/AppContext';

const categories: Category[] = ['Food', 'Rent', 'Travel', 'Shopping', 'Utilities', 'Health', 'Other'];

export default function ExpenseForm() {
  const { addExpense, user, expenses } = useAppContext();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});

  const limitReached = user?.plan === 'free' && expenses.length >= 20;

  const validate = () => {
    const newErrors: { amount?: string; description?: string } = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    } else if (description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    addExpense({
      amount: Number(amount),
      category,
      date,
      description: description.trim()
    });
    
    setAmount('');
    setDescription('');
    setErrors({});
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-400" />
        Add Transaction
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Amount</label>
          <div className="relative">
            <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.amount ? 'text-red-400' : 'text-gray-500'}`} />
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 transition-all text-xl font-semibold ${
                errors.amount ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:ring-indigo-500/50'
              }`}
            />
          </div>
          {errors.amount && <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-1">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Description</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            className={`w-full bg-white/5 border rounded-xl py-3 px-4 outline-none focus:ring-2 transition-all ${
              errors.description ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:ring-indigo-500/50'
            }`}
          />
          {errors.description && <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-1">{errors.description}</p>}
        </div>

        <button 
          type="submit" 
          disabled={limitReached}
          className={`w-full mt-2 py-4 rounded-2xl font-bold transition-all ${
            limitReached 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' 
              : 'btn-primary'
          }`}
        >
          {limitReached ? 'Limit Reached (Free)' : 'Add Expense'}
        </button>
        {limitReached && (
          <p className="text-[10px] text-center text-indigo-400 font-bold uppercase tracking-widest animate-pulse">
            Upgrade to Premium for unlimited tracking
          </p>
        )}
      </form>
    </motion.div>
  );
}
