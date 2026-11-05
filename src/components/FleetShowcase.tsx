"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Check, Users } from "lucide-react";
import { FLEET_CLASSES, FleetClassId } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

export default function FleetShowcase() {
  const router = useRouter();
  const { updateDraft, formatPrice } = useBooking();
  const [activeId, setActiveId] = useState<FleetClassId>("business");

  const activeClass =
    FLEET_CLASSES.find((f) => f.id === activeId) || FLEET_CLASSES[0];

  const handleSelectClass = (id: FleetClassId) => {
    updateDraft({ selectedClassId: id });
    router.push("/book");
  };

  return (
    <section className="py-20 sm:py-28 bg-canvas border-b border-line/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Blacklane Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-accent mb-1.5">
              Service classes
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              Discover our Canadian fleet
            </h2>
          </div>
          <p className="text-sm text-muted max-w-md">
            All-wheel-drive Business Class, First Class, Electric Class, SUVs,
            and Stretch Limousines across every major Canadian city.
          </p>
        </div>

        {/* Clean Blacklane Underline / Pill Class Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-line/12 no-scrollbar">
          {FLEET_CLASSES.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-ink text-canvas"
                    : "text-muted hover:text-ink hover:bg-line/[0.05]"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Clean Blacklane 2-Column Fleet Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeClass.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-card border border-line/12 overflow-hidden shadow-luxury grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Vehicle Photography */}
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] bg-obsidian-950">
              <img
                src={activeClass.image}
                alt={activeClass.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-obsidian-950/85 backdrop-blur-md border border-white/15 text-xs text-white font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-champagne-400" /> max.{" "}
                  {activeClass.maxPassengers}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-obsidian-950/85 backdrop-blur-md border border-white/15 text-xs text-white font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-champagne-400" /> max.{" "}
                  {activeClass.maxCheckIn}
                </span>
              </div>
            </div>

            {/* Vehicle Specifications */}
            <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-accent font-semibold">
                  {activeClass.badge}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  {activeClass.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-muted">
                  {activeClass.vehicles}
                </p>
                <p className="text-sm text-muted leading-relaxed pt-1">
                  {activeClass.description}
                </p>

                <ul className="space-y-2 pt-3">
                  {activeClass.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/90"
                    >
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 border-t border-line/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-subtle block">
                    Starting transfer rate
                  </span>
                  <span className="font-serif text-2xl font-bold text-ink">
                    {formatPrice(activeClass.baseFareCad)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectClass(activeClass.id)}
                  className="px-6 py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:brightness-105 transition-all"
                >
                  Book {activeClass.name} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
