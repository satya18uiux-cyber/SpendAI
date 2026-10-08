import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Mic,
  Camera,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { BalanceCard } from '../common/BalanceCard';
import { AIInsightCard } from '../common/AIInsightCard';
import { ExpenseCard } from '../common/ExpenseCard';
import { Modal } from '../common/Modal';

export const DashboardScreen: React.FC = () => {
  const {
    userName,
    totalSpent,
    expenses,
    setActiveScreen,
    setAddInputMode,
    setReviewExpense,
  } = useExpense();

  const [showNotifications, setShowNotifications] = useState(false);

  // Quick Action Handlers
  const handleOpenAdd = () => {
    setAddInputMode('manual');
    setActiveScreen('add');
  };

  const handleOpenVoice = () => {
    setAddInputMode('voice');
    setActiveScreen('add');
  };

  const handleOpenScan = () => {
    setActiveScreen('scan');
  };

  const handleExpenseClick = (exp: typeof expenses[0]) => {
    setReviewExpense(exp);
    setActiveScreen('review');
  };

  // Recent 4 expenses (matching Swiggy, Uber, Amazon, Netflix)
  const recentExpenses = expenses.slice(0, 4);

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 space-y-5 bg-[#FAF8FF]">
      {/* Top Bar Section */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {/* Small Profile Avatar */}
          <button
            onClick={() => setActiveScreen('profile')}
            aria-label="View Profile"
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#340075] to-[#7C3AED] text-white font-bold text-sm flex items-center justify-center ring-2 ring-purple-200 transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            G
          </button>

          <div>
            <span className="text-xs text-slate-500 font-medium">Welcome back</span>
            <h2 className="text-base font-bold text-slate-900 font-display tracking-tight leading-tight">
              Good morning, {userName}
            </h2>
          </div>
        </div>

        {/* Notification Icon */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowNotifications(true)}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Main Balance Card with Visual Spending Chart */}
      <BalanceCard
        totalSpent={totalSpent}
        expenses={expenses}
        onOpenHistory={() => setActiveScreen('history')}
      />

      {/* AI Insight Card */}
      <AIInsightCard
        onAskAI={() => {
          setActiveScreen('assistant');
        }}
      />

      {/* Quick Action Buttons */}
      <section aria-label="Quick Actions">
        <div className="grid grid-cols-3 gap-2.5">
          {/* + Add Expense */}
          <button
            onClick={handleOpenAdd}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-[#4C1D95] flex items-center justify-center group-hover:bg-[#4C1D95] group-hover:text-white transition-colors">
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-slate-800 mt-2">
              + Add Expense
            </span>
          </button>

          {/* Voice */}
          <button
            onClick={handleOpenVoice}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Mic size={20} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-semibold text-slate-800 mt-2 flex items-center gap-1">
              🎙 Voice
            </span>
          </button>

          {/* Scan Receipt */}
          <button
            onClick={handleOpenScan}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Camera size={20} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-semibold text-slate-800 mt-2 flex items-center gap-1">
              📷 Scan Receipt
            </span>
          </button>
        </div>
      </section>

      {/* Recent Expenses Section */}
      <section className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Recent Expenses
          </h3>
          <button
            onClick={() => setActiveScreen('history')}
            className="text-xs font-semibold text-[#4C1D95] hover:text-[#3B0764] flex items-center gap-0.5 cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="space-y-2">
          {recentExpenses.map((exp) => (
            <ExpenseCard
              key={exp.id}
              expense={exp}
              onClick={() => handleExpenseClick(exp)}
            />
          ))}
        </div>
      </section>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications & Alerts"
      >
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-start gap-3">
            <Sparkles size={18} className="text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <p className="font-semibold text-slate-900">Food Budget Advisory</p>
              <p className="mt-0.5">
                You are spending 18% more on takeout this month. Set a ₹1,500/week cap to stay on track.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
            <TrendingUp size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <p className="font-semibold text-slate-900">Good Job on Travel!</p>
              <p className="mt-0.5">
                Your travel expenses dropped 24% compared to last month.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Bell size={18} className="text-slate-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <p className="font-semibold text-slate-900">October Statement Synced</p>
              <p className="mt-0.5">
                42 transactions totaling ₹18,450 have been categorized with 96% AI confidence.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
