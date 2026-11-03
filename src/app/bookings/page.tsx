"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Plane,
  Plus,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";
import { FLEET_CLASSES } from "@/data/limoData";
import { DispatchStage, useBooking } from "@/context/BookingContext";

const STAGES: DispatchStage[] = [
  "Confirmed",
  "Chauffeur Assigned",
  "Chauffeur En Route",
  "Chauffeur Arrived",
  "Completed",
];

export default function ManageBookingsPage() {
  const { bookings, formatPrice, cancelBooking, advanceBookingStatus } =
    useBooking();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "cancelled">("all");

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      !searchQuery.trim() ||
      b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.dropoff.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "active")
      return b.status !== "Cancelled" && b.status !== "Completed";
    if (filter === "cancelled") return b.status === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
              Canadian Executive Concierge Portal
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink font-semibold mt-2">
              Manage Your{" "}
              <span className="italic text-accent">Chauffeured Rides</span>
            </h1>
            <p className="text-sm text-muted mt-2">
              Track live Canadian chauffeur dispatch, inspect your digital
              arrivals nameboard, or cancel free of charge up until 1 hour prior.
            </p>
          </div>

          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Reserve New Ride
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-card border border-line/12 shadow-luxury">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lookup by Booking Reference (e.g. LB-904812) or Canadian City..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-field border border-line/15 text-xs sm:text-sm text-ink focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "active", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? "bg-champagne-500 text-obsidian-950"
                    : "bg-field text-muted hover:text-ink border border-line/12"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-card border border-line/12 p-12 text-center space-y-4 shadow-luxury">
            <p className="font-serif text-2xl text-ink font-semibold">
              No matching reservations found.
            </p>
            <p className="text-xs sm:text-sm text-muted">
              Clear your search filter or schedule a new Canadian limousine
              journey.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((ride) => {
              const fleet =
                FLEET_CLASSES.find((f) => f.id === ride.selectedClassId) ||
                FLEET_CLASSES[0];
              const stageIdx = STAGES.indexOf(ride.status);
              const isCancelled = ride.status === "Cancelled";

              return (
                <motion.div
                  key={ride.reference}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 shadow-luxury space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-line/10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-field border border-champagne-500/35 text-accent">
                        {ride.reference}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isCancelled
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30"
                            : ride.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                            : "bg-champagne-500/15 text-accent border border-champagne-500/35"
                        }`}
                      >
                        {ride.status}
                      </span>
                      <span className="text-xs text-muted">
                        {fleet.name} ·{" "}
                        {ride.rideType === "oneway"
                          ? "One-Way"
                          : `${ride.durationHours}h Standby`}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-subtle mr-2">
                        All-Inclusive Total:
                      </span>
                      <span className="font-serif text-2xl text-ink font-bold">
                        {formatPrice(ride.totalUsd)}
                      </span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-field border border-line/10">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5" />
                          Live Chauffeur Telemetry
                        </span>
                        {ride.status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() => advanceBookingStatus(ride.reference)}
                            className="px-3 py-1 rounded-lg bg-champagne-500/15 hover:bg-champagne-500/25 border border-champagne-500/35 text-[11px] font-semibold text-accent flex items-center gap-1.5 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            Simulate Next Dispatch Stage
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {STAGES.map((st, idx) => {
                          const reached = idx <= stageIdx;
                          return (
                            <div
                              key={st}
                              className={`p-2.5 rounded-xl border text-center text-[11px] font-semibold transition-all ${
                                reached
                                  ? "bg-champagne-500/15 border-champagne-500/40 text-accent"
                                  : "bg-card/60 border-line/10 text-subtle"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                {reached && (
                                  <CheckCircle2 className="w-3 h-3 text-accent shrink-0" />
                                )}
                                <span className="truncate">{st}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden border border-line/10">
                      <img
                        src={fleet.image}
                        alt={fleet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="lg:col-span-5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[11px] text-subtle">Pickup</div>
                          <div className="text-sm font-semibold text-ink">
                            {ride.pickup}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[11px] text-subtle">
                            Drop-off
                          </div>
                          <div className="text-sm font-semibold text-ink">
                            {ride.dropoff}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          {ride.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          {ride.time}
                        </span>
                        {ride.flightNumber && (
                          <span className="flex items-center gap-1 text-accent font-semibold">
                            <Plane className="w-3.5 h-3.5" />
                            {ride.flightNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-4 p-4 rounded-2xl bg-field border border-line/10 space-y-2 text-xs">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        Chauffeur & Tablet Sign
                      </div>
                      <div className="text-sm font-semibold text-ink">
                        {ride.chauffeur.name} ({ride.chauffeur.rating} ★)
                      </div>
                      <div className="text-muted">
                        {ride.chauffeur.vehicleModel} ·{" "}
                        <span className="text-ink font-mono font-semibold">
                          {ride.chauffeur.plate}
                        </span>
                      </div>
                      <div className="text-muted flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-accent" />
                        {ride.chauffeur.phone}
                      </div>
                      <div className="pt-1 text-[11px] text-accent font-semibold">
                        Nameboard: “{ride.pickupSign}”
                      </div>
                    </div>
                  </div>

                  {!isCancelled && ride.status !== "Completed" && (
                    <div className="pt-4 border-t border-line/10 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-muted">
                        Cabin Staging: {ride.cabin.temperature} ·{" "}
                        {ride.cabin.conversation} · {ride.cabin.refreshment}
                      </span>

                      <button
                        type="button"
                        onClick={() => cancelBooking(ride.reference)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-semibold text-rose-600 dark:text-rose-300 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Free of Charge
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
