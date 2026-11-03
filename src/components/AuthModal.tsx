"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, ShieldCheck, Sparkles, X } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, signIn } = useBooking();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("David MacLeod");
  const [email, setEmail] = useState("d.macleod@baystreetcapital.ca");
  const [password, setPassword] = useState("••••••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(name.trim() || "Executive Guest", email.trim() || "vip@limoblack.ca");
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setAuthModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-card border border-line/15 p-7 sm:p-8 shadow-luxury overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-champagne-500/15 blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-line/[0.06] hover:bg-line/[0.12] text-muted hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center">
                <Crown className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-accent font-semibold">
                  Limo Black Canada VIP
                </p>
                <h3 className="font-serif text-2xl text-ink">
                  {mode === "signin"
                    ? "Welcome Back"
                    : "Join Obsidian Circle Canada"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-field border border-line/10 mb-6">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "signin"
                    ? "bg-champagne-500 text-obsidian-950"
                    : "text-muted hover:text-ink"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "register"
                    ? "bg-champagne-500 text-obsidian-950"
                    : "text-muted hover:text-ink"
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs text-muted mb-1.5">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Canadian Executive Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Passkey / Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all"
              >
                {mode === "signin"
                  ? "Access Canadian VIP Account"
                  : "Activate Obsidian Membership"}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-line/10">
              <button
                type="button"
                onClick={() =>
                  signIn("David MacLeod", "d.macleod@baystreetcapital.ca")
                }
                className="w-full py-2.5 px-4 rounded-xl bg-field hover:bg-line/[0.08] border border-champagne-500/30 text-xs text-accent font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Instant 1-Click VIP Demo Sign-In
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-subtle mt-3 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                Saved cabin preferences, consolidated GST/HST receipts & priority dispatch
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
