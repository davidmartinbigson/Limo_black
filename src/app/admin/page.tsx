"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown, BarChart3, Bell, CalendarDays, CarFront, Check, ChevronDown,
  ChevronLeft, ChevronRight, CirclePlay, ClipboardList, Eye, Gauge, MapPin,
  MessageSquare, Search, Settings, ShieldCheck, UserRound, Users, X,
} from "lucide-react";
import { FLEET_CLASSES } from "@/data/limoData";
import { ConfirmedBooking, useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

type Driver = { id: string; name: string; phone: string; email: string; vehicleModel: string; plate: string; active: boolean };
type Customer = { id: string; name: string; email: string; phone: string; company: string | null; bookingCount: number };
type Filter = "all" | "awaiting" | "progress" | "completed" | "cancelled";
const isProgress = (b: ConfirmedBooking) => ["Chauffeur Assigned", "Chauffeur En Route", "Chauffeur Arrived"].includes(b.status);
const statusLabel = (b: ConfirmedBooking) => ({ "Confirmed": "Request Received", "Chauffeur Assigned": "Driver Assigned", "Chauffeur En Route": "On the Way", "Chauffeur Arrived": "Driver Arrived", "Completed": "Completed", "Cancelled": "Cancelled" }[b.status] || b.status);
const vehicleInfo = (id: ConfirmedBooking["selectedClassId"]) => {
  const vehicles: Record<string, { name: string; model: string; image: string }> = {
    business: { name: "Business Class Sedan", model: "Mercedes E-Class or similar", image: "/images/checkout-banner-sedan.jpg" },
    first: { name: "First Class Sedan", model: "Mercedes S-Class or similar", image: "/images/checkout-banner-first.jpg" },
    suv: { name: "Business SUV", model: "Cadillac Escalade or similar", image: "/images/checkout-banner-suv.jpg" },
    van: { name: "Executive Van", model: "Mercedes Sprinter or similar", image: "/images/checkout-banner-van.jpg" },
  };
  return vehicles[id] || { name: FLEET_CLASSES.find((v) => v.id === id)?.name || "Chauffeur vehicle", model: "Vehicle class", image: "/images/checkout-banner-sedan.jpg" };
};
const dateText = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return value && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Date not set";
};
const timeText = (value: string) => {
  const date = new Date(`2000-01-01T${value}`);
  return value && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", hour12: true }) : "Time not set";
};
const statusStyle = (b: ConfirmedBooking) => b.status === "Confirmed" ? "bg-[#5d4710] text-[#ffdb68]" : b.status === "Completed" ? "bg-[#063f20] text-[#a0e7b8]" : b.status === "Cancelled" ? "bg-[#4d1b1c] text-[#ffb1b1]" : "bg-[#06324a] text-[#b4dfff]";

export default function AdminDispatchPage() {
  const { user, signOut } = useBooking();
  const [allBookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [driverForm, setDriverForm] = useState({ name: "", phone: "", email: "", vehicleModel: "", plate: "" });
  const detailsRef = useRef<HTMLElement>(null);
  const loadData = async () => {
    const response = await fetch("/api/admin", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load dashboard.");
    setBookings(data.bookings); setDrivers(data.drivers); setCustomers(data.customers);
  };
  useEffect(() => {
    if (user?.role !== "admin") return;
    setLoading(true);
    loadData().catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [user?.id, user?.role]);
  const perform = async (payload: Record<string, unknown>) => {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save changes.");
      try { await loadData(); } catch { setError("Change saved, but the dashboard could not refresh. Reload to see the latest data."); }
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save changes."); return false; }
    finally { setBusy(false); }
  };
  const openBooking = (reference: string) => {
    setSelectedRef(reference); setPanelOpen(true);
    setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [section, setSection] = useState("Dashboard");

  if (!user || user.role !== "admin") {
    return <div className="flex min-h-screen items-center justify-center bg-[#090a0c] px-5 text-white"><div className="w-full max-w-md space-y-5 rounded-2xl border border-white/15 bg-[#131416] p-8 text-center"><BrandLogo variant="dark" /><ShieldCheck className="mx-auto h-10 w-10 text-[#e6b541]" /><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-sm text-white/65">Sign in as an authorized owner or dispatcher to access the dashboard.</p><Link href="/login" className="block rounded-xl bg-gradient-to-b from-[#ffd064] to-[#d6931c] px-4 py-3 font-bold text-black">Sign in</Link></div></div>;
  }

  const counts = {
    all: allBookings.length,
    awaiting: allBookings.filter((b) => b.status === "Confirmed").length,
    progress: allBookings.filter(isProgress).length,
    completed: allBookings.filter((b) => b.status === "Completed").length,
    cancelled: allBookings.filter((b) => b.status === "Cancelled").length,
  };
  const matchesFilter = (b: ConfirmedBooking) => filter === "all" || (filter === "awaiting" && b.status === "Confirmed") || (filter === "progress" && isProgress(b)) || (filter === "completed" && b.status === "Completed") || (filter === "cancelled" && b.status === "Cancelled");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = allBookings.filter((b) => matchesFilter(b) && (!normalizedQuery || [b.reference, b.firstName, b.lastName, b.ownerEmail, b.pickup, b.dropoff, b.chauffeur?.name].some((value) => value?.toLowerCase().includes(normalizedQuery))));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 5));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * 5, safePage * 5);
  const selected = panelOpen ? allBookings.find((b) => b.reference === selectedRef) : undefined;
  const initials = user.name.trim().split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const nav = [{ name: "Dashboard", icon: Gauge }, { name: "Bookings", icon: CalendarDays }, { name: "Dispatch", icon: CarFront }, { name: "Drivers", icon: Users }, { name: "Fleet / Vehicles", icon: CarFront }, { name: "Customers", icon: Users }, { name: "Reports", icon: BarChart3 }, { name: "Settings", icon: Settings }];
  const tabs: { id: Filter; label: string }[] = [{ id: "all", label: "All Bookings" }, { id: "awaiting", label: "Awaiting Dispatch" }, { id: "progress", label: "In Progress" }, { id: "completed", label: "Completed" }, { id: "cancelled", label: "Cancelled" }];
  const metrics = [{ label: "Total Bookings", count: counts.all, icon: CalendarDays }, { label: "Awaiting Dispatch", count: counts.awaiting, icon: CarFront }, { label: "In Progress", count: counts.progress, icon: CirclePlay }, { label: "Completed", count: counts.completed, icon: Check }];
  return <div className="min-h-screen bg-[#08090b] text-[#f5f5f5]">
    <header className="sticky top-0 z-30 flex min-h-[70px] flex-wrap items-center gap-4 border-b border-white/20 bg-[#08090b] px-4 py-3 lg:px-8">
      <Link href="/" className="lg:w-[220px]"><BrandLogo variant="dark" size="md" /></Link>
      <div className="flex items-center gap-3 lg:border-l lg:border-white/20 lg:pl-7"><CarFront className="h-6 w-6 text-[#e9bc45]" /><span className="font-bold">Admin Dashboard</span><span className="hidden rounded-md bg-[#eab849] px-2 py-1 text-xs font-bold text-black sm:block">Dispatch</span></div>
      <label className="order-last flex w-full items-center gap-3 rounded-xl border border-white/25 bg-[#151619] px-4 py-2.5 text-white/65 sm:order-none sm:ml-auto sm:w-[320px]"><Search className="h-5 w-5 shrink-0" /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); setSelectedRef(null); }} placeholder="Search booking, customer, driver..." aria-label="Search bookings" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50" /></label>
      <Bell className="hidden h-5 w-5 text-white/60 lg:block" aria-label="Notifications not connected" />
      <div className="ml-auto flex items-center gap-3 sm:ml-0"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#f8c857] to-[#cf8c19] text-sm font-bold text-white">{initials}</span><span className="hidden text-sm font-semibold md:block">{user.name}</span><Link href="/account" aria-label="My account"><ChevronDown className="h-4 w-4" /></Link></div>
    </header>
    <div className="lg:flex"><aside className="border-b border-white/15 bg-[#0a0b0d] p-3 lg:min-h-[calc(100vh-70px)] lg:w-[250px] lg:shrink-0 lg:border-b-0 lg:border-r lg:p-4"><nav aria-label="Admin navigation" className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">{nav.map((item) => <button key={item.name} onClick={() => { setSection(item.name); if (item.name === "Bookings" || item.name === "Dispatch") { setFilter("all"); setPage(1); } }} className={`flex items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-semibold ${section === item.name ? "bg-[#624914] text-[#ffe080]" : "text-white/90 hover:bg-white/5"}`}><item.icon className="h-5 w-5 shrink-0" />{item.name}</button>)}</nav><button onClick={() => { void signOut(); }} className="mt-5 border-t border-white/15 px-4 pt-5 text-sm text-white/60 hover:text-white">Sign Out</button></aside>
    <main className="min-w-0 flex-1 p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome, {user.name.split(" ")[0]}</h1><p className="mt-2 text-sm text-white/70">Manage bookings, dispatch drivers and monitor operations.</p><p className="mt-2 text-xs text-[#d9bc78]">Driver assignments and status changes are manual. Notifications and live tracking are not connected.</p></div><div className="flex items-center gap-3 rounded-lg border border-white/25 bg-[#131416] px-4 py-3 text-sm"><CalendarDays className="h-5 w-5" />Today, {new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</div></div>
    {error && <div role="alert" className="mb-4 rounded-lg border border-red-400/40 bg-red-950 p-4 text-sm text-red-200">{error} <button onClick={() => { setError(""); loadData().catch(e => setError(e.message)); }} className="underline">Retry loading</button></div>}
    {loading ? <p className="p-6 text-white/70">Loading dashboard…</p> : section === "Drivers" ? <section className="rounded-xl border border-white/20 bg-[#121315] p-6"><h2 className="text-xl font-bold">Drivers</h2><p className="mt-2 text-sm text-white/60">Manage your driver directory. Adding or assigning a driver does not send a notification.</p><form className="mt-5 grid gap-3 md:grid-cols-3" onSubmit={async e => { e.preventDefault(); if (await perform({ action: "createDriver", ...driverForm })) setDriverForm({ name: "", phone: "", email: "", vehicleModel: "", plate: "" }); }}>
      {([{ key: "name", label: "Name", required: true }, { key: "phone", label: "Phone", required: true }, { key: "email", label: "Email", required: false }, { key: "vehicleModel", label: "Vehicle model", required: false }, { key: "plate", label: "Licence plate", required: false }] as const).map(field => <label key={field.key} className="text-xs text-white/70">{field.label}{field.required ? " *" : ""}<input required={field.required} maxLength={field.key === "email" ? 254 : 120} type={field.key === "email" ? "email" : "text"} value={driverForm[field.key]} onChange={e => setDriverForm({ ...driverForm, [field.key]: e.target.value })} className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 p-3 text-sm text-white" /></label>)}<button disabled={busy} className="self-end rounded-lg bg-[#e6b03c] p-3 font-bold text-black disabled:opacity-50">Add Driver</button></form>
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-white/60"><tr>{["Name", "Contact", "Vehicle", "Status", "Action"].map(x => <th key={x} className="p-3">{x}</th>)}</tr></thead><tbody>{drivers.map(d => <tr key={d.id} className="border-t border-white/10"><td className="p-3">{d.name}</td><td className="p-3">{d.phone}<br />{d.email}</td><td className="p-3">{d.vehicleModel || "—"}<br />{d.plate}</td><td className="p-3">{d.active ? "Active" : "Inactive"}</td><td className="p-3"><button disabled={busy} onClick={() => perform({ action: "driverActive", id: d.id, active: !d.active })} className="rounded border border-white/25 px-3 py-2">{d.active ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table>{!drivers.length && <p className="p-5 text-white/60">No drivers added yet.</p>}</div></section> : section === "Customers" ? <section className="rounded-xl border border-white/20 bg-[#121315] p-6"><h2 className="text-xl font-bold">Customers</h2><p className="mt-2 text-sm text-white/60">Registered customer accounts and their booking counts.</p><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="text-white/60"><tr>{["Name", "Email", "Phone", "Company", "Bookings"].map(x => <th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{customers.filter(c => !query.trim() || [c.name, c.email, c.phone].some(v => v?.toLowerCase().includes(query.toLowerCase().trim()))).map(c => <tr key={c.id} className="border-t border-white/10"><td className="p-3">{c.name}</td><td className="p-3">{c.email}</td><td className="p-3">{c.phone || "—"}</td><td className="p-3">{c.company || "—"}</td><td className="p-3">{c.bookingCount}</td></tr>)}</tbody></table>{!customers.length && <p className="p-5 text-white/60">No registered customers yet.</p>}</div></section> : section === "Reports" ? <section className="rounded-xl border border-white/20 bg-[#121315] p-6"><h2 className="text-xl font-bold">Booking Reports</h2><p className="mt-2 text-sm text-white/60">Current booking counts by status. Estimates are not payments or revenue.</p><div className="mt-7 space-y-5">{tabs.map(t => <div key={t.id}><div className="mb-2 flex justify-between text-sm"><span>{t.label}</span><span>{counts[t.id]}</span></div><div className="h-4 rounded bg-white/10"><div className="h-4 rounded bg-[#e6b03c]" style={{ width: `${counts.all ? counts[t.id] / counts.all * 100 : 0}%` }} /></div></div>)}</div></section> : !["Dashboard", "Bookings", "Dispatch"].includes(section) ? <section className="rounded-xl border border-white/20 bg-[#121315] p-8"><h2 className="text-xl font-bold">{section}</h2><p className="mt-3 text-sm text-white/60">This section is not connected yet.</p></section> : <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_370px]"><div className="min-w-0"><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map(({ label, count, icon: Icon }) => <div key={label} className="flex min-h-[106px] items-start gap-4 rounded-xl border border-white/20 bg-gradient-to-br from-[#1b1c1e] to-[#101113] p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5c4718]/60 text-[#f6c74a]"><Icon className="h-6 w-6" /></span><div><p className="text-2xl font-bold">{count}</p><p className="mt-1 text-xs text-white/80">{label}</p></div></div>)}</div>
    <section className="mt-5 overflow-hidden rounded-xl border border-white/20 bg-[#0e0f11]"><div className="flex overflow-x-auto border-b border-white/15 px-3">{tabs.map((tab) => <button key={tab.id} onClick={() => { setFilter(tab.id); setPage(1); setSelectedRef(null); }} className={`shrink-0 border-b-2 px-3 py-4 text-xs font-semibold ${filter === tab.id ? "border-[#f1bd3c] text-[#f5d26a]" : "border-transparent text-white/80 hover:text-white"}`}>{tab.label} ({counts[tab.id]})</button>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-white/[0.04] text-white/80"><tr>{["Booking #", "Date & Time", "Route", "Service", "Status", "Action"].map((label) => <th key={label} className="px-4 py-4 font-medium">{label}</th>)}</tr></thead><tbody>{rows.map((b) => <tr key={b.reference} onClick={() => openBooking(b.reference)} className={`cursor-pointer border-t border-white/10 ${selected?.reference === b.reference ? "bg-[#564217]/70" : "hover:bg-white/[0.04]"}`}><td className="px-4 py-4 font-bold">{b.reference}</td><td className="px-4 py-4">{dateText(b.date)}<br /><span className="text-white/65">{timeText(b.time)}</span></td><td className="max-w-[180px] px-4 py-4">{b.pickup || "Not set"} → {b.rideType === "hourly" ? `${b.durationHours}h charter` : b.dropoff || "Not set"}</td><td className="px-4 py-4">{vehicleInfo(b.selectedClassId).name}</td><td className="px-4 py-4"><span className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 ${statusStyle(b)}`}>● {statusLabel(b)}</span></td><td className="px-4 py-4"><button type="button" onClick={(e) => { e.stopPropagation(); openBooking(b.reference); }} className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 hover:border-[#e7b849]"><Eye className="h-4 w-4" />View</button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="p-8 text-center text-sm text-white/55">No bookings found.</p>}</div><div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 px-4 py-4 text-xs text-white/70"><span>Showing {filtered.length ? (safePage - 1) * 5 + 1 : 0}–{Math.min(safePage * 5, filtered.length)} of {filtered.length} bookings</span><div className="flex gap-1"><button aria-label="Previous page" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="rounded bg-white/5 p-2 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button><span className="rounded bg-[#e6b03c] px-3 py-2 font-bold text-black">{safePage}</span><span className="px-2 py-2">of {pageCount}</span><button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)} className="rounded bg-white/5 p-2 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></div></div></section></div>
    <aside ref={detailsRef} className="rounded-xl border border-white/20 bg-gradient-to-b from-[#151619] to-[#0c0d0f] p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Booking Details</h2><button aria-label="Close details" onClick={() => setPanelOpen(false)}><X className="h-5 w-5 text-white/70" /></button></div>{selected ? <><div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#d7a83b] bg-black/20 p-3 text-xs font-bold text-[#f4d16a]"><span>Booking #: {selected.reference}</span><span className={`rounded-full px-2 py-1 ${statusStyle(selected)}`}>● {statusLabel(selected)}</span></div><div className="mt-5 space-y-4 border-b border-white/20 pb-5 text-sm"><p className="flex items-center gap-4"><CalendarDays className="h-5 w-5 shrink-0" />{dateText(selected.date)} at {timeText(selected.time)}</p><p className="flex items-start gap-4"><MapPin className="h-5 w-5 shrink-0" />{selected.pickup || "Pickup not set"}</p><p className="flex items-start gap-4"><ArrowDown className="h-5 w-5 shrink-0" />{selected.rideType === "hourly" ? `${selected.durationHours} hour charter` : selected.dropoff || "Destination not set"}</p><p className="flex items-center gap-4"><UserRound className="h-5 w-5 shrink-0" />{selected.passengersCount || 1} Passenger{(selected.passengersCount || 1) === 1 ? "" : "s"}</p><p className="flex items-center gap-4"><Users className="h-5 w-5 shrink-0" />{`${selected.firstName} ${selected.lastName}`.trim() || selected.ownerEmail}</p><p className="flex items-center gap-4"><ClipboardList className="h-5 w-5 shrink-0" />CAD ${selected.totalUsd.toFixed(2)}</p></div><div className="flex items-center gap-4 border-b border-white/20 py-5"><img src={vehicleInfo(selected.selectedClassId).image} alt={vehicleInfo(selected.selectedClassId).name} className="h-20 w-32 rounded object-cover" /><div><h3 className="text-sm font-bold">{vehicleInfo(selected.selectedClassId).name}</h3><p className="mt-1 text-xs text-white/65">{vehicleInfo(selected.selectedClassId).model}</p></div></div><div className="pt-5"><h3 className="font-bold">Dispatch</h3>{selected.chauffeur?.name && <p className="mt-3 text-sm text-white/75">Assigned: {selected.chauffeur.name} · {selected.chauffeur.phone}</p>}{["Confirmed", "Chauffeur Assigned"].includes(selected.status) && <><select value={driverId} onChange={e => setDriverId(e.target.value)} aria-label="Select a driver" className="mt-4 w-full rounded-lg border border-white/25 bg-[#141518] px-4 py-3 text-sm"><option value="">Select a driver</option>{drivers.filter(d => d.active).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select><button disabled={busy || !driverId} onClick={() => perform({ action: "assign", reference: selected.reference, driverId })} className="mt-3 w-full rounded-lg bg-[#e6b03c] px-4 py-3 text-sm font-bold text-black disabled:opacity-50">Assign Driver</button></>}{({ "Chauffeur Assigned": "Chauffeur En Route", "Chauffeur En Route": "Chauffeur Arrived", "Chauffeur Arrived": "Completed" } as Record<string, string>)[selected.status] && <button disabled={busy} onClick={() => perform({ action: "status", reference: selected.reference, status: ({ "Chauffeur Assigned": "Chauffeur En Route", "Chauffeur En Route": "Chauffeur Arrived", "Chauffeur Arrived": "Completed" } as Record<string, string>)[selected.status] })} className="mt-3 w-full rounded-lg border border-white/30 px-4 py-3 text-sm">Mark {({ "Chauffeur Assigned": "En Route", "Chauffeur En Route": "Arrived", "Chauffeur Arrived": "Completed" } as Record<string, string>)[selected.status]}</button>}{!["Completed", "Cancelled"].includes(selected.status) && <button disabled={busy} onClick={() => { if (window.confirm("Cancel this booking?")) void perform({ action: "status", reference: selected.reference, status: "Cancelled" }); }} className="mt-3 w-full rounded-lg border border-red-400/40 px-4 py-3 text-sm text-red-300">Cancel Booking</button>}<p className="mt-3 text-xs leading-relaxed text-white/50">Updates are manual. No driver notification or live tracking is sent.</p></div></> : <p className="mt-5 text-sm text-white/55">Select a booking to view its details.</p>}</aside></div>}
    </main></div></div>;
}
