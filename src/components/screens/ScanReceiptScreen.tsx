import React, { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ScanLine,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { Expense } from '../../types';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

export const ScanReceiptScreen: React.FC = () => {
  const { setActiveScreen, setReviewExpense, showToast } = useExpense();

  const [flashOn, setFlashOn] = useState(false);
  const [selectedSample, setSelectedSample] = useState<'restaurant' | 'coffee' | 'grocery'>('restaurant');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Expense> | null>(null);

  // Trigger Receipt Analysis
  const handleAnalyzeReceipt = async (sampleType: 'restaurant' | 'coffee' | 'grocery' = selectedSample) => {
    setIsAnalyzing(true);
    setExtractedData(null);

    try {
      const res = await fetch('/api/ai/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleType }),
      });
      const data = await res.json();

      setTimeout(() => {
        setExtractedData({
          merchant: data.merchant || 'ABC Restaurant',
          amount: data.amount || 1250,
          date: data.date || '08 Oct 2026',
          time: data.time || '8:42 PM',
          category: data.category || 'Food',
          paymentMethod: data.paymentMethod || 'Card',
          confidence: data.confidence || 96,
          items: data.items || ['1x Truffle Pasta - ₹680', '1x Virgin Mojito - ₹250', '1x Tiramisu - ₹320'],
        });
        setIsAnalyzing(false);
        showToast('Receipt analyzed successfully with 96% confidence', 'success');
      }, 1500);
    } catch {
      setTimeout(() => {
        setExtractedData({
          merchant: 'ABC Restaurant',
          amount: 1250,
          date: '08 Oct 2026',
          time: '8:42 PM',
          category: 'Food',
          paymentMethod: 'Card',
          confidence: 96,
          items: ['1x Truffle Pasta - ₹680', '1x Virgin Mojito - ₹250', '1x Tiramisu - ₹320'],
        });
        setIsAnalyzing(false);
      }, 1200);
    }
  };

  const handleReview = () => {
    if (!extractedData) return;
    setReviewExpense({
      id: `scanned-${Date.now()}`,
      merchant: extractedData.merchant || 'ABC Restaurant',
      amount: extractedData.amount || 1250,
      date: '2026-10-08',
      time: extractedData.time || '8:42 PM',
      category: (extractedData.category as any) || 'Food',
      paymentMethod: (extractedData.paymentMethod as any) || 'Card',
      confidence: extractedData.confidence || 96,
      aiCategorized: true,
      notes: 'Scanned via SpendAI Vision OCR',
      items: extractedData.items,
    });
    setActiveScreen('review');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAnalyzeReceipt('restaurant');
    }
  };

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 bg-slate-950 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={() => setActiveScreen('dashboard')}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-base font-bold text-white font-display">
          Scan Receipt
        </h2>

        {/* Flash Toggle */}
        <button
          onClick={() => {
            setFlashOn(!flashOn);
            showToast(flashOn ? 'Flash turned off' : 'Flash enabled', 'info');
          }}
          aria-label="Toggle flash"
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
            flashOn ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {flashOn ? <Zap size={18} /> : <ZapOff size={18} />}
        </button>
      </div>

      {/* Main Viewfinder / Camera Area */}
      <div className="relative flex-1 min-h-[340px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4">
        {/* Simulated Camera feed background with receipt graphic */}
        <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 opacity-90" />

        {/* Mock Realistic Paper Receipt inside camera */}
        <div className="relative z-10 w-[240px] bg-white text-slate-900 rounded-xl p-4 shadow-2xl font-mono text-[11px] transform rotate-1 select-none">
          <div className="text-center pb-2 border-b border-dashed border-slate-300">
            <h4 className="font-bold text-xs uppercase tracking-wider">ABC Restaurant</h4>
            <p className="text-[10px] text-slate-500">14 Indiranagar, 100ft Rd</p>
            <p className="text-[9px] text-slate-400">Date: 08 Oct 2026 · 8:42 PM</p>
          </div>
          <div className="py-2 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span>1x Truffle Pasta</span>
              <span className="font-bold">₹680</span>
            </div>
            <div className="flex justify-between">
              <span>1x Virgin Mojito</span>
              <span className="font-bold">₹250</span>
            </div>
            <div className="flex justify-between">
              <span>1x Tiramisu</span>
              <span className="font-bold">₹320</span>
            </div>
          </div>
          <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between font-bold text-xs">
            <span>TOTAL</span>
            <span className="text-purple-900 font-extrabold">₹1,250</span>
          </div>
          <div className="text-center text-[9px] text-slate-400 mt-2">
            PAID BY CARD · VISA •••• 4242
          </div>
        </div>

        {/* Receipt Scanning Frame Corners */}
        <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-purple-400/50 rounded-2xl pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-6 h-6 border-t-3 border-l-3 border-purple-400 rounded-tl-lg -mt-1 -ml-1" />
            <div className="w-6 h-6 border-t-3 border-r-3 border-purple-400 rounded-tr-lg -mt-1 -mr-1" />
          </div>

          {/* Animated Laser Scanning Beam */}
          {isAnalyzing && (
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-lg shadow-purple-400 animate-pulse my-auto" />
          )}

          <div className="flex justify-between">
            <div className="w-6 h-6 border-b-3 border-l-3 border-purple-400 rounded-bl-lg -mb-1 -ml-1" />
            <div className="w-6 h-6 border-b-3 border-r-3 border-purple-400 rounded-br-lg -mb-1 -mr-1" />
          </div>
        </div>

        {/* Viewfinder Instruction Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-medium text-purple-200 border border-white/10 flex items-center gap-1.5 whitespace-nowrap">
          <ScanLine size={13} className="text-purple-400" />
          <span>Place the receipt inside the frame</span>
        </div>
      </div>

      {/* AI PROCESSING STATE OR EXTRACTED INFO */}
      {isAnalyzing ? (
        <div className="mt-4 p-4 rounded-2xl bg-purple-950/60 border border-purple-800/80 text-center space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-center gap-2 text-purple-300 text-xs font-semibold">
            <Sparkles size={16} className="animate-spin text-purple-400" />
            <span>AI is analyzing your receipt...</span>
          </div>
          <div className="w-48 h-1.5 bg-purple-900/60 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-purple-400">
            Detecting merchant, amount, tax, items & payment method
          </p>
        </div>
      ) : extractedData ? (
        /* EXTRACTED INFORMATION CARD */
        <div className="mt-4 p-4 rounded-2xl bg-white text-slate-900 border border-purple-200 shadow-xl space-y-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Extracted Details</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              {extractedData.confidence}% Confidence
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Merchant</span>
              <p className="font-bold text-slate-900 text-sm">{extractedData.merchant}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Amount</span>
              <p className="font-bold text-purple-900 text-base font-mono">
                ₹{extractedData.amount?.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Date</span>
              <p className="font-semibold text-slate-700">{extractedData.date}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
              <p className="font-semibold text-purple-700">{extractedData.category}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Payment</span>
              <p className="font-medium text-slate-700">{extractedData.paymentMethod}</p>
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton onClick={handleReview} variant="purple">
              Review Expense
            </PrimaryButton>
          </div>
        </div>
      ) : null}

      {/* Camera Capture and Control Bar */}
      {!extractedData && !isAnalyzing && (
        <div className="mt-4 flex items-center justify-between px-4 py-2">
          {/* Upload from gallery */}
          <label className="flex flex-col items-center gap-1 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <span className="text-[10px] font-medium">Gallery</span>
          </label>

          {/* Capture Trigger Button */}
          <button
            onClick={() => handleAnalyzeReceipt(selectedSample)}
            aria-label="Capture Receipt"
            className="w-18 h-18 rounded-full border-4 border-white/60 p-1 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg shadow-purple-900/40"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-purple-900 hover:bg-purple-50">
              <Camera size={26} strokeWidth={2.5} />
            </div>
          </button>

          {/* Sample Receipt Switcher for Instant Testing */}
          <button
            onClick={() => {
              const next = selectedSample === 'restaurant' ? 'coffee' : selectedSample === 'coffee' ? 'grocery' : 'restaurant';
              setSelectedSample(next);
              showToast(`Receipt preset switched to ${next}`, 'info');
            }}
            aria-label="Cycle sample receipt"
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <RefreshCw size={18} />
            </div>
            <span className="text-[10px] font-medium capitalize">{selectedSample}</span>
          </button>
        </div>
      )}
    </div>
  );
};
