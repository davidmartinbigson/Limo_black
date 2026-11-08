"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import CanadianAddressInput from "@/components/CanadianAddressInput";

interface BookingWidgetProps {
  compact?: boolean;
  defaultTab?: "oneway" | "hourly";
  onSearchComplete?: () => void;
}

export default function BookingWidget({
  defaultTab,
  onSearchComplete,
}: BookingWidgetProps) {
  const router = useRouter();
  const { draft, updateDraft } = useBooking();
  const [error, setError] = useState("");

  useEffect(() => {
    if (defaultTab && draft.rideType !== defaultTab) {
      updateDraft({ rideType: defaultTab });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTab]);

  const handleSwap = () => {
    updateDraft({
      pickup: draft.dropoff,
      dropoff: draft.pickup,
      pickupCoords: draft.dropoffCoords,
      dropoffCoords: draft.pickupCoords,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.pickup.trim()) {
      setError("Please enter a pickup location.");
      return;
    }
    if (draft.rideType === "oneway" && !draft.dropoff.trim()) {
      setError("Please enter a destination.");
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
    <div id="booking-widget" className="w-full">
      {/* Top-Left Folder Tab Lip ("One way" | "By the hour") Matching Reference */}
      <div className="inline-flex items-center gap-2 px-3 pt-2.5 pb-2 rounded-t-2xl bg-[#141518] border-t border-x border-[#C9A55C]/30 relative z-10 -mb-[1px]">
        <button
          type="button"
          onClick={() => updateDraft({ rideType: "oneway" })}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            draft.rideType === "oneway"
              ? "bg-gradient-to-r from-[#E2C275] to-[#B88F3B] text-[#0B0B0D] shadow-md"
              : "bg-[#1E1F24] border border-white/15 text-white/85 hover:text-white"
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>One way</span>
        </button>

        <button
          type="button"
          onClick={() => updateDraft({ rideType: "hourly" })}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            draft.rideType === "hourly"
              ? "bg-gradient-to-r from-[#E2C275] to-[#B88F3B] text-[#0B0B0D] shadow-md"
              : "bg-[#1E1F24] border border-white/15 text-white/85 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>By the hour</span>
        </button>
      </div>

      {/* Main Horizontal Dark Booking Container Matching Reference */}
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl rounded-tl-none bg-[#141518]/98 backdrop-blur-xl border border-[#C9A55C]/30 p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          {/* From */}
          <div className="flex-1 min-w-0">
            <CanadianAddressInput
              darkSurface
              label="From"
              value={draft.pickup}
              onChange={(val, coords) =>
                updateDraft({
                  pickup: val,
                  pickupCoords: coords || null,
                })
              }
              placeholder="Pickup location"
            />
          </div>

          {/* Swap Button */}
          {draft.rideType === "oneway" && (
            <div className="flex justify-center lg:pb-2.5">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap pickup and destination"
                className="p-2 rounded-lg text-white/60 hover:text-[#DFBE6F] hover:bg-white/5 transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* To or Duration */}
          <div className="flex-1 min-w-0">
            {draft.rideType === "oneway" ? (
              <CanadianAddressInput
                darkSurface
                label="To"
                value={draft.dropoff}
                onChange={(val, coords) =>
                  updateDraft({
                    dropoff: val,
                    dropoffCoords: coords || null,
                  })
                }
                placeholder="Destination"
              />
            ) : (
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1.5">
                  Duration
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#D4AF61] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={draft.durationHours}
                    onChange={(e) =>
                      updateDraft({ durationHours: Number(e.target.value) })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1E1F24] border border-white/12 focus:border-[#D4AF61] text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 8, 10, 12, 16, 24].map((hrs) => (
                      <option
                        key={hrs}
                        value={hrs}
                        className="bg-[#141518] text-white"
                      >
                        {hrs} hours ({hrs * 40} km inc.)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="w-full lg:w-[175px] shrink-0">
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              Date
            </label>
            <div className="relative flex items-center rounded-xl bg-[#1E1F24] border border-white/12 focus-within:border-[#D4AF61] px-3.5 py-3">
              <Calendar className="w-4 h-4 text-[#D4AF61] shrink-0 mr-2" />
              <input
                type="date"
                value={draft.date}
                onChange={(e) => updateDraft({ date: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Time */}
          <div className="w-full lg:w-[155px] shrink-0">
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              Time
            </label>
            <div className="relative flex items-center rounded-xl bg-[#1E1F24] border border-white/12 focus-within:border-[#D4AF61] px-3.5 py-3">
              <Clock className="w-4 h-4 text-[#D4AF61] shrink-0 mr-2" />
              <input
                type="time"
                value={draft.time}
                onChange={(e) => updateDraft({ time: e.target.value })}
                className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Search rides CTA */}
          <div className="w-full lg:w-auto shrink-0">
            <button
              type="submit"
              className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#E2C275] via-[#D4AF61] to-[#B88F3B] text-[#0B0B0D] font-bold text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
            >
              <span>Search rides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium mt-3">{error}</p>
        )}
      </form>
    </div>
  );
}
