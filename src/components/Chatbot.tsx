"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  "Tell me about your services",
  "How can AI help my business?",
  "Book a consultation",
  "What industries do you serve?",
];

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("service") || lower.includes("offer"))
    return "We offer AI Agents & Autonomous Workflows, Voice AI, Data Intelligence & Analytics, Enterprise Automation, Strategic AI Consulting, and Custom AI Platforms. Each solution is tailored to your specific business needs. Would you like to discuss any of these?";
  if (lower.includes("help") || lower.includes("ai") || lower.includes("business") || lower.includes("how"))
    return "AI can transform your business by automating repetitive tasks (saving 500+ hours/year), providing predictive analytics, and enabling 24/7 intelligent operations. Our clients typically see 240% ROI. Shall we schedule a discovery call?";
  if (lower.includes("book") || lower.includes("consult") || lower.includes("call") || lower.includes("schedule"))
    return "I'd love to help schedule a consultation! Fill out the contact form below or email hello@aixcel.solutions. We offer a free 30-minute discovery call to identify high-impact automation opportunities.";
  if (lower.includes("industr") || lower.includes("who") || lower.includes("serve"))
    return "We serve Financial Services, Family Offices & HNWI, Marketing Agencies, Healthcare, Manufacturing, Real Estate, and Tech startups across 55+ countries. Which industry are you in?";
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hello! Welcome to Aixcel Solutions. We specialize in enterprise AI and automation for forward-thinking organizations. How can I help you today?";
  return "Thank you for your interest! I can help with info about our AI services, scheduling a consultation, or discussing how automation can transform your operations. What would you like to know?";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! Welcome to Aixcel Solutions. How can I help you explore AI-powered automation for your business?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply }]);
        }, 600);
        return;
      }
    } catch { /* fallback */ }

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: getBotResponse(text) }]);
    }, 800);
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="chatbot-window mb-4 shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Aixcel AI</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-white/30 text-xs font-mono">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors" aria-label="Close">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-br-sm"
                      : "bg-white/[0.04] text-white/70 rounded-bl-sm border border-white/[0.06]"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-white/[0.04] px-4 py-3 rounded-2xl rounded-bl-sm border border-white/[0.06]">
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickActions.map((action, i) => (
                  <button key={i} onClick={() => sendMessage(action)}
                    className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/[0.03] text-white/40 hover:text-white/70 border border-white/[0.06] transition-all">
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your message..."
              />
              <button onClick={() => sendMessage(input)} aria-label="Send">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center shadow-glow hover:shadow-glow-lg transition-shadow"
        aria-label="Toggle chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
              className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
