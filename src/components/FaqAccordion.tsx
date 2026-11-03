"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Minus, Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/data/limoData";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-28 bg-obsidian-900 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-champagne-400 font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Concierge Knowledge Base
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-ivory-50 mt-3">
            Frequently Asked{" "}
            <span className="italic text-champagne-300">Questions</span>
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-colors ${
                  isOpen
                    ? "bg-obsidian-950 border-champagne-400/40"
                    : "bg-obsidian-950/60 border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span className="font-serif text-lg sm:text-xl text-ivory-50 font-medium">
                    {item.question}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-champagne-400">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-white/65 leading-relaxed border-t border-white/5 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
