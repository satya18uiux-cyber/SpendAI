import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Download,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { ExpenseCategory, Expense } from '../../types';
import { ExpenseCard } from '../common/ExpenseCard';
import { FilterChip } from '../common/Buttons';
import { Modal } from '../common/Modal';

export const ExpenseHistoryScreen: React.FC = () => {
  const {
    expenses,
    setActiveScreen,
    setReviewExpense,
    setAddInputMode,
    totalSpent,
    showToast,
  } = useExpense();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount-high' | 'amount-low'>('date');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const categories = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

  // Filtered and Sorted Expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
          item.merchant.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          (item.notes && item.notes.toLowerCase().includes(search.toLowerCase())) ||
          String(item.amount).includes(search);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-high') return b.amount - a.amount;
        if (sortBy === 'amount-low') return a.amount - b.amount;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [expenses, selectedCategory, search, sortBy]);

  // Group by Date: "TODAY", "YESTERDAY", "EARLIER THIS MONTH"
  const groupedExpenses = useMemo(() => {
    const groups: { [key: string]: { label: string; items: Expense[]; total: number } } = {
      today: { label: 'TODAY', items: [], total: 0 },
      yesterday: { label: 'YESTERDAY', items: [], total: 0 },
      earlier: { label: 'EARLIER THIS MONTH', items: [], total: 0 },
    };

    const todayStr = '2026-10-08';
    const yesterdayStr = '2026-10-07';

    filteredExpenses.forEach((exp) => {
      if (exp.date === todayStr) {
        groups.today.items.push(exp);
        groups.today.total += exp.amount;
      } else if (exp.date === yesterdayStr) {
        groups.yesterday.items.push(exp);
        groups.yesterday.total += exp.amount;
      } else {
        groups.earlier.items.push(exp);
        groups.earlier.total += exp.amount;
      }
    });

    return [groups.today, groups.yesterday, groups.earlier].filter(
      (g) => g.items.length > 0
    );
  }, [filteredExpenses]);

  const handleExpenseClick = (exp: Expense) => {
    setReviewExpense(exp);
    setActiveScreen('review');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Date,Merchant,Category,Amount,Payment,Notes']
        .concat(
          filteredExpenses.map(
            (e) =>
              `"${e.date}","${e.merchant}","${e.category}",${e.amount},"${e.paymentMethod}","${e.notes || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendAI_October_Expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported October expenses to CSV', 'success');
  };

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 bg-[#FAF8FF] space-y-4">
      {/* Top Header & Monthly Summary */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Expenses
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => {
              setAddInputMode('manual');
              setActiveScreen('add');
            }}
            className="w-9 h-9 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Monthly Summary Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#EDE9FE] via-[#F5F3FF] to-[#FAF8FF] border border-[#DDD6FE]/90 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-purple-900 uppercase tracking-wider">
            October Spending
          </span>
          <p className="text-2xl font-bold font-mono text-[#340075] tabular-nums mt-0.5">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 rounded-full bg-white text-purple-900 border border-purple-200 text-xs font-semibold shadow-xs">
            {expenses.length} transactions
          </span>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Avg ₹595 / day</p>
        </div>
      </div>

      {/* Search Bar & Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full min-h-[44px] pl-10 pr-9 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilterModal(true)}
          aria-label="Filter"
          className="min-h-[44px] px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Sort</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            label={cat}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* Grouped Expenses List */}
      <div className="space-y-4 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {groupedExpenses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No expenses found</p>
            <p className="text-xs">Try adjusting your search or category filter</p>
          </div>
        ) : (
          groupedExpenses.map((group) => (
            <div key={group.label} className="space-y-2">
              {/* Date Group Header with Daily Total */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase font-display">
                  {group.label}
                </span>
                <span className="text-[11px] font-bold font-mono text-slate-700 tabular-nums">
                  ₹{group.total.toLocaleString()}
                </span>
              </div>

              {/* Items in this group */}
              <div className="space-y-2">
                {group.items.map((item) => (
                  <ExpenseCard
                    key={item.id}
                    expense={item}
                    showDate={false}
                    onClick={() => handleExpenseClick(item)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sort & Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Sort & Filter Options"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wide block mb-2">
              Sort Order
            </label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSortBy('date');
                  setShowFilterModal(false);
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center ${
                  sortBy === 'date' ? 'bg-purple-50 border-purple-500 font-bold text-purple-950' : 'border-slate-200'
                }`}
              >
                <span>Latest Date First</span>
              </button>
              <button
                onClick={() => {
                  setSortBy('amount-high');
                  setShowFilterModal(false);
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center ${
                  sortBy === 'amount-high' ? 'bg-purple-50 border-purple-500 font-bold text-purple-950' : 'border-slate-200'
                }`}
              >
                <span>Highest Amount First</span>
              </button>
              <button
                onClick={() => {
                  setSortBy('amount-low');
                  setShowFilterModal(false);
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center ${
                  sortBy === 'amount-low' ? 'bg-purple-50 border-purple-500 font-bold text-purple-950' : 'border-slate-200'
                }`}
              >
                <span>Lowest Amount First</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
