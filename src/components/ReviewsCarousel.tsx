"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Quote, Star } from "lucide-react";
import { CLIENT_REVIEWS } from "@/data/limoData";

const CATEGORIES = [
  "All",
  "Airport Transfers",
  "Stretch Limousine",
  "City-to-City",
  "Corporate",
] as const;

export default function ReviewsCarousel() {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    selectedCategory === "All"
      ? CLIENT_REVIEWS
      : CLIENT_REVIEWS.filter((r) => r.category === selectedCategory);

  return (
    <section className="py-24 sm:py-32 bg-obsidian-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trustpilot-Style Summary Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/25 mb-4">
              <div className="flex items-center gap-0.5 text-emerald-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-emerald-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-emerald-300">
                Excellent 4.9 / 5.0 · Based on 12,480+ Verified Journeys
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 leading-[1.08]">
              Trusted by Discerning{" "}
              <span className="italic text-champagne-300">Global Travelers.</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-champagne-500 text-obsidian-950"
                    : "bg-white/[0.04] text-white/65 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="rounded-3xl bg-obsidian-900/80 border border-white/10 p-7 flex flex-col justify-between shadow-luxury hover:border-champagne-400/35 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-champagne-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-champagne-400 text-champagne-400"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-white/45">{rev.date}</span>
                </div>

                <Quote className="w-6 h-6 text-champagne-400/30 mb-2" />
                <h3 className="font-serif text-xl text-ivory-50 mb-2.5">
                  {rev.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                  “{rev.quote}”
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-ivory-50 flex items-center gap-1.5">
                    {rev.author}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-white/45">{rev.role}</div>
                  <div className="text-[11px] text-champagne-300 mt-0.5">
                    {rev.route}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Luxury Awards Strip */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              award: "World Chauffeur & Limousine Winner",
              org: "World Travel Luxury Awards · 2026",
            },
            {
              award: "Best Global Corporate Ground Mobility",
              org: "Business Travel Awards Europe & US",
            },
            {
              award: "Leaders in Sustainable Luxury Fleet",
              org: "LUXlife Global Hospitality Excellence",
            },
          ].map((item) => (
            <div
              key={item.award}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10"
            >
              <div className="w-11 h-11 rounded-xl bg-champagne-500/15 border border-champagne-400/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-champagne-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ivory-50">
                  {item.award}
                </div>
                <div className="text-xs text-white/50 mt-0.5">{item.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
