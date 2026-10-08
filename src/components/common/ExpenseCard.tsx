import React from 'react';
import { Expense } from '../../types';
import { CategoryIcon } from './CategoryIcon';
import { Sparkles } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onClick?: () => void;
  showDate?: boolean;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onClick,
  showDate = false,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group relative flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-150 ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <CategoryIcon category={expense.category} size="md" />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {expense.merchant}
            </h4>
            {expense.aiCategorized && (
              <span
                title="AI auto-categorized"
                className="inline-flex items-center text-purple-600 shrink-0"
              >
                <Sparkles size={12} className="fill-purple-100" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
            <span>{expense.category}</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            {showDate && (
              <>
                <span>{expense.date}</span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
              </>
            )}
            <span>{expense.time || expense.paymentMethod}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 pl-3">
        <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
          ₹{expense.amount.toLocaleString()}
        </div>
        {expense.notes && (
          <p className="text-[11px] text-slate-400 truncate max-w-[110px]">
            {expense.notes}
          </p>
        )}
      </div>
    </div>
  );
};
