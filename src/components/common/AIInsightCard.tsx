import React from 'react';
import { Lightbulb, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';

interface AIInsightCardProps {
  onAskAI?: (query: string) => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ onAskAI }) => {
  const {
    foodBudgetActive,
    setFoodBudgetActive,
    weeklyFoodBudget,
    showToast,
    setActiveScreen,
  } = useExpense();

  const handleApplyBudget = () => {
    setFoodBudgetActive(true);
    showToast(`Weekly Food Budget cap of ₹${weeklyFoodBudget.toLocaleString()} activated!`, 'success');
  };

  const handleChatAboutFood = () => {
    if (onAskAI) {
      onAskAI('How much did I spend on food?');
    } else {
      setActiveScreen('assistant');
    }
  };

  return (
    <div className="relative overflow-hidden p-4 rounded-3xl bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#FAF8FF] border border-[#DDD6FE]/80 shadow-sm">
      {/* Sparkle icon accent */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-200/60 text-[#4C1D95] text-xs font-semibold">
          <Lightbulb size={13} className="text-amber-500 fill-amber-400" />
          <span>AI Insight</span>
        </div>
        <span className="text-[11px] text-purple-700/80 font-medium flex items-center gap-1">
          <Sparkles size={11} className="text-purple-600" />
          Real-time
        </span>
      </div>

      <p className="text-sm text-slate-800 leading-relaxed font-normal mt-1">
        You spent <span className="font-semibold text-rose-600">18% more</span> on food this month.
        Consider setting a weekly food budget of <span className="font-semibold text-slate-900">₹{weeklyFoodBudget.toLocaleString()}</span>.
      </p>

      {/* Action buttons */}
      <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-purple-200/60">
        {foodBudgetActive ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>₹1,500/week Cap Active</span>
          </div>
        ) : (
          <button
            onClick={handleApplyBudget}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#4C1D95] hover:bg-[#3B0764] transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            Set ₹1,500 Budget
          </button>
        )}

        <button
          onClick={handleChatAboutFood}
          className="ml-auto flex items-center gap-1 text-xs font-semibold text-purple-800 hover:text-purple-950 px-2 py-1.5 rounded-xl hover:bg-purple-200/50 transition-colors cursor-pointer"
        >
          <span>Ask SpendAI</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
