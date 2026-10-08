import React from 'react';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';
import { AppScreen } from '../../types';
import { useExpense } from '../../context/ExpenseContext';

interface TopDeviceBarProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const TopDeviceBar: React.FC<TopDeviceBarProps> = ({
  isMobileFrame,
  setIsMobileFrame,
}) => {
  const { activeScreen, setActiveScreen } = useExpense();

  const screens: { id: AppScreen; label: string; num: string }[] = [
    { id: 'onboarding', label: 'Onboarding', num: '01' },
    { id: 'dashboard', label: 'Dashboard', num: '02' },
    { id: 'add', label: 'Add Expense', num: '03' },
    { id: 'scan', label: 'Scan Receipt', num: '04' },
    { id: 'review', label: 'Review', num: '05' },
    { id: 'history', label: 'Expenses', num: '06' },
    { id: 'assistant', label: 'AI Assistant', num: '07' },
    { id: 'profile', label: 'Profile', num: '08' },
  ];

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2 sticky top-0 z-50 text-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand mark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#340075] to-[#7C3AED] flex items-center justify-center text-white">
            <Sparkles size={13} />
          </div>
          <span className="font-extrabold text-slate-900 font-display tracking-tight text-sm">
            Spend<span className="text-purple-700">AI</span>
          </span>
        </div>

        {/* Screen Switcher Chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {screens.map((s) => {
            const isActive = activeScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScreen(s.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors cursor-pointer active:scale-95 flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span className="opacity-70 text-[10px]">{s.num}.</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Frame Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
          <button
            onClick={() => setIsMobileFrame(true)}
            title="Mobile Frame (390 × 844)"
            className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
              isMobileFrame
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden md:inline">390×844</span>
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            title="Fluid Viewport"
            className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
              !isMobileFrame
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden md:inline">Fluid</span>
          </button>
        </div>
      </div>
    </header>
  );
};
