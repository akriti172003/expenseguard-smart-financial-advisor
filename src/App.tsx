import { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import InsightsPanel from './components/InsightsPanel';
import BudgetTracker from './components/BudgetTracker';
import Charts from './components/Charts';
import AIAssistant from './components/AIAssistant';
import Toast from './components/Toast';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import WeeklyAnalyzer from './components/WeeklyAnalyzer';
import StrategyEngine from './components/StrategyEngine';
import ProfileEditModal from './components/ProfileEditModal';
import { useAppContext } from './context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, CheckCircle2, X, PieChart, Settings, User } from 'lucide-react';

export default function App() {
  const {
    user, expenses, activeTab, showLanding, showUpgradeModal, showProfileModal, strategy,
    setUser, setActiveTab, setShowLanding, setShowUpgradeModal, setShowProfileModal,
    addExpense, deleteExpense, upgradeToPremium,
    totalExpenses, totalBalance, categoryData, trendData, insights, alerts
  } = useAppContext();

  const [toast, setToast] = useState<string | null>(null);

  const handleOnboardingComplete = (profile: any) => {
    setUser(profile);
    setToast('Profile created successfully! 👋');
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpgrade = () => {
    upgradeToPremium();
    setToast('Welcome to Premium! 💎');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    setToast('Expense deleted.');
    setTimeout(() => setToast(null), 3000);
  };

  if (showLanding && !user) {
    return <LandingPage />;
  }

  if (!user) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen pb-32 bg-[#050505] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tight">Hi {user.name} 👋</h2>
              <p className="text-gray-500 font-bold">You spent ₹{trendData.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN')} this week.</p>
            </div>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              title="Account Settings"
            >
              <Settings className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <PieChart className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('analyzer')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'analyzer' ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Weekly Analyzer
            </button>
            {user.plan === 'free' && (
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        <Header />

        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' ? (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WeeklyAnalyzer />
            </motion.div>
          ) : activeTab === 'expenses' ? (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ExpenseList />
                </div>
                <div>
                  <ExpenseForm />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Strategy Engine Centerpiece */}
              <section className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    Smart Strategy Engine
                  </h3>
                  {strategy && (
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
                      AI Strategy Active
                    </span>
                  )}
                </div>
                <StrategyEngine />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="block">
                  <BudgetTracker />
                </div>
                
                <div className="block">
                  <Charts />
                </div>

                <div className="block">
                  <ExpenseList />
                </div>
              </div>

              <div className="space-y-8">
                <div className="block">
                  <ExpenseForm />
                </div>
                <div className="block">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/40">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <button onClick={() => setShowUpgradeModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                <h3 className="text-3xl font-black mb-2">Upgrade to Premium</h3>
                <p className="text-gray-400 font-medium">Unlock the full power of ExpenseGuard.</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {[
                    'Unlimited transaction tracking',
                    'Advanced AI-powered insights',
                    'Custom budget categories',
                    'Priority customer support',
                    'Export data to CSV/PDF'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1 bg-emerald-500/20 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleUpgrade}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Get Premium for ₹499/mo
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Cancel anytime • 7-day free trial</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProfileEditModal />

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 glass border-white/10 rounded-[2rem] flex items-center justify-around px-4 md:hidden z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-indigo-400 scale-110' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'dashboard' ? 'bg-indigo-500/20' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'expenses' ? 'text-pink-400 scale-110' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'expenses' ? 'bg-pink-500/20' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('analyzer')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'analyzer' ? 'text-indigo-400 scale-110' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'analyzer' ? 'bg-indigo-500/20' : ''}`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Analyze</span>
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'insights' ? 'text-emerald-400 scale-110' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-xl ${activeTab === 'insights' ? 'bg-emerald-500/20' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Insights</span>
        </button>
        <button 
          onClick={() => setShowProfileModal(true)}
          className="flex flex-col items-center gap-1 transition-all text-gray-500 hover:text-indigo-400"
        >
          <div className="p-2 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </button>
      </nav>

      <AIAssistant expenses={expenses} budget={user.monthlyIncome} />
      
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
