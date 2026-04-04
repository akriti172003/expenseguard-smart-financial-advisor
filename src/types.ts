export interface FinancialStrategy {
  problem: string;
  cause: string;
  strategy: string;
  outcome: string;
  topCategory: string;
  suggestedActions: string[];
  weeklySavings: number;
  monthlyProjection: number;
  type: 'reduction' | 'optimization' | 'balanced';
}

export interface WeeklyAnalysis {
  food: number;
  travel: number;
  shopping: number;
  bills: number;
  total: number;
  budget: number;
}

export interface Decision {
  type: 'warning' | 'suggestion' | 'positive';
  message: string;
  action?: string;
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  savingsGoal: number;
  onboarded: boolean;
  plan: 'free' | 'premium';
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export type Category = 'Food' | 'Rent' | 'Travel' | 'Shopping' | 'Utilities' | 'Health' | 'Other';

export interface Budget {
  monthly: number;
  savingsGoal: number;
  saved: number;
}

export interface InsightData {
  totalSpending: number;
  categoryBreakdown: { name: string; value: number }[];
  weeklyTrends: { date: string; amount: number }[];
  insights: string[];
}
