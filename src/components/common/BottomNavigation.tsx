import React from 'react';
import { Home, ReceiptText, Sparkles, User, Plus } from 'lucide-react';
import { AppScreen } from '../../types';
import { useExpense } from '../../context/ExpenseContext';

export const BottomNavigation: React.FC = () => {
  const { activeScreen, setActiveScreen, setAddInputMode } = useExpense();

  // Hide bottom nav on splash/onboarding, or review/camera mode if preferred (or show with nice overlay)
  if (activeScreen === 'onboarding') {
    return null;
  }

  const navItems: {
    id: AppScreen;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <Home size={20} strokeWidth={activeScreen === 'dashboard' ? 2.5 : 2} />,
    },
    {
      id: 'history',
      label: 'Expenses',
      icon: <ReceiptText size={20} strokeWidth={activeScreen === 'history' ? 2.5 : 2} />,
    },
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: <Sparkles size={20} strokeWidth={activeScreen === 'assistant' ? 2.5 : 2} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={20} strokeWidth={activeScreen === 'profile' ? 2.5 : 2} />,
    },
  ];

  const handleOpenAdd = () => {
    setAddInputMode('manual');
    setActiveScreen('add');
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-1.5 shadow-lg shadow-purple-950/5 select-none"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home */}
        <button
          onClick={() => setActiveScreen('dashboard')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeScreen === 'dashboard'
              ? 'text-[#4C1D95]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            {navItems[0].icon}
            {activeScreen === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4C1D95]" />
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-1">Home</span>
        </button>

        {/* Expenses */}
        <button
          onClick={() => setActiveScreen('history')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeScreen === 'history'
              ? 'text-[#4C1D95]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            {navItems[1].icon}
            {activeScreen === 'history' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4C1D95]" />
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-1">Expenses</span>
        </button>

        {/* Central Quick Add Action Button */}
        <div className="flex-none px-1">
          <button
            onClick={handleOpenAdd}
            aria-label="Add Expense"
            className="w-11 h-11 rounded-2xl bg-[#4C1D95] hover:bg-[#3B0764] text-white flex items-center justify-center shadow-md shadow-purple-900/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* AI Assistant */}
        <button
          onClick={() => setActiveScreen('assistant')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeScreen === 'assistant'
              ? 'text-[#4C1D95]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            {navItems[2].icon}
            {activeScreen === 'assistant' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4C1D95]" />
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-1">AI Assistant</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveScreen('profile')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeScreen === 'profile'
              ? 'text-[#4C1D95]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            {navItems[3].icon}
            {activeScreen === 'profile' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4C1D95]" />
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-tight mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
