"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  ChevronDown,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";
import { FleetClassId } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";
import BookingWidget from "@/components/BookingWidget";

const HERO_HIGHLIGHTS = [
  {
    icon: UserCheck,
    title: "Professional chauffeurs",
    desc: "Experienced, courteous, and reliable.",
  },
  {
    icon: CarFront,
    title: "Comfortable vehicles",
    desc: "A premium fleet for every occasion.",
  },
  {
    icon: CalendarCheck,
    title: "Seamless booking",
    desc: "Reserve your ride in just a few steps.",
  },
];

const SERVICES_CARDS = [
  {
    title: "Airport transfers",
    desc: "A smooth, comfortable ride to and from the airport.",
    image: "/images/card-pearson-airport.jpg",
    href: "/services/airport-transfers",
  },
  {
    title: "Hourly chauffeur",
    desc: "A dedicated chauffeur at your service, for as long as you need.",
    image: "/images/card-hourly-cabin.jpg",
    href: "/services/hourly",
  },
  {
    title: "City-to-city",
    desc: "Comfortable, direct travel between major cities and destinations.",
    image: "/images/card-city-highway.jpg",
    href: "/services/city-to-city",
  },
];

const FLEET_CARDS: {
  id: FleetClassId;
  title: string;
  desc: string;
  image: string;
}[] = [
  {
    id: "business",
    title: "Business Class",
    desc: "A smooth, comfortable ride for business and everyday travel.",
    image: "/images/fleet-business.jpg",
  },
  {
    id: "first",
    title: "First Class",
    desc: "A higher level of comfort, space, and premium amenities.",
    image: "/images/fleet-first.jpg",
  },
  {
    id: "suv",
    title: "Business SUV",
    desc: "Spacious, versatile, and ideal for groups and executive travel.",
    image: "/images/fleet-suv.jpg",
  },
];

const WHY_LIMOBLACK = [
  {
    icon: ShieldCheck,
    title: "Reliable & professional",
    desc: "A consistent, high-quality experience from start to finish.",
  },
  {
    icon: CarFront,
    title: "A modern, versatile fleet",
    desc: "A range of premium vehicles to suit your needs.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible for every occasion",
    desc: "Airport rides, hourly bookings, corporate travel, and more.",
  },
];

const HOME_FAQS = [
  {
    q: "How do I book a ride?",
    a: "Enter your pickup location, destination (or hourly duration), date, and pickup time in the booking bar above, choose your preferred vehicle class, and confirm your reservation in under 60 seconds.",
  },
  {
    q: "Can I book a chauffeur by the hour?",
    a: "Yes. Select the 'By the hour' tab in the booking bar to reserve a dedicated chauffeur and luxury vehicle from 2 to 24 hours across Toronto, the GTA, and major Canadian cities.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Toronto, Mississauga (YYZ), Billy Bishop (YTZ), Oakville, Vaughan, Niagara Falls, Muskoka, and major Canadian metropolitan hubs including Vancouver, Montréal, Calgary, and Ottawa.",
  },
  {
    q: "Can I book for business or corporate travel?",
    a: "Yes. Our Corporate Travel program offers priority executive dispatch, multi-passenger booking management, and official Canadian GST/HST consolidated invoicing.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { updateDraft } = useBooking();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelectFleet = (classId: FleetClassId) => {
    updateDraft({ selectedClassId: classId });
    router.push("/book");
  };

  return (
    <div className="bg-[#0B0B0D] text-white">
      {/* 1. HERO + OVERLAPPING HORIZONTAL BOOKING BAR + 3-COLUMN TRUST STRIP */}
      <section className="relative bg-[#0B0B0D] pt-16 sm:pt-[74px]">
        {/* Hero Image Banner */}
        <div className="relative min-h-[460px] sm:min-h-[540px] lg:min-h-[590px] flex items-center overflow-hidden">
          <img
            src="/images/hero-toronto-hotel.jpg"
            alt="LimoBlack Chauffeur Service in Toronto & the GTA"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle dark vignette on left & bottom so text and overlapping booking bar blend seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/85 via-[#0B0B0D]/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/25" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pb-20 sm:pb-24 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg space-y-4"
            >
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] font-bold text-white leading-[1.05] tracking-tight">
                Your chauffeur
                <br />
                awaits.
              </h1>
              <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-sm">
                Premium chauffeur services in
                <br />
                Toronto &amp; the GTA.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Overlapping Tabbed Horizontal Booking Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 sm:-mt-24">
          <BookingWidget />
        </div>

        {/* 3-Column Dark Feature Strip Below Booking Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-11">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-white/10">
            {HERO_HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 ${
                    idx === 0
                      ? "md:pr-8"
                      : idx === 1
                      ? "md:px-8"
                      : "md:pl-8"
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl border border-[#C9A55C]/30 bg-white/[0.02] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#D4AF61]" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. OUR SERVICES ("Travel, on your terms." — Warm Ivory Section) */}
      <section className="py-16 sm:py-24 bg-[#F5F1EA] text-[#141518]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#9E7830] mb-2.5">
              OUR SERVICES
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#141518] leading-tight">
              Travel, on your terms.
            </h2>
            <p className="text-sm sm:text-base text-[#52555E] mt-3">
              Reliable chauffeur services for business, travel, and everyday
              needs in Toronto and across the GTA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg block bg-[#0B0B0D]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed max-w-[260px]">
                      {card.desc}
                    </p>
                  </div>

                  <span className="w-9 h-9 rounded-full border border-[#D4AF61]/70 group-hover:bg-[#D4AF61] group-hover:text-[#0B0B0D] text-[#DFBE6F] flex items-center justify-center shrink-0 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR FLEET ("A fleet for every journey." — Dark Section) */}
      <section className="py-16 sm:py-24 bg-[#0B0B0D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF61] mb-2.5">
              OUR FLEET
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight">
              A fleet for every journey.
            </h2>
            <p className="text-sm sm:text-base text-white/65 mt-3">
              Modern, well-maintained vehicles designed for comfort, style, and
              flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FLEET_CARDS.map((car) => (
              <button
                key={car.id}
                type="button"
                onClick={() => handleSelectFleet(car.id)}
                className="group text-left relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#C9A55C]/30 hover:border-[#DFBE6F] bg-[#141518] transition-all"
              >
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {car.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 mt-1.5 leading-relaxed max-w-[260px]">
                      {car.desc}
                    </p>
                  </div>

                  <span className="w-9 h-9 rounded-full border border-[#D4AF61]/70 group-hover:bg-[#D4AF61] group-hover:text-[#0B0B0D] text-[#DFBE6F] flex items-center justify-center shrink-0 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORPORATE TRAVEL BANNER + WHY LIMOBLACK (Warm Ivory Section) */}
      <section className="py-16 sm:py-24 bg-[#F5F1EA] text-[#141518]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* Corporate Travel Wide Dark Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0E0F13] text-white min-h-[240px] sm:min-h-[270px] flex items-center shadow-xl">
            <img
              src="/images/banner-corporate-exec.jpg"
              alt="Executive Corporate Chauffeur Transport"
              className="absolute inset-0 w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/90 to-transparent" />

            <div className="relative z-10 p-7 sm:p-12 max-w-xl space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF61]">
                CORPORATE TRAVEL
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Executive transport for your business.
              </h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Chauffeur services for meetings, events, and corporate travel in
                the GTA.
              </p>
              <div className="pt-1">
                <Link
                  href="/business"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E2C275] via-[#D4AF61] to-[#B88F3B] text-[#0B0B0D] font-bold text-xs sm:text-sm hover:brightness-105 transition-all"
                >
                  <span>For Business</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Why LimoBlack 3-Column Strip */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#9E7830] mb-2">
                WHY LIMOBLACK
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141518]">
                A better chauffeur experience.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {WHY_LIMOBLACK.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border border-[#9E7830]/35 bg-white/70 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon
                        className="w-5 h-5 text-[#9E7830]"
                        strokeWidth={1.7}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#141518]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#52555E] leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ (2-Column Split Dark Section) */}
      <section
        id="faq"
        className="py-16 sm:py-24 bg-[#0B0B0D] text-white border-t border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Heading */}
            <div className="lg:col-span-5 space-y-2.5">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF61]">
                FAQ
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Frequently asked questions.
              </h2>
            </div>

            {/* Right 4 Accordion Rows */}
            <div className="lg:col-span-7 divide-y divide-white/12 border-b border-white/12">
              {HOME_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-4 sm:py-5 text-left flex items-center justify-between gap-4 group"
                    >
                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#DFBE6F] transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white/65 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#DFBE6F]" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 text-xs sm:text-sm text-white/70 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
