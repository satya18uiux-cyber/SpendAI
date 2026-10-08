import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useExpense();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
    warning: <AlertCircle size={16} className="text-amber-500 shrink-0" />,
    info: <Info size={16} className="text-purple-500 shrink-0" />,
  };

  return (
    <div
      role="status"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-200"
    >
      <div className="flex items-center gap-2.5 text-xs font-medium min-w-0">
        {icons[toast.type || 'success']}
        <span className="truncate">{toast.message}</span>
      </div>
      <button
        onClick={hideToast}
        aria-label="Close notification"
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};
