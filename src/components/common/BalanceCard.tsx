import React from 'react';
import { ArrowDownRight, TrendingDown } from 'lucide-react';
import { Expense } from '../../types';
import { CATEGORY_CONFIG } from '../../data/initialExpenses';

interface BalanceCardProps {
  totalSpent: number;
  expenses: Expense[];
  onOpenHistory?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalSpent,
  expenses,
  onOpenHistory,
}) => {
  // Compute category totals
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#340075] via-[#4C1D95] to-[#2E1065] text-white p-5 shadow-lg shadow-purple-950/15">
      {/* Subtle decorative atmospheric background circles */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-purple-400/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-indigo-500/15 blur-xl pointer-events-none" />

      {/* Header row */}
      <div className="relative flex items-center justify-between">
        <div>
          <span className="text-xs font-medium tracking-wide text-purple-200/90 uppercase">
            Total Spent
          </span>
          <p className="text-[11px] text-purple-300 font-medium">October 2026</p>
        </div>

        {/* 12% comparison badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
          <ArrowDownRight size={14} className="stroke-[2.5]" />
          <span>12% less than last month</span>
        </div>
      </div>

      {/* Main hero amount */}
      <div className="relative mt-3 mb-4 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white tabular-nums">
          ₹{totalSpent.toLocaleString()}
        </span>
      </div>

      {/* Spending visualization progress bar */}
      <div className="relative pt-2 border-t border-purple-500/25">
        <div className="flex items-center justify-between text-xs text-purple-200 mb-2">
          <span className="font-medium">Category Breakdown</span>
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="text-purple-300 hover:text-white transition-colors text-[11px] underline underline-offset-2"
            >
              View all 42
            </button>
          )}
        </div>

        {/* Multi-segmented stacked bar */}
        <div className="h-2.5 w-full bg-purple-950/60 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          {sortedCategories.map(([category, amount]) => {
            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
            return (
              <div
                key={category}
                title={`${category}: ₹${amount.toLocaleString()} (${percentage.toFixed(0)}%)`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: config?.color || '#a855f7',
                }}
                className="h-full rounded-xs transition-all duration-300 hover:opacity-90"
              />
            );
          })}
        </div>

        {/* Legend row */}
        <div className="flex items-center gap-3 mt-3 overflow-x-auto no-scrollbar pb-0.5">
          {sortedCategories.map(([category, amount]) => {
            const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(0) : '0';
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
            return (
              <div key={category} className="flex items-center gap-1.5 shrink-0 text-[11px] text-purple-200">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: config?.color || '#a855f7' }}
                />
                <span className="text-purple-100 font-medium">{category}</span>
                <span className="text-purple-300/80 font-mono text-[10px]">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
