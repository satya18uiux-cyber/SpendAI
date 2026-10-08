export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Other';

export type PaymentMethod = 'Card' | 'UPI' | 'Cash';

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date 'YYYY-MM-DD'
  time: string; // e.g. '8:42 PM'
  paymentMethod: PaymentMethod;
  notes?: string;
  aiCategorized?: boolean;
  confidence?: number;
  receiptImage?: string;
  items?: string[];
}

export type AppScreen =
  | 'onboarding'
  | 'dashboard'
  | 'add'
  | 'scan'
  | 'review'
  | 'history'
  | 'assistant'
  | 'profile';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
  grounded?: boolean;
  searchSources?: Array<{ title: string; url?: string }>;
  structuredData?: {
    breakdown?: { label: string; amount: number }[];
    tip?: string;
  };
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  category: ExpenseCategory;
  recommendation: string;
  actionLabel?: string;
  budgetCap?: number;
}
