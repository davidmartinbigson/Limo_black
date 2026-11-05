"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Printer, ShieldCheck, X } from "lucide-react";
import { FLEET_CLASSES } from "@/data/limoData";
import { ConfirmedBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

export default function TaxInvoiceModal({
  booking,
  companyName,
  onClose,
}: {
  booking: ConfirmedBooking | null;
  companyName?: string;
  onClose: () => void;
}) {
  if (!booking) return null;

  const totalCad = booking.totalUsd;
  const subtotal =
    booking.subtotalBeforeTaxCad || Math.round(totalCad / 1.13);
  const tax = booking.hstTaxCad || Math.max(0, totalCad - subtotal);
  const passengerFullName =
    `${booking.firstName} ${booking.lastName}`.trim() || "VIP Guest";
  const vehicle =
    FLEET_CLASSES.find((f) => f.id === booking.selectedClassId) ||
    FLEET_CLASSES[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-3xl bg-card border border-line/15 p-6 sm:p-10 shadow-luxury max-h-[92vh] overflow-y-auto text-ink"
        >
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-line/12">
            <div className="space-y-1.5">
              <BrandLogo size="md" showCanadaBadge />
              <p className="text-[11px] text-muted">
                100 King Street West, Suite 5600, Toronto, ON M5X 1C9 • CRA
                GST/HST BN: 84920-4119 RT0001
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-field border border-line/12 text-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-line/10 text-xs">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-subtle font-semibold">
                Billed To
              </p>
              <p className="text-sm font-semibold text-ink">
                {passengerFullName}
              </p>
              {companyName && (
                <p className="text-xs text-accent font-medium">{companyName}</p>
              )}
              <p className="text-muted">{booking.email}</p>
              <p className="text-muted">{booking.phone}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <p className="text-[10px] uppercase tracking-wider text-subtle font-semibold">
                Official Tax Invoice
              </p>
              <p className="font-mono text-sm font-bold text-accent">
                INV-{booking.reference}
              </p>
              <p className="text-muted">Service Date: {booking.date}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                Status: Paid in Full (CAD)
              </p>
            </div>
          </div>

          <div className="py-6 space-y-4 border-b border-line/10 text-xs">
            <p className="text-[10px] uppercase tracking-wider text-subtle font-semibold">
              Chauffeur Service Itinerary
            </p>
            <div className="p-4 rounded-2xl bg-field border border-line/10 space-y-2.5">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Vehicle Class:</span>
                <span className="font-semibold text-ink">
                  {vehicle.name} ({booking.chauffeur.vehicleModel})
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Pickup Origin:</span>
                <span className="font-medium text-ink text-right">
                  {booking.pickup}
                </span>
              </div>
              {booking.extraStops && booking.extraStops.length > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Intermediate Stops:</span>
                  <span className="font-medium text-ink text-right">
                    {booking.extraStops.join(" → ")}
                  </span>
                </div>
              )}
              {booking.rideType === "oneway" ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Destination:</span>
                  <span className="font-medium text-ink text-right">
                    {booking.dropoff}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Hourly Charter:</span>
                  <span className="font-medium text-ink text-right">
                    {booking.durationHours} Hours As-Directed
                  </span>
                </div>
              )}
              {booking.roundTrip && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Return Transfer Included:</span>
                  <span className="font-medium text-accent text-right">
                    {booking.returnDate} at {booking.returnTime} (10% Return
                    Privilege)
                  </span>
                </div>
              )}
              {booking.flightNumber && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Monitored Flight:</span>
                  <span className="font-mono text-ink">
                    {booking.flightNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-muted">Assigned Chauffeur:</span>
                <span className="text-ink">
                  {booking.chauffeur.name} ({booking.chauffeur.plate})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2.5 text-sm">
            <div className="flex justify-between text-xs text-muted">
              <span>Chauffeur & Limousine Fare (All-Inclusive Gratuity)</span>
              <span>CA${subtotal.toLocaleString()}.00 CAD</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Canadian Harmonized GST/HST (CRA BN 84920-4119)</span>
              <span>CA${tax.toLocaleString()}.00 CAD</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-line/12">
              <span className="font-semibold text-ink">
                Total Charged (Canadian Dollars)
              </span>
              <span className="font-serif text-2xl font-bold text-accent">
                CA${totalCad.toLocaleString()}.00 CAD
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line/10 flex items-center justify-between text-[11px] text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Official
              CRA Corporate Expense Tax Receipt
            </span>
            <span>support@limoblack.ca • +1 (888) 546-6255</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
