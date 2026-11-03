"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Check,
  Crown,
  Leaf,
  Luggage,
  Sparkles,
  Users,
} from "lucide-react";
import { FLEET_CLASSES, FleetClassId } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

export default function FleetShowcase() {
  const router = useRouter();
  const { updateDraft, formatPrice } = useBooking();
  const [activeId, setActiveId] = useState<FleetClassId>("limousine");
  const [viewMode, setViewMode] = useState<"exterior" | "cabin">("exterior");

  const activeFleet =
    FLEET_CLASSES.find((f) => f.id === activeId) || FLEET_CLASSES[0];

  const handleBookClass = (id: FleetClassId) => {
    updateDraft({ selectedClassId: id });
    router.push("/book");
  };

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-canvas">
      <div className="absolute inset-0 bg-obsidian-radial pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-accent font-semibold mb-3">
              <Crown className="w-3.5 h-3.5" />
              Discover Our Canadian Service Classes
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.08]">
              An All-Season Luxury{" "}
              <span className="italic text-accent">Canadian Fleet.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muted max-w-md">
            Every Limo Black vehicle across Canada features all-wheel-drive
            confidence, heated Nappa leather cabins, and vetted career
            chauffeurs.
          </p>
        </div>

        {/* Fleet Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {FLEET_CLASSES.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  setViewMode("exterior");
                }}
                className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "border-champagne-500/60 text-obsidian-950"
                    : "border-line/12 bg-card text-muted hover:text-ink hover:border-line/25"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="fleetTabPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-2xl bg-gold-gradient"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.flagship && <Sparkles className="w-3.5 h-3.5" />}
                  {item.zeroEmission && <Leaf className="w-3.5 h-3.5" />}
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Animated Fleet Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFleet.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl bg-card border border-line/12 p-6 sm:p-8 lg:p-10 shadow-luxury"
          >
            {/* Left Image Stage */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-obsidian-950 border border-line/10 group">
                <motion.img
                  key={`${activeFleet.id}-${viewMode}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={
                    viewMode === "exterior"
                      ? activeFleet.image
                      : activeFleet.cabinImage
                  }
                  alt={activeFleet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-transparent to-obsidian-950/20" />

                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold bg-obsidian-950/85 backdrop-blur-md text-champagne-300 border border-champagne-400/35">
                    {activeFleet.badge}
                  </span>
                  {activeFleet.zeroEmission && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-950/85 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> 100% Electric AWD
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex p-1 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-white/15">
                    <button
                      type="button"
                      onClick={() => setViewMode("exterior")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        viewMode === "exterior"
                          ? "bg-champagne-500 text-obsidian-950 font-semibold"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      Exterior Silhouette
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("cabin")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        viewMode === "cabin"
                          ? "bg-champagne-500 text-obsidian-950 font-semibold"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      Heated Rear Lounge
                    </button>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-obsidian-950/85 backdrop-blur-md border border-white/10 text-xs text-white/85">
                    Hourly from{" "}
                    <span className="text-champagne-300 font-semibold">
                      {formatPrice(activeFleet.hourlyRateCad)}/hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Capacity Specs Bar */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3.5 rounded-2xl bg-field border border-line/10 flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      Up to {activeFleet.maxPassengers}
                    </div>
                    <div className="text-[11px] text-subtle">Passengers</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-field border border-line/10 flex items-center gap-3">
                  <Luggage className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {activeFleet.maxCheckIn} Check-in
                    </div>
                    <div className="text-[11px] text-subtle">Large Bags</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-field border border-line/10 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {activeFleet.maxCarryOn} Carry-on
                    </div>
                    <div className="text-[11px] text-subtle">Cabin Cases</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Editorial Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl text-ink mb-2">
                  {activeFleet.name}
                </h3>
                <p className="text-xs sm:text-sm text-accent font-semibold">
                  {activeFleet.vehicles}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-4">
                  {activeFleet.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-line/10">
                {activeFleet.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-xs sm:text-sm text-ink/90">{h}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeFleet.idealFor.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] bg-field border border-line/10 text-muted font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleBookClass(activeFleet.id)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  Reserve {activeFleet.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/fleet")}
                  className="py-3.5 px-5 rounded-2xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors"
                >
                  Compare All
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
