import { DollarSign, TrendingUp, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion'; 
import { InsightData } from '../types';
import Charts from './Charts'; 

interface DashboardProps {
  data: InsightData;
}

export default function Dashboard({ data }: DashboardProps) {
  // ✅ FIX: Mapping data to ensure Recharts finds 'name' and 'value'
  // item: any is used to prevent the "Property does not exist" TypeScript error
  const formattedCategoryData = data.categoryBreakdown?.map((item: any) => ({
    name: item.category || item.name || 'Uncategorized',
    value: Number(item.amount) || Number(item.value) || 0
  })) || [];

  const formattedTrendData = data.weeklyTrends?.map((item: any) => ({
    date: item.date,
    amount: Number(item.amount) || 0
  })) || [];

  return (
    <div className="space-y-8"> 
      {/* 1. Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Spending Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="glass-card p-6 border border-white/5 bg-[#0a0a0a]/40 backdrop-blur-xl rounded-[2rem]"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <DollarSign className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total Spent</p>
              <h3 className="text-2xl font-black text-white">
                ₹{data.totalSpending.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Weekly Trend Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="glass-card p-6 border border-white/5 bg-[#0a0a0a]/40 backdrop-blur-xl rounded-[2rem]"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Weekly Trend</p>
              <h3 className="text-2xl font-black text-white">
                ₹{(data.weeklyTrends?.reduce((sum, d) => sum + d.amount, 0) || 0).toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* AI Insights Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent rounded-[2rem]"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <BrainCircuit className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Smart Insight</p>
              <p className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                {data.insights?.[0] || "Analyze your spending to see AI tips!"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Charts Section */}
      <div className="mt-8">
        <Charts 
          categoryData={formattedCategoryData} 
          trendData={formattedTrendData} 
        />
      </div>
    </div>
  );
}