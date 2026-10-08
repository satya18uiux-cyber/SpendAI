import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, ScanLine } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { PrimaryButton } from '../common/Buttons';

export const OnboardingScreen: React.FC = () => {
  const { setActiveScreen, showToast } = useExpense();

  const handleGetStarted = () => {
    setActiveScreen('dashboard');
    showToast('Welcome to SpendAI, Ganesh!', 'success');
  };

  const handleLogIn = () => {
    setActiveScreen('dashboard');
    showToast('Logged in as Ganesh (Student/Pro Plan)', 'info');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#FAF8FF] via-white to-[#F5F3FF]">
      {/* Top Header / Brand Logo */}
      <div className="pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#340075] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-900/20">
            <Sparkles size={20} className="fill-white/20" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
              Spend<span className="text-[#6D28D9]">AI</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleLogIn}
          className="text-xs font-semibold text-purple-900 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Hero Illustration Section */}
      <div className="my-auto py-6 flex flex-col items-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/50 via-indigo-100/40 to-pink-100/30 rounded-full blur-3xl" />

          {/* Custom SVG Fintech & AI Illustration */}
          <svg
            className="relative z-10 w-full h-full drop-shadow-xl"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background platform */}
            <ellipse cx="160" cy="260" rx="110" ry="24" fill="#E2E8F0" fillOpacity="0.6" />
            <ellipse cx="160" cy="254" rx="90" ry="16" fill="#EDE9FE" />

            {/* Main Holographic Credit / Smart Card */}
            <g transform="rotate(-6 160 160)">
              <rect
                x="60"
                y="90"
                width="200"
                height="124"
                rx="20"
                fill="url(#cardGrad)"
                stroke="#DDD6FE"
                strokeWidth="1.5"
              />
              {/* Card chip */}
              <rect x="84" y="116" width="32" height="24" rx="6" fill="#FBBF24" />
              <path d="M84 128H116M100 116V140" stroke="#D97706" strokeWidth="1" />
              {/* Card details */}
              <circle cx="224" cy="128" r="14" fill="#A78BFA" fillOpacity="0.5" />
              <circle cx="236" cy="128" r="14" fill="#C4B5FD" fillOpacity="0.6" />
              <text
                x="84"
                y="174"
                fill="#FFFFFF"
                fontFamily="Inter, sans-serif"
                fontSize="12"
                fontWeight="600"
                letterSpacing="2"
              >
                •••• 8450
              </text>
              <text
                x="84"
                y="196"
                fill="#E9D5FF"
                fontFamily="Inter, sans-serif"
                fontSize="10"
              >
                GANESH · SPENDAI
              </text>
            </g>

            {/* Floating Token 1 - Food */}
            <g className="animate-bounce" style={{ animationDuration: '3s' }}>
              <circle cx="68" cy="80" r="26" fill="#FFFFFF" filter="drop-shadow(0 6px 12px rgba(76,29,149,0.12))" />
              <circle cx="68" cy="80" r="24" fill="#F5F3FF" />
              <text x="68" y="85" textAnchor="middle" fontSize="18">🍔</text>
            </g>

            {/* Floating Token 2 - AI Sparkle Badge */}
            <g>
              <rect
                x="180"
                y="50"
                width="100"
                height="34"
                rx="17"
                fill="#FFFFFF"
                filter="drop-shadow(0 8px 16px rgba(76,29,149,0.15))"
              />
              <circle cx="198" cy="67" r="10" fill="#EDE9FE" />
              <path
                d="M198 62L200 66L204 67L200 68L198 72L196 68L192 67L196 66Z"
                fill="#7C3AED"
              />
              <text
                x="214"
                y="71"
                fill="#340075"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontSize="11"
                fontWeight="700"
              >
                Auto-Saved
              </text>
            </g>

            {/* Floating Token 3 - Receipt Scan Badge */}
            <g>
              <rect
                x="50"
                y="200"
                width="95"
                height="36"
                rx="18"
                fill="#FFFFFF"
                filter="drop-shadow(0 8px 16px rgba(76,29,149,0.12))"
              />
              <text
                x="65"
                y="222"
                fill="#10B981"
                fontFamily="JetBrains Mono, monospace"
                fontSize="11"
                fontWeight="700"
              >
                ₹18,450
              </text>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="cardGrad" x1="60" y1="90" x2="260" y2="214" gradientUnits="userSpaceOnUse">
                <stop stopColor="#340075" />
                <stop offset="0.5" stopColor="#4C1D95" />
                <stop offset="1" stopColor="#6D28D9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Value Props Row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-amber-500" />
            <span>&lt;10s Entry</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <ScanLine size={14} className="text-purple-600" />
            <span>AI Receipt OCR</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% Private</span>
          </div>
        </div>
      </div>

      {/* Bottom Content & CTAs */}
      <div className="space-y-5 pb-2">
        <div className="text-center space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            Take Control of Your Money
          </h1>
          <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
            Track your expenses, understand your spending, and get smarter financial insights with AI.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <PrimaryButton
            onClick={handleGetStarted}
            variant="purple"
            icon={<ArrowRight size={18} />}
          >
            Get Started
          </PrimaryButton>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={handleLogIn}
              className="text-[#4C1D95] font-semibold hover:underline cursor-pointer ml-0.5"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
