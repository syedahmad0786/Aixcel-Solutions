"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  "Tell me about your services",
  "How can AI help my business?",
  "I'd like to book a consultation",
  "What industries do you serve?",
];

const botResponses: Record<string, string> = {
  services:
    "We offer 6 core services: AI Agents & Copilots, Workflow Automation, Data Intelligence & Analytics, Strategic AI Consulting, Custom AI Platforms, and AI Governance & Compliance. Each is tailored to your specific needs. Would you like to learn more about any of these?",
  help:
    "AI can transform your business in many ways — from automating repetitive tasks (saving 500+ hours/year) to providing predictive analytics for smarter decisions. Our clients typically see 240% ROI. Would you like to schedule a discovery call to explore specific opportunities?",
  book:
    "I'd be happy to help you schedule a consultation! Please fill out the contact form below, or email us directly at hello@aixcel.solutions. Our team typically responds within 24 hours. You can also select your preferred service and budget range in the form.",
  industries:
    "We serve a diverse range of industries including Financial Services, Family Offices & HNWI, Marketing Agencies, Healthcare, Manufacturing, Real Estate, and Technology startups. We're operational in 55+ countries. Which industry are you in?",
  default:
    "Thank you for your interest in Aixcel Solutions! I can help you with information about our services, pricing, case studies, or scheduling a consultation. What would you like to know?",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("service") || lower.includes("offer") || lower.includes("what do you"))
    return botResponses.services;
  if (lower.includes("help") || lower.includes("ai") || lower.includes("business") || lower.includes("how"))
    return botResponses.help;
  if (lower.includes("book") || lower.includes("consult") || lower.includes("schedule") || lower.includes("call"))
    return botResponses.book;
  if (lower.includes("industr") || lower.includes("sector") || lower.includes("serve") || lower.includes("who"))
    return botResponses.industries;
  return botResponses.default;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! Welcome to Aixcel Solutions. I'm here to help you explore how AI can transform your business. How can I assist you today?",
      timestamp: new Date(),
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

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Try API first, fallback to local responses
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
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: data.reply,
              timestamp: new Date(),
            },
          ]);
        }, 800);
        return;
      }
    } catch {
      // Fallback to local
    }

    // Local fallback
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getBotResponse(text),
          timestamp: new Date(),
        },
      ]);
    }, 1000);
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
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-accent-blue/10 to-accent-purple/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Aixcel AI Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-white/40 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-br-sm"
                        : "bg-white/5 text-white/80 rounded-bl-sm border border-white/5"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                  <button
                    key={i}
                    onClick={() => sendMessage(action)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                  >
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
              <button onClick={() => sendMessage(input)} aria-label="Send message">
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
        className="w-14 h-14 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/30 hover:shadow-accent-blue/50 transition-shadow"
        aria-label="Toggle chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
