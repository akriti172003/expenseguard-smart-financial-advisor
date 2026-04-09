import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function InsightsPanel() {
  // ✅ FIX: Extract with fallbacks in case context values are undefined
  const { insights = [], alerts = [] } = useAppContext();

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-[2.5rem] border-indigo-500/30 bg-indigo-500/5 shadow-2xl shadow-indigo-500/5"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-black text-white">Smart Insights</h3>
        </div>
        
        <div className="space-y-4">
          {/* ✅ FIX: Added optional chaining just in case */}
          {insights?.map((insight, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
              <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
          
          {(!insights || insights.length === 0) && (
            <div className="text-center py-6 space-y-2">
              <p className="text-sm text-gray-500 italic font-medium">AI is analyzing your spending patterns...</p>
              <div className="w-24 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: -100 }}
                  animate={{ x: 100 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-1/2 h-full bg-indigo-500/40"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {/* ✅ FIX: Added optional chaining for alerts map */}
        {alerts?.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-[2rem] border flex items-center gap-4 shadow-xl backdrop-blur-md ${
              alert.type === 'warning' 
                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-orange-500/5' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${alert.type === 'warning' ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
              {alert.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <span className="text-sm font-black tracking-wide leading-tight">{alert.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}