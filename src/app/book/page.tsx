"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  MessageSquare,
  Plane,
  Repeat,
  ShieldCheck,
  Sparkles,
  Thermometer,
  UserCheck,
  Users,
} from "lucide-react";
import {
  calculateClassPriceUsd,
  estimateRouteMetrics,
  FLEET_CLASSES,
} from "@/data/limoData";
import {
  CabinPreferences,
  ConfirmedBooking,
  useBooking,
} from "@/context/BookingContext";
import BookingWidget from "@/components/BookingWidget";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

const VIP_ADDON_OPTIONS = [
  {
    id: "Inside-Terminal Meet & Greet",
    label: "Inside-Terminal Meet & Greet Tablet",
    price: 0,
    desc: "Complimentary on all Limo Black Canada airport arrivals",
  },
  {
    id: "Bilingual EN/FR Chauffeur",
    label: "Bilingual English & French Chauffeur",
    price: 0,
    desc: "Ideal for Montréal, Ottawa, Québec City & Diplomatic guests",
  },
  {
    id: "Ski / Golf Carrier",
    label: "Thule Alpine Ski / Golf Bag Carrier",
    price: 25,
    desc: "Recommended for Whistler, Banff, Tremblant & Muskoka",
  },
  {
    id: "Pet-Friendly Executive Cabin",
    label: "Pet-Friendly Protective Cabin Setup",
    price: 35,
    desc: "Hypoallergenic liner & water bowl for accompanied pets",
  },
  {
    id: "Red-Carpet Gala Staging",
    label: "Red-Carpet Wedding & Gala Arrival",
    price: 65,
    desc: "Formal tuxedo attire, red carpet & chilled non-alcoholic sparkling",
  },
];

export default function BookPage() {
  const {
    draft,
    updateDraft,
    updateCabin,
    formatPrice,
    confirmCurrentBooking,
    user,
    registerAccount,
    loginAccount,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showRouteEditor, setShowRouteEditor] = useState(!draft.pickup);

  // Checkout Account Sign-up / Login states
  const [checkoutAuthMode, setCheckoutAuthMode] = useState<"signup" | "login">(
    "signup"
  );
  const [accountPassword, setAccountPassword] = useState("");
  const [accountCompany, setAccountCompany] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const routeInfo = estimateRouteMetrics(
    draft.pickup,
    draft.dropoff,
    draft.pickupCoords,
    draft.dropoffCoords
  );
  const selectedVehicle =
    FLEET_CLASSES.find((v) => v.id === draft.selectedClassId) ||
    FLEET_CLASSES[0];

  const baseVehiclePrice = calculateClassPriceUsd(
    selectedVehicle,
    draft.rideType,
    routeInfo.distanceKm,
    draft.durationHours
  );

  const validExtraStops = (draft.extraStops || []).filter(
    (s) => s.trim().length > 2
  );
  const stopsFee = validExtraStops.length * 25;
  const childSeatFee = draft.cabin.childSeat !== "None" ? 20 : 0;
  const addonsFee = (draft.vipAddons || []).reduce((sum, id) => {
    const found = VIP_ADDON_OPTIONS.find((o) => o.id === id);
    return sum + (found?.price || 0);
  }, 0);

  const singleLegTotal = baseVehiclePrice + stopsFee + childSeatFee + addonsFee;
  const totalPrice =
    draft.roundTrip && draft.rideType === "oneway"
      ? Math.round(singleLegTotal * 1.9)
      : singleLegTotal;

  const preTaxFare = Math.round(totalPrice / 1.13);
  const hstTaxAmount = totalPrice - preTaxFare;

  const toggleAddon = (id: string) => {
    const cur = draft.vipAddons || [];
    if (cur.includes(id)) {
      updateDraft({ vipAddons: cur.filter((x) => x !== id) });
    } else {
      updateDraft({ vipAddons: [...cur, id] });
    }
  };

  const handleInlineLogin = async () => {
    setAuthError("");
    setSubmitting(true);
    const res = await loginAccount(loginEmail, loginPass);
    setSubmitting(false);
    if (!res.ok) {
      setAuthError(res.error || "Invalid email or password.");
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSubmitting(true);

    let ownerEmail = user?.email;
    const fullName = `${draft.firstName} ${draft.lastName}`.trim();

    if (!user) {
      if (checkoutAuthMode === "login") {
        const loginRes = await loginAccount(
          loginEmail || draft.email,
          loginPass
        );
        if (!loginRes.ok) {
          setSubmitting(false);
          setAuthError(
            loginRes.error || "Please check your email and password."
          );
          return;
        }
        ownerEmail = loginRes.user?.email;
      } else {
        if (!accountPassword || accountPassword.length < 6) {
          setSubmitting(false);
          setAuthError(
            "Please create a password (min. 6 characters) so you can view your personal booking & GST/HST invoice anytime."
          );
          return;
        }
        const regRes = await registerAccount({
          name: fullName || "VIP Client",
          email: draft.email,
          phone: draft.phone,
          password: accountPassword,
          company: accountCompany,
        });
        if (!regRes.ok) {
          setSubmitting(false);
          setAuthError(
            regRes.error ||
              "This email already has an account — switch to 'Existing Member (Sign In)' above."
          );
          return;
        }
        ownerEmail = regRes.user?.email;
      }
    }

    const result = confirmCurrentBooking(
      totalPrice,
      routeInfo.distanceKm,
      routeInfo.durationMin,
      ownerEmail
    );
    setSubmitting(false);
    setConfirmed(result);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line/10">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-accent font-semibold mb-1">
                Limo Black Canada Reservation Concierge
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold">
                {step === 1 && "1. Choose Your Limousine or Luxury Class"}
                {step === 2 && "2. Personalize Cabin, Flight & VIP Add-Ons"}
                {step === 3 && "3. Passenger Account & Instant Confirmation"}
                {step === 4 && "Chauffeur Dispatched & Linked to Your Account"}
              </h1>
            </div>

            {step < 4 && (
              <button
                type="button"
                onClick={() => setShowRouteEditor((v) => !v)}
                className="px-4 py-2 rounded-full bg-card hover:bg-line/[0.06] border border-line/15 text-xs text-ink font-medium transition-colors"
              >
                {showRouteEditor
                  ? "Hide Route Editor"
                  : "Modify Route, Stops / Time"}
              </button>
            )}
          </div>

          {showRouteEditor && step < 4 && (
            <div className="mt-6">
              <BookingWidget
                compact
                onSearchComplete={() => setShowRouteEditor(false)}
              />
            </div>
          )}

          {/* Visual 4-Step Indicator */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
            {[
              { num: 1, label: "Limousine Class" },
              { num: 2, label: "VIP & Flight" },
              { num: 3, label: "Account & Confirm" },
              { num: 4, label: "My Dispatch" },
            ].map((s) => {
              const active = step >= s.num;
              return (
                <div key={s.num} className="space-y-2">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      active ? "bg-gold-gradient" : "bg-line/10"
                    }`}
                  />
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                        active
                          ? "bg-champagne-500 text-obsidian-950"
                          : "bg-line/10 text-subtle"
                      }`}
                    >
                      {step > s.num ? <Check className="w-3 h-3" /> : s.num}
                    </span>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        active ? "text-ink" : "text-subtle"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {step === 4 && confirmed ? (
          /* STEP 4: CONFIRMED & LINKED TO PERSONAL ACCOUNT */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto rounded-3xl bg-card border border-champagne-500/35 p-7 sm:p-10 shadow-luxury space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Saved to {confirmed.ownerEmail}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-semibold">
                    Reference: {confirmed.reference}
                  </h2>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-subtle block">
                  All-Inclusive CAD Total (Inc. GST/HST)
                </span>
                <span className="font-serif text-3xl text-accent font-bold">
                  {formatPrice(confirmed.totalUsd)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-champagne-500/10 border border-champagne-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-ink font-medium">
                <Award className="w-5 h-5 text-accent shrink-0" />
                <span>
                  You earned{" "}
                  <strong className="text-accent">
                    +{(confirmed.totalUsd * 10).toLocaleString()} Obsidian
                    Points
                  </strong>{" "}
                  on your personal Limo Black Canada account!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="px-3.5 py-1.5 rounded-full bg-card border border-line/15 font-semibold text-accent hover:underline"
              >
                Print GST/HST Invoice
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-5 rounded-2xl bg-field border border-line/10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                  Assigned Canadian Chauffeur
                </span>
                <p className="font-serif text-xl text-ink font-semibold">
                  {confirmed.chauffeur.name}
                </p>
                <p className="text-xs text-muted">
                  Rating: ★ {confirmed.chauffeur.rating} • Plate:{" "}
                  <span className="text-ink font-mono">
                    {confirmed.chauffeur.plate}
                  </span>
                </p>
                <p className="text-xs text-muted">
                  Direct Concierge: {confirmed.chauffeur.phone}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-field border border-line/10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                  Reserved Limousine & Cabin
                </span>
                <p className="font-serif text-xl text-ink font-semibold">
                  {selectedVehicle.name}
                </p>
                <p className="text-xs text-muted">
                  Climate: {confirmed.cabin.temperature} •{" "}
                  {confirmed.cabin.refreshment}
                </p>
                <p className="text-xs text-muted">
                  Etiquette: {confirmed.cabin.conversation}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href="/account"
                className="px-7 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Open My Personal Account Dashboard
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 rounded-full border border-line/15 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:bg-line/[0.06] transition-colors"
              >
                Return to Canada Home
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Interactive Column */}
            <div className="lg:col-span-8 space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  {FLEET_CLASSES.map((v) => {
                    const price = calculateClassPriceUsd(
                      v,
                      draft.rideType,
                      routeInfo.distanceKm,
                      draft.durationHours
                    );
                    const isSelected = draft.selectedClassId === v.id;
                    const capacityWarning =
                      draft.passengersCount > v.maxPassengers ||
                      draft.luggageCount > v.maxCheckIn + v.maxCarryOn;

                    return (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => updateDraft({ selectedClassId: v.id })}
                        className={`cursor-pointer rounded-3xl p-5 sm:p-6 border transition-all ${
                          isSelected
                            ? "bg-champagne-500/[0.08] border-champagne-500 shadow-gold-glow"
                            : "bg-card border-line/12 hover:border-champagne-500/40"
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          <div className="md:col-span-4 relative h-44 rounded-2xl overflow-hidden bg-obsidian-900">
                            <Image
                              src={v.image}
                              alt={v.name}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-obsidian-950/85 border border-white/15 text-[10px] uppercase tracking-wider text-champagne-300 font-semibold">
                              {v.badge}
                            </span>
                          </div>

                          <div className="md:col-span-5 space-y-2.5">
                            <h3 className="font-serif text-2xl text-ink font-semibold">
                              {v.name}
                            </h3>
                            <p className="text-xs text-accent font-medium">
                              {v.vehicles}
                            </p>
                            <p className="text-xs text-muted leading-relaxed">
                              {v.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-ink font-medium">
                              <span className="inline-flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-accent" /> Up
                                to {v.maxPassengers} Guests
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-accent" />{" "}
                                {v.maxCheckIn} Checked + {v.maxCarryOn} Carry-On
                              </span>
                            </div>
                            {capacityWarning && (
                              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                Note: Your party ({draft.passengersCount} pax /{" "}
                                {draft.luggageCount} bags) exceeds standard
                                sedan limits — consider Executive SUV or Royal
                                Stretch Limousine.
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-line/10">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] uppercase tracking-wider text-subtle block">
                                All-Inclusive CAD
                              </span>
                              <span className="font-serif text-3xl font-bold text-ink">
                                {formatPrice(price)}
                              </span>
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">
                                Gratuity & GST/HST Inc.
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDraft({ selectedClassId: v.id });
                                setStep(2);
                              }}
                              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-gold-gradient text-obsidian-950"
                                  : "bg-field text-ink hover:bg-champagne-500 hover:text-obsidian-950 border border-line/15"
                              }`}
                            >
                              Select <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-8 shadow-luxury"
                >
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                      Beyond Blacklane Personalization
                    </span>
                    <h2 className="font-serif text-2xl text-ink font-semibold mt-1">
                      Canadian Airport Tracking, Cabin Atmosphere & VIP Add-Ons
                    </h2>
                  </div>

                  {/* Flight & Meet Sign */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs text-muted mb-2 font-medium">
                        <Plane className="w-3.5 h-3.5 text-accent" />
                        Canadian Flight Number (Live NAV CANADA Tracking)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AC 418, WS 652, PD 115"
                        value={draft.flightNumber}
                        onChange={(e) =>
                          updateDraft({ flightNumber: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs text-muted mb-2 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        Arrivals Meet & Greet Tablet Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name or Corporate Crest on iPad"
                        value={draft.pickupSign}
                        onChange={(e) =>
                          updateDraft({ pickupSign: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                  </div>

                  {/* VIP Concierge Add-Ons */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold">
                      <Crown className="w-3.5 h-3.5" />
                      Executive & Event Concierge Enhancements
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {VIP_ADDON_OPTIONS.map((opt) => {
                        const checked = (draft.vipAddons || []).includes(
                          opt.id
                        );
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleAddon(opt.id)}
                            className={`text-left p-4 rounded-2xl border transition-all ${
                              checked
                                ? "bg-champagne-500/15 border-champagne-500"
                                : "bg-field border-line/12 hover:border-champagne-500/40"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-ink">
                                {opt.label}
                              </span>
                              <span className="text-[11px] font-bold text-accent shrink-0">
                                {opt.price === 0
                                  ? "Included"
                                  : `+${formatPrice(opt.price)}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cabin Preferences */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="flex items-center gap-2 text-xs text-muted mb-2 font-medium">
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
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      >
                        <option value="19°C Cool" className="bg-card">
                          19°C Cool
                        </option>
                        <option value="21°C Balanced" className="bg-card">
                          21°C Balanced
                        </option>
                        <option value="23°C Warm" className="bg-card">
                          23°C Warm Winter Cabin
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs text-muted mb-2 font-medium">
                        <Coffee className="w-3.5 h-3.5 text-accent" />
                        Refreshments
                      </label>
                      <select
                        value={draft.cabin.refreshment}
                        onChange={(e) =>
                          updateCabin({
                            refreshment: e.target
                              .value as CabinPreferences["refreshment"],
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      >
                        <option value="Still Artisan Water" className="bg-card">
                          Still Artisan Water
                        </option>
                        <option value="Sparkling Perrier" className="bg-card">
                          Sparkling Perrier
                        </option>
                        <option value="Chilled Espresso" className="bg-card">
                          Chilled Espresso
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs text-muted mb-2 font-medium">
                        <MessageSquare className="w-3.5 h-3.5 text-accent" />
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
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      >
                        <option value="Discreet Silence" className="bg-card">
                          Discreet Silence
                        </option>
                        <option
                          value="Warm & Conversational"
                          className="bg-card"
                        >
                          Warm & Conversational
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Child Seats & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-muted mb-2">
                        Transport Canada Child Seat (+CA$20)
                      </label>
                      <select
                        value={draft.cabin.childSeat}
                        onChange={(e) =>
                          updateCabin({
                            childSeat: e.target
                              .value as CabinPreferences["childSeat"],
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      >
                        <option value="None">None</option>
                        <option value="Infant Carrier">Infant Carrier</option>
                        <option value="Toddler Seat">Toddler Seat</option>
                        <option value="Booster Seat">Booster Seat</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-muted mb-2">
                        Special Chauffeur Instructions
                      </label>
                      <input
                        type="text"
                        placeholder="FBO tail number, hotel valet gate, wheelchair assistance..."
                        value={draft.cabin.notes}
                        onChange={(e) => updateCabin({ notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-line/10">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-full border border-line/15 text-xs font-semibold text-ink hover:bg-line/[0.06] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-7 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow flex items-center gap-2"
                    >
                      Continue to Account & Checkout{" "}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.form
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleConfirm}
                  className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-6 shadow-luxury"
                >
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                      Personal Account & Guaranteed Dispatch
                    </span>
                    <h2 className="font-serif text-2xl text-ink font-semibold mt-1">
                      {user
                        ? `Confirming for ${user.name}`
                        : "Passenger Details & Account Creation"}
                    </h2>
                    <p className="text-xs text-muted mt-1">
                      Every Limo Black reservation is linked to your personal
                      account so you can track live GPS dispatch, modify pickup
                      times, and download GST/HST receipts.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {user ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div className="text-xs">
                          <p className="font-semibold text-ink">
                            Signed In as {user.name} ({user.email})
                          </p>
                          <p className="text-muted">
                            This ride +{" "}
                            <strong>
                              {(totalPrice * 10).toLocaleString()} Obsidian
                              Points
                            </strong>{" "}
                            will appear immediately in your Personal Account.
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-champagne-500/15 text-[10px] font-bold uppercase text-accent">
                        {user.tier}
                      </span>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-field border border-champagne-500/35 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                          <Crown className="w-4 h-4" /> Link Ride to Your
                          Personal Account
                        </span>
                        <div className="inline-flex p-1 rounded-xl bg-card border border-line/12">
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutAuthMode("signup");
                              setAuthError("");
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              checkoutAuthMode === "signup"
                                ? "bg-champagne-500 text-obsidian-950"
                                : "text-muted hover:text-ink"
                            }`}
                          >
                            New Client (Sign Up)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutAuthMode("login");
                              setAuthError("");
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              checkoutAuthMode === "login"
                                ? "bg-champagne-500 text-obsidian-950"
                                : "text-muted hover:text-ink"
                            }`}
                          >
                            Existing Member (Sign In)
                          </button>
                        </div>
                      </div>

                      {checkoutAuthMode === "login" && (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                          <div className="sm:col-span-5">
                            <label className="block text-xs text-muted mb-1">
                              Account Email *
                            </label>
                            <input
                              type="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="you@example.ca"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-line/15 text-xs text-ink"
                            />
                          </div>
                          <div className="sm:col-span-5">
                            <label className="block text-xs text-muted mb-1">
                              Password *
                            </label>
                            <input
                              type="password"
                              value={loginPass}
                              onChange={(e) => setLoginPass(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-line/15 text-xs text-ink"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <button
                              type="button"
                              onClick={handleInlineLogin}
                              disabled={submitting}
                              className="w-full py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs"
                            >
                              Sign In
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Passenger Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arman"
                        value={draft.firstName}
                        onChange={(e) =>
                          updateDraft({ firstName: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sidhu"
                        value={draft.lastName}
                        onChange={(e) =>
                          updateDraft({ lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">
                        Email for Account & GST Invoice *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.ca"
                        value={draft.email}
                        onChange={(e) => updateDraft({ email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">
                        Canadian Mobile (SMS Dispatch) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (416) 555-0194"
                        value={draft.phone}
                        onChange={(e) => updateDraft({ phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                      />
                    </div>
                  </div>

                  {!user && checkoutAuthMode === "signup" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted mb-1.5">
                          Create Account Password (Min. 6 chars) *
                        </label>
                        <div className="relative">
                          <input
                            type={showPass ? "text" : "password"}
                            required
                            minLength={6}
                            value={accountPassword}
                            onChange={(e) => setAccountPassword(e.target.value)}
                            placeholder="Set password to view your ride dashboard"
                            className="w-full pl-4 pr-10 py-3 rounded-xl bg-field border border-champagne-500/40 text-sm text-ink focus:outline-none focus:border-champagne-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
                          >
                            {showPass ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1.5">
                          Company Name (Optional — for CRA Tax Receipt)
                        </label>
                        <input
                          type="text"
                          value={accountCompany}
                          onChange={(e) => setAccountCompany(e.target.value)}
                          placeholder="e.g. Bay Street Partners"
                          className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink focus:outline-none focus:border-champagne-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Encrypted Payment Guarantee */}
                  <div className="p-5 rounded-2xl bg-field border border-line/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-accent" />
                        Canadian Bank-Grade Payment Guarantee (CAD)
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Charged Only After Completion
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        aria-label="Card number"
                        className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-card border border-line/15 text-sm text-ink font-mono"
                      />
                      <input
                        type="text"
                        defaultValue="09 / 29  •  884"
                        aria-label="Expiry and CVC"
                        className="px-4 py-2.5 rounded-xl bg-card border border-line/15 text-sm text-ink font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line/10">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-full border border-line/15 text-xs font-semibold text-ink hover:bg-line/[0.06] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      {submitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {user
                        ? `Confirm Limousine • ${formatPrice(totalPrice)}`
                        : `Create Account & Confirm • ${formatPrice(
                            totalPrice
                          )}`}
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Sticky Canadian Order Summary Sidebar */}
            <aside className="lg:col-span-4 rounded-3xl bg-card border border-line/12 p-6 space-y-5 lg:sticky lg:top-28 shadow-luxury">
              <div className="flex items-center justify-between pb-4 border-b border-line/10">
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                  Canadian Itinerary
                </span>
                <span className="text-xs text-muted capitalize">
                  {draft.rideType === "oneway"
                    ? draft.roundTrip
                      ? "Round-Trip Transfer"
                      : "One-Way Transfer"
                    : `${draft.durationHours}h Charter`}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-champagne-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-subtle block">Pickup (Canada)</span>
                    <span className="text-ink font-medium">
                      {draft.pickup || "Toronto Pearson Airport (YYZ)"}
                    </span>
                  </div>
                </div>

                {validExtraStops.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div>
                      <span className="text-accent block">Stop #{idx + 1}</span>
                      <span className="text-ink font-medium">{s}</span>
                    </div>
                  </div>
                ))}

                {draft.rideType === "oneway" ? (
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="text-subtle block">
                        Destination (Canada)
                      </span>
                      <span className="text-ink font-medium">
                        {draft.dropoff || "Downtown Toronto, ON"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <span className="text-subtle block">
                        As-Directed Charter
                      </span>
                      <span className="text-ink font-medium">
                        {draft.durationHours} Hours ({draft.durationHours * 40}{" "}
                        km included)
                      </span>
                    </div>
                  </div>
                )}

                {draft.roundTrip && draft.rideType === "oneway" && (
                  <div className="flex items-center gap-2 pt-1 text-accent font-semibold">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>
                      Return: {draft.returnDate} at {draft.returnTime} (-10%)
                    </span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-muted">
                  <span>Pickup Schedule</span>
                  <span className="text-ink font-medium">
                    {draft.date} • {draft.time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted">
                  <span>Party Size</span>
                  <span className="text-ink font-medium">
                    {draft.passengersCount} Pax • {draft.luggageCount} Bags
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-line/10 space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>{selectedVehicle.name}</span>
                  <span className="text-ink">
                    {formatPrice(baseVehiclePrice)}
                  </span>
                </div>
                {stopsFee > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Extra Stops ({validExtraStops.length})</span>
                    <span className="text-ink">{formatPrice(stopsFee)}</span>
                  </div>
                )}
                {childSeatFee > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Child Seat ({draft.cabin.childSeat})</span>
                    <span className="text-ink">{formatPrice(childSeatFee)}</span>
                  </div>
                )}
                {addonsFee > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>VIP Concierge Enhancements</span>
                    <span className="text-ink">{formatPrice(addonsFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-subtle pt-1 border-t border-line/10">
                  <span>Included Canadian GST/HST</span>
                  <span>{formatPrice(hstTaxAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Chauffeur Gratuity & 407 ETR Tolls</span>
                  <span>Included</span>
                </div>
                <div className="pt-3 border-t border-line/10 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-ink">
                    Guaranteed Total
                  </span>
                  <span className="font-serif text-3xl font-bold text-accent">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <TaxInvoiceModal
        booking={confirmed}
        companyName={user?.company || accountCompany}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
}
