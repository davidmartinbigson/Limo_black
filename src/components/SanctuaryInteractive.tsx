"use client";

import React from "react";
import { motion } from "framer-motion";

const SANCTUARY_CARDS = [
  {
    title: "A welcome like no other",
    desc: "The door is opened for you. Your luggage is stowed. Everything is taken care of across every Canadian terminal, hotel, and residence.",
    image: "/images/service-chauffeur.jpg",
  },
  {
    title: "You set the tone",
    desc: "Sit back and relax. Cabin music and pre-warmed winter or cooled summer temperature will be adjusted to your exact preferences.",
    image: "/images/service-interior.jpg",
  },
  {
    title: "Recharge your batteries",
    desc: "Stay connected on the go with 5G cabin Wi-Fi, bottled Canadian spring water, and universal chargers for iOS and Android.",
    image: "/images/service-corporate.jpg",
  },
];

export default function SanctuaryInteractive() {
  return (
    <section className="py-20 sm:py-28 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exact Blacklane Centered Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-accent mb-2">
            Step in. Breathe out.
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink leading-[1.16]">
            Thoughtful details and discreet service transform every journey into
            your personal sanctuary.
          </h2>
        </div>

        {/* Exact Blacklane 3-Column Sanctuary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {SANCTUARY_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="space-y-4"
            >
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-obsidian-900 border border-line/10">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1.5 pt-1">
                <h3 className="font-serif text-xl font-bold text-ink">
                  {card.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
