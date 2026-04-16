export interface FinancialStrategy {
  problem: string;
  cause: string;
  strategy: string;
  outcome: string;
  topCategory?: string; // Optional as backend might not always send it
  suggestedActions?: string[]; 
  weeklySavings: number;
  monthlyProjection?: number;
  // Added 'aggressive' and 'balanced' to match your backend controller logic
  type: 'reduction' | 'optimization' | 'balanced' | 'aggressive';
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
  isAnomaly?: boolean; // Matches your backend anomaly detection logic
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
  // ✅ This links your Backend JSON to the Dashboard UI
  aiAnalysis?: FinancialStrategy; 
}