import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, User, CornerDownLeft } from 'lucide-react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/api';

export default function AICoach({ userProfile, pendingQuery, setPendingQuery }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `**FitBot AI Coach Connected**\n\nHello **${userProfile?.name || 'Athlete'}**! I am your AI Fitness & Nutrition Coach.\n* **Fitness Goal**: ${userProfile?.fitnessGoal || 'Build Muscle'}\n* **Exercise Style**: ${userProfile?.exercisePreference || 'Home Bodyweight'}\n* **Location**: ${userProfile?.workoutLocation || 'Home'}\n* **BMI**: ${userProfile?.bmi ?? '--'} (${userProfile?.bmiCategory || 'Unknown'})\n\nAsk me anything about workouts, diet, exercise form, or recovery!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getChatHistory();
        if (data.history?.length > 0) {
          const formatted = data.history.map(m => ({
            id: m.id, sender: m.sender, text: m.text,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(prev => [...prev, ...formatted]);
        }
      } catch (err) { console.error(err); }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    if (pendingQuery?.trim()) { handleSend(pendingQuery); setPendingQuery(''); }
  }, [pendingQuery]);

  // Auto-grow the textarea up to a few rows.
  const handleInput = (e) => {
    setInputQuery(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  const handleSend = async (queryToSend = inputQuery) => {
    const text = queryToSend.trim();
    if (!text || isTyping) return;

    const userMsg = { id: `msg-${Date.now()}-user`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text, userProfile);
      setMessages(prev => [...prev, {
        id: data.reply?.id || `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.reply?.text || 'Processing your request...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`, sender: 'ai',
        text: '**Connection issue.** Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Clear chat history?")) {
      try {
        await clearChatHistory();
        setMessages([{ id: 'reset', sender: 'ai', text: "Chat cleared. Ready for your next question!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } catch (err) { console.error(err); }
    }
  };

  /* --- Inline formatter: turns **bold** into <strong>, leaves the rest as text --- */
  const renderInline = (text, keyBase) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${keyBase}-b${i}`} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={`${keyBase}-t${i}`}>{part}</React.Fragment>;
    });

  /* --- Block formatter: headers, dividers, bullets (with nesting), numbered, paragraphs --- */
  const renderFormattedText = (rawText) => {
    const lines = String(rawText).split('\n');
    return lines.map((rawLine, idx) => {
      const line = rawLine.replace(/\s+$/, '');
      const trimmed = line.trim();

      // Blank line → small spacer
      if (!trimmed) return <div key={idx} className="h-1.5" />;

      // Horizontal rule: --- or ***
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        return <hr key={idx} className="my-3 border-slate-100" />;
      }

      // Markdown headers: #, ##, ###, ####
      const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const content = h[2].replace(/\*\*/g, '');
        return (
          <h4 key={idx} className="font-heading font-bold text-slate-900 text-sm mt-3.5 mb-1.5 tracking-tight">
            {content}
          </h4>
        );
      }

      // Whole-line bold used as a section title: **Workout Goal**
      if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
        return (
          <h4 key={idx} className="font-heading font-extrabold text-slate-900 text-[11px] mt-3.5 mb-1 uppercase tracking-widest">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      }

      // Bullet: "* item" or "- item" (indent ≥ 2 spaces = nested)
      const bullet = line.match(/^(\s*)[*-]\s+(.*)$/);
      if (bullet) {
        const nested = bullet[1].length >= 2;
        return (
          <div key={idx} className={`flex items-start gap-2.5 my-0.5 ${nested ? 'pl-6' : 'pl-1'}`}>
            <span className={`shrink-0 rounded-full mt-[7px] ${nested ? 'w-1 h-1 bg-slate-300' : 'w-1.5 h-1.5 bg-slate-400'}`} />
            <span className="flex-1 text-[13px] leading-relaxed text-slate-600">{renderInline(bullet[2], idx)}</span>
          </div>
        );
      }

      // Numbered step: "1. Push-ups"
      const num = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (num) {
        return (
          <div key={idx} className="flex items-start gap-2.5 mt-2 mb-0.5">
            <span className="shrink-0 w-5 h-5 rounded-md bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center mt-px">
              {num[1]}
            </span>
            <span className="flex-1 text-[13px] font-semibold text-slate-800 leading-relaxed">{renderInline(num[2], idx)}</span>
          </div>
        );
      }

      // Plain paragraph
      return <p key={idx} className="text-[13px] leading-relaxed text-slate-600 my-0.5">{renderInline(trimmed, idx)}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[560px] pb-16 lg:pb-0 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-t-3xl px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-[15px] text-slate-900 flex items-center gap-2">
              FitBot AI Coach
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-700"></span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {userProfile?.fitnessGoal || 'Build Muscle'} · {userProfile?.exercisePreference || 'Home Bodyweight'} · {userProfile?.dietaryPreference || 'Vegetarian'}
            </p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border border-slate-200"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-slate-50 border-x border-slate-200 p-4 sm:p-5 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex items-end gap-2.5 ${isAI ? 'max-w-[92%]' : 'max-w-[85%] ml-auto flex-row-reverse'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                isAI ? 'bg-white text-slate-700 border border-slate-200' : 'bg-slate-900 text-white'
              }`}>
                {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className={`px-4 py-3 shadow-sm ${
                isAI
                  ? 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-md'
                  : 'bg-slate-900 text-white rounded-2xl rounded-br-md'
              }`}>
                {isAI ? (
                  <div>{renderFormattedText(msg.text)}</div>
                ) : (
                  <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}
                <span className={`text-[10px] block text-right mt-1.5 ${isAI ? 'text-slate-300' : 'text-white/50'}`}>{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3.5 rounded-2xl rounded-bl-md flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-x border-b border-t border-slate-200 rounded-b-3xl p-3">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
          <textarea
            ref={textareaRef}
            value={inputQuery}
            onChange={handleInput}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            rows={1}
            placeholder="Ask anything — workouts, diet, form, recovery…"
            className="flex-1 bg-transparent py-1.5 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-[120px]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 mt-1.5 pl-2 flex items-center gap-1">
          <CornerDownLeft className="w-2.5 h-2.5" /> Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
