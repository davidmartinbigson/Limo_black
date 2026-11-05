"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Globe2,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import FleetShowcase from "@/components/FleetShowcase";
import SanctuaryInteractive from "@/components/SanctuaryInteractive";
import CityRoutesExplorer from "@/components/CityRoutesExplorer";
import AppShowcase from "@/components/AppShowcase";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import FaqAccordion from "@/components/FaqAccordion";

const ARRIVE_AT_YOUR_BEST_CARDS = [
  {
    category: "Airport transfers",
    headline: "Smooth landings, every time.",
    desc: "Delayed Air Canada or WestJet flight? Chauffeurs track arrivals at YYZ, YVR, YUL & YYC and adjust accordingly. Plus, you have 1 hour of complimentary wait time just in case.",
    href: "/services/airport-transfers",
    image: "/images/service-airport.jpg",
  },
  {
    category: "Hourly and full day hire",
    headline: "Seize the day.",
    desc: "Reserve a dedicated limousine and chauffeur from 2 to 24 hours across Toronto, Vancouver, Montréal, or Calgary. They'll be on standby as long as you need them.",
    href: "/services/hourly",
    image: "/images/service-chauffeur.jpg",
  },
  {
    category: "City-to-city",
    headline: "Between cities, done better.",
    desc: "Turn long-distance Canadian corridors — like Toronto to Niagara, Vancouver to Whistler, or Calgary to Banff — into time well spent. Arrive refreshed, not stressed.",
    href: "/services/city-to-city",
    image: "/images/city-vancouver.jpg",
  },
  {
    category: "Enterprise and limousine solutions",
    headline: "Corporate & gala travel, simplified.",
    desc: "One Canadian GST/HST platform for companies, agencies, and VIP events to book, track, and account for every executive sedan, AWD SUV, and stretch limousine.",
    href: "/business",
    image: "/images/fleet-stretch-limo.jpg",
  },
];

const EXPECT_EXCELLENCE_ITEMS = [
  {
    icon: Globe2,
    title: "Available coast-to-coast",
    desc: "Expert local chauffeurs across 25+ Canadian cities & airports",
  },
  {
    icon: Award,
    title: "High-end vehicles",
    desc: "Only the finest recent AWD sedans, SUVs & stretch limousines",
  },
  {
    icon: ShieldCheck,
    title: "Safe travels",
    desc: "Trained, licensed professionals and reliable on-time pickups",
  },
  {
    icon: Leaf,
    title: "Sustainability partners",
    desc: "100% carbon-offset Canadian rides & zero-emission Electric Class",
  },
];

export default function HomePage() {
  return (
    <div className="bg-canvas">
      {/* 1. BLACKLANE SIGNATURE SPLIT HERO ("Your chauffeur awaits." + Right Stacked Booking Card) */}
      <section className="relative pt-24 pb-14 sm:pt-28 sm:pb-20 lg:min-h-[690px] flex items-center overflow-hidden bg-obsidian-950">
        {/* Full-Bleed Hero Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-limo.jpg"
            alt="LimoBlack Canada Chauffeur & Limousine Service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/90 via-obsidian-950/60 to-obsidian-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-transparent to-obsidian-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Headline (Blacklane Signature Copy & Hierarchy) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-5 text-white"
            >
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.08] text-white">
                Your chauffeur awaits.
              </h1>

              <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
                Premium limousine and executive chauffeur service across
                Toronto, Vancouver, Montréal, Calgary, Ottawa, Whistler & 25+
                Canadian cities.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/80 font-medium">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-champagne-400 shrink-0" />
                  All-inclusive fixed CAD pricing
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-champagne-400 shrink-0" />
                  Free cancellation until 1h before
                </span>
              </div>

              <p className="text-xs text-white/60 pt-2">
                Set your pickup across all 10 Canadian provinces. We&apos;ll be
                there on time.
              </p>
            </motion.div>

            {/* Right Floating Vertical Booking Card (Exact Blacklane Hero Card) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="lg:col-span-5 flex lg:justify-end"
            >
              <BookingWidget />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. BLACKLANE "ARRIVE AT YOUR BEST." — 4 EDITORIAL SERVICE CARDS */}
      <section className="py-20 sm:py-28 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="text-sm font-semibold text-accent mb-2">
              Arrive at your best.
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink leading-[1.14]">
              Effortless journeys, tailored to you.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {ARRIVE_AT_YOUR_BEST_CARDS.map((card, idx) => (
              <motion.div
                key={card.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <Link href={card.href} className="group block space-y-4">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-obsidian-900 border border-line/10">
                    <img
                      src={card.image}
                      alt={card.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {card.category}
                    </p>
                    <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-accent transition-colors">
                      {card.headline}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {card.desc}
                    </p>
                    <div className="pt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent underline underline-offset-4 transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BLACKLANE "WE MOVE WITH YOU." — SPLIT APP & PORTAL BANNER */}
      <AppShowcase />

      {/* 4. BLACKLANE "STEP IN. BREATHE OUT." — 3-COLUMN SANCTUARY */}
      <SanctuaryInteractive />

      {/* 5. BLACKLANE "EXPECT EXCELLENCE." — 4 MINIMAL PILLAR COLUMNS */}
      <section className="py-20 sm:py-24 bg-surface border-y border-line/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="text-sm font-semibold text-accent mb-2">
              Expect excellence.
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-[1.15]">
              Leave the limousine refreshed and ready for what&apos;s next.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {EXPECT_EXCELLENCE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="space-y-3"
                >
                  <div className="w-11 h-11 rounded-xl bg-card border border-line/12 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink">
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

      {/* 6. SERVICE CLASSES FLEET SHOWCASE */}
      <FleetShowcase />

      {/* 7. BLACKLANE "CITY-TO-CITY ROUTES" (TOP 4 CITIES + TOP 8 ROUTES) */}
      <CityRoutesExplorer />

      {/* 8. VERIFIED CANADIAN CLIENT REVIEWS */}
      <ReviewsCarousel />

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <FaqAccordion />
    </div>
  );
}
