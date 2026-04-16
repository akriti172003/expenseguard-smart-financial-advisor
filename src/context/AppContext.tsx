import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Expense, UserProfile, FinancialStrategy, InsightData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface AppContextType {
  user: UserProfile | null;
  expenses: Expense[];
  activeTab: string;
  showLanding: boolean;
  showUpgradeModal: boolean;
  showProfileModal: boolean;
  strategy: FinancialStrategy | null;
  insightData: InsightData; // ✅ Added for Dashboard sync
  notifications: any[];
  loading: boolean;
  authReady: boolean;
  token: string | null;
  
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  setActiveTab: (tab: string) => void;
  setShowLanding: (show: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  logout: () => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearExpenses: () => Promise<void>;
  generateStrategy: (authToken?: string) => Promise<void>;
  
  addNotification: (title: string, message: string) => void;
  clearNotifications: () => void;

  totalExpenses: number;
  totalBalance: number;
  categoryData: { name: string; value: number }[];
  trendData: { date: string; amount: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('expenseguard_token'));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [strategy, setStrategy] = useState<FinancialStrategy | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // --- ✅ 1. NOTIFICATIONS ---
  const addNotification = (title: string, message: string) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- ✅ 2. AUTH & INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      const currentToken = localStorage.getItem('expenseguard_token');
      
      if (!currentToken) {
        setShowLanding(true);
        setLoading(false);
        setAuthReady(true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          // Parallel fetch for speed
          await Promise.all([
            fetchExpenses(currentToken),
            generateStrategy(currentToken)
          ]);
          setShowLanding(false);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
        setShowLanding(true);
      } finally {
        setAuthReady(true);
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const fetchExpenses = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.map((e: any) => ({ ...e, id: e._id || e.id })));
      }
    } catch (err) {
      console.error("Fetch Expenses Error:", err);
    }
  };

  const generateStrategy = async (authToken?: string) => {
    const currentToken = authToken || localStorage.getItem('expenseguard_token');
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/user/analyze-finance`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStrategy(data);
      }
    } catch (err) {
      console.error("AI Analysis Failed:", err);
    }
  };

  // --- ✅ 3. ACTIONS ---
  const addExpense = async (newExp: any) => {
    const currentToken = localStorage.getItem('expenseguard_token');
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}` 
        },
        body: JSON.stringify(newExp)
      });

      const result = await res.json();

      if (res.ok) {
        setExpenses(prev => [{ ...result, id: result._id || result.id }, ...prev]);
        addNotification("Expense Added", `Spent ₹${newExp.amount} on ${newExp.category}`);
        // Refresh AI Analysis after adding
        generateStrategy(currentToken); 
      }
    } catch (err) {
      addNotification("Error", "Check your connection");
    }
  };

  const deleteExpense = async (id: string) => {
    const currentToken = localStorage.getItem('expenseguard_token');
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        setExpenses(prev => prev.filter(e => e.id !== id));
        generateStrategy(currentToken);
      }
    } catch (err) {}
  };

  const logout = () => {
    localStorage.removeItem('expenseguard_token');
    setToken(null);
    setUser(null);
    setExpenses([]);
    setStrategy(null);
    setShowLanding(true);
  };

  // --- ✅ 4. ANALYTICS ENGINE (Memoized) ---
  const totalExpenses = useMemo(() => 
    expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0), [expenses]);

  const totalBalance = useMemo(() => 
    (Number(user?.monthlyIncome) || 0) - totalExpenses, [user, totalExpenses]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      const cat = e.category || "General";
      data[cat] = (data[cat] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(data).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value 
    }));
  }, [expenses]);

  const trendData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    
    return days.map(date => ({
      date,
      amount: expenses
        .filter(e => e.date?.split('T')[0] === date)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    }));
  }, [expenses]);

  // ✅ COMBINED DATA FOR UI
  const insightData: InsightData = useMemo(() => ({
    totalSpending: totalExpenses,
    categoryBreakdown: categoryData,
    weeklyTrends: trendData,
    insights: strategy ? [strategy.strategy] : [],
    aiAnalysis: strategy || undefined
  }), [totalExpenses, categoryData, trendData, strategy]);

  return (
    <AppContext.Provider value={{
      user, expenses, activeTab, showLanding, showUpgradeModal, showProfileModal, strategy,
      notifications, loading, authReady, token, insightData,
      setUser, setToken, setActiveTab, setShowLanding, setShowUpgradeModal, setShowProfileModal,
      logout, addExpense, deleteExpense, clearExpenses: async() => {}, updateProfile: async() => {}, 
      generateStrategy, addNotification, clearNotifications,
      totalExpenses, totalBalance, categoryData, trendData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};