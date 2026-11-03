"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  calculateClassPriceUsd,
  estimateRouteMetrics,
  FLEET_CLASSES,
} from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";
import CanadianAddressInput from "@/components/CanadianAddressInput";

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
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(draft.pickupCoords);
  const [dropoffCoords, setDropoffCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(draft.dropoffCoords);
  const [durationHours, setDurationHours] = useState(draft.durationHours);
  const [date, setDate] = useState(draft.date);
  const [time, setTime] = useState(draft.time);
  const [swapRotation, setSwapRotation] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (defaultTab) {
      setRideType(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    setPickup(draft.pickup);
    setDropoff(draft.dropoff);
    setPickupCoords(draft.pickupCoords);
    setDropoffCoords(draft.dropoffCoords);
  }, [draft.pickup, draft.dropoff, draft.pickupCoords, draft.dropoffCoords]);

  const metrics = useMemo(
    () => estimateRouteMetrics(pickup, dropoff, pickupCoords, dropoffCoords),
    [pickup, dropoff, pickupCoords, dropoffCoords]
  );

  const startingCad = useMemo(() => {
    return calculateClassPriceUsd(
      FLEET_CLASSES[0],
      rideType,
      metrics.distanceKm,
      durationHours
    );
  }, [rideType, metrics.distanceKm, durationHours]);

  const handleSwap = () => {
    setSwapRotation((r) => r + 180);
    setPickup(dropoff);
    setDropoff(pickup);
    setPickupCoords(dropoffCoords);
    setDropoffCoords(pickupCoords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setErrorMsg("Please search or enter a Canadian pickup address.");
      return;
    }
    if (rideType === "oneway" && !dropoff.trim()) {
      setErrorMsg("Please search or enter a Canadian drop-off destination.");
      return;
    }
    setErrorMsg("");
    updateDraft({
      rideType,
      pickup: pickup.trim(),
      dropoff:
        rideType === "oneway"
          ? dropoff.trim()
          : `${pickup.trim()} (Standby As Directed)`,
      pickupCoords,
      dropoffCoords: rideType === "oneway" ? dropoffCoords : pickupCoords,
      durationHours,
      date,
      time,
    });
    router.push("/book");
  };

  return (
    <div
      id="booking-widget"
      className={`relative rounded-3xl bg-card/95 backdrop-blur-2xl border border-line/15 shadow-luxury ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8"
      }`}
    >
      {/* Top Champagne Accent Hairline */}
      <div className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-500/70 to-transparent" />

      {/* Header Row: Mode Switcher + Live CAD Fare Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex p-1 rounded-2xl bg-field border border-line/10">
          <button
            type="button"
            onClick={() => setRideType("oneway")}
            className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              rideType === "oneway"
                ? "text-obsidian-950"
                : "text-muted hover:text-ink"
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
                : "text-muted hover:text-ink"
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
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-field border border-champagne-500/30 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="text-muted">
            {rideType === "oneway"
              ? `~${metrics.distanceKm} km · ${metrics.durationMin} min`
              : `${durationHours} hrs · ${durationHours * 40} km included`}
          </span>
          <span className="text-line/20">|</span>
          <span className="font-bold text-accent">
            From {formatPrice(startingCad)}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center relative">
          {/* Pickup Input (Live Canadian Map Search) */}
          <div
            className={
              rideType === "oneway" ? "lg:col-span-5" : "lg:col-span-7"
            }
          >
            <CanadianAddressInput
              label="Pickup Location (Canada)"
              value={pickup}
              placeholder="Search street, postal code, hotel, or YYZ / YVR / YUL..."
              onChange={(val, coords) => {
                setPickup(val);
                if (coords !== undefined) setPickupCoords(coords);
                setErrorMsg("");
              }}
            />
          </div>

          {rideType === "oneway" ? (
            <>
              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center lg:pt-5">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Pickup and Drop-off"
                  className="w-10 h-10 rounded-full bg-field hover:bg-champagne-500/20 border border-line/15 hover:border-champagne-500/50 flex items-center justify-center text-accent transition-colors"
                >
                  <motion.div
                    animate={{ rotate: swapRotation }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </motion.div>
                </button>
              </div>

              {/* Dropoff Input (Live Canadian Map Search) */}
              <div className="lg:col-span-6">
                <CanadianAddressInput
                  label="Drop-off Destination (Canada)"
                  value={dropoff}
                  placeholder="Search destination street, postal code, hotel, or airport..."
                  onChange={(val, coords) => {
                    setDropoff(val);
                    if (coords !== undefined) setDropoffCoords(coords);
                    setErrorMsg("");
                  }}
                />
              </div>
            </>
          ) : (
            /* Duration Selector in Hourly Mode */
            <div className="lg:col-span-5">
              <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5 ml-1">
                Standby Duration (2 – 24 Hours)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-accent absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-field border border-line/15 focus:border-champagne-500 text-sm text-ink focus:outline-none appearance-none cursor-pointer"
                >
                  {HOUR_OPTIONS.map((hrs) => (
                    <option
                      key={hrs}
                      value={hrs}
                      className="bg-card text-ink"
                    >
                      {hrs} Hours Standby ({hrs * 40} km included)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Date, Time & CTA Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5 ml-1">
              Pickup Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-accent absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-field border border-line/15 focus:border-champagne-500 text-sm text-ink [color-scheme:light] dark:[color-scheme:dark] focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5 ml-1">
              Pickup Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-accent absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-field border border-line/15 focus:border-champagne-500 text-sm text-ink [color-scheme:light] dark:[color-scheme:dark] focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs sm:text-sm uppercase tracking-[0.14em] shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>View Limousine Options</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold pl-1">
            {errorMsg}
          </p>
        )}

        {/* Bottom Canadian Assurance Strip */}
        <div className="pt-3 border-t border-line/10 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-muted">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {metrics.isAirport ? (
              <span className="flex items-center gap-1.5 text-accent font-semibold">
                <Plane className="w-3.5 h-3.5" />
                Canadian Airport detected: Live flight tracking + 60m free wait included
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                AWD luxury fleet across Toronto, Vancouver, Montréal, Calgary & Ottawa
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Free cancellation until 1 hr before pickup
            </span>
          </div>
          <span className="text-subtle">
            GST/HST, 407 ETR tolls & tip included
          </span>
        </div>
      </form>
    </div>
  );
}
