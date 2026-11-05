"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, MessageCircle, Phone, Send, Sparkles, X } from "lucide-react";

interface ChatMessage {
  sender: "concierge" | "guest";
  text: string;
}

const QUICK_PROMPTS = [
  "Where does my chauffeur meet me at Toronto Pearson (YYZ)?",
  "Do you have stretch limousines for weddings?",
  "How does Corporate GST/HST monthly billing work?",
  "Are winter tires & AWD included for Whistler / Banff?",
];

function getConciergeReply(q: string): string {
  const lower = q.toLowerCase();
  if (
    lower.includes("yyz") ||
    lower.includes("pearson") ||
    lower.includes("airport")
  ) {
    return "At YYZ, YVR, YUL, and YYC, your chauffeur tracks your flight via NAV CANADA, waits free for up to 60 minutes after landing, and greets you inside the Arrivals Hall with a personalized iPad tablet before escorting you to the GTAA/VIP commercial limousine lane.";
  }
  if (
    lower.includes("stretch") ||
    lower.includes("wedding") ||
    lower.includes("gala")
  ) {
    return "Yes! Our Stretch Limousine (8–10 guests) and Executive Sprinter Jet-Van (12 guests) include optional Red-Carpet Wedding & Gala Staging (+CA$65) with formal tuxedo chauffeur attire and chilled non-alcoholic sparkling refreshments.";
  }
  if (
    lower.includes("gst") ||
    lower.includes("hst") ||
    lower.includes("corporate") ||
    lower.includes("invoice")
  ) {
    return "Every ride includes an instant printable CRA GST/HST Tax Invoice (BN 84920-4119 RT0001) inside your Personal Account (/account). Corporate partners also enjoy consolidated monthly Net-30 CAD billing.";
  }
  if (
    lower.includes("winter") ||
    lower.includes("whistler") ||
    lower.includes("banff") ||
    lower.includes("ski")
  ) {
    return "100% of our Canadian fleet is Winter-Certified with 4MATIC/AWD and severe-snow tires. You can also select a Thule Ski/Snowboard Carrier in Step 2 when booking Sea-to-Sky Whistler, Banff, or Mont-Tremblant transfers.";
  }
  return "Thank you for contacting Limo Black Canada 24/7 VIP Dispatch! You can get an instant guaranteed CAD fare using our live Canadian address search, sign into your personal account at /account, or call our Toronto & Vancouver desk anytime at +1 (888) 546-6255.";
}

export default function ConciergeChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "concierge",
      text: "Welcome to Limo Black Canada 24/7 VIP Concierge. How may we assist with your limousine or airport chauffeur today?",
    },
  ]);

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const reply = getConciergeReply(clean);
    setMessages((prev) => [
      ...prev,
      { sender: "guest", text: clean },
      { sender: "concierge", text: reply },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            className="mb-3 w-[340px] sm:w-[380px] rounded-3xl bg-card border border-champagne-500/35 shadow-luxury overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-obsidian-950 text-ivory border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/limoblack-mark.png"
                  alt="LimoBlack"
                  className="w-9 h-9 rounded-xl object-contain border border-champagne-500/40"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    LimoBlack Concierge
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </p>
                  <p className="text-[10px] text-champagne-300">
                    24/7 Canadian Dispatch • Online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-canvas/80">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.sender === "guest" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "guest"
                        ? "bg-gold-gradient text-obsidian-950 font-medium"
                        : "bg-card border border-line/12 text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {messages.length <= 2 && (
                <div className="pt-1 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-subtle font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" /> Instant Topics
                  </p>
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="block w-full text-left px-3 py-2 rounded-xl bg-card hover:border-champagne-500/40 border border-line/12 text-[11px] text-ink transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="p-3 bg-card border-t border-line/12 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask our Canadian concierge..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-field border border-line/15 text-xs text-ink focus:outline-none focus:border-champagne-500"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="px-4 py-2 bg-field border-t border-line/10 flex items-center justify-between text-[11px] text-muted">
              <a
                href="tel:+18885466255"
                className="inline-flex items-center gap-1 hover:text-accent font-medium"
              >
                <Phone className="w-3 h-3 text-accent" /> +1 (888) 546-6255
              </a>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="text-accent font-semibold hover:underline"
              >
                Instant Fare Quote →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open 24/7 VIP Concierge Chat"
        className="px-4 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.12em] shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">24/7 Concierge</span>
      </button>
    </div>
  );
}
