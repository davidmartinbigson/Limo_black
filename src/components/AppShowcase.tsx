"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, MapPin, Navigation, Phone, ShieldCheck } from "lucide-react";

export default function AppShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-obsidian-950 text-white border border-white/10 overflow-hidden shadow-luxury grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Copy — Exact Blacklane "We move with you." Structure */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              We move with you.
            </h2>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-md">
              Have all your Canadian journeys, live chauffeur GPS tracking, and
              CRA GST/HST receipts in the palm of your hand with LimoBlack.
            </p>

            {/* Store Badges + Member Portal Button */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/account"
                className="px-5 py-3 rounded-xl bg-white text-obsidian-950 hover:bg-ivory-100 transition-colors flex items-center gap-3"
              >
                <div className="text-left leading-tight">
                  <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-70">
                    Instant Web App
                  </span>
                  <span className="text-sm font-bold">My Personal Portal</span>
                </div>
              </Link>

              <Link
                href="/book"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-colors flex items-center gap-3"
              >
                <div className="text-left leading-tight">
                  <span className="block text-[10px] uppercase tracking-wider font-semibold text-champagne-300">
                    iOS & Android Ready
                  </span>
                  <span className="text-sm font-bold">Book Mobile Ride</span>
                </div>
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap gap-5 text-xs text-white/65">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-champagne-400" /> Live YYZ
                / YVR / YUL flight sync
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-champagne-400" /> 1-tap
                chauffeur contact
              </span>
            </div>
          </div>

          {/* Right Column — Clean Blacklane Mobile Chauffeur Telemetry Preview */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:pr-14 flex justify-center">
            <div className="w-full max-w-sm rounded-[28px] bg-obsidian-900 border border-white/15 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <img
                  src="/images/limoblack-logo-dark.png"
                  alt="LimoBlack"
                  className="h-4 w-auto object-contain"
                />
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                  Chauffeur Arrived
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/50 block">Pickup</span>
                    <span className="text-white font-medium">
                      Toronto Pearson Airport (YYZ) · Terminal 1
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/50 block">Drop-off</span>
                    <span className="text-white font-medium">
                      Fairmont Royal York, 100 Front St W, Toronto
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-champagne-500/10 border border-champagne-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-champagne-300 font-semibold block">
                    Your Chauffeur
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Marc-André Tremblay · ★ 4.98
                  </p>
                  <p className="text-xs text-white/70">
                    Mercedes-Benz S 580 AWD · ON · LIMO 01
                  </p>
                </div>
                <span className="w-10 h-10 rounded-full bg-gold-gradient text-obsidian-950 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
