"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Clock,
  Crown,
  Globe2,
  Leaf,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import FleetShowcase from "@/components/FleetShowcase";
import SanctuaryInteractive from "@/components/SanctuaryInteractive";
import CityRoutesExplorer from "@/components/CityRoutesExplorer";
import AppShowcase from "@/components/AppShowcase";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import FaqAccordion from "@/components/FaqAccordion";

const CORE_SERVICES = [
  {
    title: "Airport transfers",
    headline: "Smooth landings, every time.",
    desc: "Delayed flight? Chauffeurs track live telemetry and adjust automatically. Enjoy 1 full hour of complimentary wait time and inside-terminal Meet & Greet.",
    href: "/services/airport-transfers",
    image: "/images/service-airport.jpg",
    icon: Plane,
    badge: "60m Free Wait",
  },
  {
    title: "Hourly and full-day hire",
    headline: "Seize the day.",
    desc: "Reserve a dedicated limousine and senior chauffeur from 2 to 24 hours. They remain on discreet standby steps from every meeting or boutique.",
    href: "/services/hourly",
    image: "/images/service-chauffeur.jpg",
    icon: Clock,
    badge: "2 – 24 Hours",
  },
  {
    title: "Royal stretch limousine",
    headline: "Grand entrances, perfected.",
    desc: "Make an unforgettable impression with Mercedes-Maybach Pullman and bespoke Stretch Limousines for galas, weddings, red-carpet premieres, and VIP diplomacy.",
    href: "/services/limousine",
    image: "/images/fleet-stretch-limo.jpg",
    icon: Sparkles,
    badge: "Limo Black Signature",
  },
  {
    title: "Enterprise & corporate solutions",
    headline: "Corporate travel, simplified.",
    desc: "One unified executive portal for corporations, family offices, and travel agencies to book, track, and consolidate global ground transportation.",
    href: "/business",
    image: "/images/service-corporate.jpg",
    icon: Building2,
    badge: "Global Billing & GDS",
  },
];

const EXCELLENCE_PILLARS = [
  {
    icon: Globe2,
    title: "Available worldwide",
    desc: "Vetted, multilingual career chauffeurs across 500+ cities and 1,200+ international airports in 64+ countries.",
  },
  {
    icon: Crown,
    title: "Flagship obsidian fleet",
    desc: "Exclusively late-model Maybach Pullman, S-Class, EQS Electric, Escalade ESV, and bespoke Stretch Limousines.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent fixed fares",
    desc: "Every highway toll, airport fee, tax, and gratuity is locked in upfront. Cancel free up until 1 hour before pickup.",
  },
  {
    icon: Leaf,
    title: "100% Carbon-neutral rides",
    desc: "Every journey is verified carbon-offset at zero extra cost, backed by our expanding zero-emission Electric Class.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-obsidian-950">
      {/* CINEMATIC FULL-BLEED HERO */}
      <section className="relative min-h-[96vh] pt-28 pb-16 sm:pt-36 sm:pb-24 flex flex-col justify-center overflow-hidden">
        {/* Hero Background Image with Slow Luxury Zoom */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/images/hero-limo.jpg"
            alt="Limo Black Maybach Chauffeur Service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-obsidian-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/25 to-obsidian-950/60" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Hero Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mb-10 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-obsidian-950/75 backdrop-blur-md border border-champagne-400/35 mb-6">
              <span className="w-2 h-2 rounded-full bg-champagne-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-champagne-300 font-semibold">
                The Global Limousine & Chauffeur Standard
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ivory-50 leading-[1.03] tracking-tight">
              Your Limousine &{" "}
              <span className="italic text-champagne-300">Chauffeur Await.</span>
            </h1>

            <p className="text-base sm:text-lg text-ivory-100/80 mt-5 max-w-xl leading-relaxed">
              Experience serene door-to-door luxury in 500+ cities worldwide.
              Bespoke Stretch Limousines, Mercedes-Maybach, S-Class & Executive
              SUVs — always on time, always all-inclusive.
            </p>
          </motion.div>

          {/* Interactive Booking Engine */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
          >
            <BookingWidget />
          </motion.div>

          {/* Instant Hero Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10"
          >
            {[
              { value: "64+ Countries", label: "500+ Global Cities Served" },
              { value: "60 Minutes", label: "Free Airport Arrival Wait" },
              { value: "4.9 ★ Rating", label: "12,480+ Verified VIP Rides" },
              { value: "100% Fixed", label: "All-Inclusive Luxury Rates" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="font-serif text-2xl sm:text-3xl text-champagne-300 font-semibold">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CORE SERVICES ("ARRIVE AT YOUR BEST") */}
      <section className="py-24 sm:py-32 bg-obsidian-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-champagne-400 font-semibold">
                Arrive at Your Best
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory-50 mt-2.5 leading-[1.08]">
                Effortless Journeys,{" "}
                <span className="italic text-champagne-300">Tailored to You.</span>
              </h2>
            </div>
            <Link
              href="/services/city-to-city"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-champagne-300 hover:text-champagne-400 font-semibold"
            >
              <Route className="w-4 h-4" />
              Explore Intercity Corridors
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {CORE_SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    href={service.href}
                    className="group block h-full rounded-3xl bg-obsidian-950 border border-white/10 hover:border-champagne-400/45 overflow-hidden shadow-luxury transition-all duration-300"
                  >
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent" />
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-champagne-400/35 text-[11px] uppercase tracking-[0.16em] text-champagne-300 font-semibold flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-champagne-400" />
                        {service.badge}
                      </div>
                    </div>

                    <div className="p-7 sm:p-8">
                      <div className="text-xs uppercase tracking-[0.2em] text-champagne-400 font-semibold mb-1.5">
                        {service.title}
                      </div>
                      <h3 className="font-serif text-3xl text-ivory-50 group-hover:text-champagne-300 transition-colors">
                        {service.headline}
                      </h3>
                      <p className="text-sm text-white/65 leading-relaxed mt-3">
                        {service.desc}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-ivory-50 group-hover:text-champagne-300 transition-colors">
                        Learn More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FLEET & STRETCH LIMOUSINE SHOWCASE */}
      <FleetShowcase />

      {/* SANCTUARY CABIN CUSTOMIZER ("STEP IN. BREATHE OUT.") */}
      <SanctuaryInteractive />

      {/* INTERACTIVE CITY-TO-CITY ROUTES EXPLORER */}
      <CityRoutesExplorer />

      {/* EXPECT EXCELLENCE PILLARS */}
      <section className="py-20 sm:py-24 bg-obsidian-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.28em] text-champagne-400 font-semibold">
              Expect Excellence
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 mt-2.5">
              Leave the Limousine Refreshed for{" "}
              <span className="italic text-champagne-300">What&apos;s Next.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXCELLENCE_PILLARS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-7 rounded-3xl bg-obsidian-900/75 border border-white/10 hover:border-champagne-400/35 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-champagne-500/15 border border-champagne-400/30 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-champagne-400" />
                  </div>
                  <h3 className="font-serif text-2xl text-ivory-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MOBILE APP & LIVE CHAUFFEUR TELEMETRY SHOWCASE */}
      <AppShowcase />

      {/* CLIENT REVIEWS & LUXURY AWARDS */}
      <ReviewsCarousel />

      {/* FAQ KNOWLEDGE BASE */}
      <FaqAccordion />

      {/* FINAL EXECUTIVE CALL TO ACTION BANNER */}
      <section className="py-20 sm:py-24 bg-obsidian-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-champagne-400/35 p-8 sm:p-14 text-center bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900 shadow-luxury">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-champagne-500/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-1.5 text-champagne-400 text-xs uppercase tracking-[0.26em] font-semibold">
                <Star className="w-3.5 h-3.5 fill-champagne-400" />
                Privilege Code: LIMOBLACK15
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 leading-tight">
                Ready for an Unforgettable{" "}
                <span className="italic text-champagne-300">Chauffeured Ride?</span>
              </h2>
              <p className="text-sm sm:text-base text-white/65">
                Lock in your guaranteed all-inclusive fare in under 60 seconds,
                with complimentary changes or cancellation up until 1 hour prior
                to pickup.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="#booking-widget"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.18em] shadow-gold-glow hover:brightness-110 transition-all"
                >
                  Book Your Limousine
                </a>
                <Link
                  href="/business"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-ivory-50 font-semibold text-xs uppercase tracking-[0.18em] transition-colors"
                >
                  Corporate Accounts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
