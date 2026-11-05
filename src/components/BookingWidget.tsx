"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Bookmark,
  Briefcase,
  Calendar,
  Clock,
  Info,
  Plus,
  Repeat,
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
  const [showOptions, setShowOptions] = useState(
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
    setShowOptions(true);
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
      setError("Please enter a Canadian drop-off destination.");
      return;
    }
    setError("");
    if (onSearchComplete) {
      onSearchComplete();
    } else {
      router.push("/book");
    }
  };

  // Compact horizontal bar mode (used inside /book route editor)
  if (compact) {
    return (
      <div className="w-full rounded-2xl bg-card border border-line/15 p-5 shadow-luxury">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex rounded-xl bg-field p-1 border border-line/10">
            <button
              type="button"
              onClick={() => updateDraft({ rideType: "oneway" })}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                draft.rideType === "oneway"
                  ? "bg-ink text-canvas"
                  : "text-muted hover:text-ink"
              }`}
            >
              One way
            </button>
            <button
              type="button"
              onClick={() => updateDraft({ rideType: "hourly" })}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                draft.rideType === "hourly"
                  ? "bg-ink text-canvas"
                  : "text-muted hover:text-ink"
              }`}
            >
              By the hour
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addStop}
              className="px-3 py-1.5 rounded-lg bg-field border border-line/12 text-xs font-medium text-ink flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-accent" /> Add stop
            </button>
            {draft.rideType === "oneway" && (
              <button
                type="button"
                onClick={() => updateDraft({ roundTrip: !draft.roundTrip })}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                  draft.roundTrip
                    ? "bg-champagne-500/15 border-champagne-500 text-accent"
                    : "bg-field border-line/12 text-ink"
                }`}
              >
                <Repeat className="w-3.5 h-3.5 text-accent" /> Round-trip (-10%)
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-4">
              <CanadianAddressInput
                label="From"
                value={draft.pickup}
                onChange={(val, coords) =>
                  updateDraft({ pickup: val, pickupCoords: coords || null })
                }
                placeholder="Address, airport, hotel, ..."
                compact
              />
            </div>

            <div className="lg:col-span-4">
              {draft.rideType === "oneway" ? (
                <CanadianAddressInput
                  label="To"
                  value={draft.dropoff}
                  onChange={(val, coords) =>
                    updateDraft({ dropoff: val, dropoffCoords: coords || null })
                  }
                  placeholder="Address, airport, hotel, ..."
                  compact
                />
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-field border border-line/15">
                  <label className="block text-[10px] uppercase tracking-wider text-subtle font-semibold mb-0.5">
                    Duration
                  </label>
                  <select
                    value={draft.durationHours}
                    onChange={(e) =>
                      updateDraft({ durationHours: Number(e.target.value) })
                    }
                    className="w-full bg-transparent text-sm text-ink focus:outline-none"
                  >
                    {[2, 3, 4, 5, 6, 8, 10, 12, 16, 24].map((hrs) => (
                      <option key={hrs} value={hrs} className="bg-card text-ink">
                        {hrs} hours ({hrs * 40} km inc.)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => updateDraft({ date: e.target.value })}
                className="px-2.5 py-3 rounded-xl bg-field border border-line/15 text-xs text-ink"
              />
              <input
                type="time"
                value={draft.time}
                onChange={(e) => updateDraft({ time: e.target.value })}
                className="px-2.5 py-3 rounded-xl bg-field border border-line/15 text-xs text-ink"
              />
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider"
              >
                Update
              </button>
            </div>
          </div>

          {extraStops.map((stopVal, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <CanadianAddressInput
                  label={`Stop #${idx + 1} (+CA$25)`}
                  value={stopVal}
                  onChange={(val) => updateStop(idx, val)}
                  placeholder="Intermediate Canadian address..."
                  compact
                />
              </div>
              <button
                type="button"
                onClick={() => removeStop(idx)}
                className="p-2.5 rounded-xl bg-field border border-line/15 text-muted hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </form>
      </div>
    );
  }

  // DEFAULT: Blacklane's Iconic Vertical Stacked Booking Card
  return (
    <div
      id="booking-widget"
      className="w-full max-w-[455px] rounded-2xl bg-card border border-line/15 shadow-luxury overflow-visible"
    >
      {/* Blacklane Full-Width 2-Tab Top Header ("One way" | "By the hour") */}
      <div className="grid grid-cols-2 border-b border-line/12 rounded-t-2xl overflow-hidden bg-surface/70">
        <button
          type="button"
          onClick={() => updateDraft({ rideType: "oneway" })}
          className={`relative py-3.5 text-sm font-semibold transition-colors ${
            draft.rideType === "oneway"
              ? "bg-card text-ink"
              : "text-muted hover:text-ink"
          }`}
        >
          One way
          {draft.rideType === "oneway" && (
            <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gold-gradient" />
          )}
        </button>

        <button
          type="button"
          onClick={() => updateDraft({ rideType: "hourly" })}
          className={`relative py-3.5 text-sm font-semibold transition-colors ${
            draft.rideType === "hourly"
              ? "bg-card text-ink"
              : "text-muted hover:text-ink"
          }`}
        >
          By the hour
          {draft.rideType === "hourly" && (
            <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gold-gradient" />
          )}
        </button>
      </div>

      {/* Stacked Form Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5">
        {/* Saved Places Pills (when logged in) */}
        {user?.savedPlaces && user.savedPlaces.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            <span className="text-[10px] uppercase tracking-wider text-subtle font-semibold inline-flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-accent" /> Saved:
            </span>
            {user.savedPlaces.map((pl) => (
              <button
                key={pl.id}
                type="button"
                onClick={() =>
                  updateDraft({ pickup: pl.address, pickupCoords: pl.coords })
                }
                className="px-2.5 py-0.5 rounded-full bg-field hover:border-champagne-500/40 border border-line/12 text-[11px] font-medium text-ink transition-colors"
              >
                {pl.label}
              </button>
            ))}
          </div>
        )}

        {/* FROM & TO Stacked Boxes with Blacklane Swap Button */}
        <div className="relative space-y-2.5">
          <CanadianAddressInput
            label="From"
            value={draft.pickup}
            onChange={(val, coords) =>
              updateDraft({
                pickup: val,
                pickupCoords: coords || null,
              })
            }
            placeholder="Address, airport, hotel, ..."
            compact
          />

          {draft.rideType === "oneway" && (
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap pickup and drop-off"
              className="absolute right-3.5 top-[50px] z-20 w-7 h-7 rounded-full bg-card border border-line/20 hover:border-accent shadow-sm flex items-center justify-center text-muted hover:text-accent transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          )}

          {draft.rideType === "oneway" ? (
            <CanadianAddressInput
              label="To"
              value={draft.dropoff}
              onChange={(val, coords) =>
                updateDraft({
                  dropoff: val,
                  dropoffCoords: coords || null,
                })
              }
              placeholder="Address, airport, hotel, ..."
              compact
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-2xl bg-field border border-line/15 focus-within:border-champagne-500 transition-colors">
              <label className="block text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold mb-0.5">
                Duration
              </label>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <select
                  value={draft.durationHours}
                  onChange={(e) =>
                    updateDraft({ durationHours: Number(e.target.value) })
                  }
                  className="w-full bg-transparent text-sm text-ink font-medium focus:outline-none cursor-pointer"
                >
                  {[2, 3, 4, 5, 6, 8, 10, 12, 16, 24].map((hrs) => (
                    <option key={hrs} value={hrs} className="bg-card text-ink">
                      {hrs} hours ({hrs * 40} km included)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Intermediate Stops (if added) */}
        {extraStops.length > 0 && (
          <div className="space-y-2">
            {extraStops.map((stopVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <CanadianAddressInput
                    label={`Stop ${idx + 1} (+CA$25)`}
                    value={stopVal}
                    onChange={(val) => updateStop(idx, val)}
                    placeholder="Intermediate Canadian address..."
                    compact
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStop(idx)}
                  className="p-2.5 rounded-xl bg-field border border-line/15 text-muted hover:text-rose-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* DATE & PICKUP TIME Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="px-3.5 py-2.5 rounded-2xl bg-field border border-line/15 focus-within:border-champagne-500 transition-colors">
            <label className="block text-[10px] uppercase tracking-[0.16em] text-subtle font-semibold mb-0.5">
              Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
              <input
                type="date"
                value={draft.date}
                onChange={(e) => updateDraft({ date: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-2xl bg-field border border-line/15 focus-within:border-champagne-500 transition-colors">
            <label className="block text-[10px] uppercase tracking-[0.16em] text-subtle font-semibold mb-0.5">
              Pickup time
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
              <input
                type="time"
                value={draft.time}
                onChange={(e) => updateDraft({ time: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-ink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sleek Optional Trip Controls (+ Stop, Round-Trip, Pax/Bags) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addStop}
              className="text-muted hover:text-ink font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3 text-accent" /> Add stop
            </button>
            {draft.rideType === "oneway" && (
              <>
                <span className="text-line/20">•</span>
                <button
                  type="button"
                  onClick={() => {
                    updateDraft({ roundTrip: !draft.roundTrip });
                    setShowOptions(true);
                  }}
                  className={`font-medium inline-flex items-center gap-1 transition-colors ${
                    draft.roundTrip
                      ? "text-accent font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Repeat className="w-3 h-3 text-accent" /> Round-trip (-10%)
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted font-medium">
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <Users className="w-3 h-3 text-accent" />
              <select
                value={draft.passengersCount}
                onChange={(e) =>
                  updateDraft({ passengersCount: Number(e.target.value) })
                }
                className="bg-transparent focus:outline-none cursor-pointer text-ink"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n} className="bg-card text-ink">
                    {n} pax
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <Briefcase className="w-3 h-3 text-accent" />
              <select
                value={draft.luggageCount}
                onChange={(e) =>
                  updateDraft({ luggageCount: Number(e.target.value) })
                }
                className="bg-transparent focus:outline-none cursor-pointer text-ink"
              >
                {[0, 1, 2, 3, 4, 5, 6, 8].map((n) => (
                  <option key={n} value={n} className="bg-card text-ink">
                    {n} bags
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Round-trip return date/time if toggled */}
        {draft.roundTrip && draft.rideType === "oneway" && showOptions && (
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-champagne-500/10 border border-champagne-500/30">
            <div>
              <label className="block text-[10px] text-accent font-semibold mb-0.5">
                Return date
              </label>
              <input
                type="date"
                value={draft.returnDate}
                onChange={(e) => updateDraft({ returnDate: e.target.value })}
                className="w-full bg-transparent text-xs text-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-accent font-semibold mb-0.5">
                Return time
              </label>
              <input
                type="time"
                value={draft.returnTime}
                onChange={(e) => updateDraft({ returnTime: e.target.value })}
                className="w-full bg-transparent text-xs text-ink focus:outline-none"
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

        {/* Blacklane's Exact Wait-Time Reassurance Note */}
        <div className="flex items-start gap-2 pt-1 text-xs text-muted">
          <Info className="w-4 h-4 text-subtle shrink-0 mt-0.5" />
          <span>
            Chauffeur will wait 15 minutes free of charge (60 minutes at
            Canadian airports).
          </span>
        </div>

        {/* Full-Width Blacklane CTA Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-sm tracking-wide shadow-gold-glow hover:brightness-105 transition-all flex items-center justify-center gap-2"
        >
          <span>Search</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-obsidian-950/12">
            from {formatPrice(estimatedFare)}
          </span>
        </button>
      </form>
    </div>
  );
}
