import React from 'react';
import { motion } from 'motion/react';
import { Target, TrendingDown, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function StrategyEngine() {
  const { strategy, generateStrategy, applyStrategy } = useAppContext();

  if (!strategy) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card text-center py-12"
      >
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Ready for your Weekly Strategy?</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Our AI engine analyzes your spending patterns to create a custom financial roadmap for the next 7 days.
        </p>
        <button 
          onClick={generateStrategy}
          className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-5 h-5" />
          Generate Strategy
        </button>
      </motion.div>
    );
  }

  const isWarning = strategy.type === 'reduction' || strategy.type === 'optimization';

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden p-8 rounded-[2.5rem] border-2 shadow-2xl ${
          strategy.type === 'reduction' ? 'bg-red-500/5 border-red-500/20' :
          strategy.type === 'optimization' ? 'bg-orange-500/5 border-orange-500/20' :
          'bg-emerald-500/5 border-emerald-500/20'
        }`}
      >
        {/* Background Glow */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 rounded-full ${
          strategy.type === 'reduction' ? 'bg-red-500' :
          strategy.type === 'optimization' ? 'bg-orange-500' :
          'bg-emerald-500'
        }`} />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${
                strategy.type === 'reduction' ? 'bg-red-500 text-white' :
                strategy.type === 'optimization' ? 'bg-orange-500 text-white' :
                'bg-emerald-500 text-white'
              }`}>
                {strategy.type === 'reduction' ? <TrendingDown className="w-8 h-8" /> : 
                 strategy.type === 'optimization' ? <AlertTriangle className="w-8 h-8" /> : 
                 <CheckCircle2 className="w-8 h-8" />}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Weekly Strategy</span>
                <h2 className="text-3xl font-black">{strategy.problem}</h2>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Weekly Savings</span>
                <span className="text-xl font-black text-white">₹{strategy.weeklySavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Monthly Impact</span>
                <span className="text-xl font-black text-indigo-400">₹{strategy.monthlyProjection.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <section>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> The Problem
                </h4>
                <p className="text-lg text-gray-200 font-medium leading-relaxed">
                  {strategy.cause}
                </p>
              </section>

              <section>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> The Strategy
                </h4>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <h5 className="text-xl font-bold text-white mb-2">{strategy.strategy}</h5>
                  <p className="text-gray-400">{strategy.outcome}</p>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Action Plan</h4>
                <div className="space-y-4">
                  {strategy.suggestedActions.map((action, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-gray-300">{action}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <div className="pt-4">
                <button 
                  onClick={applyStrategy}
                  className="w-full py-5 bg-white text-black hover:bg-gray-200 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl"
                >
                  Apply Strategy
                  <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest">
                  This will update your savings goals and budget targets
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <button 
          onClick={generateStrategy}
          className="text-sm text-gray-500 hover:text-white transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Regenerate Strategy
        </button>
      </div>
    </div>
  );
}
