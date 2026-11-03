"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Crown,
  Globe,
  Menu,
  Plane,
  Clock,
  Route,
  Sparkles,
  CalendarCheck,
  User,
  X,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { CURRENCIES, CurrencyCode } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

const SERVICE_LINKS = [
  {
    href: "/services/airport-transfers",
    title: "Airport Transfers",
    desc: "Flight telemetry & 60-min free arrival wait",
    icon: Plane,
  },
  {
    href: "/services/hourly",
    title: "Hourly & Full-Day Hire",
    desc: "Dedicated chauffeur standby from 2 to 24 hours",
    icon: Clock,
  },
  {
    href: "/services/city-to-city",
    title: "City-to-City Corridors",
    desc: "Long-distance door-to-door executive travel",
    icon: Route,
  },
  {
    href: "/services/limousine",
    title: "Royal Stretch Limousine",
    desc: "Maybach Pullman & stretch limos for galas & VIPs",
    icon: Sparkles,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    bookings,
    user,
    setAuthModalOpen,
    signOut,
  } = useBooking();

  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== "Cancelled" && b.status !== "Completed"
  ).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setCurrencyOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian-950/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-luxury"
          : "bg-gradient-to-b from-obsidian-950/90 via-obsidian-950/55 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-champagne-300 via-champagne-500 to-champagne-600 p-[1px] shadow-gold-glow">
            <div className="w-full h-full rounded-[11px] bg-obsidian-950 flex items-center justify-center">
              <Crown className="w-5 h-5 text-champagne-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.22em] font-semibold text-ivory-50 leading-none">
              LIMO <span className="text-champagne-400">BLACK</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.32em] text-white/50 mt-1">
              Private Chauffeur
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname?.startsWith("/services")
                  ? "text-champagne-400 bg-white/5"
                  : "text-ivory-100/85 hover:text-white hover:bg-white/5"
              }`}
            >
              Services
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? "rotate-180 text-champagne-400" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full pt-3 w-[440px]"
                >
                  <div className="rounded-2xl bg-obsidian-900/95 backdrop-blur-2xl border border-white/10 p-3 shadow-luxury">
                    <div className="px-3 py-2 border-b border-white/5 mb-2 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-champagne-400 font-semibold">
                        Bespoke Mobility Suite
                      </span>
                      <span className="text-[11px] text-white/45">
                        64+ Countries
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {SERVICE_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/[0.06] transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-champagne-500/10 border border-champagne-400/20 flex items-center justify-center shrink-0 group-hover:bg-champagne-500/20 transition-colors">
                              <Icon className="w-4 h-4 text-champagne-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-ivory-50 group-hover:text-champagne-300 transition-colors">
                                  {item.title}
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-champagne-400 transition-colors" />
                              </div>
                              <p className="text-xs text-white/55 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/fleet"
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
              pathname === "/fleet"
                ? "text-champagne-400 bg-white/5"
                : "text-ivory-100/85 hover:text-white hover:bg-white/5"
            }`}
          >
            The Fleet
          </Link>

          <Link
            href="/business"
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
              pathname === "/business"
                ? "text-champagne-400 bg-white/5"
                : "text-ivory-100/85 hover:text-white hover:bg-white/5"
            }`}
          >
            For Business
          </Link>

          <Link
            href="/chauffeurs"
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
              pathname === "/chauffeurs"
                ? "text-champagne-400 bg-white/5"
                : "text-ivory-100/85 hover:text-white hover:bg-white/5"
            }`}
          >
            Chauffeurs
          </Link>

          <Link
            href="/bookings"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
              pathname === "/bookings"
                ? "text-champagne-400 bg-white/5"
                : "text-ivory-100/85 hover:text-white hover:bg-white/5"
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-champagne-400" />
            Manage Rides
            {activeBookingsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-champagne-500/25 text-champagne-300 border border-champagne-400/30">
                {activeBookingsCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Currency Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-champagne-400" />
              {currency}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-36 rounded-xl bg-obsidian-900 border border-white/10 p-1.5 shadow-luxury"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        currency === code
                          ? "bg-champagne-500/20 text-champagne-300"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{CURRENCIES[code].label}</span>
                      {currency === code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-champagne-400" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth / VIP Member */}
          {user ? (
            <div className="flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full bg-white/[0.06] border border-champagne-400/25">
              <div className="text-right">
                <div className="text-xs font-medium text-ivory-50 leading-none">
                  {user.name.split(" ")[0]}
                </div>
                <div className="text-[10px] text-champagne-400 leading-none mt-0.5">
                  {user.tier}
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                title="Sign Out"
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-ivory-100 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-champagne-400" />
              Sign In
            </button>
          )}

          {/* Reserve CTA */}
          <Link
            href="/book"
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] bg-gold-gradient text-obsidian-950 shadow-gold-glow hover:brightness-110 transition-all"
          >
            Reserve Now
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/book"
            className="px-3.5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-gold-gradient text-obsidian-950"
          >
            Book
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
            className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-ivory-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-obsidian-950/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-5 max-h-[82vh] overflow-y-auto">
              <div className="space-y-1">
                <p className="px-3 text-[10px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2">
                  Chauffeur & Limousine Services
                </p>
                {SERVICE_LINKS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-ivory-50"
                    >
                      <Icon className="w-4 h-4 text-champagne-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-white/50">{s.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/fleet"
                  className="px-3 py-2.5 rounded-xl bg-white/[0.04] text-sm font-medium text-ivory-50"
                >
                  The Fleet
                </Link>
                <Link
                  href="/business"
                  className="px-3 py-2.5 rounded-xl bg-white/[0.04] text-sm font-medium text-ivory-50"
                >
                  For Business
                </Link>
                <Link
                  href="/chauffeurs"
                  className="px-3 py-2.5 rounded-xl bg-white/[0.04] text-sm font-medium text-ivory-50"
                >
                  Become a Partner
                </Link>
                <Link
                  href="/bookings"
                  className="px-3 py-2.5 rounded-xl bg-white/[0.04] text-sm font-medium text-champagne-300 flex items-center justify-between"
                >
                  <span>My Rides</span>
                  <span className="px-2 py-0.5 rounded-full bg-champagne-500/20 text-xs">
                    {activeBookingsCount}
                  </span>
                </Link>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                        currency === code
                          ? "bg-champagne-500 text-obsidian-950 font-semibold"
                          : "bg-white/5 text-white/70"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                {user ? (
                  <button
                    type="button"
                    onClick={signOut}
                    className="px-4 py-2 rounded-xl bg-white/10 text-xs text-ivory-50"
                  >
                    Sign Out ({user.name.split(" ")[0]})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-xs font-medium text-ivory-50"
                  >
                    VIP Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
