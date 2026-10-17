import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Trash2,
  User,
  CornerDownLeft,
  Mic,
  MicOff,
  Sparkles,
  Zap,
  Play,
  Clock,
  Dumbbell,
  AlertCircle
} from 'lucide-react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/api';
import { getSessionEmail } from '../services/localStore';
import { MOCK_QUICK_REPLIES, MOCK_EXERCISE_CARD_MSG } from '../data/mockData';

export default function AICoach({ userProfile, pendingQuery, setPendingQuery }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `**SYSTEM ACTIVATED: FITBOT NEON AI COACH**\n\nWelcome to the command center, **${userProfile?.name || 'Athlete'}**.\n\n* **TARGET OBJECTIVE**: ${userProfile?.fitnessGoal || 'Build Muscle'}\n* **PROTOCOL**: ${userProfile?.exercisePreference || 'Home Bodyweight'}\n* **ENVIRONMENT**: ${userProfile?.workoutLocation || 'Home / Hybrid'}\n* **BODY MASS RATIO**: ${userProfile?.bmi ?? '23.4'} (${userProfile?.bmiCategory || 'Normal'})\n\nAsk for routine adjustments, nutritional breakdown, lifting mechanics, or instant exercise alternatives. Let's get to work.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exerciseCard: MOCK_EXERCISE_CARD_MSG,
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [restTimer, setRestTimer] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        // TODO: connect backend — GET /chat/history?email=${getSessionEmail()}
        const data = await getChatHistory(getSessionEmail());
        if (data.history?.length > 0) {
          const formatted = data.history.map((m) => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setMessages((prev) => [...prev, ...formatted]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    if (pendingQuery?.trim()) {
      handleSend(pendingQuery);
      setPendingQuery('');
    }
  }, [pendingQuery]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimer === null) return;
    if (restTimer <= 0) {
      setRestTimer(null);
      return;
    }
    const t = setInterval(() => {
      setRestTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [restTimer]);

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

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      // TODO: connect backend — POST /chat/message
      const data = await sendChatMessage(text, userProfile);
      const fullReply = data.reply?.text || 'Processing query complete. Keep your form strict and drive through the heels.';

      // Simulate streaming output word-by-word
      const words = fullReply.split(' ');
      let currentWordIndex = 0;
      const aiMsgId = data.reply?.id || `msg-${Date.now()}-ai`;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: '',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);

      const streamInterval = setInterval(() => {
        currentWordIndex += 2;
        const streamedSlice = words.slice(0, currentWordIndex).join(' ');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: streamedSlice } : msg
          )
        );

        if (currentWordIndex >= words.length) {
          clearInterval(streamInterval);
          setIsTyping(false);
        }
      }, 35);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: '**Connection issue.** Neural link dropped. Check connection and retry.',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Reset neural link and purge chat history?')) {
      try {
        // TODO: connect backend — DELETE /chat/history
        await clearChatHistory(getSessionEmail());
        setMessages([
          {
            id: 'reset',
            sender: 'ai',
            text: 'Neural log flushed. Standing by for next command.',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      } catch (err) {
        console.error('Clear failed:', err);
      }
    }
  };

  const toggleMic = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      // Mock voice input
      setTimeout(() => {
        setInputQuery('How many reps should I do for maximum hypertrophy?');
        setIsListening(false);
      }, 2000);
    }
  };

  const renderInline = (text, keyBase) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${keyBase}-b${i}`} className="font-bold text-volt-lime">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={`${keyBase}-t${i}`}>{part}</React.Fragment>;
    });

  const renderFormattedText = (rawText) => {
    const lines = String(rawText).split('\n');
    return lines.map((rawLine, idx) => {
      const line = rawLine.replace(/\s+$/, '');
      const trimmed = line.trim();

      if (!trimmed) return <div key={idx} className="h-1.5" />;

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        return <hr key={idx} className="my-3 border-[#222]" />;
      }

      const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const content = h[2].replace(/\*\*/g, '');
        return (
          <h4
            key={idx}
            className="font-display text-lg uppercase tracking-wider text-white mt-3 mb-1.5"
          >
            {content}
          </h4>
        );
      }

      if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
        return (
          <h4
            key={idx}
            className="font-mono text-xs font-bold text-volt-lime mt-3 mb-1 uppercase tracking-widest"
          >
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      }

      const bullet = line.match(/^(\s*)[*-]\s+(.*)$/);
      if (bullet) {
        const nested = bullet[1].length >= 2;
        return (
          <div
            key={idx}
            className={`flex items-start gap-2.5 my-1 ${
              nested ? 'pl-6' : 'pl-1'
            }`}
          >
            <span
              className={`shrink-0 rounded-full mt-[7px] ${
                nested ? 'w-1 h-1 bg-[#555]' : 'w-1.5 h-1.5 bg-volt-lime'
              }`}
            />
            <span className="flex-1 text-xs sm:text-sm leading-relaxed text-[#ccc]">
              {renderInline(bullet[2], idx)}
            </span>
          </div>
        );
      }

      const num = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (num) {
        return (
          <div key={idx} className="flex items-start gap-2.5 mt-2 mb-1">
            <span className="shrink-0 w-5 h-5 rounded-md bg-volt-lime text-black font-mono text-[10px] font-bold flex items-center justify-center mt-0.5">
              {num[1]}
            </span>
            <span className="flex-1 text-xs sm:text-sm font-medium text-white leading-relaxed">
              {renderInline(num[2], idx)}
            </span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-[#bbb] my-0.5">
          {renderInline(trimmed, idx)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] pb-16 lg:pb-0 w-full max-w-[1300px] mx-auto">
      {/* Top Header */}
      <div className="bg-[#101010] border border-[#222] rounded-t-3xl px-6 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-volt-lime text-black flex items-center justify-center shadow-[0_0_15px_rgba(198,241,53,0.4)]">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-display text-lg tracking-wider uppercase text-white flex items-center gap-2">
              FITBOT NEURAL AI
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-volt-lime shadow-[0_0_8px_#C6F135]" />
              </span>
            </h3>
            <p className="font-mono text-[10px] tracking-wider text-[#777] uppercase">
              {userProfile?.fitnessGoal || 'Build Muscle'} // {userProfile?.exercisePreference || 'Home / Gym'} // READY
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] text-[#777] hover:text-red-400 border border-[#262626] transition-all"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 bg-[#0a0a0a] border-x border-[#222] p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${
                isAI ? 'max-w-[92%]' : 'max-w-[85%] ml-auto flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAI
                    ? 'bg-[#141414] text-volt-lime border border-volt-lime/30 shadow-[0_0_10px_rgba(198,241,53,0.15)]'
                    : 'bg-cyan-neon text-black font-bold'
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`px-5 py-4 ${
                  isAI
                    ? 'bg-[#121212] border border-[#252525] text-[#eee] rounded-3xl rounded-bl-sm shadow-md'
                    : 'bg-gradient-to-r from-volt-lime/15 to-volt-lime/25 border border-volt-lime/40 text-white rounded-3xl rounded-br-sm shadow-[0_0_15px_rgba(198,241,53,0.1)]'
                }`}
              >
                {isAI ? (
                  <div>{renderFormattedText(msg.text)}</div>
                ) : (
                  <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap text-white">
                    {msg.text}
                  </p>
                )}

                {/* Optional embedded Exercise Card */}
                {msg.exerciseCard && isAI && (
                  <div className="mt-4 rounded-2xl border border-volt-lime/40 bg-[#0e0e0e] p-4 shadow-[0_0_20px_rgba(198,241,53,0.1)]">
                    <div className="flex items-center justify-between border-b border-[#222] pb-3">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-volt-lime" />
                        <span className="font-display text-lg uppercase tracking-wider text-white">
                          {msg.exerciseCard.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-cyan-neon uppercase">
                        {msg.exerciseCard.target}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-center">
                      <div className="rounded-xl bg-[#161616] p-2 border border-[#222]">
                        <span className="text-[10px] text-[#777] block">SETS</span>
                        <span className="text-sm font-bold text-volt-lime">{msg.exerciseCard.sets}</span>
                      </div>
                      <div className="rounded-xl bg-[#161616] p-2 border border-[#222]">
                        <span className="text-[10px] text-[#777] block">REPS</span>
                        <span className="text-sm font-bold text-white">{msg.exerciseCard.reps}</span>
                      </div>
                      <div className="rounded-xl bg-[#161616] p-2 border border-[#222]">
                        <span className="text-[10px] text-[#777] block">REST</span>
                        <span className="text-sm font-bold text-cyan-neon">{msg.exerciseCard.restSeconds}s</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-1">
                      <button
                        onClick={() => setRestTimer(msg.exerciseCard.restSeconds)}
                        className="flex items-center gap-2 rounded-xl bg-volt-lime px-3 py-1.5 font-mono text-xs font-bold text-black uppercase tracking-wider transition hover:bg-[#d8ff4f]"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {restTimer !== null ? `REST: ${restTimer}S` : 'START REST TIMER'}
                      </button>
                      <span className="font-mono text-[11px] text-[#777]">
                        {msg.exerciseCard.formCue}
                      </span>
                    </div>
                  </div>
                )}

                <span
                  className={`text-[10px] font-mono block text-right mt-2 ${
                    isAI ? 'text-[#555]' : 'text-volt-lime/80'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Heartbeat / Soundwave typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#141414] text-volt-lime flex items-center justify-center border border-volt-lime/30 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#121212] border border-[#252525] px-5 py-3 rounded-2xl flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#777]">
                COMPUTING NEURAL RESPONSE
              </span>
              <div className="flex items-center gap-1 ml-2">
                <span className="w-1 h-3 rounded-full bg-volt-lime animate-pulse" />
                <span className="w-1 h-5 rounded-full bg-volt-lime animate-pulse delay-75" />
                <span className="w-1 h-4 rounded-full bg-volt-lime animate-pulse delay-150" />
                <span className="w-1 h-6 rounded-full bg-cyan-neon animate-pulse delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="bg-[#0e0e0e] border-x border-[#222] px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Sparkles className="h-3.5 w-3.5 text-volt-lime shrink-0" />
        <span className="font-mono text-[10px] text-[#777] uppercase shrink-0">QUICK PROMPTS:</span>
        {MOCK_QUICK_REPLIES.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleSend(reply.text)}
            className="shrink-0 rounded-full border border-[#262626] bg-[#141414] px-3 py-1 font-mono text-[11px] text-[#ccc] hover:border-volt-lime hover:text-white transition whitespace-nowrap"
          >
            {reply.text}
          </button>
        ))}
      </div>

      {/* Input Control Box */}
      <div className="bg-[#101010] border-x border-b border-t border-[#222] rounded-b-3xl p-4">
        <div className="flex items-end gap-3 bg-[#080808] border border-[#262626] rounded-2xl px-4 py-2.5 focus-within:border-volt-lime focus-within:shadow-[0_0_15px_rgba(198,241,53,0.2)] transition-all">
          <textarea
            ref={textareaRef}
            value={inputQuery}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Ask FitBot anything (form tips, progressive overload, natural macros)..."
            className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-white placeholder-[#555] focus:outline-none resize-none max-h-[120px] font-sans"
          />

          {/* Voice Mic Button */}
          <button
            onClick={toggleMic}
            className={`p-2 rounded-xl transition ${
              isListening
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Voice input"
          >
            {isListening ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-volt-lime hover:bg-[#d8ff4f] disabled:opacity-30 disabled:hover:bg-volt-lime text-black flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-[0_0_15px_rgba(198,241,53,0.3)]"
            title="Send"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#666] mt-2 px-1">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5 text-volt-lime" /> ENTER to transmit · SHIFT+ENTER for newline
          </span>
          <span className="text-volt-lime">NEURAL ENGINE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
