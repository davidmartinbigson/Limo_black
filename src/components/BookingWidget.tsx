"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Bookmark,
  Briefcase,
  Calendar,
  Clock,
  Navigation,
  Plane,
  Plus,
  Repeat,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  calculateClassPriceUsd,
  estimateRouteMetrics,
  FLEET_CLASSES,
} from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";
import CanadianAddressInput from "@/components/CanadianAddressInput";

interface BookingWidgetProps {
  compact?: boolean;
  defaultTab?: "oneway" | "hourly";
  onSearchComplete?: () => void;
}

export default function BookingWidget({
  compact = false,
  defaultTab,
  onSearchComplete,
}: BookingWidgetProps) {
  const router = useRouter();
  const { draft, updateDraft, formatPrice, user } = useBooking();
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(
      (draft.extraStops && draft.extraStops.length > 0) || draft.roundTrip
    )
  );

  useEffect(() => {
    if (defaultTab && draft.rideType !== defaultTab) {
      updateDraft({ rideType: defaultTab });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTab]);

  const routeInfo = estimateRouteMetrics(
    draft.pickup,
    draft.dropoff,
    draft.pickupCoords,
    draft.dropoffCoords
  );

  const extraStops = draft.extraStops || [];
  const stopFee = extraStops.filter((s) => s.trim().length > 2).length * 25;
  const baseEstimate =
    calculateClassPriceUsd(
      FLEET_CLASSES[0],
      draft.rideType,
      routeInfo.distanceKm,
      draft.durationHours
    ) + stopFee;

  const estimatedFare =
    draft.roundTrip && draft.rideType === "oneway"
      ? Math.round(baseEstimate * 1.9)
      : baseEstimate;

  const handleSwap = () => {
    updateDraft({
      pickup: draft.dropoff,
      dropoff: draft.pickup,
      pickupCoords: draft.dropoffCoords,
      dropoffCoords: draft.pickupCoords,
    });
  };

  const addStop = () => {
    if (extraStops.length >= 3) return;
    updateDraft({ extraStops: [...extraStops, ""] });
    setShowAdvanced(true);
  };

  const updateStop = (idx: number, val: string) => {
    const next = [...extraStops];
    next[idx] = val;
    updateDraft({ extraStops: next });
  };

  const removeStop = (idx: number) => {
    updateDraft({ extraStops: extraStops.filter((_, i) => i !== idx) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.pickup.trim()) {
      setError("Please enter a Canadian pickup address, airport, or hotel.");
      return;
    }
    if (draft.rideType === "oneway" && !draft.dropoff.trim()) {
      setError("Please enter a Canadian destination.");
      return;
    }
    setError("");
    if (onSearchComplete) {
      onSearchComplete();
    } else {
      router.push("/book");
    }
  };

  return (
    <div
      className={`w-full rounded-3xl glass-panel border border-line/15 shadow-luxury ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8"
      }`}
    >
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex p-1 rounded-2xl bg-field border border-line/10">
          <button
            type="button"
            onClick={() => updateDraft({ rideType: "oneway" })}
            className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              draft.rideType === "oneway"
                ? "text-obsidian-950"
                : "text-muted hover:text-ink"
            }`}
          >
            {draft.rideType === "oneway" && (
              <motion.span
                layoutId="bookingTabPill"
                className="absolute inset-0 rounded-xl bg-gold-gradient shadow-gold-glow"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5" />
              One-Way Ride
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateDraft({ rideType: "hourly" })}
            className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              draft.rideType === "hourly"
                ? "text-obsidian-950"
                : "text-muted hover:text-ink"
            }`}
          >
            {draft.rideType === "hourly" && (
              <motion.span
                layoutId="bookingTabPill"
                className="absolute inset-0 rounded-xl bg-gold-gradient shadow-gold-glow"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              By the Hour
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addStop}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-field hover:bg-line/[0.08] border border-line/15 text-[11px] font-semibold text-ink transition-colors"
          >
            <Plus className="w-3 h-3 text-accent" />
            Add Stop
          </button>
          {draft.rideType === "oneway" && (
            <button
              type="button"
              onClick={() => {
                updateDraft({ roundTrip: !draft.roundTrip });
                setShowAdvanced(true);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors ${
                draft.roundTrip
                  ? "bg-champagne-500/20 border-champagne-500/50 text-accent"
                  : "bg-field hover:bg-line/[0.08] border-line/15 text-ink"
              }`}
            >
              <Repeat className="w-3 h-3 text-accent" />
              Round-Trip (-10%)
            </button>
          )}
        </div>
      </div>

      {/* Logged-in User Saved Canadian Addresses Quick-Select */}
      {user?.savedPlaces && user.savedPlaces.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className="text-[10px] uppercase tracking-wider text-subtle font-semibold inline-flex items-center gap-1 mr-1">
            <Bookmark className="w-3 h-3 text-accent" /> Saved Places:
          </span>
          {user.savedPlaces.map((pl) => (
            <button
              key={pl.id}
              type="button"
              onClick={() =>
                updateDraft({ pickup: pl.address, pickupCoords: pl.coords })
              }
              className="px-2.5 py-1 rounded-full bg-field hover:border-champagne-500/40 border border-line/12 text-[11px] font-medium text-ink transition-colors"
              title={`Set Pickup: ${pl.address}`}
            >
              {pl.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup & Dropoff / Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div
            className={
              draft.rideType === "oneway" ? "lg:col-span-5" : "lg:col-span-7"
            }
          >
            <CanadianAddressInput
              label="Pickup Location (Canada)"
              value={draft.pickup}
              onChange={(val, coords) =>
                updateDraft({
                  pickup: val,
                  pickupCoords: coords || null,
                })
              }
              placeholder="Search address, YYZ/YVR/YUL airport, or hotel..."
              compact={compact}
            />
          </div>

          {draft.rideType === "oneway" ? (
            <>
              <div className="lg:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap pickup and destination"
                  className="p-2.5 rounded-full bg-field hover:bg-champagne-500/20 border border-line/15 hover:border-champagne-500/40 text-muted hover:text-accent transition-all"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-6">
                <CanadianAddressInput
                  label="Destination (Canada)"
                  value={draft.dropoff}
                  onChange={(val, coords) =>
                    updateDraft({
                      dropoff: val,
                      dropoffCoords: coords || null,
                    })
                  }
                  placeholder="Search destination street, postal code, or hotel..."
                  compact={compact}
                />
              </div>
            </>
          ) : (
            <div className="lg:col-span-5">
              <div className="px-4 py-3 rounded-2xl bg-field border border-line/15 focus-within:border-champagne-500 transition-colors">
                <label className="block text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold mb-1">
                  Charter Duration (40 km / hr included)
                </label>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <select
                    value={draft.durationHours}
                    onChange={(e) =>
                      updateDraft({ durationHours: Number(e.target.value) })
                    }
                    className="w-full bg-transparent text-sm text-ink focus:outline-none cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 8, 10, 12, 16, 24].map((hrs) => (
                      <option key={hrs} value={hrs} className="bg-card text-ink">
                        {hrs} Hours Chauffeur Charter ({hrs * 40} km allowance)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Intermediate Stops (if added) */}
        {extraStops.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {extraStops.map((stopVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <CanadianAddressInput
                    label={`Intermediate Stop #${idx + 1} (+CA$25)`}
                    value={stopVal}
                    onChange={(val) => updateStop(idx, val)}
                    placeholder="Search en-route Canadian stop address..."
                    compact
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStop(idx)}
                  className="p-3 rounded-xl bg-field border border-line/15 text-muted hover:text-rose-500"
                  title="Remove Stop"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Date, Time, Passengers & Submit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-stretch">
          <div className="lg:col-span-3 px-4 py-3 rounded-2xl bg-field border border-line/15 focus-within:border-champagne-500 transition-colors">
            <label className="block text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold mb-1">
              Pickup Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent shrink-0" />
              <input
                type="date"
                value={draft.date}
                onChange={(e) => updateDraft({ date: e.target.value })}
                className="w-full bg-transparent text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-2 px-4 py-3 rounded-2xl bg-field border border-line/15 focus-within:border-champagne-500 transition-colors">
            <label className="block text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold mb-1">
              Pickup Time
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent shrink-0" />
              <input
                type="time"
                value={draft.time}
                onChange={(e) => updateDraft({ time: e.target.value })}
                className="w-full bg-transparent text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-3 px-4 py-3 rounded-2xl bg-field border border-line/15 flex items-center justify-between gap-2">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.16em] text-subtle font-semibold mb-1">
                Guests & Bags
              </span>
              <div className="flex items-center gap-3 text-xs text-ink font-semibold">
                <label className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <select
                    value={draft.passengersCount}
                    onChange={(e) =>
                      updateDraft({ passengersCount: Number(e.target.value) })
                    }
                    className="bg-transparent focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n} className="bg-card text-ink">
                        {n} Pax
                      </option>
                    ))}
                  </select>
                </label>
                <label className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-accent" />
                  <select
                    value={draft.luggageCount}
                    onChange={(e) =>
                      updateDraft({ luggageCount: Number(e.target.value) })
                    }
                    className="bg-transparent focus:outline-none cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 8].map((n) => (
                      <option key={n} value={n} className="bg-card text-ink">
                        {n} Bags
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex">
            <button
              type="submit"
              className="w-full rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs sm:text-sm uppercase tracking-[0.14em] px-5 py-4 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Select Limousine</span>
              <span className="px-2 py-0.5 rounded-full bg-obsidian-950/15 text-[11px] font-bold">
                from {formatPrice(estimatedFare)}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Round-Trip Return Leg Schedule */}
        {draft.roundTrip && draft.rideType === "oneway" && showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-champagne-500/10 border border-champagne-500/30">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">
                Return Pickup Date (10% Return Privilege Applied)
              </label>
              <input
                type="date"
                value={draft.returnDate}
                onChange={(e) => updateDraft({ returnDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-card border border-line/15 text-xs text-ink"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">
                Return Pickup Time
              </label>
              <input
                type="time"
                value={draft.returnTime}
                onChange={(e) => updateDraft({ returnTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-card border border-line/15 text-xs text-ink"
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

        {/* Live Telemetry & Guarantees */}
        <div className="pt-3 border-t border-line/10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-accent" />
              60m Free Canadian Airport Wait
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Free Cancellation up to 1h Before
            </span>
          </div>
          {draft.rideType === "oneway" && (
            <span className="inline-flex items-center gap-1.5 text-accent font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Est. {routeInfo.distanceKm} km • ~{routeInfo.durationMin} min
              {draft.roundTrip ? " (Each Way)" : ""}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
