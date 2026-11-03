"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  calculateClassPriceUsd,
  estimateRouteMetrics,
  FLEET_CLASSES,
  GLOBAL_LOCATIONS,
  LocationItem,
} from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

interface BookingWidgetProps {
  defaultTab?: "oneway" | "hourly";
  compact?: boolean;
}

const HOUR_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12, 16, 24];

export default function BookingWidget({
  defaultTab,
  compact = false,
}: BookingWidgetProps) {
  const router = useRouter();
  const { draft, updateDraft, formatPrice } = useBooking();

  const [rideType, setRideType] = useState<"oneway" | "hourly">(
    defaultTab || draft.rideType
  );
  const [pickup, setPickup] = useState(draft.pickup);
  const [dropoff, setDropoff] = useState(draft.dropoff);
  const [durationHours, setDurationHours] = useState(draft.durationHours);
  const [date, setDate] = useState(draft.date);
  const [time, setTime] = useState(draft.time);

  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(
    null
  );
  const [swapRotation, setSwapRotation] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultTab) {
      setRideType(defaultTab);
    }
  }, [defaultTab]);

  // Sync external route prefill changes (e.g. clicking a City-to-City route card)
  useEffect(() => {
    setPickup(draft.pickup);
    setDropoff(draft.dropoff);
  }, [draft.pickup, draft.dropoff]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filteredPickup = useMemo(() => {
    const q = pickup.trim().toLowerCase();
    if (!q) return GLOBAL_LOCATIONS.slice(0, 7);
    const matches = GLOBAL_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.subtitle.toLowerCase().includes(q) ||
        (loc.iata && loc.iata.toLowerCase().includes(q))
    );
    return matches.length > 0 ? matches.slice(0, 7) : GLOBAL_LOCATIONS.slice(0, 5);
  }, [pickup]);

  const filteredDropoff = useMemo(() => {
    const q = dropoff.trim().toLowerCase();
    if (!q) return GLOBAL_LOCATIONS.slice(0, 7);
    const matches = GLOBAL_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.subtitle.toLowerCase().includes(q) ||
        (loc.iata && loc.iata.toLowerCase().includes(q))
    );
    return matches.length > 0 ? matches.slice(0, 7) : GLOBAL_LOCATIONS.slice(0, 5);
  }, [dropoff]);

  const metrics = useMemo(
    () => estimateRouteMetrics(pickup, dropoff),
    [pickup, dropoff]
  );

  const startingUsd = useMemo(() => {
    return calculateClassPriceUsd(
      FLEET_CLASSES[0],
      rideType,
      metrics.distanceKm,
      durationHours
    );
  }, [rideType, metrics.distanceKm, durationHours]);

  const handleSwap = () => {
    setSwapRotation((r) => r + 180);
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  const handleSelectLocation = (
    field: "pickup" | "dropoff",
    loc: LocationItem
  ) => {
    if (field === "pickup") {
      setPickup(loc.name);
    } else {
      setDropoff(loc.name);
    }
    setActiveField(null);
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setErrorMsg("Please select or enter a pickup location.");
      return;
    }
    if (rideType === "oneway" && !dropoff.trim()) {
      setErrorMsg("Please select or enter a drop-off destination.");
      return;
    }
    setErrorMsg("");
    updateDraft({
      rideType,
      pickup: pickup.trim(),
      dropoff: rideType === "oneway" ? dropoff.trim() : `${pickup.trim()} (As Directed)`,
      durationHours,
      date,
      time,
    });
    router.push("/book");
  };

  return (
    <div
      ref={containerRef}
      id="booking-widget"
      className={`relative rounded-3xl bg-obsidian-900/92 backdrop-blur-2xl border border-white/15 shadow-luxury ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8"
      }`}
    >
      {/* Subtle Top Gold Hairline */}
      <div className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/60 to-transparent" />

      {/* Header Row: Mode Switcher + Live Estimate Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex p-1 rounded-2xl bg-obsidian-950 border border-white/10">
          <button
            type="button"
            onClick={() => setRideType("oneway")}
            className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              rideType === "oneway"
                ? "text-obsidian-950"
                : "text-white/65 hover:text-white"
            }`}
          >
            {rideType === "oneway" && (
              <motion.span
                layoutId="bookingTabIndicator"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-gold-gradient"
              />
            )}
            <span className="relative z-10">One way</span>
          </button>

          <button
            type="button"
            onClick={() => setRideType("hourly")}
            className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              rideType === "hourly"
                ? "text-obsidian-950"
                : "text-white/65 hover:text-white"
            }`}
          >
            {rideType === "hourly" && (
              <motion.span
                layoutId="bookingTabIndicator"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-gold-gradient"
              />
            )}
            <span className="relative z-10">By the hour</span>
          </button>
        </div>

        {/* Dynamic Live Estimate Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-champagne-400/25 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
          <span className="text-white/70">
            {rideType === "oneway"
              ? `~${metrics.distanceKm} km · ${metrics.durationMin} min`
              : `${durationHours} hrs · ${durationHours * 40} km included`}
          </span>
          <span className="text-white/25">|</span>
          <span className="font-semibold text-champagne-300">
            From {formatPrice(startingUsd)}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Locations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center relative">
          {/* Pickup Input */}
          <div
            className={`relative ${
              rideType === "oneway" ? "lg:col-span-5" : "lg:col-span-7"
            }`}
          >
            <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium mb-1.5 ml-1">
              Pickup Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-champagne-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={pickup}
                onFocus={() => setActiveField("pickup")}
                onChange={(e) => {
                  setPickup(e.target.value);
                  setActiveField("pickup");
                }}
                placeholder="Airport, hotel, address, or landmark"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-obsidian-950/95 border border-white/12 focus:border-champagne-400 text-sm text-ivory-50 placeholder:text-white/35 focus:outline-none transition-colors"
              />
            </div>

            {/* Pickup Autocomplete */}
            <AnimatePresence>
              {activeField === "pickup" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl bg-obsidian-900 border border-white/15 p-2 shadow-luxury max-h-72 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                    Popular Global Pickups
                  </div>
                  {filteredPickup.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectLocation("pickup", loc)}
                      className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        {loc.type === "airport" ? (
                          <Plane className="w-3.5 h-3.5 text-champagne-400" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-white/70" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium text-ivory-50 truncate">
                            {loc.name}
                          </span>
                          {loc.iata && (
                            <span className="px-1.5 py-0.5 rounded bg-champagne-500/20 text-champagne-300 text-[10px] font-bold shrink-0">
                              {loc.iata}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/45 truncate">
                          {loc.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {rideType === "oneway" ? (
            <>
              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center lg:pt-5">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Pickup and Drop-off"
                  className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-champagne-500/20 border border-white/15 hover:border-champagne-400/50 flex items-center justify-center text-champagne-300 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: swapRotation }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </motion.div>
                </button>
              </div>

              {/* Dropoff Input */}
              <div className="relative lg:col-span-6">
                <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium mb-1.5 ml-1">
                  Drop-off Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={dropoff}
                    onFocus={() => setActiveField("dropoff")}
                    onChange={(e) => {
                      setDropoff(e.target.value);
                      setActiveField("dropoff");
                    }}
                    placeholder="Destination hotel, terminal, or street"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-obsidian-950/95 border border-white/12 focus:border-champagne-400 text-sm text-ivory-50 placeholder:text-white/35 focus:outline-none transition-colors"
                  />
                </div>

                {/* Dropoff Autocomplete */}
                <AnimatePresence>
                  {activeField === "dropoff" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl bg-obsidian-900 border border-white/15 p-2 shadow-luxury max-h-72 overflow-y-auto"
                    >
                      <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                        Curated Destinations
                      </div>
                      {filteredDropoff.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => handleSelectLocation("dropoff", loc)}
                          className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                            {loc.type === "airport" ? (
                              <Plane className="w-3.5 h-3.5 text-champagne-400" />
                            ) : (
                              <Building2 className="w-3.5 h-3.5 text-white/70" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-medium text-ivory-50 truncate">
                                {loc.name}
                              </span>
                              {loc.iata && (
                                <span className="px-1.5 py-0.5 rounded bg-champagne-500/20 text-champagne-300 text-[10px] font-bold shrink-0">
                                  {loc.iata}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/45 truncate">
                              {loc.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Duration Selector in Hourly Mode */
            <div className="lg:col-span-5">
              <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium mb-1.5 ml-1">
                Standby Duration (2 – 24 Hours)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-champagne-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-obsidian-950/95 border border-white/12 focus:border-champagne-400 text-sm text-ivory-50 focus:outline-none appearance-none cursor-pointer"
                >
                  {HOUR_OPTIONS.map((hrs) => (
                    <option
                      key={hrs}
                      value={hrs}
                      className="bg-obsidian-900 text-ivory-50"
                    >
                      {hrs} Hours Standby ({hrs * 40} km / {hrs * 25} mi included)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Date, Time & CTA Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Date */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium mb-1.5 ml-1">
              Pickup Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-champagne-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-obsidian-950/95 border border-white/12 focus:border-champagne-400 text-sm text-ivory-50 [color-scheme:dark] focus:outline-none"
              />
            </div>
          </div>

          {/* Time */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium mb-1.5 ml-1">
              Pickup Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-champagne-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-obsidian-950/95 border border-white/12 focus:border-champagne-400 text-sm text-ivory-50 [color-scheme:dark] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs sm:text-sm uppercase tracking-[0.15em] shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>View Limousine Options</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-amber-400 font-medium pl-1">{errorMsg}</p>
        )}

        {/* Bottom Perks Assurance Strip */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-white/60">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {metrics.isAirport ? (
              <span className="flex items-center gap-1.5 text-champagne-300 font-medium">
                <Plane className="w-3.5 h-3.5 text-champagne-400" />
                Airport detected: Flight tracking + 60m free wait included
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne-400" />
                Chauffeurs arrive 15 minutes early in 64+ countries
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-400" />
              Free cancellation until 1 hr before pickup
            </span>
          </div>
          <span className="text-white/45">
            All taxes, tolls & gratuity included
          </span>
        </div>
      </form>
    </div>
  );
}
