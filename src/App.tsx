import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; 
import { Sparkles, PieChart, Settings, Loader2 } from 'lucide-react';

// Context & Components
import { useAppContext } from './context/AppContext';
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
import SmartInsights from './components/SmartInsights'; 
import UpgradeModal from './components/UpgradeModal';
import Auth from './components/Auth';

export default function App() {
  const {
    user, 
    expenses, 
    activeTab, 
    showLanding, 
    showUpgradeModal, 
    loading, 
    authReady, 
    token,
    setActiveTab, 
    setShowProfileModal,
    // ✅ Extracting the unified data object from Context
    categoryData,
    trendData,
    insightData 
  } = useAppContext();

  const [toast, setToast] = useState<string | null>(null);

  // ✅ Weekly Spending Calculation
  const weeklySpending = useMemo(() => {
    if (!trendData || trendData.length === 0) return 0;
    return trendData.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [trendData]);

  useEffect(() => {
    document.title = "ExpenseGuard | Premium Finance";
  }, []);

  // ✅ GLOBAL LOADING STATE
  if (!authReady || (token && loading && !user)) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
          Syncing Financial Data...
        </p>
      </div>
    );
  }

  // Auth Routing
  if (!token) return <Auth />;
  if (showLanding && !user) return <LandingPage />;
  if (user && user.onboarded === false) return <Onboarding />;

  return (
    <div className="min-h-screen pb-32 bg-[#050505] text-white selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Hi {user?.name || 'Explorer'} 👋
              </h2>
              <p className="text-gray-500 font-bold text-sm">
                Spending this week: <span className="text-white">₹{weeklySpending.toLocaleString('en-IN')}</span>
              </p>
            </div>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <Settings className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <PieChart className="w-4 h-4" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('analyzer')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'analyzer' ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" /> AI Analyzer
            </button>
          </div>
        </div>

        <Header />

        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' ? (
            <motion.div key="analyzer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* ✅ Passing insightData ensures the Food/Travel boxes are populated */}
              <WeeklyAnalyzer data={insightData} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              <StrategyEngine />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <BudgetTracker />
                  
                  <Charts 
                    categoryData={categoryData} 
                    trendData={trendData} 
                  />
                  
                  <ExpenseList />
                </div>
                <div className="space-y-8">
                  <SmartInsights /> 
                  <ExpenseForm />
                  <InsightsPanel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ProfileEditModal />
      <AnimatePresence>{showUpgradeModal && <UpgradeModal />}</AnimatePresence>
      {user && <AIAssistant expenses={expenses} budget={user.monthlyIncome || 0} />}
      <AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );
}