import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, ExpenseCategory, AppScreen } from '../types';
import { INITIAL_EXPENSES } from '../data/initialExpenses';

interface ToastState {
  show: boolean;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ExpenseContextType {
  expenses: Expense[];
  activeScreen: AppScreen;
  setActiveScreen: (screen: AppScreen) => void;
  reviewExpense: Expense | null;
  setReviewExpense: (exp: Expense | null) => void;
  addExpense: (exp: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Quick add mode
  addInputMode: 'manual' | 'voice' | 'scan';
  setAddInputMode: (mode: 'manual' | 'voice' | 'scan') => void;
  
  // Filter & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;

  // Totals & Analytics
  totalSpent: number;
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  userName: string;
  currency: string;
  
  // Weekly food budget goal (from AI Insight)
  weeklyFoodBudget: number;
  setWeeklyFoodBudget: (amt: number) => void;
  foodBudgetActive: boolean;
  setFoodBudgetActive: (active: boolean) => void;

  // Toast
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;

  // Reset
  resetToDefault: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const STORAGE_KEY = 'spendai_expenses_v1';
const BUDGET_KEY = 'spendai_budget_v1';

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EXPENSES;
  });

  const [activeScreen, setActiveScreen] = useState<AppScreen>('dashboard');
  const [addInputMode, setAddInputMode] = useState<'manual' | 'voice' | 'scan'>('manual');
  const [reviewExpense, setReviewExpense] = useState<Expense | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const [userName] = useState('Ganesh');
  const [currency] = useState('₹');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(BUDGET_KEY);
      if (saved) return Number(saved);
    } catch {}
    return 25000;
  });

  const [weeklyFoodBudget, setWeeklyFoodBudget] = useState(1500);
  const [foodBudgetActive, setFoodBudgetActive] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Saved ₹${newExpense.amount.toLocaleString()} for ${newExpense.merchant}`);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('Expense updated successfully');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    showToast('Expense removed', 'info');
  };

  const resetToDefault = () => {
    setExpenses(INITIAL_EXPENSES);
    setMonthlyBudget(25000);
    setFoodBudgetActive(false);
    showToast('Reset to sample data', 'info');
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        activeScreen,
        setActiveScreen,
        reviewExpense,
        setReviewExpense,
        addExpense,
        updateExpense,
        deleteExpense,
        addInputMode,
        setAddInputMode,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        totalSpent,
        monthlyBudget,
        setMonthlyBudget,
        userName,
        currency,
        weeklyFoodBudget,
        setWeeklyFoodBudget,
        foodBudgetActive,
        setFoodBudgetActive,
        toast,
        showToast,
        hideToast,
        resetToDefault,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
