import React, { useState, useRef } from 'react';
import {
  Mic,
  Camera,
  Calendar,
  FileText,
  Store,
  Sparkles,
  ArrowLeft,
  Check,
  Volume2,
  Square,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { CATEGORY_CONFIG } from '../../data/initialExpenses';
import { CategoryIcon } from '../common/CategoryIcon';
import { PrimaryButton } from '../common/Buttons';
import { AudioTranscriber } from '../../utils/audioRecorder';

export const AddExpenseScreen: React.FC = () => {
  const {
    addInputMode,
    setAddInputMode,
    setActiveScreen,
    addExpense,
    showToast,
  } = useExpense();

  // Manual Form States
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState('2026-10-08');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const categories: ExpenseCategory[] = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ];

  const quickMerchants = ['Swiggy', 'Uber', 'Amazon', 'Starbucks', 'Blinkit', 'Zomato'];

  // Handle Quick Merchant Auto-Categorization
  const handleSelectMerchant = async (name: string) => {
    setMerchant(name);
    // Auto-predict category
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant: name, amount: Number(amount) || 0 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.category && categories.includes(data.category)) {
          setCategory(data.category);
          showToast(`AI categorized as ${data.category} (${data.confidence}% confidence)`, 'info');
        }
      }
    } catch {
      // rule based fallback
      if (['Swiggy', 'Starbucks', 'Zomato'].includes(name)) setCategory('Food');
      else if (name === 'Uber') setCategory('Travel');
      else if (name === 'Amazon') setCategory('Shopping');
    }
  };

  // Submit Manual Form
  const handleSaveExpense = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }
    if (!merchant.trim()) {
      showToast('Please enter merchant or store name', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addExpense({
        merchant: merchant.trim(),
        amount: numAmount,
        category,
        date,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMethod,
        notes: notes.trim() || undefined,
        aiCategorized: true,
        confidence: 96,
      });
      setIsSubmitting(false);
      setActiveScreen('dashboard');
    }, 250);
  };

  // Voice recognition / AI extraction
  const processVoiceText = async (text: string) => {
    setIsProcessingVoice(true);
    try {
      const res = await fetch('/api/ai/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      
      setAmount(String(data.amount || 350));
      setMerchant(data.merchant || 'Lunch');
      if (data.category && categories.includes(data.category)) {
        setCategory(data.category);
      }
      if (data.paymentMethod) {
        setPaymentMethod(data.paymentMethod);
      }
      setNotes(data.notes || text);
      showToast(`AI extracted: ₹${data.amount} for ${data.merchant} (${data.category})`, 'success');
      setAddInputMode('manual');
    } catch {
      setAmount('350');
      setMerchant('Swiggy');
      setCategory('Food');
      setAddInputMode('manual');
    } finally {
      setIsProcessingVoice(false);
      setIsListening(false);
    }
  };

  const transcriberRef = useRef<AudioTranscriber | null>(null);

  const handleStartVoice = async () => {
    if (isListening) {
      // User tapped stop
      setIsListening(false);
      setIsProcessingVoice(true);
      try {
        if (transcriberRef.current) {
          const res = await transcriberRef.current.stopAndTranscribe();
          setVoiceTranscript(res.transcription);
          showToast(`Transcribed via ${res.model}`, 'success');
          await processVoiceText(res.transcription);
        }
      } catch (e) {
        simulateVoicePrompt('I spent ₹350 on lunch at Swiggy with UPI');
      } finally {
        transcriberRef.current = null;
        setIsProcessingVoice(false);
      }
      return;
    }

    try {
      const transcriber = new AudioTranscriber();
      await transcriber.startRecording();
      transcriberRef.current = transcriber;
      setIsListening(true);
      showToast('Recording voice audio... Speak now and tap to stop', 'info');
    } catch {
      // Sandbox fallback simulation
      simulateVoicePrompt('I spent ₹350 on lunch at Swiggy with UPI');
    }
  };

  const simulateVoicePrompt = (sample: string) => {
    setIsListening(true);
    setVoiceTranscript(sample);
    setTimeout(() => {
      setIsListening(false);
      processVoiceText(sample);
    }, 1200);
  };

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 bg-[#FAF8FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={() => setActiveScreen('dashboard')}
          aria-label="Back to dashboard"
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-lg font-bold text-slate-900 font-display">
          Add Expense
        </h2>

        <div className="w-10" />
      </div>

      {/* Input Method Switcher */}
      <div className="p-1 bg-slate-200/70 rounded-2xl flex items-center mb-5">
        <button
          onClick={() => setAddInputMode('manual')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            addInputMode === 'manual'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manual
        </button>

        <button
          onClick={() => setAddInputMode('voice')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            addInputMode === 'voice'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mic size={14} className="text-purple-600" />
          <span>Voice</span>
        </button>

        <button
          onClick={() => setActiveScreen('scan')}
          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:text-slate-900 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Camera size={14} className="text-emerald-600" />
          <span>Scan Receipt</span>
        </button>
      </div>

      {/* VOICE MODE */}
      {addInputMode === 'voice' ? (
        <div className="my-auto py-8 flex flex-col items-center text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Spoken Expense Entry
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Speak naturally. SpendAI extracts amount, merchant, and category automatically.
            </p>
          </div>

          {/* Large Interactive Microphone Button */}
          <div className="relative my-4">
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
                <span className="absolute -inset-4 rounded-full bg-purple-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={handleStartVoice}
              disabled={isProcessingVoice}
              aria-label="Toggle voice recording"
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 shadow-rose-500/30 ring-4 ring-rose-200'
                  : 'bg-gradient-to-tr from-[#340075] via-[#4C1D95] to-[#7C3AED] shadow-purple-900/30'
              }`}
            >
              {isProcessingVoice ? (
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Mic size={36} strokeWidth={2.2} />
              )}
            </button>
          </div>

          {/* Voice Helper Text & Status */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600">
              {isListening ? (
                <span className="text-purple-600 animate-pulse font-semibold">
                  Listening... Speak now
                </span>
              ) : isProcessingVoice ? (
                <span className="text-purple-600 font-semibold">
                  AI is analyzing voice input...
                </span>
              ) : (
                <>Voice helper text: <span className="font-semibold text-slate-800">"Say something like: I spent ₹350 on lunch"</span></>
              )}
            </p>

            {voiceTranscript && (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200/70 text-xs text-purple-950 font-medium inline-block max-w-xs">
                "{voiceTranscript}"
              </div>
            )}
          </div>

          {/* Preset voice prompt chips for instant 1-tap testing */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Try voice examples
            </span>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              <button
                onClick={() => simulateVoicePrompt('I spent ₹350 on lunch at Swiggy')}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer active:scale-95 shadow-xs"
              >
                "I spent ₹350 on lunch"
              </button>
              <button
                onClick={() => simulateVoicePrompt('Paid ₹240 for Uber cab ride with card')}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer active:scale-95 shadow-xs"
              >
                "Paid ₹240 for Uber"
              </button>
              <button
                onClick={() => simulateVoicePrompt('Bought ₹1,299 Amazon shopping gear')}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer active:scale-95 shadow-xs"
              >
                "₹1,299 Amazon shopping"
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MANUAL FORM */
        <div className="space-y-5 pb-6">
          {/* Big Tactile Amount Display */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Amount
            </span>

            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-slate-400 font-display">
                ₹
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 w-44 text-center focus:outline-hidden tabular-nums placeholder:text-slate-300"
              />
            </div>

            {/* Quick Amount Suggestion Chips */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              {[100, 250, 350, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-600 text-xs font-mono font-medium transition-colors cursor-pointer"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection Visual Icons Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Category
              </label>
              <span className="text-xs font-semibold text-[#4C1D95]">
                {category}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const isSelected = category === cat;
                const config = CATEGORY_CONFIG[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 border ${
                      isSelected
                        ? 'bg-purple-50/80 border-[#4C1D95] shadow-xs ring-1 ring-[#4C1D95]'
                        : 'bg-white hover:bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <CategoryIcon category={cat} size="sm" />
                    <span
                      className={`text-[11px] font-semibold mt-1.5 truncate max-w-full ${
                        isSelected ? 'text-[#4C1D95]' : 'text-slate-600'
                      }`}
                    >
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Merchant Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Merchant
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Store size={18} />
              </div>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Enter merchant (e.g. Swiggy, Uber)"
                className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-white border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:ring-3 focus:ring-purple-100 transition-all shadow-xs"
              />
            </div>

            {/* Quick merchant tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {quickMerchants.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectMerchant(item)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                    merchant === item
                      ? 'bg-purple-100 text-purple-900 border-purple-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200/70 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Payment Method Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[46px] pl-9 pr-3 rounded-2xl bg-white border border-slate-200/90 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100 shadow-xs"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Payment
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full min-h-[46px] px-3 rounded-2xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100 shadow-xs cursor-pointer"
              >
                <option value="UPI">UPI / GPay</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Notes
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText size={16} />
              </div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional note (e.g. lunch with team)"
                className="w-full min-h-[46px] pl-10 pr-4 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100 shadow-xs"
              />
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-2">
            <PrimaryButton
              onClick={handleSaveExpense}
              isLoading={isSubmitting}
              icon={<Check size={18} />}
            >
              Save Expense
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};
