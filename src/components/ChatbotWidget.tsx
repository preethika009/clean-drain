"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Globe, Droplets } from "lucide-react";

interface Message { role: "user" | "bot"; text: string; }

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
];

const QUICK_PROMPTS = [
  "How do I report a drain issue?",
  "Check my ticket status",
  "What is the SLA timeline?",
  "How to escalate a complaint?",
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "👋 Hi! I'm ClearBot, your drain maintenance assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showLang, setShowLang] = useState(false);
  const [ackId, setAckId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language, ackId: ackId || undefined }),
      });
      if (!res.ok) throw new Error("Chat request failed.");
      const data = await res.json();
      if (typeof data.response !== "string") throw new Error("Chat response was unavailable.");
      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25 }}
            className="glass-card mb-4 flex w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden shadow-elevated"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-900 to-primary-800 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500/30 flex items-center justify-center border border-primary-500/40">
                  <Droplets className="w-4 h-4 text-primary-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">ClearBot</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-primary-300 text-xs">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language picker */}
                <div className="relative">
                  <button type="button" onClick={() => setShowLang(!showLang)} className="btn-ghost p-1.5" title="Change language" aria-label="Change language" aria-expanded={showLang}>
                    <Globe className="w-4 h-4 text-primary-300" />
                  </button>
                  {showLang && (
                    <div className="absolute right-0 top-8 glass-card w-36 py-1 z-10 shadow-elevated">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLanguage(l.code); setShowLang(false); }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${language === l.code ? "text-primary-300 bg-primary-900/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost p-1.5" aria-label="Close ClearBot">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Ticket ID input */}
            <div className="px-3 py-2 border-b border-white/5 bg-slate-900/40">
              <input
                value={ackId}
                onChange={(e) => setAckId(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 text-slate-300 placeholder-slate-600 outline-none focus:border-primary-600/50"
                placeholder="Enter ticket ID (CD-XXXX) to check status..."
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2" role="log" aria-label="ClearBot conversation" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`chat-message ${m.role}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-message bot flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-400" />
                    <div className="flex gap-1">
                      <span className="wave-bar w-1.5 h-3 bg-primary-400 rounded-full" />
                      <span className="wave-bar w-1.5 h-3 bg-primary-400 rounded-full" />
                      <span className="wave-bar w-1.5 h-3 bg-primary-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-primary-600/30 text-primary-300 bg-primary-900/20 hover:bg-primary-900/40 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-primary-600/50 transition-colors"
                placeholder="Type your message..."
              />
              <button
                onClick={() => sendMessage(input)}
                    type="button"
                    aria-label="Send message"
                    disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        type="button"
        aria-label={open ? "Close ClearBot" : "Open ClearBot"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-lg border border-primary-400/30 ml-auto"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}
