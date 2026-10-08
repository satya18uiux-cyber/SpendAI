import React, { useState } from 'react';
import {
  User,
  Shield,
  Sparkles,
  Wallet,
  Bell,
  RefreshCcw,
  ExternalLink,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { Modal } from '../common/Modal';

export const ProfileScreen: React.FC = () => {
  const {
    userName,
    totalSpent,
    monthlyBudget,
    setMonthlyBudget,
    resetToDefault,
    showToast,
    setActiveScreen,
  } = useExpense();

  const [budgetVal, setBudgetVal] = useState(String(monthlyBudget));
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [autoCategorize, setAutoCategorize] = useState(true);

  const budgetProgress = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));
  const remaining = Math.max(0, monthlyBudget - totalSpent);

  const handleSaveBudget = () => {
    const num = Number(budgetVal);
    if (num > 0) {
      setMonthlyBudget(num);
      setShowBudgetModal(false);
      showToast(`Monthly budget set to ₹${num.toLocaleString()}`, 'success');
    }
  };

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 bg-[#FAF8FF] space-y-4">
      {/* Top Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Profile & Preferences
        </h2>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#340075] to-[#7C3AED] text-white text-xl font-bold font-display flex items-center justify-center shadow-md shadow-purple-900/20 ring-4 ring-purple-100">
          G
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 truncate font-display">
            {userName} Guthula
          </h3>
          <p className="text-xs text-slate-500 font-medium truncate">
            Student & Young Professional
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-[#4C1D95] text-[10px] font-semibold">
              <Sparkles size={10} />
              SpendAI Pro Plan
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Budget Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">Monthly Budget</span>
              <p className="text-[10px] text-slate-500">October 2026 Target</p>
            </div>
          </div>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
          >
            Edit Limit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600">Spent: ₹{totalSpent.toLocaleString()}</span>
            <span className="font-bold text-slate-900">Cap: ₹{monthlyBudget.toLocaleString()}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                budgetProgress > 90
                  ? 'bg-rose-500'
                  : budgetProgress > 75
                  ? 'bg-amber-500'
                  : 'bg-[#4C1D95]'
              }`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{budgetProgress}% consumed</span>
            <span className="text-emerald-600 font-semibold">₹{remaining.toLocaleString()} left</span>
          </div>
        </div>
      </div>

      {/* App Settings List */}
      <div className="p-2 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
        {/* AI Categorization Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">AI Auto-Categorization</p>
              <p className="text-[10px] text-slate-500">Auto-assigns categories with 96% accuracy</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAutoCategorize(!autoCategorize);
              showToast(autoCategorize ? 'AI Auto-categorize disabled' : 'AI Auto-categorize enabled');
            }}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
              autoCategorize ? 'bg-[#4C1D95]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                autoCategorize ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Currency Display */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Currency</p>
              <p className="text-[10px] text-slate-500">Indian Rupee (INR)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-900">₹ INR</span>
        </div>

        {/* Reset to Sample Data */}
        <button
          onClick={resetToDefault}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RefreshCcw size={15} />
            </div>
            <div>
              <p className="text-xs font-semibold">Reset to Default Data</p>
              <p className="text-[10px] text-slate-400">Restore ₹18,450 sample expenses</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Screen Quick Jumper for Easy Testing & Demo */}
      <div className="p-4 rounded-3xl bg-purple-50/60 border border-purple-200/70 space-y-2">
        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
          Demo Quick Jump
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setActiveScreen('onboarding')}
            className="p-2 rounded-xl bg-white border border-purple-200 text-purple-950 font-medium hover:bg-purple-100/50 cursor-pointer"
          >
            01. Onboarding
          </button>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="p-2 rounded-xl bg-white border border-purple-200 text-purple-950 font-medium hover:bg-purple-100/50 cursor-pointer"
          >
            02. Dashboard
          </button>
          <button
            onClick={() => setActiveScreen('add')}
            className="p-2 rounded-xl bg-white border border-purple-200 text-purple-950 font-medium hover:bg-purple-100/50 cursor-pointer"
          >
            03. Add Expense
          </button>
          <button
            onClick={() => setActiveScreen('scan')}
            className="p-2 rounded-xl bg-white border border-purple-200 text-purple-950 font-medium hover:bg-purple-100/50 cursor-pointer"
          >
            04. Scan Receipt
          </button>
          <button
            onClick={() => setActiveScreen('review')}
            className="p-2 rounded-xl bg-white border border-purple-200 text-purple-950 font-medium hover:bg-purple-100/50 cursor-pointer"
          >
            05. Review Expense
          </button>
          <button
            onClick={() => setActiveScreen('history')}
            className="p-2 rounded-xl bg-white border border-purple-200 text-purple-950 font-medium hover:bg-purple-100/50 cursor-pointer"
          >
            06. Expenses
          </button>
        </div>
      </div>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Set Monthly Budget"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-1 border-b pb-2">
            <span className="text-2xl font-bold text-slate-400">₹</span>
            <input
              type="number"
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className="text-2xl font-bold font-mono text-slate-900 w-36 text-center focus:outline-hidden"
            />
          </div>
          <button
            onClick={handleSaveBudget}
            className="w-full py-3 rounded-2xl bg-[#4C1D95] text-white font-semibold text-xs cursor-pointer"
          >
            Update Budget
          </button>
        </div>
      </Modal>
    </div>
  );
};
