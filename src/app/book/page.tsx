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
import CanadianAddressInput from "@/components/CanadianAddressInput";

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

  const [payMethod, setPayMethod] = useState<"card" | "invoice" | "express">(
    "card"
  );
  const [cardHolder, setCardHolder] = useState(
    `${draft.firstName} ${draft.lastName}`.trim() || "DAVID MACLEOD"
  );
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8840");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCvc, setCardCvc] = useState("842");
  const [promoInput, setPromoInput] = useState(draft.promoCode || "");
  const [promoApplied, setPromoApplied] = useState(
    draft.promoCode.toUpperCase() === "LIMOBLACK15" ||
      draft.promoCode.toUpperCase() === "CANADA15"
  );
  const [promoFeedback, setPromoFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedRide, setConfirmedRide] =
    useState<ConfirmedBookingType | null>(null);

  const metrics = useMemo(
    () =>
      estimateRouteMetrics(
        draft.pickup,
        draft.dropoff,
        draft.pickupCoords,
        draft.dropoffCoords
      ),
    [draft.pickup, draft.dropoff, draft.pickupCoords, draft.dropoffCoords]
  );

  const selectedFleet = useMemo(
    () =>
      FLEET_CLASSES.find((f) => f.id === draft.selectedClassId) ||
      FLEET_CLASSES[0],
    [draft.selectedClassId]
  );

  const subtotalCad = useMemo(
    () =>
      calculateClassPriceUsd(
        selectedFleet,
        draft.rideType,
        metrics.distanceKm,
        draft.durationHours
      ),
    [selectedFleet, draft.rideType, metrics.distanceKm, draft.durationHours]
  );

  const discountCad = promoApplied ? Math.round(subtotalCad * 0.15) : 0;
  const finalTotalCad = subtotalCad - discountCad;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (
      code === "LIMOBLACK15" ||
      code === "CANADA15" ||
      code === "FIRSTCLASS"
    ) {
      setPromoApplied(true);
      updateDraft({ promoCode: code });
      setPromoFeedback("15% Canadian VIP Privilege applied to your booking.");
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
        finalTotalCad,
        metrics.distanceKm,
        metrics.durationMin
      );
      setConfirmedRide(created);
      setIsProcessing(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  const handleBookReturn = () => {
    if (!confirmedRide) return;
    updateDraft({
      rideType: "oneway",
      pickup: confirmedRide.dropoff,
      dropoff: confirmedRide.pickup,
      pickupCoords: confirmedRide.dropoffCoords,
      dropoffCoords: confirmedRide.pickupCoords,
    });
    setConfirmedRide(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
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
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40"
                          : active
                          ? "bg-gold-gradient text-obsidian-950 shadow-gold-glow"
                          : "bg-card text-subtle border border-line/12"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`hidden sm:inline text-xs uppercase tracking-[0.14em] font-semibold ${
                        active
                          ? "text-accent"
                          : done
                          ? "text-ink"
                          : "text-subtle"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[1px] mx-3 ${
                        step > s.num ? "bg-champagne-500/60" : "bg-line/12"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Route Summary & Live Canadian Address Quick-Edit Bar */}
        {step < 4 && (
          <div className="rounded-3xl bg-card border border-line/12 p-5 sm:p-6 mb-8 shadow-luxury">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold bg-champagne-500/15 text-accent border border-champagne-500/30">
                  {draft.rideType === "oneway"
                    ? "One-Way Canada Transfer"
                    : `${draft.durationHours}h Chauffeur Standby`}
                </span>
                <div className="flex flex-wrap items-center gap-2 text-sm text-ink font-semibold">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <span>{draft.pickup}</span>
                  {draft.rideType === "oneway" && (
                    <>
                      <ArrowRight className="w-4 h-4 text-accent shrink-0" />
                      <span>{draft.dropoff}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  {draft.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  {draft.time}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingRoute((v) => !v)}
                  className="px-3.5 py-1.5 rounded-xl bg-field hover:bg-line/[0.08] border border-line/12 text-accent font-semibold transition-colors"
                >
                  {editingRoute ? "Done Editing" : "Change Canadian Address"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingRoute && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pt-5 mt-5 border-t border-line/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
                >
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5">
                      Type
                    </label>
                    <select
                      value={draft.rideType}
                      onChange={(e) =>
                        updateDraft({
                          rideType: e.target.value as "oneway" | "hourly",
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-2xl bg-field border border-line/15 text-xs text-ink"
                    >
                      <option value="oneway">One Way</option>
                      <option value="hourly">By the Hour</option>
                    </select>
                  </div>

                  <div className="lg:col-span-3">
                    <CanadianAddressInput
                      label="Pickup Address"
                      compact
                      value={draft.pickup}
                      onChange={(val, coords) =>
                        updateDraft({
                          pickup: val,
                          ...(coords !== undefined
                            ? { pickupCoords: coords }
                            : {}),
                        })
                      }
                    />
                  </div>

                  {draft.rideType === "oneway" ? (
                    <div className="lg:col-span-3">
                      <CanadianAddressInput
                        label="Drop-off Address"
                        compact
                        value={draft.dropoff}
                        onChange={(val, coords) =>
                          updateDraft({
                            dropoff: val,
                            ...(coords !== undefined
                              ? { dropoffCoords: coords }
                              : {}),
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="lg:col-span-3">
                      <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5">
                        Standby Hours (2–24h)
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
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-field border border-line/15 text-xs text-ink"
                      />
                    </div>
                  )}

                  <div className="lg:col-span-2">
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(e) => updateDraft({ date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-2xl bg-field border border-line/15 text-xs text-ink [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-1.5">
                      Time
                    </label>
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(e) => updateDraft({ time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-2xl bg-field border border-line/15 text-xs text-ink [color-scheme:light] dark:[color-scheme:dark]"
                    />
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
                <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold">
                  Select Your Canadian Service Class
                </h1>
                <p className="text-sm text-muted mt-1">
                  All fares include GST/HST, 407 ETR / highway tolls, chauffeur
                  gratuity, and{" "}
                  {metrics.isAirport
                    ? "60 minutes of complimentary airport arrival wait time."
                    : "15 minutes of complimentary wait time."}
                </p>
              </div>

              {FLEET_CLASSES.map((fleet) => {
                const isSelected = draft.selectedClassId === fleet.id;
                const priceCad = calculateClassPriceUsd(
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
                    className={`cursor-pointer rounded-3xl p-5 sm:p-6 border transition-all duration-300 shadow-luxury ${
                      isSelected
                        ? "bg-card border-champagne-500 shadow-gold-glow"
                        : "bg-card/85 border-line/12 hover:border-line/25"
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      <div className="sm:col-span-4 relative aspect-[16/10] rounded-2xl overflow-hidden bg-obsidian-950 border border-line/10">
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
                            <Leaf className="w-3 h-3" /> Electric AWD
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-5 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-2xl text-ink font-semibold">
                            {fleet.name}
                          </h3>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                          )}
                        </div>
                        <p className="text-xs text-accent font-medium">
                          {fleet.vehicles}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted pt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-accent" />
                            Max {fleet.maxPassengers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Luggage className="w-3.5 h-3.5 text-accent" />
                            {fleet.maxCheckIn} bags
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-accent" />
                            {fleet.maxCarryOn} cabin
                          </span>
                        </div>

                        <p className="text-[11px] text-subtle line-clamp-2">
                          {fleet.highlights[0]} · {fleet.highlights[1]}
                        </p>
                      </div>

                      <div className="sm:col-span-3 sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-line/10">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-subtle">
                            All-Inclusive Total
                          </div>
                          <div className="font-serif text-3xl text-ink font-bold">
                            {formatPrice(priceCad)}
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-300 font-medium">
                            HST/GST & tip included
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
                              : "bg-field hover:bg-line/[0.08] text-ink border border-line/12"
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

            {/* Right Sidebar: Visual Route Telemetry */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl bg-card border border-line/12 p-6 shadow-luxury sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                    Canadian Route Telemetry
                  </span>
                  <span className="text-xs text-muted">
                    {draft.rideType === "oneway"
                      ? `~${metrics.distanceKm} km · ${metrics.durationMin} min`
                      : `${draft.durationHours * 40} km allowance`}
                  </span>
                </div>

                <div className="rounded-2xl bg-obsidian-950 border border-line/10 p-4 mb-5 text-ivory-50">
                  <svg viewBox="0 0 320 120" className="w-full h-28" fill="none">
                    <path
                      d="M0 30 H320 M0 60 H320 M0 90 H320 M80 0 V120 M160 0 V120 M240 0 V120"
                      stroke="rgba(255,255,255,0.06)"
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
                  <div className="flex items-center justify-between text-[11px] text-white/75 mt-2">
                    <span className="truncate max-w-[45%]">{draft.pickup}</span>
                    <span className="text-champagne-400">→</span>
                    <span className="truncate max-w-[45%] text-right">
                      {draft.rideType === "oneway"
                        ? draft.dropoff
                        : `${draft.durationHours}h Standby`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pb-5 border-b border-line/10 text-xs text-muted">
                  <div className="flex items-center justify-between">
                    <span>Selected Class</span>
                    <span className="font-semibold text-ink">
                      {selectedFleet.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GST/HST, Tolls & Tip</span>
                    <span className="text-emerald-600 dark:text-emerald-300 font-semibold">
                      Included
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Free Cancellation</span>
                    <span className="text-ink font-medium">Until 1h prior</span>
                  </div>
                </div>

                <div className="py-4 flex items-end justify-between">
                  <span className="text-xs uppercase tracking-wider text-subtle">
                    Guaranteed Fare
                  </span>
                  <span className="font-serif text-3xl text-accent font-bold">
                    {formatPrice(subtotalCad)}
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
              <div className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-6 shadow-luxury">
                <div>
                  <h2 className="font-serif text-3xl text-ink font-semibold">
                    Canadian Pickup Protocol & Flight Telemetry
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Personalize how your chauffeur greets you at the terminal or
                    doorstep.
                  </p>
                </div>

                <div className="grid grid-cols-2 p-1 rounded-2xl bg-field border border-line/10 max-w-md">
                  <button
                    type="button"
                    onClick={() => updateDraft({ bookingFor: "myself" })}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      draft.bookingFor === "myself"
                        ? "bg-champagne-500 text-obsidian-950"
                        : "text-muted hover:text-ink"
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
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Booking for VIP Guest
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Flight Number (Air Canada, WestJet, Porter, Intl)
                    </label>
                    <div className="relative">
                      <Plane className="w-4 h-4 text-accent absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={draft.flightNumber}
                        onChange={(e) =>
                          updateDraft({ flightNumber: e.target.value })
                        }
                        placeholder="e.g. AC 857, WS 652, PD 115"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                    {draft.flightNumber.trim() && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-300 font-medium mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live Canadian airport telemetry active for{" "}
                        {draft.flightNumber.toUpperCase()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Meet & Greet Digital Nameboard Sign
                    </label>
                    <input
                      type="text"
                      value={draft.pickupSign}
                      onChange={(e) =>
                        updateDraft({ pickupSign: e.target.value })
                      }
                      placeholder="Name or company on chauffeur tablet"
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                {/* Illuminated Digital Tablet Preview */}
                <div className="rounded-2xl bg-gradient-to-br from-zinc-800 via-obsidian-950 to-black p-[2px] border border-champagne-500/35">
                  <div className="rounded-[14px] bg-obsidian-950 px-6 py-5 text-center relative overflow-hidden">
                    <div className="text-[9px] uppercase tracking-[0.32em] text-champagne-400 mb-1.5">
                      LIMO BLACK CANADA · ARRIVALS MEET & GREET TABLET
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl tracking-[0.14em] text-ivory-50 uppercase">
                      {draft.pickupSign.trim() || "EXECUTIVE GUEST"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-6 shadow-luxury">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-accent font-semibold">
                    Complimentary Bespoke Staging
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink font-semibold mt-1">
                    You Set the Cabin Tone
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-muted mb-2">
                      <Thermometer className="w-3.5 h-3.5 text-accent" />
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
                      className="w-full px-3.5 py-3 rounded-xl bg-field border border-line/15 text-xs sm:text-sm text-ink focus:outline-none focus:border-champagne-500"
                    >
                      <option value="19°C Cool">19°C Crisp & Cool</option>
                      <option value="21°C Balanced">21°C Balanced</option>
                      <option value="23°C Warm">
                        23°C Pre-Warmed + Heated Seats
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-muted mb-2">
                      <VolumeX className="w-3.5 h-3.5 text-accent" />
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
                      className="w-full px-3.5 py-3 rounded-xl bg-field border border-line/15 text-xs sm:text-sm text-ink focus:outline-none focus:border-champagne-500"
                    >
                      <option value="Discreet Silence">
                        Discreet Quiet Ride
                      </option>
                      <option value="Warm & Conversational">
                        Local Canadian Insights
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-muted mb-2">
                      <Wine className="w-3.5 h-3.5 text-accent" />
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
                      className="w-full px-3.5 py-3 rounded-xl bg-field border border-line/15 text-xs sm:text-sm text-ink focus:outline-none focus:border-champagne-500"
                    >
                      <option value="Still Artisan Water">
                        Canadian Spring Water
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
                    <label className="block text-xs text-muted mb-1.5">
                      Transport Canada Certified Child Seat
                    </label>
                    <select
                      value={draft.cabin.childSeat}
                      onChange={(e) =>
                        updateCabin({
                          childSeat: e.target
                            .value as CabinPreferences["childSeat"],
                        })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-field border border-line/15 text-xs sm:text-sm text-ink"
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
                    <label className="block text-xs text-muted mb-1.5">
                      Special Notes (Ski Bags, French Chauffeur, Buzzer...)
                    </label>
                    <input
                      type="text"
                      value={draft.cabin.notes}
                      onChange={(e) => updateCabin({ notes: e.target.value })}
                      placeholder="Condo concierge code, ski equipment, bilingual driver..."
                      className="w-full px-3.5 py-3 rounded-xl bg-field border border-line/15 text-xs sm:text-sm text-ink"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line/10">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-field hover:bg-line/[0.08] border border-line/12 text-xs font-semibold text-ink transition-colors"
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

            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-card border border-line/12 p-6 shadow-luxury sticky top-28 space-y-4">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-line/10">
                  <img
                    src={selectedFleet.image}
                    alt={selectedFleet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                    {selectedFleet.badge}
                  </span>
                  <h3 className="font-serif text-2xl text-ink font-semibold">
                    {selectedFleet.name}
                  </h3>
                  <p className="text-xs text-muted">{selectedFleet.vehicles}</p>
                </div>
                <div className="pt-3 border-t border-line/10 space-y-2 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Cabin Climate</span>
                    <span className="text-accent font-semibold">
                      {draft.cabin.temperature}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refreshment</span>
                    <span className="text-accent font-semibold">
                      {draft.cabin.refreshment}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-line/10 flex items-end justify-between">
                  <span className="text-xs text-subtle">Total Fare</span>
                  <span className="font-serif text-3xl text-accent font-bold">
                    {formatPrice(finalTotalCad)}
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
              <div className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-5 shadow-luxury">
                <h2 className="font-serif text-3xl text-ink font-semibold">
                  {draft.bookingFor === "myself"
                    ? "Your Contact Details"
                    : "VIP Passenger Contact Details"}
                </h2>
                <p className="text-xs text-muted">
                  Chauffeur name, direct Canadian mobile number, and license
                  plate will be sent via SMS & email 60 minutes prior to pickup.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-muted mb-1.5">
                      Honorific
                    </label>
                    <select
                      value={draft.guestTitle}
                      onChange={(e) =>
                        updateDraft({ guestTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Hon.">Hon.</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs text-muted mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.firstName}
                      onChange={(e) =>
                        updateDraft({ firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-muted mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.lastName}
                      onChange={(e) =>
                        updateDraft({ lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Email for Itinerary & GST/HST Receipt
                    </label>
                    <input
                      type="email"
                      required
                      value={draft.email}
                      onChange={(e) => updateDraft({ email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Canadian Mobile Number (SMS Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      value={draft.phone}
                      onChange={(e) => updateDraft({ phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-6 shadow-luxury">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl text-ink font-semibold">
                    Guaranteed Reservation Payment
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-300 font-semibold">
                    <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "card", label: "Credit / Debit Card" },
                    { id: "invoice", label: "Corporate HST Invoice" },
                    { id: "express", label: "Apple / Interac Express" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setPayMethod(m.id as "card" | "invoice" | "express")
                      }
                      className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        payMethod === m.id
                          ? "bg-champagne-500/20 border-champagne-500 text-accent"
                          : "bg-field border-line/12 text-muted hover:text-ink"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5">
                      <div className="aspect-[1.58/1] rounded-2xl p-5 bg-gradient-to-br from-zinc-800 via-obsidian-950 to-black border border-champagne-400/35 shadow-luxury flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-champagne-500/15 blur-2xl" />
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm tracking-[0.2em] text-champagne-300">
                            LIMO BLACK CA
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
                        <label className="block text-xs text-muted mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-muted mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted mb-1">
                            Security Code
                          </label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === "invoice" && (
                  <div className="p-4 rounded-2xl bg-field border border-line/12 text-xs text-muted space-y-2">
                    <p className="text-ink font-semibold">
                      Consolidated 30-Day Canadian Corporate Billing Enabled
                    </p>
                    <p>
                      This reservation will be billed to your corporate cost
                      center with itemized GST/HST registration numbers and
                      carbon-offset verification.
                    </p>
                  </div>
                )}

                {payMethod === "express" && (
                  <div className="p-4 rounded-2xl bg-field border border-line/12 text-xs text-muted">
                    One-tap biometric authorization ready. Your card is only
                    settled upon ride completion; free cancellation applies up
                    until 1 hour prior to pickup.
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-line/10">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-field hover:bg-line/[0.08] border border-line/12 text-xs font-semibold text-ink"
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
                      : `Confirm Limousine · ${formatPrice(finalTotalCad)}`}
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-card border border-line/12 p-6 shadow-luxury sticky top-28 space-y-5">
                <h3 className="font-serif text-2xl text-ink font-semibold">
                  Reservation Summary
                </h3>

                <div className="space-y-2.5 text-xs text-muted pb-4 border-b border-line/10">
                  <div className="flex justify-between">
                    <span>Service Class</span>
                    <span className="text-ink font-semibold">
                      {selectedFleet.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base & Distance All-Inclusive</span>
                    <span>{formatPrice(subtotalCad)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST/HST, 407 Tolls & Tip</span>
                    <span className="text-emerald-600 dark:text-emerald-300 font-semibold">
                      Included
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-accent font-semibold">
                      <span>Privilege Code (15% Off)</span>
                      <span>-{formatPrice(discountCad)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs text-muted mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-accent" />
                    Privilege Code (Try LIMOBLACK15)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="LIMOBLACK15"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-field border border-line/15 text-xs text-ink uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2.5 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-accent"
                    >
                      Apply
                    </button>
                  </div>
                  {promoFeedback && (
                    <p className="text-[11px] text-accent font-medium mt-1.5">
                      {promoFeedback}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-line/10 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-subtle">
                      Final Guaranteed Total
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-300 font-medium mt-0.5">
                      Zero hidden fees
                    </div>
                  </div>
                  <div className="font-serif text-4xl text-accent font-bold">
                    {formatPrice(finalTotalCad)}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-field border border-line/10 flex items-start gap-2.5 text-[11px] text-muted">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Cancel or modify free of charge up until 1 hour before your
                    scheduled Canadian pickup.
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* STEP 4: INSTANT CONFIRMATION */}
        {step === 4 && confirmedRide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto rounded-3xl bg-card border border-champagne-500/45 p-7 sm:p-12 shadow-luxury space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                    Canadian Reservation Confirmed · {confirmedRide.reference}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold mt-1">
                    Your Chauffeur Has Been Assigned.
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-ink"
              >
                <Printer className="w-4 h-4 text-accent" />
                Print GST/HST Receipt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-field border border-line/12 space-y-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Assigned Canadian Chauffeur
                </div>
                <div className="font-serif text-2xl text-ink font-semibold">
                  {confirmedRide.chauffeur.name} ·{" "}
                  <span className="text-accent">
                    {confirmedRide.chauffeur.rating} ★
                  </span>
                </div>
                <p className="text-xs text-muted">
                  Vehicle: {confirmedRide.chauffeur.vehicleModel} · Plate{" "}
                  <span className="text-ink font-mono font-bold">
                    {confirmedRide.chauffeur.plate}
                  </span>
                </p>
                <p className="text-xs text-muted">
                  Direct Concierge Line: {confirmedRide.chauffeur.phone} ·
                  Languages: {confirmedRide.chauffeur.languages}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-field border border-line/12 space-y-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Itinerary & Cabin Staging
                </div>
                <div className="text-sm text-ink font-semibold">
                  {confirmedRide.pickup} → {confirmedRide.dropoff}
                </div>
                <div className="text-xs text-muted">
                  {confirmedRide.date} at {confirmedRide.time} · Tablet Sign:{" "}
                  <span className="text-accent font-semibold">
                    {confirmedRide.pickupSign}
                  </span>
                </div>
                <div className="text-xs text-muted">
                  Staging: {confirmedRide.cabin.temperature} ·{" "}
                  {confirmedRide.cabin.conversation} ·{" "}
                  {confirmedRide.cabin.refreshment}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-champagne-500/15 border border-champagne-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-accent font-bold">
                  All-Inclusive Guaranteed Fare (GST/HST Included)
                </div>
                <div className="text-xs text-muted mt-0.5">
                  Confirmation & tax receipt sent to {confirmedRide.email}
                </div>
              </div>
              <div className="font-serif text-3xl text-ink font-bold">
                {formatPrice(confirmedRide.totalUsd)}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleBookReturn}
                className="px-6 py-3.5 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold uppercase tracking-wider text-ink transition-colors"
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
