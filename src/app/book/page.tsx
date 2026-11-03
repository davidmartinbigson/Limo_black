"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Leaf,
  Lock,
  Luggage,
  MapPin,
  Plane,
  Printer,
  ShieldCheck,
  Sparkles,
  Tag,
  Thermometer,
  Users,
  VolumeX,
  Wine,
} from "lucide-react";
import {
  calculateClassPriceUsd,
  estimateRouteMetrics,
  FLEET_CLASSES,
  FleetClassId,
} from "@/data/limoData";
import {
  CabinPreferences,
  ConfirmedBooking as ConfirmedBookingType,
  useBooking,
} from "@/context/BookingContext";

// Re-check import: ConfirmedBooking is in BookingContext, let's use ConfirmedBookingType cleanly!
const STEPS = [
  { num: 1, label: "Service Class" },
  { num: 2, label: "Pickup & Cabin" },
  { num: 3, label: "Guest & Payment" },
  { num: 4, label: "Confirmation" },
];

export default function BookPage() {
  const {
    draft,
    updateDraft,
    updateCabin,
    formatPrice,
    confirmCurrentBooking,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [editingRoute, setEditingRoute] = useState(false);

  // Payment fields for Step 3
  const [payMethod, setPayMethod] = useState<"card" | "invoice" | "express">(
    "card"
  );
  const [cardHolder, setCardHolder] = useState(
    `${draft.firstName} ${draft.lastName}`.trim() || "ALEXANDER STERLING"
  );
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8840");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCvc, setCardCvc] = useState("842");
  const [promoInput, setPromoInput] = useState(draft.promoCode || "");
  const [promoApplied, setPromoApplied] = useState(
    draft.promoCode.toUpperCase() === "LIMOBLACK15" ||
      draft.promoCode.toUpperCase() === "VIP15"
  );
  const [promoFeedback, setPromoFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedRide, setConfirmedRide] =
    useState<ConfirmedBookingType | null>(null);

  const metrics = useMemo(
    () => estimateRouteMetrics(draft.pickup, draft.dropoff),
    [draft.pickup, draft.dropoff]
  );

  const selectedFleet = useMemo(
    () =>
      FLEET_CLASSES.find((f) => f.id === draft.selectedClassId) ||
      FLEET_CLASSES[0],
    [draft.selectedClassId]
  );

  const subtotalUsd = useMemo(
    () =>
      calculateClassPriceUsd(
        selectedFleet,
        draft.rideType,
        metrics.distanceKm,
        draft.durationHours
      ),
    [selectedFleet, draft.rideType, metrics.distanceKm, draft.durationHours]
  );

  const discountUsd = promoApplied ? Math.round(subtotalUsd * 0.15) : 0;
  const finalTotalUsd = subtotalUsd - discountUsd;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "LIMOBLACK15" || code === "VIP15" || code === "FIRSTCLASS") {
      setPromoApplied(true);
      updateDraft({ promoCode: code });
      setPromoFeedback("15% Obsidian Privilege applied to your reservation.");
    } else {
      setPromoApplied(false);
      setPromoFeedback("Try privilege code LIMOBLACK15 for 15% off.");
    }
  };

  const handleSelectClass = (id: FleetClassId) => {
    updateDraft({ selectedClassId: id });
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const created = confirmCurrentBooking(
        finalTotalUsd,
        metrics.distanceKm,
        metrics.durationMin
      );
      setConfirmedRide(created);
      setIsProcessing(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 850);
  };

  const handleBookReturn = () => {
    if (!confirmedRide) return;
    updateDraft({
      rideType: "oneway",
      pickup: confirmedRide.dropoff,
      dropoff: confirmedRide.pickup,
    });
    setConfirmedRide(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((s, idx) => {
              const active = step === s.num;
              const done = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <button
                    type="button"
                    disabled={s.num > step || step === 4}
                    onClick={() => {
                      if (s.num < step && step !== 4) {
                        setStep(s.num as 1 | 2 | 3);
                      }
                    }}
                    className="flex items-center gap-2.5 group disabled:cursor-default"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        done
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : active
                          ? "bg-gold-gradient text-obsidian-950 shadow-gold-glow"
                          : "bg-white/[0.05] text-white/45 border border-white/10"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`hidden sm:inline text-xs uppercase tracking-[0.16em] font-semibold ${
                        active
                          ? "text-champagne-300"
                          : done
                          ? "text-ivory-100"
                          : "text-white/40"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[1px] mx-3 ${
                        step > s.num ? "bg-champagne-400/60" : "bg-white/10"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Route Summary & Quick Edit Bar (Steps 1-3) */}
        {step < 4 && (
          <div className="rounded-3xl bg-obsidian-900/90 border border-white/12 p-5 sm:p-6 mb-8 shadow-luxury">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold bg-champagne-500/15 text-champagne-300 border border-champagne-400/30">
                  {draft.rideType === "oneway"
                    ? "One-Way Transfer"
                    : `${draft.durationHours}h Chauffeur Standby`}
                </span>
                <div className="flex items-center gap-2 text-sm text-ivory-50 font-medium">
                  <MapPin className="w-4 h-4 text-champagne-400 shrink-0" />
                  <span>{draft.pickup}</span>
                  {draft.rideType === "oneway" && (
                    <>
                      <ArrowRight className="w-4 h-4 text-champagne-400 shrink-0" />
                      <span>{draft.dropoff}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/65">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-champagne-400" />
                  {draft.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-champagne-400" />
                  {draft.time}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingRoute((v) => !v)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-champagne-300 font-semibold transition-colors"
                >
                  {editingRoute ? "Done Editing" : "Modify Route"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingRoute && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 mt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">
                        Journey Type
                      </label>
                      <select
                        value={draft.rideType}
                        onChange={(e) =>
                          updateDraft({
                            rideType: e.target.value as "oneway" | "hourly",
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50"
                      >
                        <option value="oneway">One Way</option>
                        <option value="hourly">By the Hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        value={draft.pickup}
                        onChange={(e) =>
                          updateDraft({ pickup: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50"
                      />
                    </div>
                    {draft.rideType === "oneway" ? (
                      <div>
                        <label className="block text-[11px] text-white/50 mb-1">
                          Drop-off Location
                        </label>
                        <input
                          type="text"
                          value={draft.dropoff}
                          onChange={(e) =>
                            updateDraft({ dropoff: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] text-white/50 mb-1">
                          Hours (2–24h)
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={24}
                          value={draft.durationHours}
                          onChange={(e) =>
                            updateDraft({
                              durationHours: Math.max(
                                2,
                                Math.min(24, Number(e.target.value))
                              ),
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(e) => updateDraft({ date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50 [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={draft.time}
                        onChange={(e) => updateDraft({ time: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* STEP 1: SERVICE CLASS SELECTION */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="mb-2">
                <h1 className="font-serif text-3xl sm:text-4xl text-ivory-50">
                  Select Your Service Class
                </h1>
                <p className="text-sm text-white/60 mt-1">
                  All fares include taxes, tolls, gratuity, and{" "}
                  {metrics.isAirport
                    ? "60 minutes of complimentary airport wait time."
                    : "15 minutes of complimentary wait time."}
                </p>
              </div>

              {FLEET_CLASSES.map((fleet) => {
                const isSelected = draft.selectedClassId === fleet.id;
                const priceUsd = calculateClassPriceUsd(
                  fleet,
                  draft.rideType,
                  metrics.distanceKm,
                  draft.durationHours
                );

                return (
                  <motion.div
                    key={fleet.id}
                    whileHover={{ y: -2 }}
                    onClick={() => handleSelectClass(fleet.id)}
                    className={`cursor-pointer rounded-3xl p-5 sm:p-6 border transition-all duration-300 ${
                      isSelected
                        ? "bg-obsidian-900 border-champagne-400 shadow-gold-glow"
                        : "bg-obsidian-900/65 border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      {/* Vehicle Photo */}
                      <div className="sm:col-span-4 relative aspect-[16/10] rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10">
                        <img
                          src={fleet.image}
                          alt={fleet.name}
                          className="w-full h-full object-cover"
                        />
                        {fleet.flagship && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gold-gradient text-obsidian-950">
                            Flagship Limo
                          </span>
                        )}
                        {fleet.zeroEmission && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> Electric
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="sm:col-span-5 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-2xl text-ivory-50">
                            {fleet.name}
                          </h3>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-champagne-400" />
                          )}
                        </div>
                        <p className="text-xs text-champagne-300/90">
                          {fleet.vehicles}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/65 pt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-champagne-400" />
                            Max {fleet.maxPassengers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Luggage className="w-3.5 h-3.5 text-champagne-400" />
                            {fleet.maxCheckIn} bags
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-champagne-400" />
                            {fleet.maxCarryOn} cabin
                          </span>
                        </div>

                        <p className="text-[11px] text-white/50 line-clamp-2">
                          {fleet.highlights[0]} · {fleet.highlights[1]}
                        </p>
                      </div>

                      {/* Price & Select */}
                      <div className="sm:col-span-3 sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-white/45">
                            All-Inclusive Total
                          </div>
                          <div className="font-serif text-3xl text-ivory-50 font-semibold">
                            {formatPrice(priceUsd)}
                          </div>
                          <div className="text-[11px] text-emerald-300">
                            Includes taxes & tip
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectClass(fleet.id);
                            setStep(2);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            isSelected
                              ? "bg-gold-gradient text-obsidian-950 shadow-gold-glow"
                              : "bg-white/[0.08] hover:bg-white/[0.15] text-ivory-50"
                          }`}
                        >
                          Select Class
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Sidebar: Visual Route Telemetry & Guarantees */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 shadow-luxury sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-champagne-400 font-semibold">
                    Journey Telemetry
                  </span>
                  <span className="text-xs text-white/50">
                    {draft.rideType === "oneway"
                      ? `~${metrics.distanceKm} km · ${metrics.durationMin} min`
                      : `${draft.durationHours * 40} km allowance`}
                  </span>
                </div>

                {/* Animated SVG Trajectory Map */}
                <div className="rounded-2xl bg-obsidian-950 border border-white/10 p-4 mb-5">
                  <svg viewBox="0 0 320 120" className="w-full h-28" fill="none">
                    <path
                      d="M0 30 H320 M0 60 H320 M0 90 H320 M80 0 V120 M160 0 V120 M240 0 V120"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <motion.path
                      d="M 30 92 Q 150 18, 290 34"
                      stroke="#D6B982"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2 }}
                    />
                    <circle cx="30" cy="92" r="5" fill="#C6A364" />
                    <circle cx="290" cy="34" r="6" fill="#FAF8F5" />
                  </svg>
                  <div className="flex items-center justify-between text-[11px] text-white/65 mt-2">
                    <span className="truncate max-w-[45%]">{draft.pickup}</span>
                    <span className="text-champagne-400">→</span>
                    <span className="truncate max-w-[45%] text-right">
                      {draft.rideType === "oneway"
                        ? draft.dropoff
                        : `${draft.durationHours}h Standby`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pb-5 border-b border-white/10 text-xs text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Selected Class</span>
                    <span className="font-semibold text-ivory-50">
                      {selectedFleet.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Chauffeur Gratuity & Taxes</span>
                    <span className="text-emerald-300">Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Free Cancellation</span>
                    <span className="text-ivory-50">Until 1h prior</span>
                  </div>
                </div>

                <div className="py-4 flex items-end justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/50">
                    Guaranteed Fare
                  </span>
                  <span className="font-serif text-3xl text-champagne-300 font-semibold">
                    {formatPrice(subtotalUsd)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  Continue to Pickup & Cabin
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PICKUP DETAILS & BESPOKE CABIN PREFERENCES */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-3xl text-ivory-50">
                      Pickup Protocol & Flight Telemetry
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60 mt-1">
                      Personalize how your chauffeur greets you upon arrival.
                    </p>
                  </div>
                </div>

                {/* Booking For Toggle */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-obsidian-950 border border-white/10 max-w-md">
                  <button
                    type="button"
                    onClick={() => updateDraft({ bookingFor: "myself" })}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      draft.bookingFor === "myself"
                        ? "bg-champagne-500 text-obsidian-950"
                        : "text-white/65 hover:text-white"
                    }`}
                  >
                    Booking for Myself
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDraft({ bookingFor: "guest" })}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      draft.bookingFor === "guest"
                        ? "bg-champagne-500 text-obsidian-950"
                        : "text-white/65 hover:text-white"
                    }`}
                  >
                    Booking for VIP Guest
                  </button>
                </div>

                {/* Flight Number & Pickup Sign */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Flight Number or Private Tail Code (Optional)
                    </label>
                    <div className="relative">
                      <Plane className="w-4 h-4 text-champagne-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={draft.flightNumber}
                        onChange={(e) =>
                          updateDraft({ flightNumber: e.target.value })
                        }
                        placeholder="e.g. BA 117, EK 201, N650GS"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50 focus:outline-none focus:border-champagne-400"
                      />
                    </div>
                    {draft.flightNumber.trim() && (
                      <p className="text-[11px] text-emerald-300 mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live satellite tracking active for{" "}
                        {draft.flightNumber.toUpperCase()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Meet & Greet Digital Nameboard Sign
                    </label>
                    <input
                      type="text"
                      value={draft.pickupSign}
                      onChange={(e) =>
                        updateDraft({ pickupSign: e.target.value })
                      }
                      placeholder="Name or company on chauffeur tablet"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50 focus:outline-none focus:border-champagne-400"
                    />
                  </div>
                </div>

                {/* Live Illuminated Digital Tablet Preview */}
                <div className="rounded-2xl bg-gradient-to-br from-zinc-800 via-obsidian-950 to-black p-[2px] border border-champagne-400/30">
                  <div className="rounded-[14px] bg-obsidian-950 px-6 py-5 text-center relative overflow-hidden">
                    <div className="text-[9px] uppercase tracking-[0.35em] text-champagne-400 mb-1.5">
                      LIMO BLACK · ARRIVALS MEET & GREET TABLET PREVIEW
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl tracking-[0.14em] text-ivory-50 uppercase">
                      {draft.pickupSign.trim() || "EXECUTIVE GUEST"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cabin Staging Preferences ("You Set the Tone") */}
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                    Complimentary Bespoke Staging
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 mt-1">
                    You Set the Cabin Tone
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Temperature */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-white/65 mb-2">
                      <Thermometer className="w-3.5 h-3.5 text-champagne-400" />
                      Cabin Climate
                    </label>
                    <select
                      value={draft.cabin.temperature}
                      onChange={(e) =>
                        updateCabin({
                          temperature: e.target
                            .value as CabinPreferences["temperature"],
                        })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-xs sm:text-sm text-ivory-50 focus:outline-none focus:border-champagne-400"
                    >
                      <option value="19°C Cool">19°C Crisp & Cool</option>
                      <option value="21°C Balanced">21°C Balanced</option>
                      <option value="23°C Warm">23°C Warm Sanctuary</option>
                    </select>
                  </div>

                  {/* Conversation */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-white/65 mb-2">
                      <VolumeX className="w-3.5 h-3.5 text-champagne-400" />
                      Chauffeur Etiquette
                    </label>
                    <select
                      value={draft.cabin.conversation}
                      onChange={(e) =>
                        updateCabin({
                          conversation: e.target
                            .value as CabinPreferences["conversation"],
                        })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-xs sm:text-sm text-ivory-50 focus:outline-none focus:border-champagne-400"
                    >
                      <option value="Discreet Silence">
                        Discreet Quiet Ride
                      </option>
                      <option value="Warm & Conversational">
                        Local City Insights
                      </option>
                    </select>
                  </div>

                  {/* Refreshment */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-white/65 mb-2">
                      <Wine className="w-3.5 h-3.5 text-champagne-400" />
                      Door Refreshment
                    </label>
                    <select
                      value={draft.cabin.refreshment}
                      onChange={(e) =>
                        updateCabin({
                          refreshment: e.target
                            .value as CabinPreferences["refreshment"],
                        })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-xs sm:text-sm text-ivory-50 focus:outline-none focus:border-champagne-400"
                    >
                      <option value="Still Artisan Water">
                        Still Artisan Water
                      </option>
                      <option value="Sparkling Perrier">
                        Chilled Sparkling Perrier
                      </option>
                      <option value="Chilled Espresso">
                        Chilled Espresso Tonic
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Complimentary Child Seat
                    </label>
                    <select
                      value={draft.cabin.childSeat}
                      onChange={(e) =>
                        updateCabin({
                          childSeat: e.target
                            .value as CabinPreferences["childSeat"],
                        })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-xs sm:text-sm text-ivory-50"
                    >
                      <option value="None">No Child Seat Needed</option>
                      <option value="Infant Carrier">
                        Infant Carrier (0–12m)
                      </option>
                      <option value="Toddler Seat">Toddler Seat (1–4y)</option>
                      <option value="Booster Seat">Booster Seat (4–10y)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Special Notes for Chauffeur
                    </label>
                    <input
                      type="text"
                      value={draft.cabin.notes}
                      onChange={(e) => updateCabin({ notes: e.target.value })}
                      placeholder="Gate code, extra ski bags, security instructions..."
                      className="w-full px-3.5 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-xs sm:text-sm text-ivory-50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-ivory-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Fleet
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em] shadow-gold-glow hover:brightness-110 transition-all"
                  >
                    Continue to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 shadow-luxury sticky top-28 space-y-4">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={selectedFleet.image}
                    alt={selectedFleet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-champagne-400 font-semibold">
                    {selectedFleet.badge}
                  </span>
                  <h3 className="font-serif text-2xl text-ivory-50">
                    {selectedFleet.name}
                  </h3>
                  <p className="text-xs text-white/55">{selectedFleet.vehicles}</p>
                </div>
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>Cabin Climate</span>
                    <span className="text-champagne-300">
                      {draft.cabin.temperature}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refreshment</span>
                    <span className="text-champagne-300">
                      {draft.cabin.refreshment}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-end justify-between">
                  <span className="text-xs text-white/50">Total Fare</span>
                  <span className="font-serif text-3xl text-champagne-300 font-semibold">
                    {formatPrice(finalTotalUsd)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: GUEST DETAILS & LUXURY CHECKOUT */}
        {step === 3 && (
          <form
            onSubmit={handleCompleteBooking}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8 space-y-6">
              {/* Passenger Details */}
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-3xl text-ivory-50">
                  {draft.bookingFor === "myself"
                    ? "Your Contact Details"
                    : "VIP Passenger Contact Details"}
                </h2>
                <p className="text-xs text-white/55">
                  Chauffeur name, mobile number, and registration plate will be
                  sent via SMS & email 60 minutes prior to pickup.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-white/65 mb-1.5">
                      Honorific
                    </label>
                    <select
                      value={draft.guestTitle}
                      onChange={(e) =>
                        updateDraft({ guestTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Lord">Lord</option>
                      <option value="Amb.">Amb.</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs text-white/65 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.firstName}
                      onChange={(e) =>
                        updateDraft({ firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-white/65 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.lastName}
                      onChange={(e) =>
                        updateDraft({ lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Email for Itinerary & VAT Receipt
                    </label>
                    <input
                      type="email"
                      required
                      value={draft.email}
                      onChange={(e) => updateDraft({ email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Mobile Number (For SMS Dispatch Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      value={draft.phone}
                      onChange={(e) => updateDraft({ phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl text-ivory-50">
                    Guaranteed Reservation Payment
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                    <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "card", label: "Executive Card" },
                    { id: "invoice", label: "Corporate Invoice" },
                    { id: "express", label: "VIP Express Pay" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setPayMethod(m.id as "card" | "invoice" | "express")
                      }
                      className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        payMethod === m.id
                          ? "bg-champagne-500/20 border-champagne-400 text-champagne-300"
                          : "bg-obsidian-950 border-white/10 text-white/65 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Obsidian Metal Card Preview */}
                    <div className="md:col-span-5">
                      <div className="aspect-[1.58/1] rounded-2xl p-5 bg-gradient-to-br from-zinc-800 via-obsidian-950 to-black border border-champagne-400/35 shadow-luxury flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-champagne-500/15 blur-2xl" />
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm tracking-[0.22em] text-champagne-300">
                            LIMO BLACK
                          </span>
                          <Crown className="w-4 h-4 text-champagne-400" />
                        </div>
                        <div className="text-sm tracking-[0.18em] text-ivory-50 font-mono">
                          {cardNumber || "4532 •••• •••• 8840"}
                        </div>
                        <div className="flex items-end justify-between text-[10px] uppercase tracking-wider text-white/60">
                          <div>
                            <div className="text-[8px] text-white/40">
                              Cardholder
                            </div>
                            <div className="text-ivory-50 font-medium truncate max-w-[140px]">
                              {cardHolder}
                            </div>
                          </div>
                          <div>
                            <div className="text-[8px] text-white/40">
                              Expires
                            </div>
                            <div className="text-ivory-50 font-medium">
                              {cardExpiry}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-3.5">
                      <div>
                        <label className="block text-xs text-white/65 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/65 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 text-champagne-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-white/65 mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-white/65 mb-1">
                            Security Code
                          </label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === "invoice" && (
                  <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10 text-xs text-white/70 space-y-2">
                    <p className="text-ivory-50 font-semibold">
                      Consolidated 30-Day Corporate Billing Enabled
                    </p>
                    <p>
                      This reservation will be billed to your executive cost
                      center with automated VAT breakdown and carbon-offset
                      certificate.
                    </p>
                  </div>
                )}

                {payMethod === "express" && (
                  <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10 text-xs text-white/70">
                    One-tap biometric authorization ready. Your card is only
                    charged once your ride is completed; free cancellation
                    applies up until 1 hour prior to pickup.
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-ivory-50"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 disabled:opacity-60 transition-all"
                  >
                    {isProcessing
                      ? "Dispatching Chauffeur..."
                      : `Confirm Limousine · ${formatPrice(finalTotalUsd)}`}
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 Fare Breakdown & Promo Sidebar */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-obsidian-900 border border-white/12 p-6 shadow-luxury sticky top-28 space-y-5">
                <h3 className="font-serif text-2xl text-ivory-50">
                  Reservation Summary
                </h3>

                <div className="space-y-2.5 text-xs text-white/70 pb-4 border-b border-white/10">
                  <div className="flex justify-between">
                    <span>Service Class</span>
                    <span className="text-ivory-50 font-semibold">
                      {selectedFleet.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base & Distance All-Inclusive</span>
                    <span>{formatPrice(subtotalUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes, Tolls & Chauffeur Tip</span>
                    <span className="text-emerald-300">Included</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-champagne-300 font-semibold">
                      <span>Privilege Code (15% Off)</span>
                      <span>-{formatPrice(discountUsd)}</span>
                    </div>
                  )}
                </div>

                {/* Promo Input */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-champagne-400" />
                    Privilege Code (Try LIMOBLACK15)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="LIMOBLACK15"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/15 text-xs text-ivory-50 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-champagne-300"
                    >
                      Apply
                    </button>
                  </div>
                  {promoFeedback && (
                    <p className="text-[11px] text-champagne-300 mt-1.5">
                      {promoFeedback}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/45">
                      Final Guaranteed Total
                    </div>
                    <div className="text-[11px] text-emerald-300 mt-0.5">
                      Zero hidden fees
                    </div>
                  </div>
                  <div className="font-serif text-4xl text-champagne-300 font-semibold">
                    {formatPrice(finalTotalUsd)}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-obsidian-950 border border-white/10 flex items-start gap-2.5 text-[11px] text-white/60">
                  <ShieldCheck className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                  <span>
                    Cancel or modify free of charge up until 1 hour before your
                    scheduled pickup.
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* STEP 4: INSTANT CONFIRMATION & CHAUFFEUR ASSIGNMENT */}
        {step === 4 && confirmedRide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto rounded-3xl bg-obsidian-900 border border-champagne-400/40 p-7 sm:p-12 shadow-luxury space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.24em] text-champagne-400 font-semibold">
                    Reservation Confirmed · {confirmedRide.reference}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl text-ivory-50 mt-1">
                    Your Chauffeur Has Been Assigned.
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-ivory-50"
              >
                <Printer className="w-4 h-4 text-champagne-400" />
                Print Itinerary
              </button>
            </div>

            {/* Chauffeur & Vehicle Dispatch Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-obsidian-950 border border-white/10 space-y-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-champagne-400 font-semibold">
                  Assigned Senior Chauffeur
                </div>
                <div className="font-serif text-2xl text-ivory-50">
                  {confirmedRide.chauffeur.name} ·{" "}
                  <span className="text-champagne-300">
                    {confirmedRide.chauffeur.rating} ★
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  Vehicle: {confirmedRide.chauffeur.vehicleModel} · Plate{" "}
                  <span className="text-ivory-50 font-mono font-semibold">
                    {confirmedRide.chauffeur.plate}
                  </span>
                </p>
                <p className="text-xs text-white/60">
                  Direct Concierge Line: {confirmedRide.chauffeur.phone} ·
                  Languages: {confirmedRide.chauffeur.languages}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-obsidian-950 border border-white/10 space-y-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-champagne-400 font-semibold">
                  Itinerary & Cabin Staging
                </div>
                <div className="text-sm text-ivory-50 font-medium">
                  {confirmedRide.pickup} → {confirmedRide.dropoff}
                </div>
                <div className="text-xs text-white/60">
                  {confirmedRide.date} at {confirmedRide.time} · Tablet Sign:{" "}
                  <span className="text-champagne-300">
                    {confirmedRide.pickupSign}
                  </span>
                </div>
                <div className="text-xs text-white/60">
                  Staging: {confirmedRide.cabin.temperature} ·{" "}
                  {confirmedRide.cabin.conversation} ·{" "}
                  {confirmedRide.cabin.refreshment}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-champagne-500/10 border border-champagne-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-champagne-300 font-semibold">
                  All-Inclusive Guaranteed Fare
                </div>
                <div className="text-xs text-white/65 mt-0.5">
                  Confirmation sent to {confirmedRide.email}
                </div>
              </div>
              <div className="font-serif text-3xl text-ivory-50 font-semibold">
                {formatPrice(confirmedRide.totalUsd)}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleBookReturn}
                className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold uppercase tracking-wider text-ivory-50 transition-colors"
              >
                Book Return Journey
              </button>

              <Link
                href="/bookings"
                className="px-7 py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center gap-2"
              >
                Open Live Chauffeur Tracker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
