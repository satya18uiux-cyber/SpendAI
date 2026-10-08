import React, { useState } from 'react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { TopDeviceBar } from './components/layout/TopDeviceBar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { Toast } from './components/common/Toast';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AddExpenseScreen } from './components/screens/AddExpenseScreen';
import { ScanReceiptScreen } from './components/screens/ScanReceiptScreen';
import { ReviewExpenseScreen } from './components/screens/ReviewExpenseScreen';
import { ExpenseHistoryScreen } from './components/screens/ExpenseHistoryScreen';
import { AIAssistantScreen } from './components/screens/AIAssistantScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { Wifi, Battery, Signal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeScreen } = useExpense();
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'add':
        return <AddExpenseScreen />;
      case 'scan':
        return <ScanReceiptScreen />;
      case 'review':
        return <ReviewExpenseScreen />;
      case 'history':
        return <ExpenseHistoryScreen />;
      case 'assistant':
        return <AIAssistantScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Device Toolbar */}
      <TopDeviceBar
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
      />

      {/* Main View Area */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-6 overflow-x-hidden">
        {isMobileFrame ? (
          /* Mobile Frame 390 × 844 px */
          <div className="relative w-full max-w-[390px] h-[844px] bg-[#FAF8FF] sm:rounded-[44px] shadow-2xl border-0 sm:border-[8px] sm:border-slate-800 flex flex-col overflow-hidden ring-1 ring-slate-900/10">
            {/* iOS Status Bar */}
            <div className="pt-2 px-6 pb-1 bg-inherit flex items-center justify-between text-xs font-semibold text-slate-800 select-none z-30 shrink-0">
              <span className="font-mono text-[13px] tracking-tight">9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-700">
                <Signal size={13} strokeWidth={2.5} />
                <Wifi size={13} strokeWidth={2.5} />
                <Battery size={14} strokeWidth={2.5} />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
              {renderScreen()}
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />
          </div>
        ) : (
          /* Fluid / Tablet Responsive Container */
          <div className="w-full max-w-md min-h-[844px] bg-[#FAF8FF] rounded-3xl shadow-xl border border-slate-200/80 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
              {renderScreen()}
            </div>
            <BottomNavigation />
          </div>
        )}
      </main>

      {/* Global Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
