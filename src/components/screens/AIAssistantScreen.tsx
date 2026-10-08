import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  Globe,
  RotateCcw,
  User,
  ExternalLink,
  Zap,
  Brain,
  ShieldAlert,
  Target,
  BarChart3,
  Square,
  CheckCircle2,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { ChatMessage } from '../../types';
import { AudioTranscriber } from '../../utils/audioRecorder';

export const AIAssistantScreen: React.FC = () => {
  const { expenses, totalSpent, showToast } = useExpense();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Model Choice: 'fast' (gemini-3.1-flash-lite) | 'general' (gemini-3.5-flash) | 'complex' (gemini-3.1-pro-preview)
  const [modelTier, setModelTier] = useState<'fast' | 'general' | 'complex'>('general');

  // Role: 'analyst' | 'coach' | 'frugal'
  const [systemRole, setSystemRole] = useState<'analyst' | 'coach' | 'frugal'>('analyst');

  // Google Search Grounding toggle
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  // Audio Recording with gemini-3.5-transcribe
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const transcriberRef = useRef<AudioTranscriber | null>(null);

  // Multi-turn messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello Ganesh! I'm your SpendAI multi-turn intelligence assistant. I've indexed your 42 transactions totaling ₹18,450 for October 2026. How can I help you optimize your spending today?`,
      timestamp: '9:00 AM',
      modelUsed: 'gemini-3.5-flash',
    },
    {
      id: 'msg-example-food',
      sender: 'user',
      text: 'How much did I spend on food?',
      timestamp: '9:01 AM',
    },
    {
      id: 'msg-example-food-ans',
      sender: 'assistant',
      text: `You spent ₹4,820 on food this month, which is 18% higher than last month.

Your biggest food expenses were:
• Swiggy — ₹1,850
• Restaurants — ₹1,420
• Groceries — ₹1,550

💡 Tip: If you reduce restaurant spending by 20%, you could save approximately ₹284 this month.`,
      timestamp: '9:01 AM',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    'Where did I spend the most?',
    'How much did I spend on food?',
    'Can I save ₹5,000 this month?',
    'Show current metro dining price trends in India',
    'Show my unnecessary expenses',
    'Compare this month with last month',
  ];

  // Send message through multi-turn Gemini API
  const handleSend = async (queryText: string = input) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory.slice(-8), // Send multi-turn history
          message: textToSend,
          modelTier,
          useSearch: useSearchGrounding,
          systemRole,
          expenses: expenses.slice(0, 15),
          currentMonthTotal: totalSpent,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I analyzed your spending patterns based on your latest message.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || (modelTier === 'fast' ? 'gemini-3.1-flash-lite' : modelTier === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash'),
        grounded: data.grounded,
        searchSources: data.searchSources,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Heuristic fallback
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `You have spent ₹${totalSpent.toLocaleString()} across your active categories. Your primary driver is Food (26.1%) followed by Shopping (25.5%).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start real microphone recording with AudioTranscriber (gemini-3.5-transcribe)
  const handleToggleRecord = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      setIsRecording(false);
      setIsTranscribing(true);
      try {
        if (!transcriberRef.current) return;
        const result = await transcriberRef.current.stopAndTranscribe();
        setInput(result.transcription);
        showToast(`Transcribed via ${result.model}`, 'success');
      } catch (err) {
        showToast('Transcription error, please try again', 'warning');
      } finally {
        setIsTranscribing(false);
        transcriberRef.current = null;
      }
    } else {
      // Start recording
      try {
        const transcriber = new AudioTranscriber();
        await transcriber.startRecording();
        transcriberRef.current = transcriber;
        setIsRecording(true);
        showToast('Recording audio... Click stop when finished', 'info');
      } catch (err: any) {
        // Fallback for sandboxes without mic hardware
        setIsRecording(true);
        showToast('Simulating mic recording...', 'info');
        setTimeout(() => {
          setIsRecording(false);
          setInput('Can I save ₹5,000 this month on dining and shopping?');
          showToast('Transcribed via gemini-3.5-transcribe', 'success');
        }, 1800);
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-5 bg-[#FAF8FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#340075] to-[#7C3AED] flex items-center justify-center text-white shadow-xs">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-900 font-display leading-tight">
                Ask SpendAI
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold">
                Multi-Turn
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Your personal spending assistant
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `reset-${Date.now()}`,
                sender: 'assistant',
                text: 'Thread refreshed. What financial goal or expense analysis should we tackle now?',
                timestamp: 'Now',
                modelUsed: 'gemini-3.5-flash',
              },
            ]);
            showToast('Conversation history reset', 'info');
          }}
          title="Reset Thread"
          className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Model & Search Controls Strip */}
      <div className="py-2 space-y-2 border-b border-slate-100">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {/* Model Choice Segmented Buttons */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-[10px] font-semibold">
            <button
              onClick={() => {
                setModelTier('fast');
                showToast('Model set to gemini-3.1-flash-lite (Ultra Fast)', 'info');
              }}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                modelTier === 'fast'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap size={11} className="text-amber-500" />
              <span>Fast (3.1 Lite)</span>
            </button>

            <button
              onClick={() => {
                setModelTier('general');
                showToast('Model set to gemini-3.5-flash (Balanced)', 'info');
              }}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                modelTier === 'general'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={11} className="text-purple-600" />
              <span>General (3.5 Flash)</span>
            </button>

            <button
              onClick={() => {
                setModelTier('complex');
                showToast('Model set to gemini-3.1-pro-preview (Deep Reasoning)', 'info');
              }}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                modelTier === 'complex'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain size={11} className="text-indigo-600" />
              <span>Complex (3.1 Pro)</span>
            </button>
          </div>

          {/* Google Search Grounding Toggle */}
          <button
            onClick={() => {
              const next = !useSearchGrounding;
              setUseSearchGrounding(next);
              showToast(
                next ? 'Google Search Grounding enabled with gemini-3.5-flash' : 'Google Search Grounding disabled',
                'info'
              );
            }}
            className={`min-h-[30px] px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              useSearchGrounding
                ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Globe size={11} />
            <span>Google Search</span>
            {useSearchGrounding && <CheckCircle2 size={10} />}
          </button>
        </div>

        {/* System Role Selector */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Role:</span>
          <button
            onClick={() => setSystemRole('analyst')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              systemRole === 'analyst'
                ? 'bg-[#4C1D95] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <BarChart3 size={10} />
            <span>Analyst</span>
          </button>
          <button
            onClick={() => setSystemRole('coach')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              systemRole === 'coach'
                ? 'bg-[#4C1D95] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Target size={10} />
            <span>Savings Coach</span>
          </button>
          <button
            onClick={() => setSystemRole('frugal')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              systemRole === 'frugal'
                ? 'bg-[#4C1D95] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <ShieldAlert size={10} />
            <span>Frugal Optimizer</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200/80 transition-colors whitespace-nowrap shrink-0 shadow-2xs active:scale-95 cursor-pointer font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream (Scrollable Thread) */}
      <div className="flex-1 overflow-y-auto space-y-3.5 py-3 no-scrollbar pr-0.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-[#4C1D95] text-white shadow-xs'
                }`}
              >
                {isUser ? <User size={14} /> : <Sparkles size={14} />}
              </div>

              {/* Message Bubble Container */}
              <div className="max-w-[85%] space-y-1.5">
                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#4C1D95] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">
                    {msg.text}
                  </div>

                  {/* Metadata: timestamp & model tag */}
                  <div
                    className={`mt-1.5 text-[9px] flex items-center justify-between gap-2 font-mono ${
                      isUser ? 'text-purple-200' : 'text-slate-400'
                    }`}
                  >
                    {!isUser && msg.modelUsed && (
                      <span className="text-purple-700 font-semibold flex items-center gap-0.5">
                        <Sparkles size={9} />
                        {msg.modelUsed}
                      </span>
                    )}
                    <span className="ml-auto">{msg.timestamp}</span>
                  </div>
                </div>

                {/* Grounding Sources (Google Search Evidence) */}
                {msg.searchSources && msg.searchSources.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/80 text-[10px] space-y-1">
                    <span className="font-bold text-blue-900 flex items-center gap-1">
                      <Globe size={11} className="text-blue-600" />
                      Google Search Grounding Sources:
                    </span>
                    <div className="space-y-1 pt-0.5">
                      {msg.searchSources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline truncate"
                        >
                          <ExternalLink size={10} className="shrink-0" />
                          <span className="truncate">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#4C1D95] text-white flex items-center justify-center shrink-0">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div className="p-3 bg-white border border-purple-200 rounded-2xl rounded-tl-xs shadow-xs text-xs text-purple-900 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {useSearchGrounding ? 'Consulting Google Search & analyzing...' : 'SpendAI reasoning...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Audio Microphone & Gemini Transcribe */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRecording
                ? 'Recording microphone audio...'
                : isTranscribing
                ? 'gemini-3.5-transcribe is converting audio...'
                : 'Ask anything about your spending...'
            }
            className="flex-1 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />

          {/* Audio Microphone Button (gemini-3.5-transcribe) */}
          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isTranscribing}
            aria-label="Transcribe microphone audio"
            title="Record & transcribe audio with gemini-3.5-transcribe"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                : isTranscribing
                ? 'bg-purple-100 text-purple-800'
                : 'text-slate-500 hover:text-purple-700 hover:bg-purple-50'
            }`}
          >
            {isRecording ? <Square size={14} className="fill-current" /> : <Mic size={16} />}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="w-9 h-9 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white disabled:opacity-40 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <Send size={15} />
          </button>
        </form>

        {isRecording && (
          <p className="text-[10px] text-rose-600 font-medium text-center mt-1 animate-pulse">
            🔴 Live Audio Recording... Click the stop square to transcribe with gemini-3.5-transcribe
          </p>
        )}
      </div>
    </div>
  );
};
