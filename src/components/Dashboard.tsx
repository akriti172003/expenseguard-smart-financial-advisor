import { DollarSign, TrendingUp, BrainCircuit, AlertTriangle, Utensils, Plane, ShoppingBag, ReceiptText } from 'lucide-react';
import { motion } from 'framer-motion'; 
import { InsightData } from '../types';
import Charts from './Charts'; 

interface DashboardProps {
  data: InsightData;
}

export default function Dashboard({ data }: DashboardProps) {
  // ✅ 1. Format Chart Data
  const formattedCategoryData = data.categoryBreakdown?.map((item: any) => ({
    name: item.category || item.name || 'Uncategorized',
    value: Number(item.amount) || Number(item.value) || 0
  })) || [];

  const formattedTrendData = data.weeklyTrends?.map((item: any) => ({
    date: item.date,
    amount: Number(item.amount) || 0
  })) || [];

  // ✅ 2. Helper to find specific category amounts for the bottom cards
  const getCategoryAmount = (catName: string) => {
    const found = formattedCategoryData.find(c => c.name.toLowerCase() === catName.toLowerCase());
    return found ? found.value : 0;
  };

  return (
    <div className="space-y-8"> 
      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spending Card */}
        <div className="glass-card p-6 border border-white/5 bg-[#0a0a0a]/40 rounded-[2rem]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Spent</p>
            <h3 className="text-2xl font-black text-white">₹{data.totalSpending.toLocaleString('en-IN')}</h3>
        </div>

        {/* Weekly Trend Card */}
        <div className="glass-card p-6 border border-white/5 bg-[#0a0a0a]/40 rounded-[2rem]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Weekly Trend</p>
            <h3 className="text-2xl font-black text-white">
              ₹{(data.weeklyTrends?.reduce((sum, d) => sum + d.amount, 0) || 0).toLocaleString('en-IN')}
            </h3>
        </div>

        {/* AI Insight Card */}
        <div className={`glass-card p-6 border rounded-[2rem] ${data.aiAnalysis?.type === 'aggressive' ? 'border-red-500/30' : 'border-purple-500/20'}`}>
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{data.aiAnalysis?.problem || "Smart Insight"}</p>
            <h4 className="text-sm font-bold text-white">{data.aiAnalysis?.strategy || "Analyze to see tips"}</h4>
        </div>
      </div>

      {/* --- 🚀 BOTTOM SECTION: WEEKLY FINANCIAL ANALYSIS (The one from your screenshot) --- */}
      <div className="glass-card p-8 border border-white/5 bg-[#0a0a0a]/60 rounded-[2.5rem]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Weekly Financial Analysis</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Smart Behavioral Insights</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Weekly Budget</p>
            <p className="text-sm font-black text-white">₹12,500</p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Food', icon: Utensils, key: 'Food' },
            { label: 'Travel', icon: Plane, key: 'Travel' },
            { label: 'Shopping', icon: ShoppingBag, key: 'Shopping' },
            { label: 'Bills', icon: ReceiptText, key: 'Bills' },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase">{item.label}</p>
              <p className="text-lg font-bold text-white">₹{getCategoryAmount(item.key).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>

        {/* Total & Status Bar */}
        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total Spent</p>
            <p className="text-2xl font-black text-emerald-400">₹{data.totalSpending.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">
              {data.aiAnalysis?.type === 'aggressive' ? 'Over Budget' : 'On Track'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <Charts categoryData={formattedCategoryData} trendData={formattedTrendData} />
    </div>
  );
}