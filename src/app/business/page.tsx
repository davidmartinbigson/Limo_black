"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Handshake,
  Headphones,
  Leaf,
  MapPin,
  PlaneTakeoff,
  ShieldCheck,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

const SOLUTIONS = [
  {
    icon: Building2,
    title: "Canadian Corporate Executive Travel",
    desc: "Centralized booking for Executive Assistants and travel managers across Toronto, Calgary, Vancouver, Montréal, and Ottawa with cost-center tagging.",
  },
  {
    icon: PlaneTakeoff,
    title: "Canadian Travel Agencies & GDS",
    desc: "Seamless Sabre, Amadeus, and Travelport GDS integration with transparent CAD commissions and instant VIP client confirmation.",
  },
  {
    icon: Handshake,
    title: "Five-Star Hotels & FBO Aviation",
    desc: "White-glove house-car and tarmac transfer programs for luxury Canadian hotels, Skyservice/Signature FBOs, and private wealth offices.",
  },
];

const ENTERPRISE_PERKS = [
  {
    icon: MapPin,
    title: "Coast-to-Coast Reliability",
    desc: "Instant confirmation and uniform standards across 25+ Canadian metros.",
  },
  {
    icon: FileSpreadsheet,
    title: "Consolidated GST/HST Invoicing",
    desc: "Eliminate expense reports with one itemized monthly Canadian tax invoice.",
  },
  {
    icon: Clock,
    title: "Unrivaled Flexibility",
    desc: "Modify or cancel any executive reservation free until 1 hour before pickup.",
  },
  {
    icon: Headphones,
    title: "Bilingual 24/7 Account Desk",
    desc: "Dedicated English & French corporate concierge via phone, chat, or email.",
  },
  {
    icon: Leaf,
    title: "Auditable Canadian ESG Reports",
    desc: "Quarterly Scope-3 carbon-offset certificates & Electric AWD prioritization.",
  },
  {
    icon: ShieldCheck,
    title: "Duty of Care & PIPEDA Privacy",
    desc: "Live GPS passenger visibility and background-vetted career chauffeurs.",
  },
];

export default function BusinessPage() {
  const { formatPrice } = useBooking();

  const [monthlyRides, setMonthlyRides] = useState(45);
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [teamSize, setTeamSize] = useState("50–250 Employees");

  const estimatedSpendCad = monthlyRides * 210;
  const corporatePrivilegeSavingsCad = Math.round(estimatedSpendCad * 0.14);
  const adminHoursSaved = Math.round(monthlyRides * 0.35);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-500/15 border border-champagne-500/35 text-[11px] uppercase tracking-[0.22em] text-accent font-semibold">
              Limo Black Canada for Enterprise
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink font-semibold leading-[1.06]">
              Canadian Corporate Mobility,{" "}
              <span className="italic text-accent">Simplified.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Five-star AWD limousines and chauffeurs across Bay Street,
              Downtown Calgary, Montréal, Vancouver, and Ottawa — managed from
              one Canadian GST/HST-ready executive portal.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#corporate-onboarding"
                className="px-7 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center gap-2"
              >
                Create Canadian Business Account{" "}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-line/15 shadow-luxury aspect-[16/10]">
              <img
                src="/images/service-corporate.jpg"
                alt="Canadian Corporate Chauffeur Travel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-obsidian-950/85 backdrop-blur-md border border-white/10">
                <p className="text-xs sm:text-sm text-ivory-50 italic">
                  “Consolidating our Toronto, Calgary, and Montréal executive
                  rides onto Limo Black cut EA booking time by 70%.”
                </p>
                <p className="text-[11px] text-champagne-300 mt-1">
                  — Director of Corporate Travel, Bay Street Financial Group
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.title}
                className="p-8 rounded-3xl bg-card border border-line/12 shadow-luxury space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-serif text-2xl text-ink font-semibold">
                  {sol.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed">{sol.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-card border border-line/12 p-8 sm:p-12 shadow-luxury">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">
              How You Arrive Matters
            </span>
            <h2 className="font-serif text-4xl text-ink font-semibold mt-2">
              Built for Canadian EAs & Travel Leaders
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {ENTERPRISE_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="space-y-2">
                  <div className="flex items-center gap-2.5 text-accent font-bold text-sm">
                    <Icon className="w-4 h-4 text-accent" />
                    {perk.title}
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          id="corporate-onboarding"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          <div className="lg:col-span-5 rounded-3xl bg-card border border-line/12 p-7 sm:p-8 flex flex-col justify-between shadow-luxury">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                  Canadian Corporate Estimator
                </span>
                <h3 className="font-serif text-3xl text-ink font-semibold mt-1">
                  Estimate Your Enterprise Savings
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-field border border-line/10 space-y-3">
                <div className="flex justify-between text-xs text-muted">
                  <span>Monthly Executive Rides</span>
                  <span className="font-bold text-accent text-sm">
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
                <div className="p-4 rounded-2xl bg-field border border-line/10">
                  <div className="text-[11px] text-subtle">
                    Est. Volume Rebate
                  </div>
                  <div className="font-serif text-2xl text-emerald-600 dark:text-emerald-300 font-bold mt-1">
                    {formatPrice(corporatePrivilegeSavingsCad)}/mo
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-field border border-line/10">
                  <div className="text-[11px] text-subtle">
                    EA Admin Time Saved
                  </div>
                  <div className="font-serif text-2xl text-accent font-bold mt-1">
                    ~{adminHoursSaved} hrs/mo
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-subtle mt-6">
              Includes complimentary monthly GST/HST invoicing, zero setup fees,
              and no minimum annual spend commitment.
            </p>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-card border border-champagne-500/40 p-7 sm:p-10 shadow-luxury">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="font-serif text-3xl text-ink font-semibold">
                  Canadian Executive Portal Provisioned
                </h3>
                <p className="text-sm text-muted max-w-md">
                  Thank you,{" "}
                  <span className="text-accent font-semibold">
                    {companyName || "Partner"}
                  </span>
                  . Our Canadian Corporate Director has sent instant portal
                  credentials and preferred CAD rate tables to{" "}
                  <span className="text-ink font-semibold">{workEmail}</span>.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                    Instant Canadian Onboarding
                  </span>
                  <h3 className="font-serif text-3xl text-ink font-semibold mt-1">
                    Create Your Business Account
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Company or Agency Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Bay Street Capital Partners Inc."
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="travel@company.ca"
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Organization Size
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink"
                    >
                      <option>1–50 Employees / Family Office</option>
                      <option>50–250 Employees</option>
                      <option>250–1,000 Employees</option>
                      <option>1,000+ National Enterprise</option>
                      <option>Canadian Travel Agency (GDS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Primary Canadian Hub
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-field border border-line/15 text-sm text-ink">
                      <option>Toronto & GTA (Ontario)</option>
                      <option>Vancouver & Lower Mainland (BC)</option>
                      <option>Montréal & Québec</option>
                      <option>Calgary & Edmonton (Alberta)</option>
                      <option>Ottawa / National Capital Region</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-[0.16em] shadow-gold-glow hover:brightness-110 transition-all"
                >
                  Activate Canadian Corporate Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
