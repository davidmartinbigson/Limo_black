"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Plane,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { ServiceDetail, SERVICES_DATA } from "@/data/limoData";
import BookingWidget from "@/components/BookingWidget";
import CityRoutesExplorer from "@/components/CityRoutesExplorer";
import FleetShowcase from "@/components/FleetShowcase";
import FaqAccordion from "@/components/FaqAccordion";

const FLIGHT_STEPS = [
  "Taxi to departure airport (45m)",
  "Check-in & baggage drop (35m)",
  "Security screening queues (40m)",
  "Gate boarding wait (45m)",
  "Short-haul flight sector (65m)",
  "Deplaning & luggage carousel (35m)",
  "Hail transfer to final hotel (45m)",
];

export default function ServiceDetailPage() {
  const params = useParams();
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = (rawSlug as ServiceDetail["slug"]) || "airport-transfers";
  const service = SERVICES_DATA[slug] || SERVICES_DATA["airport-transfers"];

  return (
    <div className="bg-obsidian-950 min-h-screen">
      {/* Service Hero */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/85 to-obsidian-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-obsidian-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-champagne-400/35 text-[11px] uppercase tracking-[0.24em] text-champagne-300 font-semibold mb-5">
              <Crown className="w-3.5 h-3.5 text-champagne-400" />
              {service.eyebrow}
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl text-ivory-50 leading-[1.06]">
              {service.headline}
            </h1>
            <p className="text-base sm:text-lg text-ivory-100/80 mt-4 leading-relaxed max-w-2xl">
              {service.subtitle}
            </p>
          </motion.div>

          <BookingWidget defaultTab={service.defaultTab} />

          {/* Service Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-10 pt-6 border-t border-white/10">
            {service.stats.map((st) => (
              <div key={st.label}>
                <div className="font-serif text-3xl text-champagne-300 font-semibold">
                  {st.value}
                </div>
                <div className="text-xs text-white/60 mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Value Pillars */}
      <section className="py-24 bg-obsidian-900 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.26em] text-champagne-400 font-semibold">
              The Limo Black Advantage
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 mt-2">
              Engineered Around{" "}
              <span className="italic text-champagne-300">Your Schedule.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {service.pillars.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-7 sm:p-8 rounded-3xl bg-obsidian-950 border border-white/10 space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-champagne-500/15 border border-champagne-400/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-champagne-400" />
                </div>
                <h3 className="font-serif text-2xl text-ivory-50">{p.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Interactive Diagram on City-to-City: 1 Step vs 7 Flight Steps */}
      {service.slug === "city-to-city" && (
        <section className="py-24 bg-obsidian-950 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-[0.26em] text-champagne-400 font-semibold">
                Door-to-Door Efficiency Comparison
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 mt-2">
                Why Regional Flights Lose to{" "}
                <span className="italic text-champagne-300">Limo Black.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Short-Haul Flight 7 Steps */}
              <div className="rounded-3xl bg-obsidian-900/60 border border-white/10 p-7 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/50 font-semibold flex items-center gap-2">
                    <Plane className="w-4 h-4 text-rose-400" /> Short-Haul
                    Commercial Flight
                  </span>
                  <span className="text-xs font-semibold text-rose-300">
                    ~5h 10m Total · 7 Transitions
                  </span>
                </div>
                <div className="space-y-2.5">
                  {FLIGHT_STEPS.map((st, i) => (
                    <div
                      key={st}
                      className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-950/75 border border-white/5 text-xs text-white/60"
                    >
                      <XCircle className="w-4 h-4 text-rose-400/80 shrink-0" />
                      <span>
                        Step {i + 1}: {st}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limo Black 1 Seamless Step */}
              <div className="rounded-3xl bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900 border border-champagne-400/45 p-7 sm:p-8 flex flex-col justify-between shadow-gold-glow">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-champagne-300 font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-champagne-400" /> Limo
                      Black City-to-City
                    </span>
                    <span className="text-xs font-semibold text-emerald-300">
                      ~2h 15m Total · 1 Seamless Step
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-obsidian-950 border border-champagne-400/35 space-y-3">
                    <div className="flex items-center gap-2.5 text-champagne-300 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Step 1: Private Doorstep Pickup to Final Destination
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      Step out of your front door or hotel lobby into a
                      climate-staged S-Class, Escalade, or Maybach. Enjoy
                      uninterrupted 5G Wi-Fi, confidential calls, and full trunk
                      luggage capacity all the way to your destination entrance.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-ivory-100">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="text-champagne-300 font-semibold mb-1">
                        Per-Car Pricing
                      </div>
                      <p className="text-white/55">
                        Bring up to 3–6 guests for one transparent vehicle rate.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="text-champagne-300 font-semibold mb-1">
                        Zero Queue Stress
                      </div>
                      <p className="text-white/55">
                        Depart on your schedule; cancel free until 1h prior.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="#booking-widget"
                  className="mt-6 w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] text-center flex items-center justify-center gap-2"
                >
                  Quote Your Intercity Route <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tailored Occasions */}
      <section className="py-24 bg-obsidian-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.26em] text-champagne-400 font-semibold">
              Bespoke Use Cases
            </span>
            <h2 className="font-serif text-4xl text-ivory-50 mt-2">
              Tailored for Every Occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.occasions.map((occ) => (
              <div
                key={occ.title}
                className="p-7 rounded-3xl bg-obsidian-900/75 border border-white/10 space-y-2.5"
              >
                <h3 className="font-serif text-2xl text-champagne-300">
                  {occ.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  {occ.description}
                </p>
              </div>
            ))}
          </div>

          {/* Cross-Service Navigation */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wider text-white/45">
              Explore Other Limo Black Services:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {Object.values(SERVICES_DATA)
                .filter((s) => s.slug !== service.slug)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/services/${other.slug}`}
                    className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-ivory-50 transition-colors"
                  >
                    {other.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {service.slug === "city-to-city" && <CityRoutesExplorer />}

      <FleetShowcase />
      <FaqAccordion />
    </div>
  );
}
