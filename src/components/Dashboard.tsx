import { DollarSign, TrendingUp, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';
import { InsightData } from '../types';

interface DashboardProps {
  data: InsightData;
}

export default function Dashboard({ data }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-indigo-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <DollarSign className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spending</p>
            <h3 className="text-2xl font-bold text-white">₹{data.totalSpending.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card border-emerald-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly Trend</p>
            <h3 className="text-2xl font-bold text-white">
              ₹{data.weeklyTrends.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-2xl">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Smart Insights</p>
            <p className="text-sm font-medium text-white line-clamp-2">
              {data.insights[0] || "Add more expenses to see insights!"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
