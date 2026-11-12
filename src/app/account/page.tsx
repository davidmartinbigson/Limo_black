"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  Bookmark,
  Building2,
  Calendar,
  ArrowRight,
  ChevronRight,
  Copy,
  CreditCard,
  Heart,
  Home,
  User,
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
import LiveTracking from "@/components/LiveTracking";

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

  const [activeTab, setActiveTab] = useState<"dashboard" | "rides" | "places" | "profile" | "payments">(
    "dashboard"
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

  useEffect(() => {
    if (!user) return;
    setProfName(user.name); setProfPhone(user.phone); setProfCompany(user.company || "");
    setPrefTemp(user.defaultCabin?.temperature || "21°C Balanced"); setPrefDrink(user.defaultCabin?.refreshment || "Still Artisan Water"); setPrefConv(user.defaultCabin?.conversation || "Discreet Silence"); setPrefLang(user.preferredLanguage || "English");
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin") router.replace("/admin");
  }, [router, user?.role]);

  if (user?.role === "admin") {
    return <div className="min-h-screen bg-[#090a0c] px-5 pt-32 text-center text-white">Opening owner dashboard… <Link className="text-[#e6b541] underline" href="/admin">Continue</Link></div>;
  }

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextCabin: CabinPreferences = {
      temperature: prefTemp,
      refreshment: prefDrink,
      conversation: prefConv,
      childSeat: user.defaultCabin?.childSeat || "None",
      notes: user.defaultCabin?.notes || "",
    };
    const saved = await updateUserProfile({
      name: profName,
      phone: profPhone,
      company: profCompany,
      preferredLanguage: prefLang,
      defaultCabin: nextCabin,
    });
    if (!saved) return;
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

  // The dashboard uses only the signed-in customer's rides, including for admin accounts.
  const personalBookings = bookings.filter((b) => b.ownerEmail?.trim().toLowerCase() === user.email.trim().toLowerCase());
  const upcoming = personalBookings.filter((b) => b.status !== "Cancelled" && b.status !== "Completed").sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const past = personalBookings.filter((b) => b.status === "Completed" || b.status === "Cancelled").sort ( (a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  const vehicleDetails = (id: ConfirmedBooking["selectedClassId"]) => {
    const options: Record<string, { name: string; image: string }> = {
      business: { name: "Business Class Sedan", image: "/images/checkout-banner-sedan.jpg" },
      first: { name: "First Class Sedan", image: "/images/checkout-banner-first.jpg" },
      suv: { name: "Business SUV", image: "/images/checkout-banner-suv.jpg" },
      van: { name: "Executive Van", image: "/images/checkout-banner-van.jpg" },
    };
    return options[id] || { name: FLEET_CLASSES.find((v) => v.id === id)?.name || "Chauffeur vehicle", image: "/images/checkout-banner-sedan.jpg" };
  };
  const displayDate = (date: string) => {
    if (!date) return "Date not set";
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };
  const displayTime = (time: string) => {
    if (!time) return "Time not set";
    const parsed = new Date(`2000-01-01T${time}`);
    return Number.isNaN(parsed.getTime()) ? time : parsed.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  const initials = user.name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const goToEdit = (b: ConfirmedBooking) => {
    setEditingRef(b.reference);
    setEditTime(b.time);
    setEditNotes(b.cabin?.notes || "");
    setActiveTab("rides");
  };

  if (activeTab === "dashboard" || activeTab === "payments") {
    const stageIndex = upcoming ? ({ "Confirmed": 0, "Chauffeur Assigned": 1, "Chauffeur En Route": 2, "Chauffeur Arrived": 2, "Completed": 3, "Cancelled": -1 }[upcoming.status] ?? 0) : 0;
    const dashboardButton = "flex min-h-[55px] items-center justify-center gap-3 rounded-xl border border-white/25 bg-[#101113] px-4 text-sm font-semibold text-white hover:border-[#e6b341] transition-colors";
    return (
      <div className="min-h-screen bg-[#08090a] pt-16 text-white sm:pt-[74px] lg:flex">
        <aside className="border-b border-white/10 bg-[#0b0c0d] p-5 lg:min-h-[calc(100vh-74px)] lg:w-[280px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5 lg:py-10">
          <div className="mb-8 flex items-center gap-4 px-2"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#ffce62] to-[#d7961d] text-lg font-semibold text-white">{initials}</div><div className="min-w-0"><p className="truncate font-bold">{user.name}</p><p className="truncate text-sm text-white/75">{user.email}</p></div></div>
          <nav aria-label="Account navigation" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {([{id:"dashboard", label:"Dashboard", icon:Home}, {id:"rides", label:"My Bookings", icon:Calendar}, {id:"places", label:"Saved Locations", icon:MapPin}, {id:"payments", label:"Payment Methods", icon:CreditCard}, {id:"profile", label:"Profile Settings", icon:User}] as const).map((item) => <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-semibold ${activeTab === item.id ? "bg-[#664b18] text-[#ffdb78]" : "text-white hover:bg-white/10"}`}><item.icon className="h-5 w-5 shrink-0" />{item.label}</button>)}
            <button type="button" onClick={async () => { await signOut(); router.push("/"); }} className="flex items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 lg:mt-3 lg:border-t lg:border-white/20"><LogOut className="h-5 w-5" />Log Out</button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="relative overflow-hidden px-5 py-10 sm:px-9"><img src="/images/checkout-banner-sedan.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-right opacity-60" /><div className="absolute inset-0 bg-gradient-to-r from-[#08090a] via-[#08090a]/90 to-transparent" /><div className="relative"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {user.name.split(" ")[0]}</h1><p className="mt-2 text-sm text-white/80 sm:text-base">Manage your bookings, track your rides and update your preferences.</p><p className="mt-2 text-xs text-white/60">Live location is available when your assigned driver starts sharing.</p></div></div>
          <div className="px-5 pb-16 sm:px-9">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Link href="/book" className={`${dashboardButton} border-[#e8b13d] bg-gradient-to-b from-[#ffce60] to-[#d99a21] !text-black`}><Car className="h-6 w-6" />Book a Ride</Link><button onClick={() => setActiveTab("rides")} className={dashboardButton}><Calendar className="h-6 w-6" />My Bookings</button><button onClick={() => setActiveTab("places")} className={dashboardButton}><Heart className="h-6 w-6" />Saved Locations</button><button onClick={() => setActiveTab("payments")} className={dashboardButton}><CreditCard className="h-6 w-6" />Payment Methods</button></div>
            {activeTab === "payments" ? <section className="mt-8 rounded-2xl border border-white/20 bg-[#111214] p-7"><h2 className="text-xl font-bold">Payment Methods</h2><p className="mt-3 text-sm text-white/70">Payment methods will be available when payment processing is connected.</p></section> : <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold sm:text-2xl">Your Upcoming Booking</h2><button onClick={() => setActiveTab("rides")} className="flex items-center gap-2 text-sm font-semibold text-[#edc451]">View All Bookings <ArrowRight className="h-5 w-5" /></button></div>
            {upcoming ? <section className="mt-4 rounded-2xl border border-white/25 bg-gradient-to-br from-[#151619] to-[#0b0c0d] p-5">
              <div className="grid gap-5 xl:grid-cols-[220px_1fr]"><img src={vehicleDetails(upcoming.selectedClassId).image} alt={vehicleDetails(upcoming.selectedClassId).name} className="h-32 w-full rounded-lg object-cover" /><div><div className="flex flex-wrap justify-between gap-5"><div><h3 className="text-xl font-bold">{vehicleDetails(upcoming.selectedClassId).name}</h3><p className="mt-1 text-sm text-white/75">Booking #: <strong className="text-white">{upcoming.reference}</strong> <button type="button" aria-label="Copy booking reference" onClick={() => { void navigator.clipboard?.writeText(upcoming.reference); }} className="ml-2 align-middle text-[#f4c748]"><Copy className="h-4 w-4" /></button></p></div><div className="flex flex-wrap gap-3 text-center text-xs">{["Request Received", "Driver Assigned", "On the Way", "Ride Completed"].map((label, i) => <div key={label} className="w-20"><div className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full border-2 ${i <= stageIndex ? "border-[#ecc04c] bg-[#eeb53c] text-black" : "border-white/50 text-white/60"}`}>{i < stageIndex ? "✓" : i + 1}</div>{label}</div>)}</div></div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-4 text-sm"><span className="flex items-center gap-2"><Calendar className="h-5 w-5" />{displayDate(upcoming.date)} · {displayTime(upcoming.time)}</span><span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{upcoming.pickup || "Pickup not set"} <ArrowRight className="h-4 w-4" /> {upcoming.rideType === "hourly" ? `${upcoming.durationHours} hour charter` : upcoming.dropoff || "Destination not set"}</span><span className="flex items-center gap-2"><User className="h-5 w-5" />{upcoming.passengersCount || 1} Passenger{(upcoming.passengersCount || 1) === 1 ? "" : "s"}</span></div></div></div>
              <div className="mt-5 grid gap-4 rounded-xl border border-white/20 bg-white/[0.02] p-4 sm:grid-cols-3 sm:items-center"><div><p className="text-xs text-white/65">Your Driver</p><p className="font-semibold">{upcoming.chauffeur?.name || "Not assigned yet"}</p>{upcoming.chauffeur?.rating && <p className="mt-1 text-sm text-[#edc451]">★ {upcoming.chauffeur.rating}</p>}</div><div><p className="text-xs text-white/65">Vehicle</p><p className="text-sm font-semibold">{upcoming.chauffeur?.vehicleModel || vehicleDetails(upcoming.selectedClassId).name}</p></div><button type="button" disabled title="Driver contact will be available when dispatch is connected" className={`${dashboardButton} cursor-not-allowed opacity-50`}><Phone className="h-5 w-5 text-[#edc451]" />Contact Driver</button></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3"><button onClick={() => setActiveTab("rides")} className={`${dashboardButton} !min-h-[46px] !border-[#d8ad3b] !text-[#edc451]`}><FileText className="h-5 w-5" />View Details</button><button onClick={() => goToEdit(upcoming)} className={`${dashboardButton} !min-h-[46px]`}><Edit3 className="h-5 w-5" />Modify Booking</button><button onClick={() => { if (window.confirm("Are you sure you want to cancel this booking?")) cancelBooking(upcoming.reference); }} className={`${dashboardButton} !min-h-[46px]`}><XCircle className="h-5 w-5" />Cancel Booking</button></div>
            </section> : <div className="mt-4 rounded-2xl border border-white/20 bg-[#111214] p-8 text-center"><p className="font-semibold">No upcoming bookings</p><p className="mt-2 text-sm text-white/60">Your upcoming rides will appear here.</p><Link href="/book" className="mt-4 inline-block text-sm font-bold text-[#edc451]">Book a Ride →</Link></div>}
            <h2 className="mt-8 text-xl font-bold sm:text-2xl">Live Tracking</h2><p className="mt-2 text-sm text-white/60">Choose a ride to see its driver’s latest location when sharing is active.</p>{personalBookings.filter(b => !["Cancelled", "Completed"].includes(b.status)).map(b => <div key={b.reference}><p className="mt-4 text-sm font-semibold">{b.reference} · {displayDate(b.date)}</p><LiveTracking reference={b.reference} /></div>)}<h2 className="mt-8 text-xl font-bold sm:text-2xl">Past Bookings</h2><div className="mt-4 overflow-x-auto rounded-xl border border-white/25"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-white/[0.06] text-white/80"><tr>{["Booking #", "Date & Time", "Route", "Vehicle", "Total", "Status", ""].map((heading, i) => <th key={i} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{past.map((b) => <tr key={b.reference} className="border-t border-white/15"><td className="px-4 py-4 font-semibold">{b.reference}</td><td className="px-4 py-4">{displayDate(b.date)}<br />{displayTime(b.time)}</td><td className="px-4 py-4">{b.pickup} → {b.rideType === "hourly" ? `${b.durationHours} hour charter` : b.dropoff}</td><td className="px-4 py-4">{vehicleDetails(b.selectedClassId).name}</td><td className="whitespace-nowrap px-4 py-4">CAD ${b.totalUsd.toFixed(2)}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs ${b.status === "Completed" ? "bg-green-900 text-green-100" : "bg-red-950 text-red-200"}`}>{b.status}</span></td><td className="px-4 py-4"><button onClick={() => setActiveTab("rides")} aria-label={`View ${b.reference}`} className="rounded bg-white/10 p-1"><ChevronRight className="h-5 w-5" /></button></td></tr>)}</tbody></table>{past.length === 0 && <p className="border-t border-white/15 px-4 py-7 text-center text-sm text-white/60">No past bookings yet.</p>}</div>
            </>}
          </div>
        </main>
      </div>
    );
  }

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
        <button type="button" onClick={() => setActiveTab("dashboard")} className="text-sm font-semibold text-accent">← Back to Dashboard</button>
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
            {personalBookings.length === 0 ? (
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
              personalBookings.map((b) => {
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
                          disabled title="Receipts are unavailable until payment is connected"
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
                            onClick={async () => {
                              if (await updateBookingSchedule(b.reference, editTime, editNotes)) setEditingRef(null);
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
                              disabled title="Live dispatch is not connected"
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
                            disabled title="Rating is not available yet"
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
                onClick={async () => {
                  if (!placeAddress.trim()) return;
                  const saved = await addSavedPlace({
                    label: placeLabel,
                    address: placeAddress,
                    coords: placeCoords,
                  });
                  if (saved) { setPlaceAddress(""); setPlaceCoords(null); }
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
                  Your saved preferences will be included with your future booking requests.
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
