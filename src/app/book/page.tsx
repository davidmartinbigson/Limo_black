"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { FleetClassId, GLOBAL_LOCATIONS } from "@/data/limoData";
import { ConfirmedBooking, useBooking } from "@/context/BookingContext";
import CanadianAddressInput from "@/components/CanadianAddressInput";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

function estimateRouteMetrics(
  pickup: string,
  dropoff: string,
  pickupCoords: { lat: number; lng: number } | null,
  dropoffCoords: { lat: number; lng: number } | null
): { distanceKm: number; durationMin: number } {
  const findCoords = (text: string) => {
    const q = text.trim().toLowerCase();
    if (!q) return null;
    const match = GLOBAL_LOCATIONS.find(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        q.includes(loc.name.toLowerCase()) ||
        (loc.iata && q.includes(loc.iata.toLowerCase()))
    );
    return match ? { lat: match.lat, lng: match.lng } : null;
  };

  const c1 = pickupCoords || findCoords(pickup);
  const c2 = dropoffCoords || findCoords(dropoff);

  if (c1 && c2) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(c2.lat - c1.lat);
    const dLng = toRad(c2.lng - c1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(c1.lat)) *
        Math.cos(toRad(c2.lat)) *
        Math.sin(dLng / 2) ** 2;
    const straightKm = 2 * R * Math.asin(Math.sqrt(a));
    const roadKm = Math.max(8, Math.round(straightKm * 1.25));
    const mins = Math.max(18, Math.round((roadKm / 55) * 60 + 10));
    return { distanceKm: roadKm, durationMin: mins };
  }

  return { distanceKm: 24, durationMin: 35 };
}

type VehicleCategory = "all" | "sedan" | "suv" | "van";

interface BookingVehicleOption {
  id: FleetClassId;
  category: Exclude<VehicleCategory, "all">;
  title: string;
  description: string;
  passengersLabel: string;
  luggageLabel: string;
  baseCad: number;
  extraKmCad: number;
  hourlyCad: number;
  image: string;
}

const BOOKING_VEHICLES: BookingVehicleOption[] = [
  {
    id: "business",
    category: "sedan",
    title: "Business Class Sedan",
    description: "Comfortable and stylish for everyday travel.",
    passengersLabel: "1 – 3",
    luggageLabel: "2",
    baseCad: 99,
    extraKmCad: 2.4,
    hourlyCad: 95,
    image: "/images/book-sedan-business.jpg",
  },
  {
    id: "first",
    category: "sedan",
    title: "First Class Sedan",
    description: "A higher level of comfort and premium amenities.",
    passengersLabel: "1 – 3",
    luggageLabel: "3",
    baseCad: 129,
    extraKmCad: 3.1,
    hourlyCad: 125,
    image: "/images/book-sedan-first.jpg",
  },
  {
    id: "suv",
    category: "suv",
    title: "Business SUV",
    description: "Spacious, versatile, and ideal for small groups.",
    passengersLabel: "1 – 6",
    luggageLabel: "6",
    baseCad: 149,
    extraKmCad: 3.5,
    hourlyCad: 145,
    image: "/images/book-suv-business.jpg",
  },
  {
    id: "van",
    category: "van",
    title: "Executive Van",
    description: "Premium group travel with extra space and comfort.",
    passengersLabel: "7 – 14",
    luggageLabel: "10",
    baseCad: 229,
    extraKmCad: 4.5,
    hourlyCad: 215,
    image: "/images/book-van-executive.jpg",
  },
];

const CATEGORY_TABS: { id: VehicleCategory; label: string }[] = [
  { id: "all", label: "All Vehicles" },
  { id: "sedan", label: "Sedan" },
  { id: "suv", label: "SUV" },
  { id: "van", label: "Van" },
];

const STEPS: { num: 1 | 2 | 3 | 4; label: string }[] = [
  { num: 1, label: "Trip Details" },
  { num: 2, label: "Choose Vehicle" },
  { num: 3, label: "Passenger Details" },
  { num: 4, label: "Review & Pay" },
];

function formatShortLocation(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed.includes("Toronto Pearson")) return "Toronto Pearson (YYZ)";
  if (trimmed.includes("Fairmont Royal York")) return "Royal York Hotel, Toronto";
  if (trimmed.includes("Billy Bishop")) return "Billy Bishop Airport (YTZ)";
  const parts = trimmed.split(",");
  if (parts.length >= 2) {
    return `${parts[0].trim()}, ${parts[1].trim()}`;
  }
  return trimmed;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "Sun, Dec 27, 2026";
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return isoDate;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function formatDisplayTime(hhmm: string): string {
  if (!hhmm || !hhmm.includes(":")) return "10:00 AM";
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function BookPage() {
  const {
    draft,
    updateDraft,
    confirmCurrentBooking,
    user,
    registerAccount,
    loginAccount,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(2);
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory>("all");

  // Account auth states inside Step 3
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Confirmed reservation state
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const effectiveSelectedId: FleetClassId = useMemo(() => {
    const exists = BOOKING_VEHICLES.some((v) => v.id === draft.selectedClassId);
    return exists ? draft.selectedClassId : "business";
  }, [draft.selectedClassId]);

  const routeMetrics = useMemo(() => {
    const pickupAddr =
      draft.pickup.trim() || "Toronto Pearson International Airport (YYZ)";
    const dropoffAddr =
      draft.dropoff.trim() ||
      "Fairmont Royal York Hotel, 100 Front St W, Toronto, ON";
    return estimateRouteMetrics(
      pickupAddr,
      dropoffAddr,
      draft.pickupCoords,
      draft.dropoffCoords
    );
  }, [draft.pickup, draft.dropoff, draft.pickupCoords, draft.dropoffCoords]);

  const calculateVehiclePrice = (v: BookingVehicleOption): number => {
    if (draft.rideType === "hourly") {
      return Math.round(v.hourlyCad * Math.max(2, draft.durationHours));
    }
    if (routeMetrics.distanceKm <= 30) {
      return v.baseCad;
    }
    return Math.round(
      v.baseCad + (routeMetrics.distanceKm - 25) * v.extraKmCad
    );
  };

  const filteredVehicles = useMemo(() => {
    if (categoryFilter === "all") return BOOKING_VEHICLES;
    return BOOKING_VEHICLES.filter((v) => v.category === categoryFilter);
  }, [categoryFilter]);

  const selectedVehicle = useMemo(
    () =>
      BOOKING_VEHICLES.find((v) => v.id === effectiveSelectedId) ||
      BOOKING_VEHICLES[0],
    [effectiveSelectedId]
  );

  const selectedPriceCad = calculateVehiclePrice(selectedVehicle);

  const pickupSummary = formatShortLocation(
    draft.pickup,
    "Toronto Pearson (YYZ)"
  );
  const dropoffSummary =
    draft.rideType === "hourly"
      ? `${draft.durationHours} Hours Hourly Charter`
      : formatShortLocation(draft.dropoff, "Royal York Hotel, Toronto");

  const handlePassengerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!user) {
      setSubmitting(true);
      try {
        if (authMode === "signup") {
          const fullName =
            `${draft.firstName} ${draft.lastName}`.trim() || "VIP Passenger";
          const res = await registerAccount({
            name: fullName,
            email: draft.email,
            phone: draft.phone,
            password,
            company: companyName || undefined,
          });
          if (!res.ok) {
            setAuthError(
              res.error ||
                "An account with this email already exists. Switch to Sign In."
            );
            setSubmitting(false);
            return;
          }
        } else {
          const res = await loginAccount(draft.email, password);
          if (!res.ok) {
            setAuthError(res.error || "Invalid email or password.");
            setSubmitting(false);
            return;
          }
        }
      } finally {
        setSubmitting(false);
      }
    }

    setStep(4);
  };

  const handleConfirmBooking = () => {
    if (!draft.pickup.trim()) {
      updateDraft({
        pickup: "Toronto Pearson International Airport (YYZ)",
      });
    }
    if (draft.rideType === "oneway" && !draft.dropoff.trim()) {
      updateDraft({
        dropoff: "Fairmont Royal York Hotel, 100 Front St W, Toronto, ON",
      });
    }
    updateDraft({ selectedClassId: effectiveSelectedId });

    const ownerEmail = user?.email || draft.email || "guest@limoblack.ca";
    const result = confirmCurrentBooking(
      selectedPriceCad,
      routeMetrics.distanceKm,
      routeMetrics.durationMin,
      ownerEmail
    );
    setConfirmed(result);
  };

  // =========================================================================
  // CONFIRMED RESERVATION VIEW
  // =========================================================================
  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] text-[#141416] pt-20 sm:pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-white border border-[#E6E4DC] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-7 sm:p-10 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#FAF6EC] border border-[#C9A65B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-[#C59B3F]" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8923B]">
                Reservation Confirmed • {confirmed.reference}
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111113]">
                Your chauffeur is reserved.
              </h1>
              <p className="text-sm text-[#55555A]">
                Saved to your account ({confirmed.ownerEmail}). Chauffeur{" "}
                <strong className="text-[#141416]">
                  {confirmed.chauffeur.name}
                </strong>{" "}
                has been assigned to your trip.
              </p>
            </div>

            <div className="rounded-xl bg-[#F7F6F2] border border-[#ECEAE2] p-5 text-left space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#66666B]">Vehicle</span>
                <span className="font-semibold text-[#141416]">
                  {selectedVehicle.title}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#66666B]">Pickup</span>
                <span className="font-medium text-[#141416] text-right">
                  {pickupSummary}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#66666B]">Destination</span>
                <span className="font-medium text-[#141416] text-right">
                  {dropoffSummary}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#66666B]">Date &amp; Time</span>
                <span className="font-medium text-[#141416]">
                  {formatDisplayDate(confirmed.date)} ·{" "}
                  {formatDisplayTime(confirmed.time)}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#E4E2DA] flex justify-between items-baseline">
                <span className="font-semibold text-[#141416]">
                  Total Paid (Tax Incl.)
                </span>
                <span className="text-lg font-extrabold text-[#111113]">
                  CAD ${confirmed.totalUsd}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#C9A65B] hover:bg-[#FAF6EC] text-sm font-semibold text-[#141416] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#C59B3F]" />
                GST/HST Tax Receipt
              </button>

              <Link
                href="/account"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-b from-[#D4B26A] to-[#BE9644] hover:from-[#DCBC76] hover:to-[#C79F4E] text-sm font-semibold text-[#111113] transition-all"
              >
                View My Rides
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {showInvoice && (
          <TaxInvoiceModal
            booking={confirmed}
            companyName={user?.company || companyName}
            onClose={() => setShowInvoice(false)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // MAIN 4-STEP CLEAN BOOKING FLOW (MATCHING REFERENCE LAYOUT)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#141416] pt-16 sm:pt-[74px] pb-16">
      {/* Top 4-Step Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8">
        <div className="flex items-center justify-center">
          {STEPS.map((s, idx) => {
            const isCompleted = s.num < step;
            const isActive = s.num === step;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all shrink-0 ${
                      isCompleted
                        ? "bg-[#C8A24D] text-[#111113]"
                        : isActive
                        ? "bg-[#C8A24D] text-white shadow-sm"
                        : "bg-white border border-[#D5D5D0] text-[#222226]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.6]" />
                    ) : (
                      s.num
                    )}
                  </span>
                  <span
                    className={`text-xs sm:text-[13.5px] whitespace-nowrap ${
                      isCompleted || isActive
                        ? "font-semibold text-[#141416]"
                        : "font-normal text-[#5A5A60] hidden sm:inline"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 md:w-20 h-[1.5px] mx-2.5 sm:mx-4 shrink-0 ${
                      s.num < step ? "bg-[#C8A24D]" : "bg-[#DFDFDA]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Centered Step Title & Subtitle */}
      <div className="max-w-3xl mx-auto px-4 text-center mb-8 sm:mb-9">
        <h1 className="font-serif text-3xl sm:text-[40px] font-bold text-[#111113] tracking-tight leading-tight">
          {step === 1 && "Trip Details"}
          {step === 2 && "Choose Your Vehicle"}
          {step === 3 && "Passenger Details"}
          {step === 4 && "Review & Pay"}
        </h1>
        <p className="text-sm sm:text-[16px] text-[#4E4E54] mt-2">
          {step === 1 && "Enter or update your pickup, destination, and schedule."}
          {step === 2 && "Select the vehicle that best fits your trip."}
          {step === 3 && "Provide contact details for chauffeur updates."}
          {step === 4 && "Review your trip summary and confirm your chauffeur."}
        </p>
      </div>

      {/* Main 2-Column Content Container */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* =============================================================== */}
          {/* LEFT COLUMN (8 Cols)                                            */}
          {/* =============================================================== */}
          <div className="lg:col-span-8">
            {/* STEP 1: TRIP DETAILS EDITOR */}
            {step === 1 && (
              <div className="rounded-2xl bg-white border border-[#EAEAE4] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
                <div className="inline-flex items-center rounded-full bg-[#F6F6F3] border border-[#E4E4DE] p-1">
                  <button
                    type="button"
                    onClick={() => updateDraft({ rideType: "oneway" })}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      draft.rideType === "oneway"
                        ? "bg-[#111113] text-[#E2C278]"
                        : "text-[#222226]"
                    }`}
                  >
                    One way
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDraft({ rideType: "hourly" })}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      draft.rideType === "hourly"
                        ? "bg-[#111113] text-[#E2C278]"
                        : "text-[#222226]"
                    }`}
                  >
                    By the hour
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CanadianAddressInput
                    label="Pickup Location"
                    value={draft.pickup}
                    placeholder="Toronto Pearson (YYZ)"
                    lightSurface
                    onChange={(val, coords) =>
                      updateDraft({ pickup: val, pickupCoords: coords ?? null })
                    }
                  />

                  {draft.rideType === "oneway" ? (
                    <CanadianAddressInput
                      label="Destination"
                      value={draft.dropoff}
                      placeholder="Royal York Hotel, Toronto"
                      lightSurface
                      onChange={(val, coords) =>
                        updateDraft({
                          dropoff: val,
                          dropoffCoords: coords ?? null,
                        })
                      }
                    />
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                        Charter Duration
                      </label>
                      <select
                        value={draft.durationHours}
                        onChange={(e) =>
                          updateDraft({
                            durationHours: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                      >
                        {[2, 3, 4, 5, 6, 8, 10, 12].map((hrs) => (
                          <option key={hrs} value={hrs}>
                            {hrs} Hours Charter
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(e) => updateDraft({ date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(e) => updateDraft({ time: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Passengers
                    </label>
                    <select
                      value={draft.passengersCount || 1}
                      onChange={(e) =>
                        updateDraft({
                          passengersCount: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    >
                      {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-b from-[#D4B26A] to-[#BE9644] hover:from-[#DCBC76] hover:to-[#C79F4E] text-sm font-semibold text-[#111113] transition-all"
                  >
                    Continue to Vehicles
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE VEHICLE (EXACT MATCH TO REFERENCE) */}
            {step === 2 && (
              <div>
                {/* Category Filter Segmented Pill Bar */}
                <div className="mb-5">
                  <div className="inline-flex items-center rounded-full bg-[#F6F6F3] border border-[#E4E4DE] p-1">
                    {CATEGORY_TABS.map((tab) => {
                      const active = categoryFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCategoryFilter(tab.id)}
                          className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                            active
                              ? "bg-[#111113] text-[#E2C278] shadow-sm"
                              : "text-[#1E1E22] hover:text-[#111113]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4 Horizontal Vehicle Cards */}
                <div className="space-y-4">
                  {filteredVehicles.map((v) => {
                    const isSelected = effectiveSelectedId === v.id;
                    const price = calculateVehiclePrice(v);

                    return (
                      <div
                        key={v.id}
                        onClick={() => updateDraft({ selectedClassId: v.id })}
                        className={`rounded-2xl px-5 sm:px-6 py-4 sm:py-5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FAF6EC] border-[1.5px] border-[#C9A65B]"
                            : "bg-white border border-[#EAEAE4] hover:border-[#C9A65B]/65 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          {/* Studio Vehicle Image */}
                          <div className="w-full sm:w-[205px] h-[106px] flex items-center justify-center shrink-0">
                            <img
                              src={v.image}
                              alt={v.title}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>

                          {/* Vehicle Title, Subtitle & Capacity */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[18px] sm:text-[19px] font-bold text-[#111113] leading-snug">
                              {v.title}
                            </h3>
                            <p className="text-[13.5px] text-[#4E4E54] mt-1 leading-relaxed">
                              {v.description}
                            </p>

                            <div className="flex items-center gap-5 mt-3.5 text-[13.5px] font-medium text-[#1A1A1E]">
                              <span className="inline-flex items-center gap-1.5">
                                <User className="w-4 h-4 text-[#252529] stroke-[1.9]" />
                                {v.passengersLabel}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-[#252529] stroke-[1.9]" />
                                {v.luggageLabel}
                              </span>
                            </div>
                          </div>

                          {/* Price & Select CTA */}
                          <div className="sm:pl-7 sm:border-l sm:border-[#EAE5DA] sm:w-[178px] shrink-0 flex sm:flex-col items-center sm:items-start justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#ECEAE2]">
                            <div>
                              <span className="block text-[11.5px] text-[#66666B] leading-none mb-1">
                                From
                              </span>
                              <div className="flex items-baseline gap-1 text-[#111113]">
                                <span className="text-[14px] font-bold tracking-tight">
                                  CAD
                                </span>
                                <span className="text-[26px] sm:text-[28px] font-extrabold leading-none tracking-tight">
                                  ${price}
                                </span>
                              </div>
                            </div>

                            {isSelected ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStep(3);
                                }}
                                className="w-auto sm:w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-b from-[#D4B26A] to-[#BE9644] hover:from-[#DCBC76] hover:to-[#C79F4E] text-[13.5px] font-semibold text-[#111113] shadow-sm transition-all"
                              >
                                <Check className="w-4 h-4 stroke-[2.4]" />
                                Selected
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateDraft({ selectedClassId: v.id });
                                }}
                                className="w-auto sm:w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white border border-[#C9A65B] hover:bg-[#FAF6EC] text-[13.5px] font-semibold text-[#141416] transition-colors"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: PASSENGER DETAILS */}
            {step === 3 && (
              <form
                onSubmit={handlePassengerSubmit}
                className="rounded-2xl bg-white border border-[#EAEAE4] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.firstName}
                      onChange={(e) =>
                        updateDraft({ firstName: e.target.value })
                      }
                      placeholder="Alexander"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.lastName}
                      onChange={(e) =>
                        updateDraft({ lastName: e.target.value })
                      }
                      placeholder="Sterling"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={draft.email}
                      onChange={(e) => updateDraft({ email: e.target.value })}
                      placeholder="you@company.ca"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={draft.phone}
                      onChange={(e) => updateDraft({ phone: e.target.value })}
                      placeholder="+1 (416) 555-0194"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Flight Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={draft.flightNumber}
                      onChange={(e) =>
                        updateDraft({ flightNumber: e.target.value })
                      }
                      placeholder="e.g. AC 857 / WS 652"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#222226] mb-1.5">
                      Pickup Sign / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={draft.pickupSign}
                      onChange={(e) =>
                        updateDraft({ pickupSign: e.target.value })
                      }
                      placeholder="Name on greeting sign or special requests"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Account Linking so every customer has isolated personal bookings */}
                {!user && (
                  <div className="rounded-xl bg-[#F7F6F2] border border-[#ECEAE2] p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#141416]">
                        <Lock className="w-4 h-4 text-[#C59B3F]" />
                        Save Ride to Your LimoBlack Account
                      </div>
                      <div className="inline-flex rounded-full bg-white border border-[#E4E4DE] p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signup");
                            setAuthError("");
                          }}
                          className={`px-3 py-1 rounded-full font-medium ${
                            authMode === "signup"
                              ? "bg-[#111113] text-[#E2C278]"
                              : "text-[#44444A]"
                          }`}
                        >
                          New Account
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setAuthError("");
                          }}
                          className={`px-3 py-1 rounded-full font-medium ${
                            authMode === "login"
                              ? "bg-[#111113] text-[#E2C278]"
                              : "text-[#44444A]"
                          }`}
                        >
                          Existing Account
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#44444A] mb-1.5">
                          {authMode === "signup"
                            ? "Create Password (Min. 6 chars) *"
                            : "Account Password *"}
                        </label>
                        <div className="relative">
                          <input
                            type={showPass ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66666B]"
                          >
                            {showPass ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {authMode === "signup" && (
                        <div>
                          <label className="block text-xs font-medium text-[#44444A] mb-1.5">
                            Company Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="For GST/HST receipt"
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {authError && (
                      <p className="text-xs font-medium text-red-600">
                        {authError}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#DEDED8] hover:border-[#141416] text-sm font-medium text-[#141416] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-b from-[#D4B26A] to-[#BE9644] hover:from-[#DCBC76] hover:to-[#C79F4E] text-sm font-semibold text-[#111113] transition-all disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Continue to Review
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: REVIEW & PAY */}
            {step === 4 && (
              <div className="rounded-2xl bg-white border border-[#EAEAE4] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#ECEAE2]">
                  <div className="w-40 h-24 flex items-center justify-center shrink-0">
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B8923B]">
                      Selected Vehicle
                    </span>
                    <h3 className="text-xl font-bold text-[#111113] mt-0.5">
                      {selectedVehicle.title}
                    </h3>
                    <p className="text-sm text-[#55555A] mt-0.5">
                      {selectedVehicle.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#66666B] block">
                      All-Inclusive Fare
                    </span>
                    <span className="text-2xl font-extrabold text-[#111113]">
                      CAD ${selectedPriceCad}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-[#F7F6F2] p-4 space-y-1">
                    <span className="text-xs text-[#66666B]">Passenger</span>
                    <p className="font-semibold text-[#141416]">
                      {`${draft.firstName} ${draft.lastName}`.trim() ||
                        user?.name ||
                        "VIP Guest"}
                    </p>
                    <p className="text-xs text-[#55555A]">
                      {draft.email || user?.email} · {draft.phone}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7F6F2] p-4 space-y-1">
                    <span className="text-xs text-[#66666B]">
                      Included Complimentary
                    </span>
                    <p className="font-semibold text-[#141416]">
                      All Taxes (HST/GST) &amp; Tolls Included
                    </p>
                    <p className="text-xs text-[#55555A]">
                      60 min airport wait · Free cancellation up to 1 hr prior
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#DEDED8] hover:border-[#141416] text-sm font-medium text-[#141416] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-b from-[#D4B26A] to-[#BE9644] hover:from-[#DCBC76] hover:to-[#C79F4E] text-sm font-semibold text-[#111113] shadow-sm transition-all"
                  >
                    Confirm &amp; Pay • CAD ${selectedPriceCad}
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: TRIP SUMMARY CARD (4 Cols — Exact Match)          */}
          {/* =============================================================== */}
          <aside className="lg:col-span-4 lg:mt-2">
            <div className="rounded-2xl bg-[#F7F6F2] border border-[#ECEAE2] p-6 sm:p-7">
              <h2 className="text-[18px] font-bold text-[#141416] mb-5">
                Trip Summary
              </h2>

              <div className="space-y-4 text-[14px] text-[#1E1E22]">
                {/* Pickup + Dashed Connector + Destination */}
                <div>
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 mt-0.5 stroke-[1.9]" />
                    <span className="font-medium leading-snug">
                      {pickupSummary}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 mt-1">
                    <div className="w-[18px] flex justify-center shrink-0 py-0.5">
                      <span className="h-5 border-l-[1.5px] border-dashed border-[#2A2A2E]" />
                    </div>
                    <span className="font-medium leading-snug pt-1.5">
                      {dropoffSummary}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3.5 pt-1">
                  <Calendar className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
                  <span className="font-medium">
                    {formatDisplayDate(draft.date)}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3.5">
                  <Clock className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
                  <span className="font-medium">
                    {formatDisplayTime(draft.time)}
                  </span>
                </div>

                {/* Passengers */}
                <div className="flex items-center gap-3.5">
                  <Users className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
                  <span className="font-medium">
                    {draft.passengersCount || 1}{" "}
                    {(draft.passengersCount || 1) === 1
                      ? "Passenger"
                      : "Passengers"}
                  </span>
                </div>
              </div>

              {/* Centered Gold-Bordered Edit Trip Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-lg bg-white border border-[#C9A65B] hover:bg-[#FAF6EC] text-[13.5px] font-medium text-[#141416] transition-colors w-full max-w-[195px]"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#C59B3F]" />
                  Edit Trip
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
