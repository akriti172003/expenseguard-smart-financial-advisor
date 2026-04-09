import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, CheckCircle2, User, Wallet, Target, TrendingUp, PieChart, Zap, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';
import { useAppContext } from '../context/AppContext';

export default function Onboarding() {
  const { setShowLanding, updateProfile, addNotification } = useAppContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [goal, setGoal] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFinish = async () => {
    const profile: Partial<UserProfile> = {
      name: name || 'User',
      monthlyIncome: Number(income) || 0,
      savingsGoal: Number(goal) || 0,
      onboarded: true,
      plan: 'free'
    };
    
    try {
      await updateProfile(profile);
      addNotification('Welcome to ExpenseGuard!', `Hi ${name || 'User'}, your financial journey starts now. We've set up your dashboard.`);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white bg-gradient-to-br from-white via-white to-indigo-50 text-gray-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                  <Shield className="text-white w-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-gray-900">ExpenseGuard</h1>
                <p className="text-gray-500 font-medium">Track smarter. Spend wiser.</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <p className="text-indigo-900 font-medium leading-relaxed">
                  Welcome to the future of personal finance. Let's set up your profile to give you personalized insights.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={nextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setShowLanding(true)}
                  className="text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Master your money in 3 simple steps</h2>
                <p className="text-gray-500 font-medium">ExpenseGuard is more than just a tracker.</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <TrendingUp className="w-6 h-6 text-indigo-600" />, title: "Behavioral Analysis", desc: "We analyze your spending habits to provide personalized advice." },
                  { icon: <PieChart className="w-6 h-6 text-purple-600" />, title: "Visual Analytics", desc: "Beautiful charts and graphs to help you visualize your progress." },
                  { icon: <Zap className="w-6 h-6 text-pink-600" />, title: "Smart Decisions", desc: "Get instant suggestions on how to optimize your budget." }
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                      {f.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black">{f.title}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Personalize your experience</h2>
                <p className="text-gray-500">We'll use this to calculate your budget and savings progress.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    What's your name?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-indigo-600" />
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-600" />
                    Fixed Expenses (Rent, Bills, etc.) (₹)
                  </label>
                  <input
                    type="number"
                    value={fixedExpenses}
                    onChange={(e) => setFixedExpenses(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    Monthly Savings Goal (₹)
                  </label>
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!name || !income || !goal || !fixedExpenses}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
                  <CheckCircle2 className="text-white w-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">You're all set, {name}!</h2>
                <p className="text-gray-500">Your premium financial dashboard is ready.</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-emerald-900 font-medium">
                We've initialized your dashboard with some sample data to help you get started.
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleFinish}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-gray-200"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={prevStep}
                  className="text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Back to Setup
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
