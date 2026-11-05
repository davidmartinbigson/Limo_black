"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Check,
  Crown,
  Leaf,
  Luggage,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { FLEET_CLASSES, FleetClassId } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

export default function FleetPage() {
  const router = useRouter();
  const { updateDraft, formatPrice } = useBooking();

  const [passengers, setPassengers] = useState(2);
  const [checkInBags, setCheckInBags] = useState(2);
  const [carryOnBags, setCarryOnBags] = useState(2);

  const handleBookClass = (id: FleetClassId) => {
    updateDraft({ selectedClassId: id });
    router.push("/book");
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-accent font-semibold">
            <Crown className="w-3.5 h-3.5" />
            Five All-Season Canadian Service Classes
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-bold mt-3 leading-[1.12]">
            The LimoBlack{" "}
            <span className="text-accent">Canada Fleet.</span>
          </h1>
          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            From zero-emission dual-motor Mercedes-Benz EQS sedans to flagship
            Maybach Pullman Stretch Limousines and winter-certified Escalade
            ESVs — built for Canadian cities, Rockies, and coastal highways.
          </p>
        </div>

        <div className="rounded-3xl bg-card border border-line/12 p-6 sm:p-10 shadow-luxury">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-line/10">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Interactive Fleet Matcher
              </span>
              <h2 className="font-serif text-3xl text-ink font-semibold mt-1">
                Will My Party, Skis & Luggage Fit?
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Adjust your guest count and luggage below to filter compatible
                Canadian service classes instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:w-[540px]">
              <div className="p-4 rounded-2xl bg-field border border-line/10">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent" /> Guests
                  </span>
                  <span className="font-bold text-ink">{passengers}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full accent-[#C6A364]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-field border border-line/10">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span className="flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-accent" /> Check-in
                  </span>
                  <span className="font-bold text-ink">{checkInBags}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={checkInBags}
                  onChange={(e) => setCheckInBags(Number(e.target.value))}
                  className="w-full accent-[#C6A364]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-field border border-line/10">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-accent" /> Carry-on
                  </span>
                  <span className="font-bold text-ink">{carryOnBags}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  value={carryOnBags}
                  onChange={(e) => setCarryOnBags(Number(e.target.value))}
                  className="w-full accent-[#C6A364]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {FLEET_CLASSES.map((fleet, idx) => {
              const fits =
                fleet.maxPassengers >= passengers &&
                fleet.maxCheckIn >= checkInBags &&
                fleet.maxCarryOn >= carryOnBags;

              return (
                <motion.div
                  key={fleet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                    fits
                      ? "bg-field border-line/12 hover:border-champagne-500/50"
                      : "bg-field/40 border-line/5 opacity-50"
                  }`}
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-obsidian-950">
                      <img
                        src={fleet.image}
                        alt={fleet.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            fits
                              ? "bg-emerald-950/90 text-emerald-300 border border-emerald-400/35"
                              : "bg-zinc-900/90 text-white/60 border border-white/10"
                          }`}
                        >
                          {fits ? "Recommended Fit" : "Exceeds Capacity"}
                        </span>
                        {fleet.flagship && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gold-gradient text-obsidian-950 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Flagship
                          </span>
                        )}
                        {fleet.zeroEmission && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> EV
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-2xl text-ink font-semibold">
                          {fleet.name}
                        </h3>
                        <p className="text-xs text-accent font-medium mt-0.5">
                          {fleet.vehicles}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted py-2.5 border-y border-line/10">
                        <span>Up to {fleet.maxPassengers} pax</span>
                        <span>·</span>
                        <span>{fleet.maxCheckIn} check-in</span>
                        <span>·</span>
                        <span>{fleet.maxCarryOn} cabin</span>
                      </div>

                      <ul className="space-y-2">
                        {fleet.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-xs text-muted"
                          >
                            <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-subtle">
                        Hourly Standby From
                      </div>
                      <div className="font-serif text-2xl text-ink font-bold">
                        {formatPrice(fleet.hourlyRateCad)}
                        <span className="text-xs font-sans text-muted">
                          /hr
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookClass(fleet.id)}
                      className="px-5 py-3 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center gap-1.5"
                    >
                      Reserve <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
