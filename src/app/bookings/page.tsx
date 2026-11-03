"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Plane,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";
import { FLEET_CLASSES } from "@/data/limoData";
import {
  ConfirmedBooking,
  DispatchStage,
  useBooking,
} from "@/context/BookingContext";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

const STATUS_STEPS: DispatchStage[] = [
  "Confirmed",
  "Chauffeur Assigned",
  "Chauffeur En Route",
  "Chauffeur Arrived",
  "Completed",
];

export default function BookingsPage() {
  const {
    user,
    bookings,
    allBookings,
    formatPrice,
    cancelBooking,
    advanceBookingStatus,
  } = useBooking();

  const [lookupRef, setLookupRef] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [foundGuestRide, setFoundGuestRide] = useState<ConfirmedBooking | null>(
    null
  );
  const [lookupError, setLookupError] = useState("");
  const [invoiceBooking, setInvoiceBooking] = useState<ConfirmedBooking | null>(
    null
  );

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    const match = allBookings.find(
      (b) =>
        b.reference.toLowerCase() === lookupRef.trim().toLowerCase() &&
        (b.email.toLowerCase() === lookupEmail.trim().toLowerCase() ||
          b.ownerEmail.toLowerCase() === lookupEmail.trim().toLowerCase())
    );
    if (!match) {
      setFoundGuestRide(null);
      setLookupError(
        "No reservation matched that Reference Code and Email. Please sign in to your account or verify your confirmation code."
      );
      return;
    }
    setFoundGuestRide(match);
  };

  const displayedRides = user
    ? bookings
    : foundGuestRide
    ? [foundGuestRide]
    : [];

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
              {user
                ? `Signed In as ${user.name}`
                : "Canadian Chauffeur Telemetry & Lookup"}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink font-semibold">
              {user ? "My Chauffeur Rides" : "Track & Manage Your Ride"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {user ? (
              <Link
                href="/account"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-champagne-500/40 text-accent font-bold text-xs uppercase tracking-[0.14em]"
              >
                <Crown className="w-3.5 h-3.5" /> Full Account & Loyalty
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-line/15 text-ink font-semibold text-xs uppercase tracking-[0.14em]"
              >
                Sign In to Account
              </Link>
            )}
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow"
            >
              + Book New Canadian Ride
            </Link>
          </div>
        </div>

        {/* If NOT signed in, show Private Ride Lookup + Account Login Invite */}
        {!user && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleGuestLookup}
              className="lg:col-span-7 rounded-3xl bg-card border border-line/12 p-6 sm:p-8 shadow-luxury space-y-4"
            >
              <h2 className="font-serif text-2xl text-ink font-semibold">
                Lookup Ride by Reference & Email
              </h2>
              <p className="text-xs text-muted">
                For privacy, reservations are visible only to the account holder
                or via verified Reference Code + Email (try Demo:{" "}
                <code className="text-accent">LB-904812</code> +{" "}
                <code className="text-accent">
                  d.macleod@baystreetcapital.ca
                </code>
                ).
              </p>
              {lookupError && (
                <p className="text-xs text-rose-500 font-medium">
                  {lookupError}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={lookupRef}
                  onChange={(e) => setLookupRef(e.target.value)}
                  placeholder="Reference (e.g. LB-904812)"
                  className="px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink font-mono"
                />
                <input
                  type="email"
                  required
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="Booking Email Address"
                  className="px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Find My Reservation
              </button>
            </form>

            <div className="lg:col-span-5 rounded-3xl bg-card border border-champagne-500/30 p-6 sm:p-8 shadow-luxury flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
                  Obsidian Member Portal
                </span>
                <h3 className="font-serif text-2xl text-ink font-semibold">
                  Sign In for Full Personal Account Access
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  View all your past & upcoming chauffeured limousines, download
                  CRA GST/HST corporate tax invoices, manage saved Canadian
                  addresses, and redeem Obsidian Points.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-full bg-field border border-line/15 text-ink font-semibold text-xs uppercase tracking-[0.15em]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Rides List */}
        {user && displayedRides.length === 0 ? (
          <div className="rounded-3xl bg-card border border-line/12 p-12 text-center space-y-4">
            <p className="font-serif text-2xl text-ink">
              You have no rides on your account yet
            </p>
            <p className="text-sm text-muted">
              Reserve an executive sedan, AWD winter SUV, or stretch limousine
              anywhere in Canada.
            </p>
            <Link
              href="/book"
              className="inline-flex px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider"
            >
              Book a Limousine
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedRides.map((b) => {
              const isCancelled = b.status === "Cancelled";
              const currentStepIdx = STATUS_STEPS.indexOf(b.status);
              const vehicle =
                FLEET_CLASSES.find((f) => f.id === b.selectedClassId) ||
                FLEET_CLASSES[0];

              return (
                <motion.div
                  key={b.reference}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
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
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setInvoiceBooking(b)}
                        className="px-3.5 py-2 rounded-xl bg-field border border-line/15 text-xs font-semibold text-ink flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        GST/HST Receipt
                      </button>
                      <div className="text-right">
                        <span className="text-xs text-subtle block">
                          Guaranteed All-Inclusive CAD
                        </span>
                        <span className="font-serif text-2xl font-bold text-ink">
                          {formatPrice(b.totalUsd)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Live Status Tracker */}
                  {!isCancelled && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {STATUS_STEPS.map((st, idx) => {
                        const reached = idx <= currentStepIdx;
                        return (
                          <div
                            key={st}
                            className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                              reached
                                ? "bg-champagne-500/10 border-champagne-500/40 text-ink font-medium"
                                : "bg-field border-line/10 text-subtle"
                            }`}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                reached ? "text-accent" : "text-subtle"
                              }`}
                            />
                            <span className="truncate">{st}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Route & Chauffeur Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <div>
                          <span className="text-xs text-subtle block">
                            Pickup (Canada)
                          </span>
                          <span className="text-ink font-medium">
                            {b.pickup}
                          </span>
                        </div>
                      </div>

                      {b.rideType === "oneway" ? (
                        <div className="flex items-start gap-3">
                          <Navigation className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                          <div>
                            <span className="text-xs text-subtle block">
                              Destination (Canada)
                            </span>
                            <span className="text-ink font-medium">
                              {b.dropoff}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                          <div>
                            <span className="text-xs text-subtle block">
                              Hourly Charter
                            </span>
                            <span className="text-ink font-medium">
                              {b.durationHours} Hours As-Directed
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted">
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
                            Flight {b.flightNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-5 rounded-2xl bg-field border border-line/10 flex flex-col justify-between gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-accent font-semibold block">
                            Assigned Canadian Chauffeur
                          </span>
                          <p className="font-serif text-xl text-ink font-semibold mt-0.5">
                            {b.chauffeur.name}
                          </p>
                          <p className="text-xs text-muted">
                            ★ {b.chauffeur.rating} • Plate:{" "}
                            <span className="text-ink font-mono">
                              {b.chauffeur.plate}
                            </span>
                          </p>
                        </div>
                        <a
                          href={`tel:${b.chauffeur.phone}`}
                          className="p-3 rounded-xl bg-champagne-500/15 border border-champagne-500/35 text-accent hover:bg-champagne-500 hover:text-obsidian-950 transition-colors"
                          title="Call Chauffeur"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="text-xs text-muted border-t border-line/10 pt-3 flex flex-wrap gap-2">
                        <span>Cabin: {b.cabin.temperature}</span>•
                        <span>{b.cabin.refreshment}</span>•
                        <span>{b.cabin.conversation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Dispatch Controls */}
                  {!isCancelled && b.status !== "Completed" && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line/10">
                      <button
                        type="button"
                        onClick={() => advanceBookingStatus(b.reference)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-500/15 hover:bg-champagne-500/25 border border-champagne-500/35 text-xs font-semibold text-accent transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Simulate Next Live Chauffeur Update
                      </button>

                      <button
                        type="button"
                        onClick={() => cancelBooking(b.reference)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-semibold text-rose-600 dark:text-rose-300 transition-colors"
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

      <TaxInvoiceModal
        booking={invoiceBooking}
        companyName={user?.company}
        onClose={() => setInvoiceBooking(null)}
      />
    </div>
  );
}
