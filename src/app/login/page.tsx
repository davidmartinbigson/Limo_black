"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginAccount } = useBooking();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await loginAccount(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Invalid email or password.");
      return;
    }
    router.push(res.user?.role === "admin" ? "/admin" : "/account");
  };

  const handleDemo = async (e: string, p: string) => {
    setError("");
    setLoading(true);
    const res = await loginAccount(e, p);
    setLoading(false);
    if (res.ok) {
      router.push(res.user?.role === "admin" ? "/admin" : "/account");
    }
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-card border border-line/12 p-7 sm:p-10 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-champagne-500/15 border border-champagne-500/35 flex items-center justify-center mx-auto">
            <Crown className="w-6 h-6 text-accent" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-accent font-semibold pt-2">
            Limo Black Canada
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            View your personal chauffeured rides, live GPS status, and GST/HST
            tax invoices.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.ca"
              className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
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
            className="w-full py-4 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-line/10 space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-subtle text-center font-semibold">
            Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                handleDemo("d.macleod@baystreetcapital.ca", "Canada123!")
              }
              className="py-2.5 px-3 rounded-xl bg-field hover:bg-line/[0.08] border border-champagne-500/30 text-xs font-semibold text-accent flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> VIP Client
            </button>
            <button
              type="button"
              onClick={() => handleDemo("admin@limoblack.ca", "Admin123!")}
              className="py-2.5 px-3 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-ink flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Owner Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted">
          New to Limo Black Canada?{" "}
          <Link href="/signup" className="text-accent font-semibold underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
