"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  CheckCircle2,
  MessageSquare,
  Navigation,
  Plane,
  QrCode,
  Shield,
  Smartphone,
  Star,
} from "lucide-react";

const APP_SCREENS = [
  {
    id: "dispatch",
    label: "Live Chauffeur GPS",
    badge: "Arriving in 4 mins",
    title: "Liam MacLeod · 4.99 ★",
    subtitle: "Mercedes-Maybach S680 AWD · Plate ON LB 88",
    detail:
      "Waiting outside Fairmont Royal York (100 Front St W, Toronto). Cabin pre-warmed to 22°C with Sparkling Perrier.",
  },
  {
    id: "flight",
    label: "YYZ / YVR Flight Sync",
    badge: "Auto-Adjusted +38m",
    title: "Air Canada AC 857 · LHR → YYZ",
    subtitle: "Terminal 1 Landing 18:12 · Gate E74",
    detail:
      "Your chauffeur's arrival at Toronto Pearson has been synchronized to your updated touchdown. 60m free wait active.",
  },
  {
    id: "concierge",
    label: "24/7 Canada Concierge",
    badge: "Bilingual EN / FR Desk",
    title: "Obsidian Concierge Live Chat",
    subtitle: "Canadian Support · < 30s Response",
    detail:
      "“Certainly Mr. MacLeod — we have added an intermediate stop on Bay Street before heading up to Yorkville.”",
  },
];

export default function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState(APP_SCREENS[0]);
  const [qrToast, setQrToast] = useState(false);

  return (
    <section className="py-24 sm:py-32 bg-surface border-y border-line/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-accent font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              We Move Across Canada With You
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-[1.12]">
              Every Canadian Journey in the{" "}
              <span className="text-accent">Palm of Your Hand.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
              Book in 20 seconds across Toronto, Vancouver, Montréal, Calgary,
              and Ottawa. Watch your chauffeur approach your terminal live,
              pre-warm your cabin, and download instant GST/HST corporate
              receipts.
            </p>

            {/* Screen Selector Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {APP_SCREENS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveScreen(s)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeScreen.id === s.id
                      ? "bg-gold-gradient text-obsidian-950 shadow-gold-glow"
                      : "bg-card text-muted hover:text-ink border border-line/12"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setQrToast(true)}
                className="px-5 py-3 rounded-2xl bg-card hover:bg-line/[0.05] border border-line/15 flex items-center gap-3 transition-colors"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-subtle">
                    Download on the
                  </div>
                  <div className="text-sm font-semibold text-ink">
                    App Store · Canada
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setQrToast(true)}
                className="px-5 py-3 rounded-2xl bg-card hover:bg-line/[0.05] border border-line/15 flex items-center gap-3 transition-colors"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-subtle">
                    Get it on
                  </div>
                  <div className="text-sm font-semibold text-ink">
                    Google Play
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-champagne-500/15 border border-champagne-500/30">
                <QrCode className="w-6 h-6 text-accent" />
                <div className="text-xs">
                  <div className="font-semibold text-accent">
                    4.9 ★ Canada App
                  </div>
                  <div className="text-[11px] text-muted">
                    EN & FR Companion
                  </div>
                </div>
              </div>
            </div>

            {qrToast && (
              <p className="text-xs text-accent bg-champagne-500/15 border border-champagne-500/30 rounded-xl px-4 py-2.5 inline-block font-medium">
                Tip: Our responsive Web App & My Rides tracker works directly in
                your mobile browser across iOS & Android with zero install!
              </p>
            )}
          </div>

          {/* Right Interactive Titanium Phone Mockup (intentional dark OLED phone bezel) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[360px] rounded-[44px] bg-gradient-to-b from-zinc-700 via-zinc-900 to-black p-[10px] shadow-luxury border border-white/15">
              <div className="rounded-[35px] bg-obsidian-950 overflow-hidden border border-white/10 text-ivory-50">
                <div className="pt-3 pb-2 px-6 flex items-center justify-between text-[11px] text-white/60">
                  <span>18:26 EST</span>
                  <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-champagne-300">LIVE</span>
                  </div>
                  <span>5G+</span>
                </div>

                <div className="relative h-48 bg-obsidian-900 overflow-hidden border-y border-white/10">
                  <svg
                    viewBox="0 0 360 190"
                    className="w-full h-full opacity-80"
                    fill="none"
                  >
                    <path
                      d="M0 40 H360 M0 95 H360 M0 150 H360 M70 0 V190 M180 0 V190 M290 0 V190"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <motion.path
                      d="M 48 148 C 120 140, 165 55, 305 48"
                      stroke="#D6B982"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                    <circle cx="48" cy="148" r="6" fill="#C6A364" />
                    <circle
                      cx="305"
                      cy="48"
                      r="9"
                      fill="rgba(198,163,100,0.25)"
                    />
                    <circle cx="305" cy="48" r="4.5" fill="#FAF8F5" />
                  </svg>

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-obsidian-950/90 border border-champagne-400/35 text-[11px] font-semibold text-champagne-300 flex items-center gap-1.5">
                    <Navigation className="w-3 h-3" />
                    {activeScreen.badge}
                  </div>
                </div>

                <motion.div
                  key={activeScreen.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ivory-50">
                        {activeScreen.title}
                      </div>
                      <div className="text-xs text-champagne-300 mt-0.5">
                        {activeScreen.subtitle}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-champagne-500/15 border border-champagne-400/30 flex items-center justify-center shrink-0">
                      {activeScreen.id === "flight" ? (
                        <Plane className="w-4 h-4 text-champagne-400" />
                      ) : activeScreen.id === "concierge" ? (
                        <MessageSquare className="w-4 h-4 text-champagne-400" />
                      ) : (
                        <Star className="w-4 h-4 text-champagne-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed bg-white/[0.04] border border-white/10 rounded-2xl p-3.5">
                    {activeScreen.detail}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="px-3 py-2 rounded-xl bg-white/[0.04] text-[11px] text-white/75 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-champagne-400" />
                      HST Included
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-white/[0.04] text-[11px] text-white/75 flex items-center gap-1.5">
                      <BellRing className="w-3.5 h-3.5 text-champagne-400" />
                      SMS Dispatch
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid in CAD
                    </span>
                    <span className="text-white/45">Ref #LB-904812</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
