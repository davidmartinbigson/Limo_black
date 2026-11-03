"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Globe2,
  Handshake,
  Headphones,
  Leaf,
  PlaneTakeoff,
  ShieldCheck,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

const SOLUTIONS = [
  {
    icon: Building2,
    title: "Corporate Executive Travel",
    desc: "Centralized booking for Executive Assistants, travel managers, and C-Suite travelers across 64+ countries with automated cost-center tagging.",
  },
  {
    icon: PlaneTakeoff,
    title: "Travel Agencies & GDS",
    desc: "Seamless Amadeus, Sabre, and Travelport GDS integration with generous agency commissions and instant VIP client confirmation.",
  },
  {
    icon: Handshake,
    title: "Strategic & Hospitality Partners",
    desc: "White-glove complimentary transfer programs for five-star hotels, private banks, airlines, and luxury maisons.",
  },
];

const ENTERPRISE_PERKS = [
  {
    icon: Globe2,
    title: "Global Reliability",
    desc: "Instant confirmation and uniform five-star standards in 500+ cities.",
  },
  {
    icon: FileSpreadsheet,
    title: "Consolidated Monthly Billing",
    desc: "Eliminate individual expense reports with itemized monthly VAT invoices.",
  },
  {
    icon: Clock,
    title: "Unrivaled Flexibility",
    desc: "Modify or cancel any executive reservation free until 1 hour before pickup.",
  },
  {
    icon: Headphones,
    title: "Priority 24/7 Account Desk",
    desc: "Dedicated multilingual corporate concierge via phone, live chat, or email.",
  },
  {
    icon: Leaf,
    title: "Auditable ESG Reporting",
    desc: "Quarterly Scope-3 carbon-offset certificates & Electric Class prioritization.",
  },
  {
    icon: ShieldCheck,
    title: "Duty of Care & NDA Security",
    desc: "Live GPS passenger visibility and background-vetted career chauffeurs.",
  },
];

export default function BusinessPage() {
  const { formatPrice } = useBooking();

  // Interactive Corporate Spend & Savings Calculator
  const [monthlyRides, setMonthlyRides] = useState(45);
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [teamSize, setTeamSize] = useState("50–250 Employees");

  const estimatedSpendUsd = monthlyRides * 165;
  const corporatePrivilegeSavingsUsd = Math.round(estimatedSpendUsd * 0.14);
  const adminHoursSaved = Math.round(monthlyRides * 0.35);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-500/15 border border-champagne-400/35 text-[11px] uppercase tracking-[0.24em] text-champagne-300 font-semibold">
              Limo Black for Enterprise
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ivory-50 leading-[1.06]">
              Corporate Mobility,{" "}
              <span className="italic text-champagne-300">Simplified.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/65 leading-relaxed">
              Five-star chauffeurs and limousines worldwide for corporations,
              private banks, travel agencies, and diplomatic missions — managed
              from one intuitive executive portal.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#corporate-onboarding"
                className="px-7 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center gap-2"
              >
                Create Business Account <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-luxury aspect-[16/10]">
              <img
                src="/images/service-corporate.jpg"
                alt="Corporate Chauffeur Travel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-obsidian-950/85 backdrop-blur-md border border-white/10">
                <p className="text-xs sm:text-sm text-ivory-50 italic">
                  “We consolidated 14 regional car vendors into Limo Black’s
                  executive portal — cutting EA booking time by 70%.”
                </p>
                <p className="text-[11px] text-champagne-300 mt-1">
                  — Global Travel Director, Fortune 500 Financial Institution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tailored Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.title}
                className="p-8 rounded-3xl bg-obsidian-900 border border-white/10 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-champagne-500/15 border border-champagne-400/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-champagne-400" />
                </div>
                <h2 className="font-serif text-2xl text-ivory-50">
                  {sol.title}
                </h2>
                <p className="text-sm text-white/65 leading-relaxed">
                  {sol.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 6 Enterprise Advantages */}
        <div className="rounded-3xl bg-obsidian-900/75 border border-white/10 p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-[0.26em] text-champagne-400 font-semibold">
              How You Arrive Matters
            </span>
            <h2 className="font-serif text-4xl text-ivory-50 mt-2">
              Built for Executive Assistants & Travel Leaders
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {ENTERPRISE_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="space-y-2">
                  <div className="flex items-center gap-2.5 text-champagne-300 font-semibold text-sm">
                    <Icon className="w-4 h-4 text-champagne-400" />
                    {perk.title}
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive ROI Estimator + Onboarding Form */}
        <div
          id="corporate-onboarding"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Spend & Savings Calculator */}
          <div className="lg:col-span-5 rounded-3xl bg-obsidian-900 border border-white/12 p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                  Corporate Privilege Estimator
                </span>
                <h3 className="font-serif text-3xl text-ivory-50 mt-1">
                  Estimate Your Enterprise Savings
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-obsidian-950 border border-white/10 space-y-3">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Monthly Executive Rides</span>
                  <span className="font-bold text-champagne-300 text-sm">
                    {monthlyRides} rides / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={250}
                  step={5}
                  value={monthlyRides}
                  onChange={(e) => setMonthlyRides(Number(e.target.value))}
                  className="w-full accent-[#C6A364]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10">
                  <div className="text-[11px] text-white/50">
                    Est. Contract Rebate
                  </div>
                  <div className="font-serif text-2xl text-emerald-300 font-semibold mt-1">
                    {formatPrice(corporatePrivilegeSavingsUsd)}/mo
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10">
                  <div className="text-[11px] text-white/50">
                    EA Admin Time Saved
                  </div>
                  <div className="font-serif text-2xl text-champagne-300 font-semibold mt-1">
                    ~{adminHoursSaved} hrs/mo
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/45 mt-6">
              Includes complimentary monthly VAT invoicing, zero setup fees, and
              no minimum annual spend commitment.
            </p>
          </div>

          {/* Business Account Form */}
          <div className="lg:col-span-7 rounded-3xl bg-obsidian-900 border border-champagne-400/35 p-7 sm:p-10 shadow-luxury">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="font-serif text-3xl text-ivory-50">
                  Executive Portal Provisioned
                </h3>
                <p className="text-sm text-white/65 max-w-md">
                  Thank you,{" "}
                  <span className="text-champagne-300 font-semibold">
                    {companyName || "Partner"}
                  </span>
                  . Our Enterprise Mobility Director has sent instant portal
                  credentials and preferred rate tables to{" "}
                  <span className="text-ivory-50">{workEmail}</span>.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                    Instant Corporate Onboarding
                  </span>
                  <h3 className="font-serif text-3xl text-ivory-50 mt-1">
                    Create Your Business Account
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Company or Agency Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Sterling Capital Partners"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="travel@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Organization Size
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50"
                    >
                      <option>1–50 Employees / Family Office</option>
                      <option>50–250 Employees</option>
                      <option>250–1,000 Employees</option>
                      <option>1,000+ Global Enterprise</option>
                      <option>Luxury Travel Agency (GDS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/65 mb-1.5">
                      Primary Billing Hub
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-white/15 text-sm text-ivory-50">
                      <option>United States (USD)</option>
                      <option>United Kingdom (GBP)</option>
                      <option>European Union (EUR)</option>
                      <option>United Arab Emirates (AED)</option>
                      <option>Singapore / APAC</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all"
                >
                  Activate Corporate Booker Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
