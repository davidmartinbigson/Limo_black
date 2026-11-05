"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  Bookmark,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Crown,
  Edit3,
  FileText,
  LogOut,
  MapPin,
  Navigation,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import { FLEET_CLASSES } from "@/data/limoData";
import {
  CabinPreferences,
  ConfirmedBooking,
  SavedPlace,
  useBooking,
} from "@/context/BookingContext";
import CanadianAddressInput from "@/components/CanadianAddressInput";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";
import BrandLogo from "@/components/BrandLogo";

export default function AccountDashboardPage() {
  const router = useRouter();
  const {
    user,
    bookings,
    loyaltyPoints,
    formatPrice,
    signOut,
    updateUserProfile,
    addSavedPlace,
    removeSavedPlace,
    updateDraft,
    updateCabin,
    cancelBooking,
    advanceBookingStatus,
    updateBookingSchedule,
    rateBooking,
  } = useBooking();

  const [activeTab, setActiveTab] = useState<"rides" | "places" | "profile">(
    "rides"
  );
  const [invoiceBooking, setInvoiceBooking] = useState<ConfirmedBooking | null>(
    null
  );

  // Edit schedule state
  const [editingRef, setEditingRef] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Rating state
  const [ratingRef, setRatingRef] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Saved places state
  const [placeLabel, setPlaceLabel] = useState<SavedPlace["label"]>("Office");
  const [placeAddress, setPlaceAddress] = useState("");
  const [placeCoords, setPlaceCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Profile editor state
  const [profName, setProfName] = useState(user?.name || "");
  const [profPhone, setProfPhone] = useState(user?.phone || "");
  const [profCompany, setProfCompany] = useState(user?.company || "");
  const [prefTemp, setPrefTemp] = useState<CabinPreferences["temperature"]>(
    user?.defaultCabin?.temperature || "21°C Balanced"
  );
  const [prefDrink, setPrefDrink] = useState<CabinPreferences["refreshment"]>(
    user?.defaultCabin?.refreshment || "Still Artisan Water"
  );
  const [prefConv, setPrefConv] = useState<CabinPreferences["conversation"]>(
    user?.defaultCabin?.conversation || "Discreet Silence"
  );
  const [prefLang, setPrefLang] = useState<
    "English" | "Français" | "Bilingual EN/FR"
  >(user?.preferredLanguage || "English");
  const [profileSaved, setProfileSaved] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-3xl bg-card border border-line/12 p-8 sm:p-10 text-center space-y-6 shadow-luxury">
          <div className="flex justify-center">
            <BrandLogo size="md" showCanadaBadge />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-bold">
            Sign In to View Your Personal Account
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Access your private limousine bookings, live chauffeur GPS dispatch,
            saved Canadian addresses, Obsidian Loyalty Points, and official CRA
            GST/HST receipts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-full bg-field border border-line/15 text-ink font-semibold text-xs uppercase tracking-[0.16em] hover:border-champagne-500/40"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((acc, b) => acc + b.totalUsd, 0);
  const nextTierPoints = 15000;
  const progressPct = Math.min(
    100,
    Math.round(((loyaltyPoints || 500) / nextTierPoints) * 100)
  );

  const handleRebook = (b: ConfirmedBooking) => {
    const parts = user.name.trim().split(" ");
    updateDraft({
      rideType: b.rideType,
      pickup: b.pickup,
      dropoff: b.dropoff,
      pickupCoords: b.pickupCoords,
      dropoffCoords: b.dropoffCoords,
      durationHours: b.durationHours,
      selectedClassId: b.selectedClassId,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      email: user.email,
      phone: user.phone,
    });
    router.push("/book");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const nextCabin: CabinPreferences = {
      temperature: prefTemp,
      refreshment: prefDrink,
      conversation: prefConv,
      childSeat: user.defaultCabin?.childSeat || "None",
      notes: user.defaultCabin?.notes || "",
    };
    updateUserProfile({
      name: profName,
      phone: profPhone,
      company: profCompany,
      preferredLanguage: prefLang,
      defaultCabin: nextCabin,
    });
    const parts = profName.trim().split(" ");
    updateDraft({
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      phone: profPhone,
    });
    updateCabin(nextCabin);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* VIP Personal Header Card */}
        <div className="rounded-3xl bg-card border border-champagne-500/30 p-6 sm:p-8 shadow-luxury relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-champagne-500/12 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gold-gradient text-obsidian-950 font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-gold-glow">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-champagne-500/15 border border-champagne-500/35 text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                    {user.tier}
                  </span>
                  {user.company && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Building2 className="w-3.5 h-3.5 text-accent" />
                      {user.company}
                    </span>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-300 font-bold"
                    >
                      Open Admin Dispatch →
                    </Link>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl text-ink font-semibold">
                  Welcome, {user.name}
                </h1>
                <p className="text-xs sm:text-sm text-muted">
                  {user.email} • {user.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/book"
                className="px-5 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.14em] shadow-gold-glow hover:brightness-110 transition-all"
              >
                + Book New Limousine
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="px-4 py-3 rounded-full bg-field border border-line/15 text-xs font-semibold text-muted hover:text-rose-500 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* Personal Account Metrics + Obsidian Loyalty Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7 pt-6 border-t border-line/10">
            <div className="p-4 rounded-2xl bg-field border border-line/10">
              <p className="text-[11px] uppercase tracking-wider text-subtle font-semibold">
                My Personal Rides
              </p>
              <p className="font-serif text-3xl text-ink font-bold mt-1">
                {bookings.length}
              </p>
              <p className="text-xs text-muted mt-0.5">
                Private to {user.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-field border border-line/10">
              <p className="text-[11px] uppercase tracking-wider text-subtle font-semibold">
                Total Chauffeur Spend
              </p>
              <p className="font-serif text-3xl text-accent font-bold mt-1">
                {formatPrice(totalSpent)}
              </p>
              <p className="text-xs text-muted mt-0.5">
                CRA GST/HST Invoices Ready
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-field border border-champagne-500/25">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Obsidian Loyalty Points
                </p>
                <span className="font-mono text-sm font-bold text-ink">
                  {loyaltyPoints.toLocaleString()} pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-line/10 overflow-hidden mt-3">
                <div
                  className="h-full bg-gold-gradient rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-muted mt-1.5">
                Earn 10 pts per CA$1 • Complimentary First-Class upgrade at
                15,000 pts
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line/10 pb-3">
          {[
            {
              id: "rides" as const,
              label: `My Chauffeur Rides (${bookings.length})`,
              icon: Car,
            },
            {
              id: "places" as const,
              label: `Saved Canadian Addresses (${user.savedPlaces?.length || 0})`,
              icon: Bookmark,
            },
            {
              id: "profile" as const,
              label: "Personal Details & Cabin Profile",
              icon: Sliders,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-champagne-500 text-obsidian-950 shadow-gold-glow"
                  : "bg-card border border-line/12 text-muted hover:text-ink"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MY PERSONAL RIDES */}
        {activeTab === "rides" && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="rounded-3xl bg-card border border-line/12 p-12 text-center space-y-4">
                <Car className="w-10 h-10 text-accent mx-auto" />
                <h2 className="font-serif text-2xl text-ink font-semibold">
                  No Rides Yet on Your Account
                </h2>
                <p className="text-sm text-muted max-w-md mx-auto">
                  Reserve your first chauffeured limousine across Toronto,
                  Vancouver, Montréal, Calgary, Ottawa, or Whistler. Every ride
                  you book appears right here with live GPS status and GST/HST
                  receipts.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em]"
                >
                  Book Your First Ride
                </Link>
              </div>
            ) : (
              bookings.map((b) => {
                const isCancelled = b.status === "Cancelled";
                const isCompleted = b.status === "Completed";
                const vehicle =
                  FLEET_CLASSES.find((f) => f.id === b.selectedClassId) ||
                  FLEET_CLASSES[0];

                return (
                  <div
                    key={b.reference}
                    className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 shadow-luxury space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-line/10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-xl bg-champagne-500/15 border border-champagne-500/35 font-mono text-xs text-accent font-bold">
                          {b.reference}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            isCancelled
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30"
                              : isCompleted
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {b.status}
                        </span>
                        {b.roundTrip && (
                          <span className="px-2.5 py-1 rounded-full bg-champagne-500/15 text-[10px] uppercase tracking-wider text-accent font-semibold">
                            Round-Trip Included
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setInvoiceBooking(b)}
                          className="px-3.5 py-2 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-accent" />
                          GST/HST Tax Invoice
                        </button>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-subtle block">
                            All-Inclusive Total
                          </span>
                          <span className="font-serif text-2xl font-bold text-ink">
                            {formatPrice(b.totalUsd)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Route & Chauffeur Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7 space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-accent mt-1 shrink-0" />
                          <div>
                            <span className="text-[11px] text-subtle block">
                              Pickup Location
                            </span>
                            <span className="text-sm font-medium text-ink">
                              {b.pickup}
                            </span>
                          </div>
                        </div>

                        {b.extraStops && b.extraStops.length > 0 && (
                          <div className="flex items-start gap-3 pl-2 border-l-2 border-champagne-500/40 ml-2">
                            <div>
                              <span className="text-[11px] text-accent font-semibold block">
                                Extra Intermediate Stops ({b.extraStops.length})
                              </span>
                              <span className="text-xs text-muted">
                                {b.extraStops.join(" • ")}
                              </span>
                            </div>
                          </div>
                        )}

                        {b.rideType === "oneway" ? (
                          <div className="flex items-start gap-3">
                            <Navigation className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                            <div>
                              <span className="text-[11px] text-subtle block">
                                Dropoff Location
                              </span>
                              <span className="text-sm font-medium text-ink">
                                {b.dropoff}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <Clock className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                            <div>
                              <span className="text-[11px] text-subtle block">
                                As-Directed Hourly Charter
                              </span>
                              <span className="text-sm font-medium text-ink">
                                {b.durationHours} Hours Reserved
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2.5 pt-2 text-xs text-muted">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-field border border-line/10">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            {b.date} at {b.time}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-field border border-line/10">
                            <Car className="w-3.5 h-3.5 text-accent" />
                            {vehicle.name}
                          </span>
                          {b.flightNumber && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-field border border-line/10">
                              <Plane className="w-3.5 h-3.5 text-accent" />
                              {b.flightNumber}
                            </span>
                          )}
                        </div>

                        {b.vipAddons && b.vipAddons.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {b.vipAddons.map((addon) => (
                              <span
                                key={addon}
                                className="px-2.5 py-1 rounded-full bg-champagne-500/10 border border-champagne-500/25 text-[11px] text-accent font-medium"
                              >
                                ✦ {addon}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5 p-4 rounded-2xl bg-field border border-line/10 flex flex-col justify-between gap-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-accent font-semibold block">
                              Assigned Senior Chauffeur
                            </span>
                            <p className="font-serif text-lg text-ink font-semibold">
                              {b.chauffeur.name}
                            </p>
                            <p className="text-xs text-muted">
                              ★ {b.chauffeur.rating} • Plate:{" "}
                              <span className="font-mono text-ink">
                                {b.chauffeur.plate}
                              </span>
                            </p>
                          </div>
                          <a
                            href={`tel:${b.chauffeur.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-champagne-500/15 border border-champagne-500/35 text-xs text-accent font-semibold flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>
                        </div>

                        <div className="text-xs text-muted flex flex-wrap gap-2 pt-2 border-t border-line/10">
                          <span>Cabin: {b.cabin.temperature}</span>•
                          <span>{b.cabin.refreshment}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inline Edit Schedule Form */}
                    {editingRef === b.reference && (
                      <div className="p-4 rounded-2xl bg-field border border-champagne-500/35 space-y-3">
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                          Modify Pickup Time or Chauffeur Notes
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-card border border-line/15 text-xs text-ink"
                          />
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Special instructions..."
                            className="px-3 py-2 rounded-xl bg-card border border-line/15 text-xs text-ink"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              updateBookingSchedule(
                                b.reference,
                                editTime,
                                editNotes
                              );
                              setEditingRef(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-gold-gradient text-obsidian-950 text-xs font-bold"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRef(null)}
                            className="px-4 py-2 rounded-xl bg-card border border-line/15 text-xs text-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Chauffeur Rating Form */}
                    {ratingRef === b.reference && (
                      <div className="p-4 rounded-2xl bg-field border border-champagne-500/35 space-y-3">
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                          Rate Your Experience with {b.chauffeur.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setStars(n)}
                              className="p-1"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  n <= stars
                                    ? "text-champagne-400 fill-champagne-400"
                                    : "text-subtle"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share feedback on punctuality, vehicle & hospitality..."
                          className="w-full px-3.5 py-2 rounded-xl bg-card border border-line/15 text-xs text-ink"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              rateBooking(b.reference, stars, reviewText);
                              setRatingRef(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-gold-gradient text-obsidian-950 text-xs font-bold"
                          >
                            Submit Chauffeur Rating
                          </button>
                          <button
                            type="button"
                            onClick={() => setRatingRef(null)}
                            className="px-4 py-2 rounded-xl bg-card border border-line/15 text-xs text-muted"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {b.ratingScore && (
                      <div className="text-xs text-accent flex items-center gap-2">
                        <span>
                          Your Rating: {"★".repeat(b.ratingScore)} (
                          {b.ratingScore}/5)
                        </span>
                        {b.ratingComment && (
                          <span className="text-muted italic">
                            — &ldquo;{b.ratingComment}&rdquo;
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line/10">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleRebook(b)}
                          className="px-3.5 py-2 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-ink flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-accent" />
                          Rebook Route
                        </button>

                        {!isCancelled && !isCompleted && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRef(b.reference);
                                setEditTime(b.time);
                                setEditNotes(b.cabin.notes || "");
                              }}
                              className="px-3.5 py-2 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-ink flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-accent" />
                              Modify Time / Notes
                            </button>
                            <button
                              type="button"
                              onClick={() => advanceBookingStatus(b.reference)}
                              className="px-3.5 py-2 rounded-xl bg-champagne-500/15 hover:bg-champagne-500/25 border border-champagne-500/35 text-xs font-semibold text-accent flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Simulate Live GPS Dispatch
                            </button>
                          </>
                        )}

                        {!b.ratingScore && !isCancelled && (
                          <button
                            type="button"
                            onClick={() => {
                              setRatingRef(b.reference);
                              setStars(5);
                              setReviewText("");
                            }}
                            className="px-3.5 py-2 rounded-xl bg-field hover:bg-line/[0.08] border border-line/15 text-xs font-semibold text-ink flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 text-accent" />
                            Rate Chauffeur
                          </button>
                        )}
                      </div>

                      {!isCancelled && !isCompleted && (
                        <button
                          type="button"
                          onClick={() => cancelBooking(b.reference)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-semibold text-rose-600 dark:text-rose-300 flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Free Cancellation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: SAVED CANADIAN ADDRESSES */}
        {activeTab === "places" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 rounded-3xl bg-card border border-line/12 p-6 sm:p-8 space-y-4 h-fit">
              <h2 className="font-serif text-2xl text-ink font-semibold">
                Save a Canadian Location
              </h2>
              <p className="text-xs text-muted">
                Save your frequent home, Bay Street office, private terminal, or
                hotel for 1-click booking.
              </p>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Category Label
                </label>
                <select
                  value={placeLabel}
                  onChange={(e) =>
                    setPlaceLabel(e.target.value as SavedPlace["label"])
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-field border border-line/15 text-sm text-ink"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Airport">Airport</option>
                  <option value="Favorite">Favorite</option>
                </select>
              </div>
              <CanadianAddressInput
                label="Canadian Street Address or Airport"
                value={placeAddress}
                onChange={(val, coords) => {
                  setPlaceAddress(val);
                  setPlaceCoords(coords || null);
                }}
                placeholder="Search any address in Canada..."
              />
              <button
                type="button"
                onClick={() => {
                  if (!placeAddress.trim()) return;
                  addSavedPlace({
                    label: placeLabel,
                    address: placeAddress,
                    coords: placeCoords,
                  });
                  setPlaceAddress("");
                  setPlaceCoords(null);
                }}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Save to My Account
              </button>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {(user.savedPlaces || []).length === 0 ? (
                <div className="rounded-3xl bg-card border border-line/12 p-10 text-center text-sm text-muted">
                  No saved places yet. Add your home, office, or airport on the
                  left.
                </div>
              ) : (
                (user.savedPlaces || []).map((pl) => (
                  <div
                    key={pl.id}
                    className="rounded-2xl bg-card border border-line/12 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-[10px] uppercase tracking-wider text-accent font-bold">
                        {pl.label}
                      </span>
                      <p className="text-sm font-medium text-ink pt-1">
                        {pl.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          updateDraft({
                            pickup: pl.address,
                            pickupCoords: pl.coords,
                          });
                          router.push("/book");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-champagne-500/15 border border-champagne-500/35 text-xs font-semibold text-accent"
                      >
                        Book Pickup Here
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedPlace(pl.id)}
                        className="p-2 rounded-xl bg-field border border-line/12 text-muted hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PERSONAL DETAILS & CABIN PROFILE */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl bg-card border border-line/12 p-6 sm:p-10 shadow-luxury space-y-6 max-w-3xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-ink font-semibold">
                  Personal Details & Default Limousine Cabin
                </h2>
                <p className="text-xs text-muted mt-1">
                  Your saved preferences are automatically sent to your
                  chauffeur before every pickup across Canada.
                </p>
              </div>
              <UserCheck className="w-6 h-6 text-accent" />
            </div>

            {profileSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Your personal account &
                cabin profile have been updated.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Account Email (Verified ID)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-3 rounded-xl bg-field/60 border border-line/10 text-sm text-subtle cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Canadian Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Corporate Organization (Appears on GST/HST Invoices)
                </label>
                <input
                  type="text"
                  value={profCompany}
                  onChange={(e) => setProfCompany(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-line/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Default Cabin Climate
                </label>
                <select
                  value={prefTemp}
                  onChange={(e) =>
                    setPrefTemp(
                      e.target.value as CabinPreferences["temperature"]
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                >
                  <option value="19°C Cool">19°C Cool</option>
                  <option value="21°C Balanced">21°C Balanced</option>
                  <option value="23°C Warm">23°C Warm</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Preferred Chauffeur Language
                </label>
                <select
                  value={prefLang}
                  onChange={(e) =>
                    setPrefLang(
                      e.target.value as
                        | "English"
                        | "Français"
                        | "Bilingual EN/FR"
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                >
                  <option value="English">English</option>
                  <option value="Français">Français</option>
                  <option value="Bilingual EN/FR">
                    Bilingual English & Français
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Complimentary Refreshment
                </label>
                <select
                  value={prefDrink}
                  onChange={(e) =>
                    setPrefDrink(
                      e.target.value as CabinPreferences["refreshment"]
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                >
                  <option value="Still Artisan Water">
                    Still Artisan Water
                  </option>
                  <option value="Sparkling Perrier">Sparkling Perrier</option>
                  <option value="Chilled Espresso">Chilled Espresso</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">
                  Chauffeur Etiquette
                </label>
                <select
                  value={prefConv}
                  onChange={(e) =>
                    setPrefConv(
                      e.target.value as CabinPreferences["conversation"]
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                >
                  <option value="Discreet Silence">Discreet Silence</option>
                  <option value="Warm & Conversational">
                    Warm & Conversational
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em] shadow-gold-glow flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Save Personal Account Profile
            </button>
          </form>
        )}
      </div>

      <TaxInvoiceModal
        booking={invoiceBooking}
        companyName={user.company}
        onClose={() => setInvoiceBooking(null)}
      />
    </div>
  );
}
