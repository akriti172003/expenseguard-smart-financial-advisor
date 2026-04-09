import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

interface ChartProps {
  categoryData?: { name: string; value: number }[];
  trendData?: { date: string; amount: number }[];
}

export default function Charts({ categoryData = [], trendData = [] }: ChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
        <div className="h-[400px] w-full bg-white/5 rounded-[2.5rem] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Category Pie Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-xl flex flex-col"
      >
        <h3 className="text-xl font-black mb-6 text-white tracking-tight">Spending by Category</h3>
        <div className="w-full flex-1" style={{ minHeight: '320px' }}>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData} cx="50%" cy="50%" innerRadius={65} outerRadius={90}
                  paddingAngle={8} dataKey="value" nameKey="name" stroke="none"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-500 italic border-2 border-dashed border-white/5 rounded-[2rem]">
              No category data yet
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Weekly Trend Line Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-8 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-xl flex flex-col"
      >
        <h3 className="text-xl font-black mb-6 text-white tracking-tight">Weekly Spending Trend</h3>
        <div className="w-full flex-1" style={{ minHeight: '320px' }}>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v) => v.split('-').pop()} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0a0a0a' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-500 italic border-2 border-dashed border-white/5 rounded-[2rem]">
              No trend data available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}