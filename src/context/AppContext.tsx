import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Expense, UserProfile, Category, WeeklyAnalysis, FinancialStrategy } from '../types';

interface AppContextType {
  user: UserProfile | null;
  expenses: Expense[];
  weeklyData: Omit<WeeklyAnalysis, 'total' | 'budget'>;
  activeTab: 'dashboard' | 'expenses' | 'insights' | 'analyzer';
  showLanding: boolean;
  showUpgradeModal: boolean;
  showProfileModal: boolean;
  strategy: FinancialStrategy | null;
  notifications: { id: string; title: string; message: string; time: string; read: boolean }[];
  
  setUser: (user: UserProfile | null) => void;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setWeeklyData: React.Dispatch<React.SetStateAction<Omit<WeeklyAnalysis, 'total' | 'budget'>>>;
  setActiveTab: (tab: 'dashboard' | 'expenses' | 'insights' | 'analyzer') => void;
  setShowLanding: (show: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string) => void;
  logout: () => void;
  restartOnboarding: () => void;
  clearExpenses: () => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  upgradeToPremium: () => void;
  generateStrategy: () => void;
  applyStrategy: () => void;
  
  // Computed values
  totalExpenses: number;
  totalBalance: number;
  categoryData: { name: string; value: number }[];
  trendData: { date: string; amount: number }[];
  insights: string[];
  alerts: { type: 'warning' | 'success'; message: string }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weeklyData, setWeeklyData] = useState<Omit<WeeklyAnalysis, 'total' | 'budget'>>({
    food: 0,
    travel: 0,
    shopping: 0,
    bills: 0
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'insights' | 'analyzer'>('dashboard');
  const [showLanding, setShowLanding] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [strategy, setStrategy] = useState<FinancialStrategy | null>(null);
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; time: string; read: boolean }[]>([
    { id: '1', title: 'Welcome!', message: 'Welcome to ExpenseGuard. Start tracking your expenses today.', time: 'Just now', read: false },
    { id: '2', title: 'Budget Tip', message: 'Try to save at least 20% of your income for long-term goals.', time: '2h ago', read: false }
  ]);

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string) => {
    setNotifications(prev => [
      { id: Math.random().toString(36).substr(2, 9), title, message, time: 'Just now', read: false },
      ...prev
    ]);
  };

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('expenseguard_user');
    const savedExpenses = localStorage.getItem('expenseguard_expenses');
    const savedWeekly = localStorage.getItem('expenseguard_weekly');
    const savedStrategy = localStorage.getItem('expenseguard_strategy');
    const savedNotifications = localStorage.getItem('expenseguard_notifications');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      addNotification('Welcome Back!', `Good to see you again, ${parsedUser.name}. Your dashboard is up to date.`);
    } else {
      // If no user, we definitely want onboarding first based on user request
      setShowLanding(false);
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedWeekly) {
      setWeeklyData(JSON.parse(savedWeekly));
    }
    if (savedStrategy) {
      setStrategy(JSON.parse(savedStrategy));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const clearExpenses = () => {
    setExpenses([]);
  };

  const logout = () => {
    localStorage.removeItem('expenseguard_user');
    localStorage.removeItem('expenseguard_expenses');
    localStorage.removeItem('expenseguard_weekly');
    localStorage.removeItem('expenseguard_strategy');
    localStorage.removeItem('expenseguard_notifications');
    setUser(null);
    setExpenses([]);
    setWeeklyData({ food: 0, travel: 0, shopping: 0, bills: 0 });
    setStrategy(null);
    setNotifications([]);
    setShowLanding(true);
  };

  const restartOnboarding = () => {
    localStorage.removeItem('expenseguard_user');
    localStorage.removeItem('expenseguard_expenses');
    localStorage.removeItem('expenseguard_weekly');
    localStorage.removeItem('expenseguard_strategy');
    localStorage.removeItem('expenseguard_notifications');
    setUser(null);
    setExpenses([]);
    setWeeklyData({ food: 0, travel: 0, shopping: 0, bills: 0 });
    setStrategy(null);
    setNotifications([]);
    setShowLanding(false); // Go straight to onboarding
  };

  const addExpense = (newExp: Omit<Expense, 'id'>) => {
    if (user?.plan === 'free' && expenses.length >= 20) {
      setShowUpgradeModal(true);
      return;
    }
    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      ...newExp
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const upgradeToPremium = () => {
    if (user) {
      const updatedUser: UserProfile = { ...user, plan: 'premium' };
      setUser(updatedUser);
      setShowUpgradeModal(false);
    }
  };

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalBalance = (user?.monthlyIncome || 0) - totalExpenses;

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      amount: expenses
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0)
    }));
  }, [expenses]);

  // Save to localStorage and check for budget alerts
  useEffect(() => {
    if (user) localStorage.setItem('expenseguard_user', JSON.stringify(user));
    localStorage.setItem('expenseguard_expenses', JSON.stringify(expenses));
    localStorage.setItem('expenseguard_weekly', JSON.stringify(weeklyData));
    if (strategy) localStorage.setItem('expenseguard_strategy', JSON.stringify(strategy));
    localStorage.setItem('expenseguard_notifications', JSON.stringify(notifications));

    // Auto-notification for budget exceeded
    if (user && totalExpenses > user.monthlyIncome) {
      const hasBudgetNotification = notifications.some(n => n.title === 'Budget Alert' && !n.read);
      if (!hasBudgetNotification) {
        addNotification('Budget Alert', `You have exceeded your monthly budget of ₹${user.monthlyIncome.toLocaleString('en-IN')}.`);
      }
    }
  }, [user, expenses, weeklyData, strategy, notifications, totalExpenses]);

  const generateStrategy = () => {
    const weeklyBudget = (user?.monthlyIncome || 0) / 4;
    const currentWeeklySpending = trendData.reduce((sum, d) => sum + d.amount, 0);
    const topCat = [...categoryData].sort((a, b) => b.value - a.value)[0];
    const topCatPerc = topCat ? (topCat.value / totalExpenses) * 100 : 0;
    const savingsRate = user?.monthlyIncome ? ((user.monthlyIncome - totalExpenses) / user.monthlyIncome) * 100 : 0;

    let newStrategy: FinancialStrategy;

    if (currentWeeklySpending > weeklyBudget) {
      newStrategy = {
        type: 'reduction',
        problem: 'Weekly Spending Overload',
        cause: `Your weekly spending of ₹${currentWeeklySpending.toLocaleString('en-IN')} exceeds your weekly budget of ₹${weeklyBudget.toLocaleString('en-IN')}.`,
        strategy: 'Aggressive Cost Reduction',
        outcome: 'Stabilized cash flow and debt prevention.',
        topCategory: topCat?.name || 'General',
        suggestedActions: [
          'Cut non-essential subscriptions immediately.',
          'Limit dining out to once per week.',
          'Use public transport for the next 7 days.'
        ],
        weeklySavings: currentWeeklySpending - weeklyBudget,
        monthlyProjection: (currentWeeklySpending - weeklyBudget) * 4
      };
    } else if (topCatPerc > 30) {
      const actions = topCat.name === 'Shopping' 
        ? ['Implement a 48-hour wait rule for all non-essential purchases.', 'Unsubscribe from marketing emails.', 'Delete saved card details from shopping apps.']
        : topCat.name === 'Food'
        ? ['Meal prep for the entire week on Sunday.', 'Switch to store-brand groceries.', 'Limit food delivery apps to zero usage this week.']
        : [`Audit your ${topCat.name} expenses for recurring waste.`, `Set a hard daily limit for ${topCat.name} spending.`, 'Look for cheaper alternatives or bulk purchases.'];

      newStrategy = {
        type: 'optimization',
        problem: 'Category Imbalance',
        cause: `${topCat.name} accounts for ${topCatPerc.toFixed(0)}% of your total spending, which is disproportionately high.`,
        strategy: 'Category Optimization',
        outcome: 'Better distribution of funds across all needs.',
        topCategory: topCat.name,
        suggestedActions: actions,
        weeklySavings: topCat.value * 0.15,
        monthlyProjection: topCat.value * 0.15 * 4
      };
    } else if (savingsRate < 20) {
      newStrategy = {
        type: 'reduction',
        problem: 'Low Savings Rate',
        cause: `Your current savings rate is only ${savingsRate.toFixed(1)}%. Financial experts recommend at least 20%.`,
        strategy: 'Savings Acceleration',
        outcome: 'Faster progress towards your ₹' + (user?.savingsGoal.toLocaleString('en-IN')) + ' goal.',
        topCategory: topCat?.name || 'N/A',
        suggestedActions: [
          'Automate a transfer of ₹2,000 to your savings account today.',
          'Review all recurring bills for potential downgrades.',
          'Negotiate better rates for your internet or phone plan.'
        ],
        weeklySavings: (user?.monthlyIncome || 0) * 0.05,
        monthlyProjection: (user?.monthlyIncome || 0) * 0.05 * 4
      };
    } else {
      newStrategy = {
        type: 'balanced',
        problem: 'Healthy Spending Pattern',
        cause: 'Your spending is well-distributed and within budget limits.',
        strategy: 'Wealth Building Strategy',
        outcome: 'Accelerated savings and investment potential.',
        topCategory: topCat?.name || 'N/A',
        suggestedActions: [
          'Increase your automated savings by 5%.',
          'Research low-risk investment options like Index Funds.',
          'Allocate a small portion of your surplus to an Emergency Fund.'
        ],
        weeklySavings: weeklyBudget * 0.1,
        monthlyProjection: weeklyBudget * 0.1 * 4
      };
    }

    setStrategy(newStrategy);
  };

  const applyStrategy = () => {
    if (!strategy || !user) return;
    
    // Example: Adjust savings goal or just simulate applying
    const updatedUser: UserProfile = {
      ...user,
      savingsGoal: user.savingsGoal + strategy.monthlyProjection
    };
    setUser(updatedUser);
    // In a real app, we might create a budget record or something similar.
  };

  const { insights, alerts } = useMemo(() => {
    const res: string[] = [];
    const al: { type: 'warning' | 'success'; message: string }[] = [];

    if (expenses.length > 0) {
      const topCat = [...categoryData].sort((a, b) => b.value - a.value)[0];
      if (topCat) {
        const perc = (topCat.value / totalExpenses * 100).toFixed(0);
        res.push(`You spent ${perc}% of your budget on ${topCat.name}.`);
        if (topCat.name === 'Food' && Number(perc) > 30) {
          al.push({ type: 'warning', message: 'High spending on food 🚨' });
        }
      }

      const thisWeek = trendData.reduce((sum, d) => sum + d.amount, 0);
      res.push(`Your weekly spending is ₹${thisWeek.toLocaleString('en-IN')}.`);
      
      const budget = user?.monthlyIncome || 0;
      if (totalExpenses > budget && budget > 0) {
        al.push({ type: 'warning', message: 'Budget exceeded 🚨' });
      } else if (totalExpenses < budget * 0.5 && budget > 0) {
        al.push({ type: 'success', message: 'Good saving trend 👍' });
      }

      if (user?.plan === 'premium') {
        res.push(`Premium Insight: You're on track to save ₹${(budget - totalExpenses).toLocaleString('en-IN')} this month.`);
      }
    }

    return { insights: res, alerts: al };
  }, [expenses, categoryData, totalExpenses, user, trendData]);

  return (
    <AppContext.Provider value={{
      user, expenses, weeklyData, activeTab, showLanding, showUpgradeModal, showProfileModal, strategy, notifications,
      setUser, setExpenses, setWeeklyData, setActiveTab, setShowLanding, setShowUpgradeModal, setShowProfileModal, clearNotifications, addNotification, logout, restartOnboarding, clearExpenses,
      addExpense, deleteExpense, upgradeToPremium, generateStrategy, applyStrategy,
      totalExpenses, totalBalance, categoryData, trendData, insights, alerts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
