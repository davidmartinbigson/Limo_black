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
    title: "Julian Kensington · 4.99 ★",
    subtitle: "Mercedes-Maybach S680 · Plate LB 01 MAY",
    detail:
      "Waiting outside Claridge's Brook Street Entrance. Cabin pre-cooled to 20.5°C with chilled Sparkling Perrier.",
  },
  {
    id: "flight",
    label: "Flight Telemetry",
    badge: "Auto-Adjusted +42m",
    title: "Flight BA 117 · LHR → JFK",
    subtitle: "New Landing 18:12 · Gate B22",
    detail:
      "Your chauffeur's arrival has been automatically synchronized to your updated touchdown. 60m complimentary wait active.",
  },
  {
    id: "concierge",
    label: "24/7 VIP Concierge",
    badge: "Instant Priority Desk",
    title: "Obsidian Concierge Live Chat",
    subtitle: "Multilingual Support · < 30s Response",
    detail:
      "“Certainly Mr. Sterling — we have added an intermediate stop at Sotheby's New Bond Street before Heathrow Terminal 5.”",
  },
];

export default function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState(APP_SCREENS[0]);
  const [qrToast, setQrToast] = useState(false);

  return (
    <section className="py-24 sm:py-32 bg-obsidian-900 border-y border-white/10 relative overflow-hidden">
      <div className="absolute -left-32 top-1/3 w-96 h-96 rounded-full bg-champagne-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-champagne-400 font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              We Move With You
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory-50 leading-[1.08]">
              Every Global Journey in the{" "}
              <span className="italic text-champagne-300">Palm of Your Hand.</span>
            </h2>
            <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-xl">
              Book in 20 seconds, watch your chauffeur glide toward your terminal
              in real time, adjust cabin temperature en route, and download
              instant corporate VAT invoices from the Limo Black iOS & Android
              application.
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
                      : "bg-obsidian-950 text-white/70 hover:text-white border border-white/12"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* App Store & Play Badges + QR */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setQrToast(true)}
                className="px-5 py-3 rounded-2xl bg-obsidian-950 hover:bg-white/[0.06] border border-white/15 flex items-center gap-3 transition-colors"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Download on the
                  </div>
                  <div className="text-sm font-semibold text-ivory-50">
                    App Store · iOS
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setQrToast(true)}
                className="px-5 py-3 rounded-2xl bg-obsidian-950 hover:bg-white/[0.06] border border-white/15 flex items-center gap-3 transition-colors"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Get it on
                  </div>
                  <div className="text-sm font-semibold text-ivory-50">
                    Google Play
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-champagne-500/10 border border-champagne-400/25">
                <QrCode className="w-6 h-6 text-champagne-400" />
                <div className="text-xs">
                  <div className="font-semibold text-champagne-300">
                    4.9 ★ App Rating
                  </div>
                  <div className="text-[11px] text-white/50">
                    iOS & Android Companion
                  </div>
                </div>
              </div>
            </div>

            {qrToast && (
              <p className="text-xs text-champagne-300 bg-champagne-500/10 border border-champagne-400/30 rounded-xl px-4 py-2.5 inline-block">
                Tip: Our full mobile-responsive Web App & Manage Rides portal works
                instantly in your mobile browser with zero install required!
              </p>
            )}
          </div>

          {/* Right Interactive Titanium Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[360px] rounded-[44px] bg-gradient-to-b from-zinc-700 via-zinc-900 to-black p-[10px] shadow-luxury border border-white/15">
              <div className="rounded-[35px] bg-obsidian-950 overflow-hidden border border-white/10">
                {/* Dynamic Island */}
                <div className="pt-3 pb-2 px-6 flex items-center justify-between text-[11px] text-white/60">
                  <span>18:26</span>
                  <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-champagne-300">LIVE</span>
                  </div>
                  <span>5G</span>
                </div>

                {/* Animated Map Trajectory Canvas */}
                <div className="relative h-48 bg-obsidian-900 overflow-hidden border-y border-white/10">
                  <svg
                    viewBox="0 0 360 190"
                    className="w-full h-full opacity-80"
                    fill="none"
                  >
                    {/* Subtle Street Grid */}
                    <path
                      d="M0 40 H360 M0 95 H360 M0 150 H360 M70 0 V190 M180 0 V190 M290 0 V190"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    {/* Animated Gold Route Curve */}
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

                {/* Active Screen Card */}
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

                  <p className="text-xs text-white/65 leading-relaxed bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
                    {activeScreen.detail}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="px-3 py-2 rounded-xl bg-white/[0.04] text-[11px] text-white/75 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-champagne-400" />
                      NDA Protected
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-white/[0.04] text-[11px] text-white/75 flex items-center gap-1.5">
                      <BellRing className="w-3.5 h-3.5 text-champagne-400" />
                      SMS Alerts Active
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All-Inclusive Paid
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
