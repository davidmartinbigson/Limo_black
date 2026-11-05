"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  Mail,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { GLOBAL_CITIES_DIRECTORY } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

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
    <footer className="bg-obsidian-950 text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand Logo + Help Desk */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 border-b border-white/10">
          <Link href="/" className="inline-flex items-center">
            <BrandLogo size="lg" variant="dark" showCanadaBadge />
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/75">
            <span className="inline-flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-champagne-400" />
              24/7 Canada Dispatch: +1 (888) 546-6255
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              100% Carbon-Offset Canadian Rides
            </span>
          </div>
        </div>

        {/* Blacklane-Style Multi-Column Directory */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 border-b border-white/10">
          <div className="col-span-1 lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link
                  href="/business"
                  className="hover:text-white transition-colors"
                >
                  For business
                </Link>
              </li>
              <li>
                <Link
                  href="/chauffeurs"
                  className="hover:text-white transition-colors"
                >
                  For chauffeurs
                </Link>
              </li>
              <li>
                <Link
                  href="/fleet"
                  className="hover:text-white transition-colors"
                >
                  Service classes
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  Dispatch portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Our services
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link
                  href="/services/airport-transfers"
                  className="hover:text-white transition-colors"
                >
                  Airport transfers
                </Link>
              </li>
              <li>
                <Link
                  href="/services/hourly"
                  className="hover:text-white transition-colors"
                >
                  Hourly and full day hire
                </Link>
              </li>
              <li>
                <Link
                  href="/services/city-to-city"
                  className="hover:text-white transition-colors"
                >
                  City-to-city rides
                </Link>
              </li>
              <li>
                <Link
                  href="/services/limousine"
                  className="hover:text-white transition-colors"
                >
                  Stretch limousine service
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Account & bookings
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link
                  href="/account"
                  className="hover:text-white transition-colors text-champagne-300 font-medium"
                >
                  My personal account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="hover:text-white transition-colors"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="hover:text-white transition-colors"
                >
                  Track ride & GST/HST receipt
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              VIP Canadian Privilege
            </h4>
            <p className="text-xs sm:text-sm text-white/70">
              Subscribe for seasonal Whistler, Banff & TIFF priority plus 15%
              welcome code{" "}
              <span className="text-champagne-300 font-semibold">
                LIMOBLACK15
              </span>
              .
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Subscribed! Use code LIMOBLACK15 at checkout.
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
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-champagne-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:brightness-105 transition-all"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-white/50 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
              PIPEDA Compliant · CRA GST/HST BN 84920-4119 RT0001
            </p>
          </div>
        </div>

        {/* Top Canadian Cities Directory (Blacklane Bottom City Links) */}
        <div className="py-10 border-b border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
            Top Canadian cities
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(GLOBAL_CITIES_DIRECTORY).map(([region, cities]) => (
              <div key={region}>
                <p className="text-xs font-semibold text-champagne-300 mb-2.5">
                  {region}
                </p>
                <ul className="space-y-1.5">
                  {cities.slice(0, 6).map((city) => (
                    <li key={city}>
                      <button
                        type="button"
                        onClick={() => handleCityClick(city)}
                        className="text-xs text-white/65 hover:text-white transition-colors text-left"
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} LimoBlack Canada Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/bookings" className="hover:text-white transition-colors">
              Terms & Cancellation
            </Link>
            <Link href="/fleet" className="hover:text-white transition-colors">
              Canadian AWD Standards
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
