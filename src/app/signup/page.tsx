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
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

export default function SignupPage() {
  const router = useRouter();
  const { registerAccount } = useBooking();

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
    const res = await registerAccount({
      name,
      email,
      phone,
      password,
      company,
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Unable to create account.");
      return;
    }
    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-line/12 p-7 sm:p-10 shadow-luxury space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-1">
            <BrandLogo size="md" showCanadaBadge />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
            Obsidian Circle Membership
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
            Create Your LimoBlack Account
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Track your rides, save Canadian addresses, customize cabin
            preferences, and earn 10x Obsidian Points on every CAD dollar.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arman Sidhu"
              className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">
                Email Address *
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
              <label className="block text-xs text-muted mb-1.5">
                Canadian Mobile *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (416) 555-0199"
                className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">
              Company / Organization (Optional — for GST/HST Corporate Receipts)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Maple Leaf Holdings Inc."
              className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">
              Create Password (Min. 8 characters) *
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
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
            Activate My VIP Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
