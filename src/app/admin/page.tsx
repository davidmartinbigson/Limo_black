"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Car,
  Database,
  DollarSign,
  FileText,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { FLEET_CLASSES } from "@/data/limoData";
import { ConfirmedBooking, useBooking } from "@/context/BookingContext";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

export default function AdminDispatchPage() {
  const {
    user,
    allBookings,
    storageMode,
    formatPrice,
    advanceBookingStatus,
    cancelBooking,
    loginAccount,
  } = useBooking();

  const [invoiceBooking, setInvoiceBooking] = useState<ConfirmedBooking | null>(
    null
  );
  const [filter, setFilter] = useState<string>("all");

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl bg-card border border-line/12 p-8 text-center space-y-5 shadow-luxury">
          <div className="w-14 h-14 rounded-2xl bg-champagne-500/15 border border-champagne-500/35 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-serif text-3xl text-ink font-semibold">
            National Dispatch Command
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Restricted to authorized Limo Black Canada fleet dispatchers and
            owners.
          </p>
          <button
            type="button"
            onClick={() => loginAccount("admin@limoblack.ca", "Admin123!")}
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em] shadow-gold-glow"
          >
            Sign In as Demo Owner (admin@limoblack.ca)
          </button>
          <Link
            href="/login"
            className="block text-xs text-accent underline font-medium"
          >
            Or sign in with custom credentials
          </Link>
        </div>
      </div>
    );
  }

  const activeBookings = allBookings.filter((b) => b.status !== "Cancelled");
  const grossRevenue = activeBookings.reduce((acc, b) => acc + b.totalUsd, 0);
  const uniqueCustomers = new Set(allBookings.map((b) => b.ownerEmail)).size;

  const filtered =
    filter === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
              Owner & Fleet Command Center
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-semibold">
              Limo Black Canada Dispatch
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            <Database className="w-3.5 h-3.5" />
            <span>
              {storageMode === "postgres"
                ? "Neon PostgreSQL Cloud DB Connected"
                : "Hybrid Auth & Vault Active (Neon Postgres Ready)"}
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-line/12 space-y-1">
            <div className="flex items-center justify-between text-xs text-subtle uppercase tracking-wider">
              <span>Gross Bookings Revenue</span>
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            <p className="font-serif text-3xl font-bold text-ink">
              {formatPrice(grossRevenue)}
            </p>
            <p className="text-xs text-muted">Includes CRA GST/HST</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-line/12 space-y-1">
            <div className="flex items-center justify-between text-xs text-subtle uppercase tracking-wider">
              <span>Total Reservations</span>
              <Car className="w-4 h-4 text-accent" />
            </div>
            <p className="font-serif text-3xl font-bold text-ink">
              {allBookings.length}
            </p>
            <p className="text-xs text-muted">
              {activeBookings.length} active / completed
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-line/12 space-y-1">
            <div className="flex items-center justify-between text-xs text-subtle uppercase tracking-wider">
              <span>Registered Ride Clients</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <p className="font-serif text-3xl font-bold text-ink">
              {uniqueCustomers}
            </p>
            <p className="text-xs text-muted">Isolated per-account portals</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-line/12 space-y-1">
            <div className="flex items-center justify-between text-xs text-subtle uppercase tracking-wider">
              <span>Canadian Hubs Online</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              12 / 12
            </p>
            <p className="text-xs text-muted">YYZ • YVR • YUL • YYC • YOW</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Reservations" },
            { id: "Confirmed", label: "Confirmed" },
            { id: "Chauffeur Assigned", label: "Assigned" },
            { id: "Chauffeur En Route", label: "En Route" },
            { id: "Chauffeur Arrived", label: "Arrived VIP" },
            { id: "Completed", label: "Completed" },
            { id: "Cancelled", label: "Cancelled" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === f.id
                  ? "bg-champagne-500 text-obsidian-950"
                  : "bg-card border border-line/12 text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Master Dispatch Table */}
        <div className="space-y-4">
          {filtered.map((b) => {
            const vehicle =
              FLEET_CLASSES.find((f) => f.id === b.selectedClassId) ||
              FLEET_CLASSES[0];
            const fullName =
              `${b.firstName} ${b.lastName}`.trim() || b.ownerEmail;

            return (
              <div
                key={b.reference}
                className="rounded-2xl bg-card border border-line/12 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs px-3 py-1 rounded-lg bg-champagne-500/15 border border-champagne-500/35 text-accent font-bold">
                      {b.reference}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-field border border-line/15 text-[11px] uppercase tracking-wider font-semibold text-ink">
                      {b.status}
                    </span>
                    <span className="text-xs text-muted">
                      Client: <strong className="text-ink">{fullName}</strong> (
                      {b.ownerEmail})
                    </span>
                  </div>
                  <p className="text-sm text-ink font-medium">
                    {b.pickup}{" "}
                    {b.rideType === "oneway"
                      ? `→ ${b.dropoff}`
                      : `(${b.durationHours}h Charter)`}
                  </p>
                  <p className="text-xs text-muted">
                    {b.date} at {b.time} • {vehicle.name} • Chauffeur:{" "}
                    {b.chauffeur.name} ({b.chauffeur.plate})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <span className="font-serif text-xl font-bold text-accent mr-2">
                    {formatPrice(b.totalUsd)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInvoiceBooking(b)}
                    className="px-3 py-2 rounded-xl bg-field border border-line/15 text-xs font-semibold text-ink flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-accent" /> Invoice
                  </button>
                  <a
                    href={`tel:${b.phone}`}
                    className="px-3 py-2 rounded-xl bg-field border border-line/15 text-xs font-semibold text-ink flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-accent" /> Client
                  </a>
                  {b.status !== "Cancelled" && b.status !== "Completed" && (
                    <>
                      <button
                        type="button"
                        onClick={() => advanceBookingStatus(b.reference)}
                        className="px-3.5 py-2 rounded-xl bg-gold-gradient text-obsidian-950 text-xs font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Advance Dispatch
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelBooking(b.reference)}
                        className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaxInvoiceModal
        booking={invoiceBooking}
        onClose={() => setInvoiceBooking(null)}
      />
    </div>
  );
}
