import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function InsightsPanel() {
  const { insights, alerts } = useAppContext();

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card border-indigo-500/30 bg-indigo-500/5"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold">Smart Insights</h3>
        </div>
        
        <div className="space-y-4">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">Add more data to generate insights.</p>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-[1.5rem] border flex items-center gap-4 shadow-xl ${
              alert.type === 'warning' 
                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-orange-500/5' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5'
            }`}
          >
            <div className={`p-2 rounded-xl ${alert.type === 'warning' ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
              {alert.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <span className="text-sm font-bold tracking-wide">{alert.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
