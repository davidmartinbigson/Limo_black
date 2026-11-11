"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    loginAccount,
    registerAccount,
  } = useBooking();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+1 (416) ");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signin") {
      const res = await loginAccount(email, password);
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "Invalid credentials.");
        return;
      }
      router.push(res.user?.role === "admin" ? "/admin" : "/account");
    } else {
      const res = await registerAccount({
        name,
        email,
        phone,
        password,
        company,
      });
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "Unable to register account.");
        return;
      }
      router.push("/account");
    }
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
            className="relative w-full max-w-md rounded-3xl bg-card border border-line/15 p-6 sm:p-8 shadow-luxury overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-champagne-500/15 blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-line/[0.06] hover:bg-line/[0.12] text-muted hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-3 mb-6">
              <BrandLogo size="sm" showCanadaBadge />
              <div>
                <h3 className="font-serif text-2xl text-ink font-bold">
                  {mode === "signin"
                    ? "Sign In to Your Account"
                    : "Create Your VIP Account"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-field border border-line/10 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
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
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "register"
                    ? "bg-champagne-500 text-obsidian-950"
                    : "text-muted hover:text-ink"
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-xs text-muted mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arman Sidhu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Canadian Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (416) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Corporate / Agency"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs text-muted mb-1">
                  Email Address or Owner Username *
                </label>
                <input
                  type={mode === "signin" ? "text" : "email"}
                  autoComplete="username"
                  required
                  placeholder="you@example.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div>
                <label className="block text-xs text-muted mb-1">
                  Password {mode === "register" && "(Min. 8 characters)"} *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    minLength={mode === "register" ? 8 : undefined}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "signin" ? "Sign In to My Account" : "Create Account"}
              </button>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
