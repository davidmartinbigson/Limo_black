"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CalendarCheck,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Copy,
  Mail,
  PhoneCall,
  XCircle,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Pencil,
  Plane,
  ShieldCheck,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { FleetClassId, GLOBAL_LOCATIONS } from "@/data/limoData";
import { ConfirmedBooking, useBooking } from "@/context/BookingContext";
import CanadianAddressInput from "@/components/CanadianAddressInput";

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
type CheckoutAccountMode = "guest" | "login" | "signup";

interface BookingVehicleOption {
  id: FleetClassId;
  category: Exclude<VehicleCategory, "all">;
  title: string;
  modelSubtitle: string;
  description: string;
  passengersLabel: string;
  luggageLabel: string;
  baseCad: number;
  extraKmCad: number;
  hourlyCad: number;
  image: string;
  bannerImage: string;
}

const BOOKING_VEHICLES: BookingVehicleOption[] = [
  {
    id: "business",
    category: "sedan",
    title: "Business Class Sedan",
    modelSubtitle: "Mercedes E-Class or similar",
    description: "Comfortable and stylish for everyday travel.",
    passengersLabel: "1 – 3",
    luggageLabel: "2",
    baseCad: 99,
    extraKmCad: 2.4,
    hourlyCad: 95,
    image: "/images/book-sedan-business.jpg",
    bannerImage: "/images/checkout-banner-sedan.jpg",
  },
  {
    id: "first",
    category: "sedan",
    title: "First Class Sedan",
    modelSubtitle: "BMW 7 Series / Mercedes S-Class or similar",
    description: "A higher level of comfort and premium amenities.",
    passengersLabel: "1 – 3",
    luggageLabel: "3",
    baseCad: 129,
    extraKmCad: 3.1,
    hourlyCad: 125,
    image: "/images/book-sedan-first.jpg",
    bannerImage: "/images/checkout-banner-first.jpg",
  },
  {
    id: "suv",
    category: "suv",
    title: "Business SUV",
    modelSubtitle: "Cadillac Escalade ESV or similar",
    description: "Spacious, versatile, and ideal for small groups.",
    passengersLabel: "1 – 6",
    luggageLabel: "6",
    baseCad: 149,
    extraKmCad: 3.5,
    hourlyCad: 145,
    image: "/images/book-suv-business.jpg",
    bannerImage: "/images/checkout-banner-suv.jpg",
  },
  {
    id: "van",
    category: "van",
    title: "Executive Van",
    modelSubtitle: "Mercedes-Benz Sprinter or similar",
    description: "Premium group travel with extra space and comfort.",
    passengersLabel: "7 – 14",
    luggageLabel: "10",
    baseCad: 229,
    extraKmCad: 4.5,
    hourlyCad: 215,
    image: "/images/book-van-executive.jpg",
    bannerImage: "/images/checkout-banner-van.jpg",
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

function CanadaFlagIcon() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="w-5 h-3.5 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] shrink-0"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#FFFFFF" />
      <rect x="0" y="0" width="6" height="16" fill="#D80621" />
      <rect x="18" y="0" width="6" height="16" fill="#D80621" />
      <path
        d="M12 2.4l1.05 2.15 1.85-.4-.65 2.2 1.65.45-1.45 1.35.4 1.15-2.35-.25V13h-1v-3.95l-2.35.25.4-1.15L8.1 6.8l1.65-.45-.65-2.2 1.85.4L12 2.4z"
        fill="#D80621"
      />
    </svg>
  );
}

export default function BookPage() {
  const {
    draft,
    updateDraft,
    updateCabin,
    confirmCurrentBooking,
    cancelBooking,
    user,
    registerAccount,
    loginAccount,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(2);
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory>("all");

  // Step 3 Passenger Details states matching reference checkout design
  const [accountMode, setAccountMode] = useState<CheckoutAccountMode>("guest");
  const [fullName, setFullName] = useState(() =>
    `${draft.firstName} ${draft.lastName}`.trim()
  );
  const [dialCountry, setDialCountry] = useState<"CA" | "US">("CA");
  const [airline, setAirline] = useState("");
  const [flightNumOnly, setFlightNumOnly] = useState(draft.flightNumber || "");
  const [specialRequests, setSpecialRequests] = useState(
    draft.cabin?.notes || ""
  );

  // Account password states when Log In or Create Account radio is chosen
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Step 4 payment method & terms states matching Review & Pay reference
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Confirmed reservation state
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  // Pre-fill passenger contact fields when user logs in
  useEffect(() => {
    if (user) {
      if (!fullName.trim() && user.name) {
        setFullName(user.name);
        const parts = user.name.trim().split(/\s+/);
        updateDraft({
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" "),
        });
      }
      if (!draft.email && user.email) {
        updateDraft({ email: user.email });
      }
      if (!draft.phone && user.phone) {
        updateDraft({ phone: user.phone });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    const parts = val.trim().split(/\s+/);
    updateDraft({
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" "),
    });
  };

  const handlePassengerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const combinedFlight = [airline.trim(), flightNumOnly.trim()]
      .filter(Boolean)
      .join(" · ");
    updateDraft({ flightNumber: combinedFlight });
    updateCabin({ notes: specialRequests.trim() });

    if (!user && (accountMode === "signup" || accountMode === "login")) {
      setSubmitting(true);
      try {
        if (accountMode === "signup") {
          const nameToSave = fullName.trim() || "VIP Passenger";
          const res = await registerAccount({
            name: nameToSave,
            email: draft.email,
            phone: draft.phone,
            password,
            company: companyName || undefined,
          });
          if (!res.ok) {
            setAuthError(
              res.error ||
                "An account with this email already exists. Select 'Log In to My Account'."
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!user) { setAuthError("Please go back and sign in or create an account to submit your booking. Guest booking is not available yet."); return; }
    if (!draft.pickup.trim() || (draft.rideType === "oneway" && !draft.dropoff.trim())) { setAuthError("Please enter your pickup and destination in Trip Details."); return; }
    setSubmitting(true);
    try {
      const result = await confirmCurrentBooking(selectedPriceCad, routeMetrics.distanceKm, routeMetrics.durationMin);
      setConfirmed(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) { setAuthError(error instanceof Error ? error.message : "Unable to submit booking."); }
    finally { setSubmitting(false); }
  };

  // =========================================================================
  // CONFIRMED RESERVATION VIEW
  // =========================================================================
  if (confirmed) {
    const cancelled = confirmed.status === "Cancelled";
    const calendarDownload = () => {
      if (!confirmed.date || !confirmed.time) return;
      const start = `${confirmed.date.replace(/-/g, "")}T${confirmed.time.replace(/:/g, "").slice(0, 4)}00`;
      const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
      const event = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LimoBlack//Booking//EN", "BEGIN:VEVENT", `UID:${confirmed.reference}@limoblack.ca`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART:${start}`, `DURATION:PT${confirmed.durationMin || 60}M`, "SUMMARY:LimoBlack ride", `LOCATION:${escapeIcs(confirmed.pickup || pickupSummary)}`, `DESCRIPTION:${escapeIcs(`Reservation ${confirmed.reference} - Destination: ${confirmed.dropoff || dropoffSummary}`)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const url = URL.createObjectURL(new Blob([event], { type: "text/calendar;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${confirmed.reference}.ics`;
      link.click();
      URL.revokeObjectURL(url);
    };
    const copyReference = async () => {
      try {
        await navigator.clipboard.writeText(confirmed.reference);
        setCopyMessage("Copied!");
      } catch {
        setCopyMessage("Unable to copy. Please select the reference instead.");
      }
    };
    const buttonClass = "inline-flex min-h-[54px] items-center justify-center gap-3 rounded-2xl border border-[#181818] px-5 text-sm font-bold transition-colors hover:bg-[#f4f2ed]";

    return (
      <div className="min-h-screen bg-[#fdfdfc] pt-20 text-[#111113]">
        <section className="relative overflow-hidden bg-[#09090a] text-white">
          <img src={selectedVehicle.bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090a] via-[#09090a]/90 to-[#09090a]/20" />
          <div className="relative mx-auto flex max-w-[1440px] items-start gap-5 px-5 py-12 sm:gap-7 sm:px-8 lg:px-10">
            <CheckCircle2 className="mt-1 h-14 w-14 shrink-0 text-[#d5a339] sm:h-20 sm:w-20" strokeWidth={1.5} />
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{cancelled ? "Booking Cancelled" : "Booking Request Received!"}</h1>
              <p className="mt-3 text-base text-white/75 sm:text-xl">{cancelled ? "Your reservation has been cancelled." : "Your booking request has been saved. Dispatch and payment are pending."}</p>
              <button type="button" onClick={copyReference} className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-[#c99428] bg-black/40 px-5 py-3 text-sm text-[#edc46d] sm:text-base" aria-label="Copy reservation number">
                Reservation #: <strong className="text-lg text-white">{confirmed.reference}</strong><Copy className="ml-2 h-5 w-5" />
              </button>
              <p className="mt-1 text-xs text-white/80" role="status">{copyMessage}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-3">
            <section className="rounded-2xl border border-[#e2e2e2] bg-[#fafafa] p-6 sm:p-7">
              <h2 className="flex items-center gap-4 text-xl font-bold"><Calendar className="h-7 w-7" />Trip Details</h2>
              <div className="mt-7 space-y-5 text-sm font-medium sm:text-base">
                <div className="flex gap-5"><MapPin className="h-6 w-6 shrink-0" /><div><p>{formatShortLocation(confirmed.pickup, "Toronto Pearson (YYZ)")}</p><p className="mt-4">{confirmed.rideType === "hourly" ? `${confirmed.durationHours} Hours Hourly Charter` : formatShortLocation(confirmed.dropoff, "Royal York Hotel, Toronto")}</p></div></div>
                <div className="flex items-center gap-5"><Calendar className="h-6 w-6 shrink-0" />{formatDisplayDate(confirmed.date)}</div>
                <div className="flex items-center gap-5"><Clock className="h-6 w-6 shrink-0" />{formatDisplayTime(confirmed.time)}</div>
                <div className="flex items-center gap-5"><Users className="h-6 w-6 shrink-0" />{confirmed.passengersCount || 1} {(confirmed.passengersCount || 1) === 1 ? "Passenger" : "Passengers"}</div>
              </div>
            </section>
            <section className="rounded-2xl border border-[#e2e2e2] bg-[#fafafa] p-6 sm:p-7">
              <h2 className="flex items-center gap-4 text-xl font-bold"><CarFront className="h-7 w-7" />Your Vehicle</h2>
              <img src={selectedVehicle.image} alt={selectedVehicle.title} className="mx-auto mt-2 h-36 w-full object-contain mix-blend-multiply" />
              <div className="mx-auto max-w-[340px]"><h3 className="text-xl font-bold">{selectedVehicle.title}</h3><p className="mt-1 text-sm text-[#454545]">{selectedVehicle.modelSubtitle}</p>
                <div className="mt-4 flex items-center gap-5 text-sm font-medium"><span className="flex items-center gap-2"><User className="h-6 w-6" />{selectedVehicle.passengersLabel}</span><span className="h-5 border-l border-[#ddd]" /><span className="flex items-center gap-2"><Briefcase className="h-6 w-6" />{selectedVehicle.luggageLabel}</span></div>
              </div>
            </section>
            <section className="rounded-2xl border border-[#e2e2e2] bg-[#fafafa] p-6 sm:p-7">
              <h2 className="flex items-center gap-4 text-xl font-bold"><CreditCard className="h-7 w-7" />Payment Summary</h2>
              <div className="mt-8 flex justify-between gap-3 text-base font-medium"><span>Estimated Fare</span><span>CAD ${confirmed.totalUsd.toFixed(2)}</span></div>
              <div className="mt-4 flex justify-between gap-3 border-t border-[#dedede] pt-4 text-lg font-bold"><span>Estimated Total (CAD)</span><span>CAD ${confirmed.totalUsd.toFixed(2)}</span></div>
              <div className="mt-8 rounded-xl bg-[#fff5df] px-4 py-4 text-sm font-bold text-[#785400]">Payment not yet processed</div>
              <p className="mt-3 text-sm text-[#454545]">No payment has been collected and no confirmation email has been sent through this site.</p>
            </section>
          </div>

          <div className="mx-auto mt-8 grid max-w-[1240px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={calendarDownload} disabled={!confirmed.date || !confirmed.time || cancelled} className={`${buttonClass} border-[#d19a2d] bg-gradient-to-b from-[#f8c35d] to-[#d99517] hover:from-[#f8cc76] disabled:opacity-50`}><Calendar className="h-5 w-5" />Add to Calendar</button>
            <button type="button" disabled title="Email confirmations are not available yet" className={`${buttonClass} cursor-not-allowed opacity-50`}><Mail className="h-5 w-5" />Resend Confirmation</button>
            <Link href={user ? "/account" : "/login"} className={buttonClass}><Pencil className="h-5 w-5" />Modify Booking</Link>
            <button type="button" disabled={cancelled} onClick={async () => { if (window.confirm("Are you sure you want to cancel this booking?") && await cancelBooking(confirmed.reference)) setConfirmed({ ...confirmed, status: "Cancelled" }); }} className={`${buttonClass} border-[#b32727] text-[#b32727] hover:bg-[#fff5f5] disabled:opacity-50`}><XCircle className="h-5 w-5" />{cancelled ? "Booking Cancelled" : "Cancel Booking"}</button>
          </div>
          {!user && <p className="mt-3 text-center text-xs text-[#666]">Sign in to your account to manage your rides.</p>}
          <p className="mt-5 text-center text-xs text-[#666]">A payment receipt is not available until payment is processed.</p>

          <section className="mt-10 grid gap-7 rounded-2xl bg-[#f8f6f1] px-7 py-8 sm:grid-cols-2 lg:grid-cols-[0.8fr_1fr_1fr_1fr] lg:items-center">
            <h2 className="text-2xl font-bold">What’s Next?</h2>
            <div className="flex gap-4"><Mail className="h-8 w-8 shrink-0 text-[#c99220]" /><div><h3 className="font-bold">Save Your Reference</h3><p className="mt-1 text-sm text-[#454545]">Keep your reservation number for your records.</p></div></div>
            <div className="flex gap-4 lg:border-l lg:border-[#dedbd5] lg:pl-7"><PhoneCall className="h-8 w-8 shrink-0 text-[#c99220]" /><div><h3 className="font-bold">Driver Assignment</h3><p className="mt-1 text-sm text-[#454545]">Check your account for your driver’s details.</p></div></div>
            <div className="flex gap-4 lg:border-l lg:border-[#dedbd5] lg:pl-7"><MapPin className="h-8 w-8 shrink-0 text-[#c99220]" /><div><h3 className="font-bold">Your Ride</h3><p className="mt-1 text-sm text-[#454545]">View your booking details in your account.</p></div></div>
          </section>
        </div>
      </div>
    );
  }

  const isCheckoutStage = step === 3 || step === 4;

  // Reusable Right Sidebar "Your Booking" Card for Steps 3 & 4
  const renderYourBookingSidebar = () => (
    <div className="rounded-2xl bg-[#F9F8F5] border border-[#EAE8E0] overflow-hidden shadow-[0_4px_22px_rgba(0,0,0,0.04)]">
      {/* Dark Night Hotel Vehicle Header Banner */}
      <div className="relative h-[222px] bg-[#0B0B0D] rounded-b-2xl overflow-hidden">
        <img
          src={selectedVehicle.bannerImage}
          alt={selectedVehicle.title}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090C]/90 via-[#09090C]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090C]/92 via-transparent to-[#09090C]/45" />

        <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
          <h2 className="text-[19px] font-bold text-white tracking-tight">
            Your Booking
          </h2>

          <div>
            <h3 className="text-[18px] font-bold text-white leading-snug">
              {selectedVehicle.title}
            </h3>
            {step === 3 && (
              <>
                <p className="text-[12.5px] text-white/80 mt-0.5">
                  {selectedVehicle.modelSubtitle}
                </p>

                <div className="flex items-center gap-3.5 mt-2.5 text-[12.5px] font-medium text-white/95">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 stroke-[2]" />
                    {selectedVehicle.passengersLabel}
                  </span>
                  <span className="h-3.5 w-px bg-white/25" />
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 stroke-[2]" />
                    {selectedVehicle.luggageLabel}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trip Details List */}
      <div className="px-6 py-5 space-y-3.5 border-b border-[#E8E6DF] text-[14px] text-[#1E1E22]">
        <div>
          <div className="flex items-start gap-3.5">
            <MapPin className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 mt-0.5 stroke-[1.9]" />
            <span className="font-medium leading-snug">{pickupSummary}</span>
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

        <div className="flex items-center gap-3.5 pt-0.5">
          <Calendar className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
          <span className="font-medium">{formatDisplayDate(draft.date)}</span>
        </div>

        <div className="flex items-center gap-3.5">
          <Clock className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
          <span className="font-medium">{formatDisplayTime(draft.time)}</span>
        </div>

        <div className="flex items-center gap-3.5">
          <Users className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
          <span className="font-medium">
            {draft.passengersCount || 1}{" "}
            {(draft.passengersCount || 1) === 1 ? "Passenger" : "Passengers"}
          </span>
        </div>
      </div>

      {/* Price Breakdown:
          - Step 4: Trip Fare + Warm Cream Total (CAD) Box
          - Step 3: Total Price + All-inclusive note */}
      {step === 4 ? (
        <div className="px-6 py-5 border-b border-[#E8E6DF] space-y-3">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-bold text-[#141416]">Estimated Fare</span>
            <span className="font-extrabold text-[#111113]">
              CAD ${selectedPriceCad}
            </span>
          </div>

          <div className="rounded-xl bg-[#F5EFE1] px-4 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[16px] font-bold text-[#111113]">
              Total (CAD)
            </span>
            <div className="flex items-baseline gap-1 text-[#111113]">
              <span className="text-[16px] font-extrabold tracking-tight">
                CAD
              </span>
              <span className="text-[27px] font-extrabold leading-none tracking-tight">
                ${selectedPriceCad}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-5 border-b border-[#E8E6DF] flex items-center justify-between gap-4">
          <div>
            <div className="text-[17px] font-bold text-[#111113] leading-snug">
              Total Price
            </div>
            <div className="text-[12px] text-[#66666C] mt-0.5">
              All-inclusive (taxes &amp; fees included)
            </div>
          </div>
          <div className="flex items-baseline gap-1 text-[#111113] shrink-0">
            <span className="text-[15px] font-bold tracking-tight">CAD</span>
            <span className="text-[28px] font-extrabold leading-none tracking-tight">
              ${selectedPriceCad}
            </span>
          </div>
        </div>
      )}

      {/* 3 Gold Trust Badges Strip */}
      <div className="px-3 py-4 grid grid-cols-3 divide-x divide-[#E6E4DC] text-center bg-[#F9F8F5]">
        <div className="px-1 flex flex-col items-center justify-center gap-1.5">
          <ShieldCheck className="w-5 h-5 text-[#C89B3C] stroke-[1.9]" />
          <span className="text-[11.5px] font-medium text-[#2A2A2E] leading-tight">
            {step === 4 ? "Payment Pending" : "Booking Request"}
          </span>
        </div>
        <div className="px-1 flex flex-col items-center justify-center gap-1.5">
          <CalendarCheck className="w-5 h-5 text-[#C89B3C] stroke-[1.9]" />
          <span className="text-[11.5px] font-medium text-[#2A2A2E] leading-tight">
            Free Changes
          </span>
        </div>
        <div className="px-1 flex flex-col items-center justify-center gap-1.5">
          <Headphones className="w-5 h-5 text-[#C89B3C] stroke-[1.9]" />
          <span className="text-[11.5px] font-medium text-[#2A2A2E] leading-tight">
            24/7 Support
          </span>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // MAIN 4-STEP BOOKING & CHECKOUT PAGE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#141416] pt-16 sm:pt-[74px] pb-16">
      {/* Top 4-Step Progress Bar:
          - Dark Obsidian Sub-Bar on Steps 3 & 4 (matching Checkout reference)
          - Clean Light Stepper on Steps 1 & 2 (matching Vehicle Selector reference) */}
      {isCheckoutStage ? (
        <div className="w-full bg-[#101013] border-b border-white/10 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-center">
            {STEPS.map((s, idx) => {
              const isCompleted = s.num < step;
              const isActive = s.num === step;

              return (
                <React.Fragment key={s.num}>
                  <button
                    type="button"
                    onClick={() => setStep(s.num)}
                    className="flex items-center gap-2 sm:gap-2.5 focus:outline-none"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isCompleted || isActive
                          ? "bg-[#D8AF4F] text-[#111113]"
                          : "bg-transparent border border-white/30 text-white/70 font-medium"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.7]" />
                      ) : (
                        s.num
                      )}
                    </span>
                    <span
                      className={`text-xs sm:text-[13.5px] whitespace-nowrap ${
                        isActive
                          ? "font-bold text-white"
                          : isCompleted
                          ? "font-medium text-white/90 hidden sm:inline"
                          : "font-normal text-white/60 hidden sm:inline"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 md:w-20 h-[1.5px] mx-2.5 sm:mx-4 shrink-0 ${
                        s.num < step ? "bg-[#C8A24D]" : "bg-white/20"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
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
      )}

      {/* Step Title & Subtitle:
          - Left-aligned inside container on Steps 3 & 4 (matching Checkout reference)
          - Centered on Steps 1 & 2 (matching Vehicle Selector reference) */}
      {isCheckoutStage ? (
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-9 pb-6">
          <h1 className="font-serif text-3xl sm:text-[38px] font-bold text-[#111113] tracking-tight leading-tight">
            {step === 3 ? "Passenger Details" : "Review & Pay"}
          </h1>
          <p className="text-sm sm:text-[15.5px] text-[#4E4E54] mt-1.5">
            {step === 3
              ? "Provide your details to confirm the booking."
              : "Review your trip details and submit a booking request."}
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 text-center mb-8 sm:mb-9">
          <h1 className="font-serif text-3xl sm:text-[40px] font-bold text-[#111113] tracking-tight leading-tight">
            {step === 1 ? "Trip Details" : "Choose Your Vehicle"}
          </h1>
          <p className="text-sm sm:text-[16px] text-[#4E4E54] mt-2">
            {step === 1
              ? "Enter or update your pickup, destination, and schedule."
              : "Select the vehicle that best fits your trip."}
          </p>
        </div>
      )}

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
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-b from-[#DFBC6A] to-[#C69838] hover:from-[#E5C476] hover:to-[#CE9F3E] text-sm font-bold text-[#111113] transition-all"
                  >
                    Continue to Vehicles
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE VEHICLE */}
            {step === 2 && (
              <div>
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
                          <div className="w-full sm:w-[205px] h-[106px] flex items-center justify-center shrink-0">
                            <img
                              src={v.image}
                              alt={v.title}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>

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
                                  window.scrollTo({ top: 0, behavior: "smooth" });
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
                                  setStep(3);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
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

            {/* ============================================================= */}
            {/* STEP 3: PASSENGER DETAILS (EXACT MATCH TO CHECKOUT REFERENCE) */}
            {/* ============================================================= */}
            {step === 3 && (
              <form
                onSubmit={handlePassengerSubmit}
                className="rounded-2xl bg-white border border-[#E6E6E2] shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-6"
              >
                {/* Top 3 Booking Mode Radio Cards */}
                {user ? (
                  <div className="rounded-xl bg-[#FAF6EC] border border-[#CEAA56] px-4 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#B88E35] shrink-0" />
                      <span className="text-[#141416]">
                        Signed in as{" "}
                        <strong className="font-semibold">{user.name}</strong> (
                        {user.email})
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#9C7625] shrink-0">
                      Saved to Account
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-6 border-b border-[#EFEFEB]">
                    {(
                      [
                        {
                          id: "guest",
                          title: "Book as a Guest",
                          desc: "Quick booking, no account required",
                          icon: User,
                        },
                        {
                          id: "login",
                          title: "Log In to My Account",
                          desc: "Book faster and manage your rides",
                          icon: User,
                        },
                        {
                          id: "signup",
                          title: "Create an Account",
                          desc: "Save details, view bookings & more",
                          icon: UserPlus,
                        },
                      ] as const
                    ).map((opt) => {
                      const active = accountMode === opt.id;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setAccountMode(opt.id);
                            setAuthError("");
                          }}
                          className={`text-left rounded-xl px-3.5 py-3.5 transition-all flex items-start gap-2.5 ${
                            active
                              ? "bg-[#FAF6EC] border-[1.5px] border-[#CEAA56]"
                              : "bg-[#FAFAFA] hover:bg-[#F6F5F0] border border-[#E6E6E2]"
                          }`}
                        >
                          <span
                            className={`mt-0.5 w-[17px] h-[17px] rounded-full flex items-center justify-center shrink-0 ${
                              active
                                ? "bg-[#D8AF4F]"
                                : "bg-white border-[1.5px] border-[#B8B8BE]"
                            }`}
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#111113]" />
                            )}
                          </span>

                          <Icon className="w-[18px] h-[18px] text-[#141416] shrink-0 mt-0.5 stroke-[1.9]" />

                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-[#111113] leading-snug">
                              {opt.title}
                            </div>
                            <div className="text-[11px] text-[#5E5E65] leading-snug mt-0.5">
                              {opt.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Section 1: Contact Information */}
                <div className="space-y-4 pb-6 border-b border-[#EFEFEB]">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-[#141416] stroke-[1.9]" />
                    <h2 className="text-[16.5px] font-bold text-[#111113]">
                      Contact Information
                    </h2>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] placeholder:text-[#8A8A92] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email + Phone Number with Canadian Flag Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={draft.email}
                        onChange={(e) => updateDraft({ email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] placeholder:text-[#8A8A92] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-stretch rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus-within:border-[#C8A24D] focus-within:bg-white overflow-hidden transition-colors">
                        <div className="relative flex items-center gap-1.5 px-3 bg-white border-r border-[#E4E4DF] shrink-0">
                          <CanadaFlagIcon />
                          <ChevronDown className="w-3.5 h-3.5 text-[#55555B]" />
                          <select
                            aria-label="Country code"
                            value={dialCountry}
                            onChange={(e) =>
                              setDialCountry(e.target.value as "CA" | "US")
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          >
                            <option value="CA">Canada (+1)</option>
                            <option value="US">United States (+1)</option>
                          </select>
                        </div>

                        <input
                          type="tel"
                          required
                          value={draft.phone}
                          onChange={(e) =>
                            updateDraft({ phone: e.target.value })
                          }
                          placeholder="+1 (416) 000-0000"
                          className="flex-1 min-w-0 px-3.5 py-3 bg-transparent text-sm text-[#141416] placeholder:text-[#8A8A92] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Password Fields ONLY when Log In or Create Account is selected */}
                  {!user && (accountMode === "login" || accountMode === "signup") && (
                    <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                          {accountMode === "signup"
                            ? "Create Password (Min. 8 chars)"
                            : "Account Password"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPass ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] focus:outline-none"
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

                      {accountMode === "signup" && (
                        <div>
                          <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                            Company Name{" "}
                            <span className="font-normal text-[#66666B]">
                              (Optional)
                            </span>
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="For GST/HST corporate receipt"
                            className="w-full px-4 py-3 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {authError && (
                    <p className="text-xs font-semibold text-red-600">
                      {authError}
                    </p>
                  )}
                </div>

                {/* Section 2: Flight Details (Optional) */}
                <div className="space-y-3.5 pb-6 border-b border-[#EFEFEB]">
                  <div className="flex items-start gap-2.5">
                    <Plane className="w-5 h-5 text-[#141416] stroke-[1.9] shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-[16.5px] font-bold text-[#111113] leading-snug">
                        Flight Details{" "}
                        <span className="text-[13.5px] font-normal text-[#55555A]">
                          (Optional)
                        </span>
                      </h2>
                      <p className="text-[12.5px] text-[#5E5E65] mt-0.5">
                        For airport pickups, add your flight for real-time
                        tracking.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                        Airline
                      </label>
                      <input
                        type="text"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        placeholder="e.g., Air Canada"
                        className="w-full px-4 py-3 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] placeholder:text-[#8A8A92] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1E1E22] mb-1.5">
                        Flight Number
                      </label>
                      <input
                        type="text"
                        value={flightNumOnly}
                        onChange={(e) => setFlightNumOnly(e.target.value)}
                        placeholder="e.g., AC123"
                        className="w-full px-4 py-3 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] placeholder:text-[#8A8A92] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Special Requests (Optional) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-[#141416] stroke-[1.9]" />
                    <h2 className="text-[16.5px] font-bold text-[#111113]">
                      Special Requests{" "}
                      <span className="text-[13.5px] font-normal text-[#55555A]">
                        (Optional)
                      </span>
                    </h2>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      maxLength={250}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g., child seat, extra luggage, meet & greet, etc."
                      className="w-full px-4 py-3 pb-7 rounded-lg bg-[#FCFCFB] border border-[#DFDFDB] focus:border-[#C8A24D] focus:bg-white text-sm text-[#141416] placeholder:text-[#8A8A92] focus:outline-none resize-none transition-colors"
                    />
                    <span className="absolute bottom-2.5 right-3.5 text-[11.5px] text-[#6E6E76] pointer-events-none">
                      {specialRequests.length} / 250
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#C9A65B] hover:bg-[#FAF6EC] text-sm font-semibold text-[#141416] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#B88E35]" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#DFBC6A] to-[#C69838] hover:from-[#E6C577] hover:to-[#CF9F3E] text-[15px] font-bold text-[#111113] shadow-[0_4px_14px_rgba(198,152,56,0.28)] transition-all disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Continue to Review
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================= */}
            {/* STEP 4: REVIEW & PAY (EXACT 3-CARD LAYOUT MATCHING REFERENCE) */}
            {/* ============================================================= */}
            {step === 4 && (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {authError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{authError}</p>}
                <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">No payment is collected now. This is a booking request; fare and dispatch are not yet confirmed.</p>
                {/* CARD 1: Trip Details */}
                <div className="rounded-2xl bg-white border border-[#E6E6E2] shadow-[0_2px_12px_rgba(0,0,0,0.025)] px-6 py-5">
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#F2F2EE]">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-[#141416] stroke-[1.9]" />
                      <h2 className="text-[16.5px] font-bold text-[#111113]">
                        Trip Details
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#B3882E] hover:text-[#966F1E] transition-colors"
                    >
                      <span>Edit</span>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Route Row */}
                  <div className="py-3.5 border-b border-[#F2F2EE] flex flex-wrap items-center gap-3 sm:gap-6 text-[14.5px] font-bold text-[#111113]">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-[18px] h-[18px] text-[#141416] stroke-[1.9] shrink-0" />
                      {pickupSummary}
                    </span>

                    <ArrowRight className="w-4 h-4 text-[#44444A] shrink-0" />

                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-[18px] h-[18px] text-[#141416] stroke-[1.9] shrink-0" />
                      {dropoffSummary}
                    </span>
                  </div>

                  {/* Date, Time & Passengers Row */}
                  <div className="pt-3.5 flex flex-wrap items-center justify-between gap-4 text-[13.5px] font-medium text-[#1E1E22]">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-[17px] h-[17px] text-[#252529] stroke-[1.9]" />
                      {formatDisplayDate(draft.date)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-[17px] h-[17px] text-[#252529] stroke-[1.9]" />
                      {formatDisplayTime(draft.time)}
                    </span>

                    <span className="inline-flex items-center gap-2 sm:pr-8">
                      <Users className="w-[17px] h-[17px] text-[#252529] stroke-[1.9]" />
                      {draft.passengersCount || 1}{" "}
                      {(draft.passengersCount || 1) === 1
                        ? "Passenger"
                        : "Passengers"}
                    </span>
                  </div>
                </div>

                {/* CARD 2: Selected Vehicle */}
                <div className="rounded-2xl bg-white border border-[#E6E6E2] shadow-[0_2px_12px_rgba(0,0,0,0.025)] px-6 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <CarFront className="w-5 h-5 text-[#141416] stroke-[1.9]" />
                      <h2 className="text-[16.5px] font-bold text-[#111113]">
                        Selected Vehicle
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#B3882E] hover:text-[#966F1E] transition-colors"
                    >
                      <span>Edit</span>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-full sm:w-[205px] h-[98px] flex items-center justify-center shrink-0">
                      <img
                        src={selectedVehicle.image}
                        alt={selectedVehicle.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div>
                      <h3 className="text-[16.5px] font-bold text-[#111113] leading-snug">
                        {selectedVehicle.title}
                      </h3>
                      <p className="text-[13.5px] text-[#55555B] mt-0.5">
                        {selectedVehicle.modelSubtitle}
                      </p>

                      <div className="flex items-center gap-5 mt-3 text-[13.5px] font-medium text-[#1A1A1E]">
                        <span className="inline-flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#252529] stroke-[1.9]" />
                          {selectedVehicle.passengersLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#252529] stroke-[1.9]" />
                          {selectedVehicle.luggageLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: Payment Method */}
                <div className="rounded-2xl bg-white border border-[#E6E6E2] shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <CreditCard className="w-5 h-5 text-[#141416] stroke-[1.9]" />
                    <h2 className="text-[16.5px] font-bold text-[#111113]">
                      Payment Method
                    </h2>
                  </div>

                  <p className="text-sm leading-relaxed text-[#555]">Online payment is not available yet. No card or payment details are collected.</p>

                  {/* Terms & Cancellation Agreement Checkbox */}
                  <label className="mt-5 inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                        agreedTerms
                          ? "bg-[#D8AF4F] text-[#111113]"
                          : "bg-white border border-[#B8B8BE]"
                      }`}
                    >
                      {agreedTerms && (
                        <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                      )}
                    </span>
                    <span className="text-[13px] text-[#222226]">
                      I agree to the{" "}
                      <span className="underline underline-offset-2 font-medium text-[#111113]">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="underline underline-offset-2 font-medium text-[#111113]">
                        Cancellation Policy
                      </span>
                      .
                    </span>
                  </label>

                  {/* Bottom Back + Confirm & Pay Buttons */}
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(3);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white border border-[#C9A65B] hover:bg-[#FAF6EC] text-sm font-semibold text-[#141416] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#B88E35]" />
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={!agreedTerms || submitting}
                      className="inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-xl bg-gradient-to-b from-[#DFBC6A] to-[#C69838] hover:from-[#E6C577] hover:to-[#CF9F3E] text-[15px] font-bold text-[#111113] shadow-[0_4px_14px_rgba(198,152,56,0.28)] transition-all disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4 text-[#111113] stroke-[2.3]" />
                      {submitting ? "Submitting..." : "Submit Booking Request"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN (4 Cols):                                          */}
          {/* - "Your Booking" Photo Card on Steps 3 & 4                      */}
          {/* - Clean "Trip Summary" Card on Steps 1 & 2                      */}
          {/* =============================================================== */}
          <aside className={`lg:col-span-4 ${isCheckoutStage ? "" : "lg:mt-2"}`}>
            {isCheckoutStage ? (
              renderYourBookingSidebar()
            ) : (
              <div className="rounded-2xl bg-[#F7F6F2] border border-[#ECEAE2] p-6 sm:p-7">
                <h2 className="text-[18px] font-bold text-[#141416] mb-5">
                  Trip Summary
                </h2>

                <div className="space-y-4 text-[14px] text-[#1E1E22]">
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

                  <div className="flex items-center gap-3.5 pt-1">
                    <Calendar className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
                    <span className="font-medium">
                      {formatDisplayDate(draft.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <Clock className="w-[18px] h-[18px] text-[#1E1E22] shrink-0 stroke-[1.9]" />
                    <span className="font-medium">
                      {formatDisplayTime(draft.time)}
                    </span>
                  </div>

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
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
