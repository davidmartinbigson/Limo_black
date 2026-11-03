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

const CITY_TIERS_CAD: Record<string, number> = {
  "Toronto & GTA (ON)": 185,
  "Vancouver & Whistler (BC)": 192,
  "Montréal (QC)": 175,
  "Calgary & Banff (AB)": 182,
  "Ottawa (ON)": 170,
  "Niagara & Muskoka (ON)": 195,
};

export default function ChauffeursPartnerPage() {
  const { formatPrice } = useBooking();
  const [city, setCity] = useState("Toronto & GTA (ON)");
  const [vehiclesCount, setVehiclesCount] = useState(2);
  const [weeklyRidesPerCar, setWeeklyRidesPerCar] = useState(18);
  const [applied, setApplied] = useState(false);

  const avgPayoutCad = CITY_TIERS_CAD[city] || 180;
  const monthlyGrossCad = Math.round(
    vehiclesCount * weeklyRidesPerCar * 4.3 * avgPayoutCad
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-500/15 border border-champagne-500/35 text-[11px] uppercase tracking-[0.22em] text-accent font-semibold">
              <Crown className="w-3.5 h-3.5 text-accent" />
              Canadian Chauffeur & Fleet Partner Network
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink font-semibold leading-[1.06]">
              Grow Your Canadian Fleet With{" "}
              <span className="italic text-accent">Limo Black.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Partner with Canada’s premier luxury limousine network. Access
              high-value pre-scheduled YYZ/YVR/YUL/YYC airport runs, corporate
              roadshows, and gala bookings with reliable weekly CAD direct
              deposits.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-line/15 aspect-[16/10] shadow-luxury">
              <img
                src="/images/service-chauffeur.jpg"
                alt="Limo Black Canada Senior Chauffeur Partner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[
            {
              icon: CalendarClock,
              title: "Plan Your Week in Advance",
              desc: "Accept pre-booked Canadian airport transfers, Whistler/Banff runs, and multi-hour standby assignments days or weeks ahead.",
            },
            {
              icon: DollarSign,
              title: "Direct Weekly CAD Settlements",
              desc: "Automated EFT transfers to any Canadian bank with transparent per-journey payouts, toll reimbursements, and 100% of extra tips.",
            },
            {
              icon: Award,
              title: "Executive & VIP Clientele",
              desc: "Serve respectful Bay Street executives, five-star hotel guests, diplomatic delegations, and private aviation travelers.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-card border border-line/12 shadow-luxury space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-serif text-2xl text-ink font-semibold">
                  {item.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-3xl bg-card border border-line/12 p-7 sm:p-8 space-y-6 shadow-luxury">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                Canadian Fleet Partner Calculator
              </span>
              <h3 className="font-serif text-3xl text-ink font-semibold mt-1">
                Projected Monthly CAD Settlement
              </h3>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">
                Canadian Metropolitan Hub
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
              >
                {Object.keys(CITY_TIERS_CAD).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-field border border-line/10 space-y-2">
              <div className="flex justify-between text-xs text-muted">
                <span>AWD Luxury Vehicles in Fleet</span>
                <span className="font-bold text-accent">
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

            <div className="p-4 rounded-2xl bg-field border border-line/10 space-y-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Rides per Vehicle / Week</span>
                <span className="font-bold text-accent">
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

            <div className="p-5 rounded-2xl bg-champagne-500/15 border border-champagne-500/35">
              <div className="text-xs uppercase tracking-wider text-accent font-bold">
                Estimated Monthly Fleet Settlement
              </div>
              <div className="font-serif text-4xl text-ink font-bold mt-1">
                {formatPrice(monthlyGrossCad)}
              </div>
              <div className="text-[11px] text-muted mt-1">
                Based on {city} First Class, SUV & Stretch Limo mix
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-card border border-champagne-500/40 p-7 sm:p-10 shadow-luxury">
            {applied ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="font-serif text-3xl text-ink font-semibold">
                  Canadian Partner Application Received
                </h3>
                <p className="text-sm text-muted max-w-md">
                  Our Regional Fleet Standards Specialist for{" "}
                  <span className="text-accent font-semibold">{city}</span> will
                  verify your provincial livery licensing and contact you within
                  48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                    Licensed Canadian Limousine Operators
                  </span>
                  <h3 className="font-serif text-3xl text-ink font-semibold mt-1">
                    Apply to Become a Limo Black Partner
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Liam MacLeod"
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Registered Canadian Livery Company
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MacLeod Executive Limousine Inc."
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="dispatch@fleetcompany.ca"
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Primary AWD Flagship Vehicle
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink">
                      <option>Mercedes-Maybach S680 AWD / Stretch Limo</option>
                      <option>Mercedes-Benz S580 4MATIC / BMW 760i xDrive</option>
                      <option>Cadillac Escalade ESV 4WD / Yukon Denali</option>
                      <option>Mercedes-Benz EQS 580 4MATIC Electric</option>
                      <option>Mercedes-Benz E-Class 4MATIC (2023+)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-field border border-line/10 flex items-start gap-2.5 text-xs text-muted">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Requirements: Provincial commercial livery insurance &
                    permit (PTC Toronto / PTB BC / CTQ Québec), GTAA/airport
                    transponder where applicable, and black AWD model year 2023+.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all"
                >
                  Submit Canadian Partner Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
