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
    updateDraft({
      rideType: "oneway",
      pickup: `${city} International Airport`,
      dropoff: `${city} City Center Five-Star Hotel`,
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
    <footer className="bg-obsidian-950 border-t border-white/10 pt-20 pb-12 text-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Global Cities Directory Strip */}
        <div className="pb-16 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-champagne-400 font-semibold">
                500+ Cities · 64+ Countries
              </p>
              <h3 className="font-serif text-3xl text-ivory-50 mt-1">
                Global Chauffeur & Limousine Hubs
              </h3>
            </div>
            <p className="text-xs text-white/50">
              Select any city to launch instant airport & point-to-point rates
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(GLOBAL_CITIES_DIRECTORY).map(([region, cities]) => (
              <div key={region}>
                <h4 className="text-xs uppercase tracking-[0.2em] text-champagne-300 font-semibold mb-3">
                  {region}
                </h4>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city}>
                      <button
                        type="button"
                        onClick={() => handleCityClick(city)}
                        className="text-xs sm:text-sm text-white/60 hover:text-champagne-300 transition-colors"
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
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-500/15 border border-champagne-400/35 flex items-center justify-center">
                <Crown className="w-5 h-5 text-champagne-400" />
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-ivory-50">
                  LIMO <span className="text-champagne-400">BLACK</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              The global private limousine and chauffeur standard. Impeccable
              Maybach, S-Class, Escalade, and Stretch Limousine journeys across
              64+ countries with all-inclusive transparent fares.
            </p>

            <div className="space-y-2 text-xs text-white/65">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-champagne-400" />
                <span>24/7 VIP Dispatch: +1 (800) 555-LIMO · +44 20 7946 0990</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>100% Carbon-Offset Rides & Electric Luxury Fleet</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-champagne-400 font-semibold">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li>
                <Link
                  href="/services/airport-transfers"
                  className="hover:text-white transition-colors"
                >
                  Airport Transfers
                </Link>
              </li>
              <li>
                <Link
                  href="/services/hourly"
                  className="hover:text-white transition-colors"
                >
                  Hourly & Full-Day
                </Link>
              </li>
              <li>
                <Link
                  href="/services/city-to-city"
                  className="hover:text-white transition-colors"
                >
                  City-to-City Rides
                </Link>
              </li>
              <li>
                <Link
                  href="/services/limousine"
                  className="hover:text-white transition-colors"
                >
                  Stretch Limousines
                </Link>
              </li>
              <li>
                <Link
                  href="/fleet"
                  className="hover:text-white transition-colors"
                >
                  Service Classes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Corporate */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-champagne-400 font-semibold">
              Enterprise
            </h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li>
                <Link
                  href="/business"
                  className="hover:text-white transition-colors"
                >
                  Corporate Travel
                </Link>
              </li>
              <li>
                <Link
                  href="/business"
                  className="hover:text-white transition-colors"
                >
                  Travel Agencies & GDS
                </Link>
              </li>
              <li>
                <Link
                  href="/business"
                  className="hover:text-white transition-colors"
                >
                  Private Aviation FBO
                </Link>
              </li>
              <li>
                <Link
                  href="/chauffeurs"
                  className="hover:text-white transition-colors"
                >
                  Become a Chauffeur
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="hover:text-white transition-colors"
                >
                  Manage Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Concierge Brief Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-champagne-400 font-semibold">
              Private Privilege Dispatch
            </h4>
            <p className="text-xs sm:text-sm text-white/60">
              Receive seasonal intercity corridor openings, F1 & Fashion Week
              standby priority, and a 15% welcome privilege code (
              <span className="text-champagne-300 font-semibold">
                LIMOBLACK15
              </span>
              ).
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Welcome to the Obsidian Circle. Use code LIMOBLACK15 at checkout!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter executive email"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-xs sm:text-sm text-ivory-50 focus:outline-none focus:border-champagne-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 rounded-xl bg-gold-gradient text-obsidian-950 font-semibold text-xs uppercase tracking-wider flex items-center gap-1 hover:brightness-110 transition-all"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="flex items-center gap-2 text-[11px] text-white/45">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-400" />
              PCI-DSS Level 1 Encrypted · ISO 27001 Executive Privacy
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} Limo Black Global Chauffeur Services
            Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/bookings" className="hover:text-white transition-colors">
              Free Cancellation Policy
            </Link>
            <Link href="/fleet" className="hover:text-white transition-colors">
              Fleet Standards
            </Link>
            <Link href="/business" className="hover:text-white transition-colors">
              Corporate Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
