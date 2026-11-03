"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Leaf,
  Mail,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { GLOBAL_CITIES_DIRECTORY } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

export default function Footer() {
  const router = useRouter();
  const { updateDraft } = useBooking();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleCityClick = (city: string) => {
    const cleanCity = city.replace(/\s*\(.*?\)\s*/g, "").trim();
    updateDraft({
      rideType: "oneway",
      pickup: `${cleanCity} International Airport, Canada`,
      dropoff: `Downtown ${cleanCity}, Canada`,
      pickupCoords: null,
      dropoffCoords: null,
    });
    router.push("/book");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-surface border-t border-line/12 pt-20 pb-12 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Canadian Provinces & Cities Directory Strip */}
        <div className="pb-16 border-b border-line/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
                Coast-to-Coast Canadian Coverage
              </p>
              <h3 className="font-serif text-3xl text-ink mt-1">
                Canadian Chauffeur & Limousine Hubs
              </h3>
            </div>
            <p className="text-xs text-muted">
              Select any Canadian city to launch instant CAD airport & city
              rates
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(GLOBAL_CITIES_DIRECTORY).map(([region, cities]) => (
              <div key={region}>
                <h4 className="text-xs uppercase tracking-[0.18em] text-accent font-semibold mb-3">
                  {region}
                </h4>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city}>
                      <button
                        type="button"
                        onClick={() => handleCityClick(city)}
                        className="text-xs sm:text-sm text-muted hover:text-accent transition-colors text-left"
                      >
                        {city} Limo Service
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-line/10">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-obsidian-950 border border-champagne-500/40 flex items-center justify-center">
                <Crown className="w-5 h-5 text-champagne-400" />
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.16em] font-semibold text-ink">
                  LIMO <span className="text-accent">BLACK</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Canada’s premier private limousine and chauffeur network.
              All-wheel drive Maybach, S-Class, Escalade ESV, and Stretch
              Limousines across Toronto, Vancouver, Montréal, Calgary, Ottawa &
              beyond.
            </p>

            <div className="space-y-2 text-xs text-muted">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-accent shrink-0" />
                <span>
                  24/7 Canada Dispatch: +1 (888) 546-6255 · Toronto (416)
                  555-0190
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  100% Carbon-Offset Canadian Rides & Zero-Emission AWD Fleet
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link
                  href="/services/airport-transfers"
                  className="hover:text-ink transition-colors"
                >
                  Airport Transfers
                </Link>
              </li>
              <li>
                <Link
                  href="/services/hourly"
                  className="hover:text-ink transition-colors"
                >
                  Hourly & Full-Day
                </Link>
              </li>
              <li>
                <Link
                  href="/services/city-to-city"
                  className="hover:text-ink transition-colors"
                >
                  City-to-City Canada
                </Link>
              </li>
              <li>
                <Link
                  href="/services/limousine"
                  className="hover:text-ink transition-colors"
                >
                  Stretch Limousines
                </Link>
              </li>
              <li>
                <Link
                  href="/fleet"
                  className="hover:text-ink transition-colors"
                >
                  Service Classes
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Member & Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link
                  href="/account"
                  className="hover:text-ink transition-colors font-medium text-accent"
                >
                  My Personal Account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-ink transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="hover:text-ink transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="hover:text-ink transition-colors"
                >
                  Track Ride & Receipt
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-ink transition-colors"
                >
                  Owner Dispatch Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Canadian VIP Privilege Dispatch
            </h4>
            <p className="text-xs sm:text-sm text-muted">
              Receive TIFF, Whistler & Banff seasonal priority plus a 15%
              welcome privilege code (
              <span className="text-accent font-semibold">LIMOBLACK15</span>).
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Welcome to Limo Black Canada! Use code LIMOBLACK15 at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter Canadian executive email"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-line/15 text-xs sm:text-sm text-ink focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:brightness-110 transition-all"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="flex items-center gap-2 text-[11px] text-subtle">
              <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
              PIPEDA Compliant · CRA GST/HST BN 84920-4119 RT0001
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtle">
          <p>
            © {new Date().getFullYear()} Limo Black Canada Inc. (Toronto ·
            Vancouver · Montréal · Calgary · Ottawa). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/account" className="hover:text-ink transition-colors">
              Member Portal
            </Link>
            <Link href="/fleet" className="hover:text-ink transition-colors">
              Canadian AWD Standards
            </Link>
            <Link href="/business" className="hover:text-ink transition-colors">
              Corporate Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
