"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BatteryCharging,
  DoorOpen,
  Music,
  Sliders,
  Thermometer,
  VolumeX,
  Wine,
} from "lucide-react";

const CABIN_MOODS = [
  {
    id: "focus",
    label: "Bay Street Focus",
    temp: "20.5°C Crisp",
    sound: "Discreet Acoustic Silence",
    light: "Warm Alabaster Reading Glow",
    drink: "Canadian Spring Water & Espresso",
  },
  {
    id: "alpine",
    label: "Winter Warmth Sanctuary",
    temp: "23°C Heated Seats Active",
    sound: "Soft Classical Nocturnes",
    light: "2700K Starlight Dimmed Trim",
    drink: "Sparkling Perrier & Lemon Peel",
  },
  {
    id: "gala",
    label: "TIFF Red Carpet Gala",
    temp: "19.5°C Evening Gown Cool",
    sound: "Curated Montréal Lounge Jazz",
    light: "Champagne Gold Lounge Aura",
    drink: "0.0% Niagara Blanc de Blancs",
  },
];

const SANCTUARY_PILLARS = [
  {
    icon: DoorOpen,
    title: "A warm Canadian welcome",
    desc: "Your chauffeur arrives 15 minutes early in bespoke attire with a pre-warmed or pre-cooled cabin. Doors are opened graciously and snow or luggage is handled effortlessly.",
    image: "/images/service-chauffeur.jpg",
  },
  {
    icon: Sliders,
    title: "You set the tone",
    desc: "Preparing for a downtown board meeting or unwinding on the Sea-to-Sky Highway? Cabin climate, heated seats, lighting, and etiquette are pre-staged to your preferences.",
    image: "/images/service-interior.jpg",
  },
  {
    icon: BatteryCharging,
    title: "Recharge coast to coast",
    desc: "Stay connected across Canadian metros with high-speed 5G cabin Wi-Fi, braided USB-C & MagSafe chargers for iOS and Android, and chilled refreshments.",
    image: "/images/service-corporate.jpg",
  },
];

export default function SanctuaryInteractive() {
  const [selectedMood, setSelectedMood] = useState(CABIN_MOODS[1]);

  return (
    <section className="py-24 sm:py-32 bg-surface relative overflow-hidden border-y border-line/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.26em] text-accent font-semibold">
            Step In. Breathe Out.
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink mt-3 leading-[1.08]">
            Thoughtful Details Transform Every Canadian Ride Into Your{" "}
            <span className="italic text-accent">Sanctuary.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4">
            Every Limo Black reservation across Canada includes complimentary
            cabin personalization. Preview how our chauffeurs stage the rear
            lounge before your pickup:
          </p>
        </div>

        {/* Interactive Cabin Mood Customizer */}
        <div className="rounded-3xl bg-card border border-line/12 p-6 sm:p-8 mb-16 shadow-luxury">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-line/10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-accent font-semibold">
                Interactive Cabin Staging Preview
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink mt-1">
                Customize Your Rear-Lounge Atmosphere
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {CABIN_MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedMood.id === mood.id
                      ? "bg-gold-gradient text-obsidian-950 shadow-gold-glow"
                      : "bg-field text-muted hover:text-ink border border-line/10"
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6"
          >
            <div className="p-4 rounded-2xl bg-field border border-line/10">
              <div className="flex items-center gap-2 text-accent text-xs font-semibold mb-1">
                <Thermometer className="w-4 h-4" /> Cabin Climate
              </div>
              <div className="text-sm font-semibold text-ink">
                {selectedMood.temp}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-field border border-line/10">
              <div className="flex items-center gap-2 text-accent text-xs font-semibold mb-1">
                <VolumeX className="w-4 h-4" /> Acoustic Protocol
              </div>
              <div className="text-sm font-semibold text-ink">
                {selectedMood.sound}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-field border border-line/10">
              <div className="flex items-center gap-2 text-accent text-xs font-semibold mb-1">
                <Music className="w-4 h-4" /> Ambient Lighting
              </div>
              <div className="text-sm font-semibold text-ink">
                {selectedMood.light}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-field border border-line/10">
              <div className="flex items-center gap-2 text-accent text-xs font-semibold mb-1">
                <Wine className="w-4 h-4" /> Door Console Refreshment
              </div>
              <div className="text-sm font-semibold text-ink">
                {selectedMood.drink}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3 Sanctuary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {SANCTUARY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="group rounded-3xl bg-card border border-line/12 overflow-hidden hover:border-champagne-500/45 transition-all duration-300 flex flex-col shadow-luxury"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 w-11 h-11 rounded-2xl bg-obsidian-950/90 backdrop-blur-md border border-champagne-400/35 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-champagne-400" />
                  </div>
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl text-ink mb-2.5 group-hover:text-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
