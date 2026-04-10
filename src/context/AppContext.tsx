import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Expense, UserProfile, FinancialStrategy } from '../types';

// ✅ Fix: Deployment ke liye dynamic URL (Localhost vs Render)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface AppContextType {
  user: UserProfile | null;
  expenses: Expense[];
  activeTab: string;
  showLanding: boolean;
  showUpgradeModal: boolean;
  showProfileModal: boolean;
  strategy: FinancialStrategy | null;
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
  generateStrategy: () => void;
  
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

  // --- Notifications Logic ---
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

  // --- Auth & Initialization ---
  useEffect(() => {
    const init = async () => {
      const currentToken = localStorage.getItem('expenseguard_token');
      if (currentToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            await fetchExpenses(currentToken);
            setShowLanding(false); // Logged in user ke liye landing chhupayein
          } else {
            // Agar token expire ho gaya hai
            logout();
          }
        } catch (err) {
          console.error("Init Error (Check if Backend is running):", err);
          // 💡 Important: Error aane par user ko landing par hi rakhein
          setShowLanding(true);
        }
      } else {
        setShowLanding(true);
      }
      setAuthReady(true);
      setLoading(false);
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
        // Backend '_id' ko frontend 'id' se map kar rahe hain
        setExpenses(data.map((e: any) => ({ ...e, id: e._id || e.id })));
      }
    } catch (err) {
      console.error("Fetch Expenses Error:", err);
    }
  };

  // --- Actions ---

  const addExpense = async (newExp: Omit<Expense, 'id'>) => {
    const currentToken = localStorage.getItem('expenseguard_token');
    if (!currentToken) return;
    try {
      const payload = {
        title: newExp.title || "Untitled",
        amount: Number(newExp.amount) || 0,
        category: newExp.category || "General",
        date: newExp.date || new Date().toISOString()
      };

      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedExp = await res.json();
        setExpenses(prev => [{ ...savedExp, id: savedExp._id || savedExp.id }, ...prev]);
        addNotification("Expense Added", `Added ₹${payload.amount}`);
      }
    } catch (err) {
      console.error("Add Expense Error:", err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const currentToken = localStorage.getItem('expenseguard_token');
    if (!currentToken) return;

    try {
      const cleanedUpdates = {
        ...updates,
        monthlyIncome: updates.monthlyIncome !== undefined ? Number(updates.monthlyIncome) : undefined,
        savingsGoal: updates.savingsGoal !== undefined ? Number(updates.savingsGoal) : undefined
      };

      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}` 
        },
        body: JSON.stringify(cleanedUpdates)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        addNotification("Success", "Financial profile updated!");
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error("Update Profile Error:", err);
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
      }
    } catch (err) {}
  };

  const clearExpenses = async () => {
    const currentToken = localStorage.getItem('expenseguard_token');
    if (!currentToken) return;
    try {
      await fetch(`${API_BASE_URL}/expenses/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      setExpenses([]);
    } catch (err) {}
  };

  const logout = () => {
    localStorage.removeItem('expenseguard_token');
    setToken(null);
    setUser(null);
    setExpenses([]);
    setShowLanding(true);
  };

  // --- 🚀 Memoized Stats (Improved for Charts) ---
  
  const totalExpenses = useMemo(() => 
    expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0), [expenses]);

  const totalBalance = useMemo(() => 
    (Number(user?.monthlyIncome) || 0) - totalExpenses, [user, totalExpenses]);

  const categoryData = useMemo(() => {
    if (expenses.length === 0) return [];
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

  const generateStrategy = () => {
    setStrategy({
      type: 'balanced',
      problem: 'High Utility Spending',
      cause: 'Routine Subscriptions',
      strategy: 'Growth',
      outcome: 'Savings Increased by 12%',
      topCategory: 'General',
      suggestedActions: ['Review Subscriptions', 'Set Daily Limit'],
      weeklySavings: 500,
      monthlyProjection: 2000
    });
  };

  return (
    <AppContext.Provider value={{
      user, expenses, activeTab, showLanding, showUpgradeModal, showProfileModal, strategy,
      notifications, loading, authReady, token,
      setUser, setToken, setActiveTab, setShowLanding, setShowUpgradeModal, setShowProfileModal,
      logout, addExpense, deleteExpense, updateProfile, clearExpenses, generateStrategy,
      addNotification, clearNotifications,
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