import React from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, PieChart, Zap, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function LandingPage() {
  const { setShowLanding } = useAppContext();

  const handleStart = () => {
    setShowLanding(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight">ExpenseGuard</span>
        </div>
        <button 
          onClick={handleStart}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Smart Financial Advisor</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-gray-900">
            Track smarter. <br />
            <span className="text-indigo-600">Spend wiser.</span> <br />
            Save better.
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
            Experience the next generation of personal finance. ExpenseGuard analyzes your behavior to help you make better financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleStart}
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex -space-x-3 items-center px-4">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  className="w-10 h-10 rounded-full border-4 border-white shadow-sm"
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              ))}
              <span className="pl-6 text-sm font-bold text-gray-400">+10k users</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="relative glass-mockup p-8 rounded-[3rem] border border-gray-100 bg-white/50 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Balance</p>
                  <p className="text-3xl font-black">₹75,000.00</p>
                </div>
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="h-40 bg-indigo-50 rounded-2xl flex items-end p-4 gap-2">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-600 rounded-t-lg" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Savings</p>
                  <p className="text-lg font-black text-emerald-600">₹12,500</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Expenses</p>
                  <p className="text-lg font-black text-pink-600">₹8,400</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-black tracking-tight">Everything you need to master your money</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Powerful tools designed to give you complete control over your financial life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <TrendingUp className="w-8 h-8 text-indigo-600" />, 
                title: "Behavioral Analysis", 
                desc: "We analyze your spending habits to provide personalized advice." 
              },
              { 
                icon: <PieChart className="w-8 h-8 text-purple-600" />, 
                title: "Visual Analytics", 
                desc: "Beautiful charts and graphs to help you visualize your progress." 
              },
              { 
                icon: <Zap className="w-8 h-8 text-pink-600" />, 
                title: "Smart Decisions", 
                desc: "Get instant suggestions on how to optimize your budget." 
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black">{f.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Shield className="text-indigo-600 w-6 h-6" />
            <span className="text-lg font-black tracking-tight">ExpenseGuard</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">© 2026 ExpenseGuard. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-bold text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
