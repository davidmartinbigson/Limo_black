"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Clock,
  Crown,
  Leaf,
  MapPin,
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
    title: "Canadian airport transfers",
    headline: "Smooth landings at YYZ, YVR, YUL & YYC.",
    desc: "Delayed Air Canada, WestJet, or Porter flight? Chauffeurs track live telemetry and adjust automatically — with 60 minutes of complimentary arrival wait time.",
    href: "/services/airport-transfers",
    image: "/images/service-airport.jpg",
    icon: Plane,
    badge: "60m Free Wait",
  },
  {
    title: "Hourly and full-day hire",
    headline: "Seize the city, snow or shine.",
    desc: "Reserve a dedicated AWD limousine and senior chauffeur from 2 to 24 hours across Toronto, Vancouver, Montréal, Calgary, or Ottawa.",
    href: "/services/hourly",
    image: "/images/service-chauffeur.jpg",
    icon: Clock,
    badge: "2 – 24 Hours",
  },
  {
    title: "Royal stretch limousine",
    headline: "Grand Canadian entrances, perfected.",
    desc: "Arrive in unmistakable style with Mercedes-Maybach Pullman and bespoke Stretch Limousines for weddings, TIFF premieres, galas, and graduations.",
    href: "/services/limousine",
    image: "/images/fleet-stretch-limo.jpg",
    icon: Sparkles,
    badge: "Limo Black Signature",
  },
  {
    title: "Canadian corporate & enterprise",
    headline: "National business travel, simplified.",
    desc: "One unified executive portal for Bay Street firms, Calgary energy leaders, and Canadian agencies with consolidated monthly GST/HST invoicing.",
    href: "/business",
    image: "/images/service-corporate.jpg",
    icon: Building2,
    badge: "Consolidated HST Billing",
  },
];

const EXCELLENCE_PILLARS = [
  {
    icon: MapPin,
    title: "Coast-to-coast Canada",
    desc: "Vetted career chauffeurs across Toronto, Vancouver, Montréal, Calgary, Ottawa, Whistler, Banff, Niagara & 25+ Canadian hubs.",
  },
  {
    icon: Crown,
    title: "All-season AWD fleet",
    desc: "Exclusively late-model 4MATIC / xDrive / 4WD Maybach, S-Class, EQS Electric, Escalade ESV, and Stretch Limousines.",
  },
  {
    icon: ShieldCheck,
    title: "Fixed CAD fares",
    desc: "Every 407 ETR highway toll, airport pickup fee, GST/HST tax, and tip is locked in upfront. Cancel free until 1 hour prior.",
  },
  {
    icon: Leaf,
    title: "100% Carbon-neutral",
    desc: "Every Canadian journey is carbon-offset at zero extra cost, backed by our clean-grid Electric Class sedans.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-canvas">
      {/* CINEMATIC FULL-BLEED HERO */}
      <section className="relative min-h-[96vh] pt-28 pb-16 sm:pt-36 sm:pb-24 flex flex-col justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.07, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/images/hero-limo.jpg"
            alt="Limo Black Canada Maybach Chauffeur Service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/95 via-obsidian-950/80 to-obsidian-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/25 to-obsidian-950/55" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mb-10 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-champagne-400/40 mb-6">
              <span className="w-2 h-2 rounded-full bg-champagne-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-champagne-300 font-semibold">
                Canada&apos;s Premier Limousine & Chauffeur Service 🇨🇦
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ivory-50 leading-[1.03] tracking-tight">
              Your Canadian Limousine &{" "}
              <span className="italic text-champagne-300">Chauffeur Await.</span>
            </h1>

            <p className="text-base sm:text-lg text-ivory-100/85 mt-5 max-w-xl leading-relaxed">
              Door-to-door luxury across Toronto, Vancouver, Montréal, Calgary,
              Ottawa, Whistler, Banff & Niagara. Search any Canadian street
              address below for guaranteed all-inclusive CAD fares.
            </p>
          </motion.div>

          {/* Interactive Booking Engine (Adapts cleanly to Light/Dark Mode!) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
          >
            <BookingWidget />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/15"
          >
            {[
              { value: "10 Provinces", label: "25+ Major Canadian Cities & Hubs" },
              { value: "60 Minutes", label: "Free Airport Arrival Wait" },
              { value: "4.9 ★ Rating", label: "Verified Canadian VIP Journeys" },
              { value: "100% Fixed CAD", label: "GST/HST, Tolls & Tip Included" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="font-serif text-2xl sm:text-3xl text-champagne-300 font-semibold">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CORE SERVICES ("ARRIVE AT YOUR BEST") */}
      <section className="py-24 sm:py-32 bg-surface border-t border-line/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.26em] text-accent font-semibold">
                Arrive at Your Best Across Canada
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink mt-2.5 leading-[1.08]">
                Effortless Journeys,{" "}
                <span className="italic text-accent">Tailored to You.</span>
              </h2>
            </div>
            <Link
              href="/services/city-to-city"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent hover:opacity-80 font-semibold"
            >
              <Route className="w-4 h-4" />
              Explore Canadian Corridors
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
                    className="group block h-full rounded-3xl bg-card border border-line/12 hover:border-champagne-500/50 overflow-hidden shadow-luxury transition-all duration-300"
                  >
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/75 via-obsidian-950/20 to-transparent" />
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-champagne-400/35 text-[11px] uppercase tracking-[0.16em] text-champagne-300 font-semibold flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-champagne-400" />
                        {service.badge}
                      </div>
                    </div>

                    <div className="p-7 sm:p-8">
                      <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1.5">
                        {service.title}
                      </div>
                      <h3 className="font-serif text-3xl text-ink group-hover:text-accent transition-colors">
                        {service.headline}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed mt-3">
                        {service.desc}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-ink group-hover:text-accent transition-colors">
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

      {/* SANCTUARY CABIN CUSTOMIZER */}
      <SanctuaryInteractive />

      {/* INTERACTIVE CANADIAN CITY-TO-CITY ROUTES EXPLORER */}
      <CityRoutesExplorer />

      {/* EXPECT EXCELLENCE PILLARS */}
      <section className="py-20 sm:py-24 bg-canvas border-t border-line/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.26em] text-accent font-semibold">
              Expect Canadian Excellence
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink mt-2.5">
              Arrive Refreshed in{" "}
              <span className="italic text-accent">Every Season.</span>
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
                  className="p-7 rounded-3xl bg-card border border-line/12 hover:border-champagne-500/40 shadow-luxury transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
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

      {/* CLIENT REVIEWS & AWARDS */}
      <ReviewsCarousel />

      {/* FAQ KNOWLEDGE BASE */}
      <FaqAccordion />

      {/* FINAL EXECUTIVE CALL TO ACTION BANNER */}
      <section className="py-20 sm:py-24 bg-canvas border-t border-line/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-champagne-500/40 p-8 sm:p-14 text-center bg-obsidian-950 text-ivory-50 shadow-luxury">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-champagne-500/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-1.5 text-champagne-400 text-xs uppercase tracking-[0.24em] font-semibold">
                <Star className="w-3.5 h-3.5 fill-champagne-400" />
                Canadian Welcome Privilege: LIMOBLACK15
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 leading-tight">
                Ready for an Unforgettable{" "}
                <span className="italic text-champagne-300">
                  Canadian Chauffeur Ride?
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/70">
                Search any Canadian address and lock in your guaranteed
                all-inclusive CAD fare in under 60 seconds — with free
                cancellation up until 1 hour before pickup.
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
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-ivory-50 font-semibold text-xs uppercase tracking-[0.18em] transition-colors"
                >
                  Canadian Corporate Accounts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
