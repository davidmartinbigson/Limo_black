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
    label: "Executive Focus",
    temp: "20°C Crisp",
    sound: "Discreet Acoustic Silence",
    light: "Warm Alabaster Reading Glow",
    drink: "Chilled Still Evian & Espresso",
    glowClass: "from-amber-200/20 via-champagne-400/10 to-transparent",
  },
  {
    id: "nocturne",
    label: "Midnight Sanctuary",
    temp: "21.5°C Balanced",
    sound: "Soft Classical Nocturnes",
    light: "2700K Starlight Dimmed Trim",
    drink: "Sparkling Perrier & Lemon Peel",
    glowClass: "from-champagne-500/25 via-indigo-900/20 to-transparent",
  },
  {
    id: "gala",
    label: "Red Carpet Gala",
    temp: "19.5°C Evening Gown Cool",
    sound: "Curated Parisian Lounge",
    light: "Champagne Gold Lounge Aura",
    drink: "0.0% Vintage Blanc de Blancs",
    glowClass: "from-champagne-300/30 via-amber-500/15 to-transparent",
  },
];

const SANCTUARY_PILLARS = [
  {
    icon: DoorOpen,
    title: "A welcome like no other",
    desc: "Your chauffeur arrives 15 minutes early in bespoke attire. The door is opened graciously, your luggage is stowed with care, and the city noise disappears behind acoustic glass.",
    image: "/images/service-chauffeur.jpg",
  },
  {
    icon: Sliders,
    title: "You set the tone",
    desc: "Prefer uninterrupted silence to prepare for a board meeting, or curated local dining insights? Cabin climate, lighting, and soundscape are pre-set to your profile before you step in.",
    image: "/images/service-interior.jpg",
  },
  {
    icon: BatteryCharging,
    title: "Recharge your batteries",
    desc: "Stay effortlessly connected with high-speed 5G cabin Wi-Fi, braided USB-C & MagSafe chargers for iOS and Android, and chilled crystal refreshments.",
    image: "/images/service-corporate.jpg",
  },
];

export default function SanctuaryInteractive() {
  const [selectedMood, setSelectedMood] = useState(CABIN_MOODS[1]);

  return (
    <section className="py-24 sm:py-32 bg-obsidian-900 relative overflow-hidden border-y border-white/10">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${selectedMood.glowClass} transition-all duration-700 pointer-events-none`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.28em] text-champagne-400 font-semibold">
            Step In. Breathe Out.
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory-50 mt-3 leading-[1.08]">
            Thoughtful Details Transform Every Journey Into Your{" "}
            <span className="italic text-champagne-300">Sanctuary.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/65 mt-4">
            Every Limo Black reservation includes complimentary cabin
            personalization. Preview how our chauffeurs stage the rear lounge
            before your arrival:
          </p>
        </div>

        {/* Interactive Cabin Mood Customizer */}
        <div className="rounded-3xl bg-obsidian-950/85 backdrop-blur-xl border border-white/12 p-6 sm:p-8 mb-16 shadow-luxury">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                Interactive Cabin Staging Preview
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 mt-1">
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
                      : "bg-white/[0.05] text-white/70 hover:text-white border border-white/10"
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
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-champagne-400 text-xs font-medium mb-1">
                <Thermometer className="w-4 h-4" /> Cabin Climate
              </div>
              <div className="text-sm font-semibold text-ivory-50">
                {selectedMood.temp}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-champagne-400 text-xs font-medium mb-1">
                <VolumeX className="w-4 h-4" /> Acoustic Protocol
              </div>
              <div className="text-sm font-semibold text-ivory-50">
                {selectedMood.sound}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-champagne-400 text-xs font-medium mb-1">
                <Music className="w-4 h-4" /> Ambient Lighting
              </div>
              <div className="text-sm font-semibold text-ivory-50">
                {selectedMood.light}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-champagne-400 text-xs font-medium mb-1">
                <Wine className="w-4 h-4" /> Door Console Refreshment
              </div>
              <div className="text-sm font-semibold text-ivory-50">
                {selectedMood.drink}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3 Blacklane-Inspired Sanctuary Cards Elevated */}
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
                className="group rounded-3xl bg-obsidian-950/90 border border-white/10 overflow-hidden hover:border-champagne-400/40 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 w-11 h-11 rounded-2xl bg-obsidian-950/90 backdrop-blur-md border border-champagne-400/35 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-champagne-400" />
                  </div>
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl text-ivory-50 mb-2.5 group-hover:text-champagne-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed">
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
