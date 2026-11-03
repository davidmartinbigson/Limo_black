"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CalendarClock,
  CheckCircle2,
  Crown,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

const CITY_TIERS: Record<string, number> = {
  "New York": 145,
  London: 138,
  Dubai: 130,
  Paris: 132,
  "Los Angeles": 140,
  Zurich: 158,
};

export default function ChauffeursPartnerPage() {
  const { formatPrice } = useBooking();
  const [city, setCity] = useState("New York");
  const [vehiclesCount, setVehiclesCount] = useState(2);
  const [weeklyRidesPerCar, setWeeklyRidesPerCar] = useState(18);
  const [applied, setApplied] = useState(false);

  const avgPayoutUsd = CITY_TIERS[city] || 135;
  const monthlyGrossUsd = Math.round(
    vehiclesCount * weeklyRidesPerCar * 4.3 * avgPayoutUsd
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-500/15 border border-champagne-400/35 text-[11px] uppercase tracking-[0.24em] text-champagne-300 font-semibold">
              <Crown className="w-3.5 h-3.5 text-champagne-400" />
              Chauffeur & Fleet Partner Network
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ivory-50 leading-[1.06]">
              Grow Your Luxury Fleet With{" "}
              <span className="italic text-champagne-300">Limo Black.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/65 leading-relaxed">
              Partner with the world’s premier limousine network. Access
              high-value pre-scheduled airport, corporate roadshow, and gala
              bookings with reliable weekly settlements.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-white/15 aspect-[16/10] shadow-luxury">
              <img
                src="/images/service-chauffeur.jpg"
                alt="Limo Black Senior Chauffeur Partner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Partner Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[
            {
              icon: CalendarClock,
              title: "Plan Your Week in Advance",
              desc: "Accept pre-booked executive transfers and multi-hour standby assignments days or weeks ahead to maximize fleet utilization.",
            },
            {
              icon: DollarSign,
              title: "Transparent Weekly Payouts",
              desc: "Direct bank transfers with clear per-journey payouts, guaranteed late-cancellation protection, and 100% of extra client tips.",
            },
            {
              icon: Award,
              title: "Prestigious Diplomatic & VIP Clientele",
              desc: "Serve respectful C-Suite executives, five-star hotel guests, and private aviation travelers.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-obsidian-900 border border-white/10 space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-champagne-500/15 border border-champagne-400/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-champagne-400" />
                </div>
                <h2 className="font-serif text-2xl text-ivory-50">
                  {item.title}
                </h2>
                <p className="text-sm text-white/65 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Partner Revenue Calculator + Application */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Estimator */}
          <div className="lg:col-span-5 rounded-3xl bg-obsidian-900 border border-white/12 p-7 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                Fleet Partner Calculator
              </span>
              <h3 className="font-serif text-3xl text-ivory-50 mt-1">
                Projected Monthly Partner Revenue
              </h3>
            </div>

            <div>
              <label className="block text-xs text-white/65 mb-1.5">
                Operating Metropolitan Hub
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
              >
                {Object.keys(CITY_TIERS).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>Luxury Vehicles in Fleet</span>
                <span className="font-bold text-champagne-300">
                  {vehiclesCount} vehicles
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={vehiclesCount}
                onChange={(e) => setVehiclesCount(Number(e.target.value))}
                className="w-full accent-[#C6A364]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>Rides per Vehicle / Week</span>
                <span className="font-bold text-champagne-300">
                  {weeklyRidesPerCar} rides
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                value={weeklyRidesPerCar}
                onChange={(e) => setWeeklyRidesPerCar(Number(e.target.value))}
                className="w-full accent-[#C6A364]"
              />
            </div>

            <div className="p-5 rounded-2xl bg-champagne-500/10 border border-champagne-400/35">
              <div className="text-xs uppercase tracking-wider text-champagne-300 font-semibold">
                Estimated Monthly Fleet Settlement
              </div>
              <div className="font-serif text-4xl text-ivory-50 font-semibold mt-1">
                {formatPrice(monthlyGrossUsd)}
              </div>
              <div className="text-[11px] text-white/55 mt-1">
                Based on {city} First Class / Stretch Limo & Business mix
              </div>
            </div>
          </div>

          {/* Partner Application Form */}
          <div className="lg:col-span-7 rounded-3xl bg-obsidian-900 border border-champagne-400/35 p-7 sm:p-10 shadow-luxury">
            {applied ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="font-serif text-3xl text-ivory-50">
                  Partner Application Received
                </h3>
                <p className="text-sm text-white/65 max-w-md">
                  Our Regional Fleet Standards Specialist in{" "}
                  <span className="text-champagne-300 font-semibold">
                    {city}
                  </span>{" "}
                  will review your commercial licensing and contact you within
                  48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                    Licensed Limousine Operators
                  </span>
                  <h3 className="font-serif text-3xl text-ivory-50 mt-1">
                    Apply to Become a Limo Black Partner
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Marcus Vance"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Licensed Limousine Company
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Vance Executive Coachworks LLC"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="partner@fleetcompany.com"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Primary Flagship Vehicle
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50">
                      <option>Mercedes-Maybach S680 / Stretch Limo</option>
                      <option>Mercedes-Benz S-Class / BMW 7 Series</option>
                      <option>Cadillac Escalade ESV / Mercedes V-Class</option>
                      <option>Mercedes-Benz EQS / BMW i7 Electric</option>
                      <option>Mercedes-Benz E-Class (2024+)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10 flex items-start gap-2.5 text-xs text-white/60">
                  <ShieldCheck className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                  <span>
                    Requirements: Commercial chauffeur & livery insurance,
                    obsidian black exterior (model year 2023 or newer), and
                    clean safety record.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all"
                >
                  Submit Chauffeur Partner Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
