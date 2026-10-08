import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CreditCard,
  Calendar,
  Clock,
  Edit2,
  Check,
  ChevronDown,
  FileText,
  Trash2,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { CATEGORY_CONFIG } from '../../data/initialExpenses';
import { CategoryIcon } from '../common/CategoryIcon';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { Modal } from '../common/Modal';

export const ReviewExpenseScreen: React.FC = () => {
  const {
    reviewExpense,
    setActiveScreen,
    addExpense,
    updateExpense,
    deleteExpense,
    showToast,
  } = useExpense();

  // If no review expense set, fallback to default ABC Restaurant
  const initial = reviewExpense || {
    id: 'default-review',
    merchant: 'ABC Restaurant',
    amount: 1250,
    category: 'Food' as ExpenseCategory,
    date: '2026-10-08',
    time: '8:42 PM',
    paymentMethod: 'Card' as PaymentMethod,
    aiCategorized: true,
    confidence: 96,
    notes: 'Scanned receipt from dinner',
    items: ['1x Truffle Pasta - ₹680', '1x Virgin Mojito - ₹250', '1x Tiramisu - ₹320'],
  };

  const [currentExpense, setCurrentExpense] = useState(initial);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initial.notes || '');
  const [merchantName, setMerchantName] = useState(initial.merchant);
  const [amountVal, setAmountVal] = useState(String(initial.amount));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initial.paymentMethod);

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

  const handleSelectCategory = (cat: ExpenseCategory) => {
    setCurrentExpense((prev) => ({ ...prev, category: cat }));
    setShowCategoryModal(false);
    showToast(`Category updated to ${cat}`, 'info');
  };

  const handleSave = () => {
    // Check if this is an existing expense or a newly scanned one
    if (reviewExpense?.id && !reviewExpense.id.startsWith('scanned-') && reviewExpense.id !== 'default-review') {
      updateExpense(reviewExpense.id, {
        merchant: merchantName,
        amount: Number(amountVal) || currentExpense.amount,
        category: currentExpense.category,
        paymentMethod,
        notes,
      });
    } else {
      addExpense({
        merchant: merchantName,
        amount: Number(amountVal) || currentExpense.amount,
        category: currentExpense.category,
        date: currentExpense.date,
        time: currentExpense.time,
        paymentMethod,
        notes: notes || undefined,
        aiCategorized: true,
        confidence: currentExpense.confidence || 96,
        items: currentExpense.items,
      });
    }
    setActiveScreen('history');
  };

  const handleDelete = () => {
    if (reviewExpense?.id) {
      deleteExpense(reviewExpense.id);
    }
    setActiveScreen('dashboard');
  };

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 bg-[#FAF8FF]">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={() => setActiveScreen('dashboard')}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-lg font-bold text-slate-900 font-display">
          Review Expense
        </h2>

        {reviewExpense?.id && !reviewExpense.id.startsWith('scanned-') ? (
          <button
            onClick={handleDelete}
            aria-label="Delete Expense"
            className="w-10 h-10 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 size={17} />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      <div className="space-y-4 my-auto py-2">
        {/* Main Clean Expense Card */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-md shadow-purple-950/5 text-center relative overflow-hidden">
          {/* Top category icon */}
          <div className="mx-auto w-14 h-14 rounded-3xl bg-purple-100/70 border border-purple-200 flex items-center justify-center mb-3">
            <CategoryIcon category={currentExpense.category} size="lg" />
          </div>

          {/* Amount */}
          {isEditing ? (
            <div className="flex items-center justify-center gap-1 my-2">
              <span className="text-3xl font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={amountVal}
                onChange={(e) => setAmountVal(e.target.value)}
                className="text-3xl font-bold font-mono text-slate-900 w-40 text-center border-b-2 border-purple-600 focus:outline-hidden"
              />
            </div>
          ) : (
            <h1 className="text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              ₹{Number(amountVal).toLocaleString()}
            </h1>
          )}

          {/* Merchant */}
          {isEditing ? (
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="text-lg font-bold text-center text-slate-900 border-b border-slate-300 mt-2 focus:outline-hidden"
            />
          ) : (
            <h3 className="text-lg font-bold text-slate-900 mt-1 font-display">
              {merchantName}
            </h3>
          )}

          {/* Date & Time metadata */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-2">
            <span>08 Oct 2026</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>8:42 PM</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">Payment: {paymentMethod}</span>
          </div>

          {/* AI Categorized Badge */}
          <div className="mt-5 p-3 rounded-2xl bg-purple-50/90 border border-purple-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={13} />
              </div>
              <div>
                <p className="text-[11px] text-purple-900/80 font-medium">
                  AI categorized this expense as:
                </p>
                <p className="text-xs font-bold text-purple-950">
                  "{currentExpense.category}"
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white border border-purple-200/90 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              Change Category
            </button>
          </div>
        </div>

        {/* Itemized Receipt breakdown (if available) */}
        {currentExpense.items && currentExpense.items.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Scanned Items
            </span>
            <div className="space-y-1.5">
              {currentExpense.items.map((item, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 flex justify-between font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg"
                >
                  <span>{item.split('-')[0]}</span>
                  <span className="font-semibold text-slate-900">
                    {item.split('-')[1] || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Notes */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <FileText size={14} className="text-slate-400" />
            <span>Optional Notes</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add note (e.g. Dinner with team)"
            className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden p-1"
          />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-auto pt-4 space-y-2.5">
        <PrimaryButton
          onClick={handleSave}
          variant="purple"
          icon={<Check size={18} />}
        >
          Save Expense
        </PrimaryButton>

        <SecondaryButton
          onClick={() => {
            setIsEditing(!isEditing);
            showToast(isEditing ? 'Editing stopped' : 'Edit amount and merchant above', 'info');
          }}
          icon={<Edit2 size={16} />}
          className="w-full"
        >
          {isEditing ? 'Done Editing' : 'Edit'}
        </SecondaryButton>
      </div>

      {/* Change Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Change Category"
      >
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const isSelected = currentExpense.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <CategoryIcon category={cat} size="sm" />
                <span className="text-xs">{cat}</span>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
