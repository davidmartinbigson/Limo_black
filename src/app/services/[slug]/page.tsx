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
  "Ride to Pearson / Trudeau / YVR airport (45m)",
  "Bag drop & airline check-in desk (35m)",
  "CATSA security screening queues (40m)",
  "Gate boarding & de-icing wait (45m)",
  "Short-haul regional flight sector (60m)",
  "Deplaning & baggage carousel wait (35m)",
  "Hail transfer to downtown hotel (40m)",
];

export default function ServiceDetailPage() {
  const params = useParams();
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = (rawSlug as ServiceDetail["slug"]) || "airport-transfers";
  const service = SERVICES_DATA[slug] || SERVICES_DATA["airport-transfers"];

  return (
    <div className="bg-canvas min-h-screen">
      {/* Service Hero */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/95 via-obsidian-950/80 to-obsidian-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-obsidian-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-champagne-400/35 text-[11px] uppercase tracking-[0.22em] text-champagne-300 font-semibold mb-5">
              <Crown className="w-3.5 h-3.5 text-champagne-400" />
              {service.eyebrow}
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ivory-50 leading-[1.12]">
              {service.headline}
            </h1>
            <p className="text-base sm:text-lg text-ivory-100/85 mt-4 leading-relaxed max-w-2xl">
              {service.subtitle}
            </p>
          </motion.div>

          <BookingWidget defaultTab={service.defaultTab} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t border-white/15">
            {service.stats.map((st) => (
              <div key={st.label}>
                <div className="font-serif text-2xl sm:text-3xl text-champagne-300 font-semibold">
                  {st.value}
                </div>
                <div className="text-xs text-white/70 mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Value Pillars */}
      <section className="py-24 bg-surface border-y border-line/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
              The Limo Black Canada Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-bold mt-2">
              Engineered Around{" "}
              <span className="text-accent">Your Schedule.</span>
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
                className="p-7 sm:p-8 rounded-3xl bg-card border border-line/12 shadow-luxury space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-serif text-2xl text-ink font-semibold">
                  {p.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Interactive Diagram on City-to-City: 1 Step vs 7 Flight Steps */}
      {service.slug === "city-to-city" && (
        <section className="py-24 bg-canvas border-b border-line/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
                Canadian Corridor Comparison
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-bold mt-2">
                Why Short-Haul Flights Lose to{" "}
                <span className="text-accent">LimoBlack Canada.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="rounded-3xl bg-card border border-line/12 p-7 sm:p-8 space-y-5 shadow-luxury">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                    <Plane className="w-4 h-4 text-rose-500" /> Short-Haul
                    Regional Flight
                  </span>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-300">
                    ~5h 00m Total · 7 Transitions
                  </span>
                </div>
                <div className="space-y-2.5">
                  {FLIGHT_STEPS.map((st, i) => (
                    <div
                      key={st}
                      className="flex items-center gap-3 p-3 rounded-xl bg-field border border-line/10 text-xs text-muted"
                    >
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>
                        Step {i + 1}: {st}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-card border border-champagne-500/50 p-7 sm:p-8 flex flex-col justify-between shadow-gold-glow">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-accent font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" /> Limo Black
                      City-to-City Canada
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">
                      ~1h 55m Total · 1 Seamless Step
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-field border border-champagne-500/35 space-y-3">
                    <div className="flex items-center gap-2.5 text-accent font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Step 1: Private Canadian Doorstep to Final Destination
                    </div>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      Step straight from your home, office, or hotel into a
                      pre-warmed AWD S-Class, Escalade ESV, or Maybach. Enjoy
                      uninterrupted 5G Wi-Fi, confidential calls, and full ski
                      or luggage capacity directly to Whistler, Banff, Niagara,
                      Muskoka, or Montréal.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-field border border-line/10">
                      <div className="text-accent font-bold mb-1">
                        Per-Vehicle CAD Pricing
                      </div>
                      <p className="text-muted">
                        Bring up to 3–6 guests for one transparent CAD fare.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-field border border-line/10">
                      <div className="text-accent font-bold mb-1">
                        Zero CATSA Queues
                      </div>
                      <p className="text-muted">
                        Depart on your schedule; cancel free until 1h prior.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="#booking-widget"
                  className="mt-6 w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] text-center flex items-center justify-center gap-2"
                >
                  Quote Your Canadian Corridor <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tailored Occasions */}
      <section className="py-24 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
              Canadian Use Cases
            </span>
            <h2 className="font-serif text-4xl text-ink font-semibold mt-2">
              Tailored for Every Occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.occasions.map((occ) => (
              <div
                key={occ.title}
                className="p-7 rounded-3xl bg-card border border-line/12 shadow-luxury space-y-2.5"
              >
                <h3 className="font-serif text-2xl text-accent font-semibold">
                  {occ.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {occ.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-line/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wider text-subtle">
              Explore Other Canadian Services:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {Object.values(SERVICES_DATA)
                .filter((s) => s.slug !== service.slug)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/services/${other.slug}`}
                    className="px-4 py-2 rounded-full bg-card hover:bg-line/[0.06] border border-line/15 text-xs font-semibold text-ink transition-colors"
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
