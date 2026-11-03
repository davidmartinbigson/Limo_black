"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Compass, MapPin, Sparkles } from "lucide-react";
import { CITY_TO_CITY_ROUTES, CityRoute } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

const REGIONS = ["All", "North America", "Europe", "Middle East"] as const;

export default function CityRoutesExplorer() {
  const router = useRouter();
  const { updateDraft, formatPrice } = useBooking();
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");

  const visibleRoutes =
    region === "All"
      ? CITY_TO_CITY_ROUTES
      : CITY_TO_CITY_ROUTES.filter((r) => r.region === region);

  const handleSelectRoute = (route: CityRoute) => {
    updateDraft({
      rideType: "oneway",
      pickup: route.pickupFull,
      dropoff: route.dropoffFull,
    });
    router.push("/book");
  };

  return (
    <section className="py-24 sm:py-32 bg-obsidian-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-champagne-400 font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              City-to-City Executive Corridors
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 leading-[1.08]">
              Between Cities,{" "}
              <span className="italic text-champagne-300">Done Better.</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mt-3">
              Skip short-haul terminal queues and rail transfers. Select any
              iconic corridor below to pre-load fixed door-to-door vehicle fares.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {REGIONS.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setRegion(reg)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  region === reg
                    ? "bg-champagne-500 text-obsidian-950"
                    : "bg-white/[0.04] text-white/65 hover:text-white border border-white/10"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleRoutes.map((route, idx) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleSelectRoute(route)}
              className="group cursor-pointer rounded-3xl bg-obsidian-900/80 hover:bg-obsidian-850 border border-white/10 hover:border-champagne-400/45 p-6 transition-all duration-300 flex flex-col justify-between shadow-luxury"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] bg-champagne-500/15 text-champagne-300 border border-champagne-400/25 font-semibold">
                    {route.highlight}
                  </span>
                  <span className="text-[11px] text-white/45">
                    {route.region}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-champagne-400" />
                    <span className="font-serif text-xl text-ivory-50 font-medium">
                      {route.from}
                    </span>
                  </div>
                  <div className="ml-[3px] h-4 border-l border-dashed border-champagne-400/40" />
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-champagne-400 -ml-[3px]" />
                    <span className="font-serif text-xl text-champagne-300 font-medium">
                      {route.to}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-white/55 pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-champagne-400" />
                    {route.duration}
                  </span>
                  <span>·</span>
                  <span>{route.distanceLabel.split("·")[0]}</span>
                </div>

                <p className="text-[11px] text-white/45 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-champagne-400 shrink-0" />
                  {route.flightTimeSaved}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/45">
                    Per Vehicle From
                  </div>
                  <div className="text-lg font-semibold text-ivory-50">
                    {formatPrice(route.startingUsd)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.06] group-hover:bg-gold-gradient text-champagne-300 group-hover:text-obsidian-950 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
