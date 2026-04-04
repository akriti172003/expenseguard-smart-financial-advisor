import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, Utensils, Car, Home, Heart, Zap, MoreHorizontal, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';

const categoryIcons: Record<string, any> = {
  Food: Utensils,
  Rent: Home,
  Travel: Car,
  Shopping: ShoppingBag,
  Utilities: Zap,
  Health: Heart,
  Other: MoreHorizontal
};

const categoryColors: Record<string, string> = {
  Food: 'text-orange-400 bg-orange-400/10',
  Rent: 'text-blue-400 bg-blue-400/10',
  Travel: 'text-indigo-400 bg-indigo-400/10',
  Shopping: 'text-pink-400 bg-pink-400/10',
  Utilities: 'text-yellow-400 bg-yellow-400/10',
  Health: 'text-emerald-400 bg-emerald-400/10',
  Other: 'text-gray-400 bg-gray-400/10'
};

export default function ExpenseList() {
  const { expenses, deleteExpense, setActiveTab, activeTab, clearExpenses } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           e.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, selectedCategory]);

  const displayExpenses = activeTab === 'dashboard' ? filteredExpenses.slice(0, 5) : filteredExpenses;

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold">
          {activeTab === 'dashboard' ? 'Recent Transactions' : 'All Transactions'}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-48 bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="All" className="bg-[#1a1a1a]">All Categories</option>
              {Object.keys(categoryIcons).map(cat => (
                <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {expenses.length > 0 && (
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all transactions?')) clearExpenses();
                }}
                className="text-xs text-red-400 font-medium hover:underline"
              >
                Clear
              </button>
            )}
            {activeTab === 'dashboard' && (
              <button 
                onClick={() => setActiveTab('expenses')}
                className="text-sm text-indigo-400 font-medium hover:underline"
              >
                View All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayExpenses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 space-y-3"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchTerm || selectedCategory !== 'All' ? 'No matching transactions found.' : 'No transactions yet.'}
              </p>
            </motion.div>
          ) : (
            displayExpenses.map((expense) => {
              const Icon = categoryIcons[expense.category] || MoreHorizontal;
              return (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${categoryColors[expense.category]}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{expense.description || expense.category}</h4>
                      <p className="text-xs text-gray-500 font-medium">{format(new Date(expense.date), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="font-black text-xl block">₹{expense.amount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{expense.category}</span>
                    </div>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
