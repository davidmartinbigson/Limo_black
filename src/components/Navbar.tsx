"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  ChevronDown,
  Clock,
  Crown,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Plane,
  Route,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { CURRENCIES, CurrencyCode } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

const SERVICE_LINKS = [
  {
    href: "/services/airport-transfers",
    title: "Canadian Airport Transfers",
    desc: "YYZ, YVR, YUL, YYC, YOW · 60-min free arrival wait",
    icon: Plane,
  },
  {
    href: "/services/hourly",
    title: "Hourly & Full-Day Standby",
    desc: "Dedicated chauffeur standby from 2 to 24 hours",
    icon: Clock,
  },
  {
    href: "/services/city-to-city",
    title: "City-to-City Corridors",
    desc: "Niagara, Whistler, Banff, Tremblant & Muskoka",
    icon: Route,
  },
  {
    href: "/services/limousine",
    title: "Royal Stretch Limousine",
    desc: "Maybach Pullman & stretch limos for galas & weddings",
    icon: Sparkles,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
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

  const hasHeroPhoto =
    pathname === "/" || Boolean(pathname?.startsWith("/services"));
  const useSolidSurface = scrolled || !hasHeroPhoto;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setCurrencyOpen(false);
  }, [pathname]);

  const linkBaseClass = (active: boolean) => {
    if (useSolidSurface) {
      return active
        ? "text-accent bg-line/[0.06]"
        : "text-ink/80 hover:text-ink hover:bg-line/[0.05]";
    }
    return active
      ? "text-champagne-300 bg-white/10"
      : "text-ivory-50/90 hover:text-white hover:bg-white/10";
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        useSolidSurface
          ? "bg-card/92 backdrop-blur-xl border-b border-line/10 py-3 shadow-luxury"
          : "bg-obsidian-950/70 backdrop-blur-md border-b border-white/10 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo — Compact & Non-Wrapping */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0 whitespace-nowrap"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-champagne-300 via-champagne-500 to-champagne-600 p-[1px] shadow-gold-glow shrink-0">
            <div className="w-full h-full rounded-[11px] bg-obsidian-950 flex items-center justify-center">
              <Crown className="w-4 h-4 text-champagne-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span
              className={`font-serif text-lg sm:text-xl tracking-[0.14em] font-semibold leading-none ${
                useSolidSurface ? "text-ink" : "text-ivory-50"
              }`}
            >
              LIMO{" "}
              <span
                className={
                  useSolidSurface ? "text-accent" : "text-champagne-400"
                }
              >
                BLACK
              </span>
            </span>
            <span
              className={`text-[9px] uppercase tracking-[0.22em] mt-0.5 flex items-center gap-1 ${
                useSolidSurface ? "text-subtle" : "text-white/60"
              }`}
            >
              <MapPin className="w-2.5 h-2.5 text-champagne-500 inline" />
              Canada Chauffeur
            </span>
          </div>
        </Link>

        {/* Desktop Center Navigation — Clean Spacing & Zero Overlap */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
          {/* Services Dropdown */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${linkBaseClass(
                Boolean(pathname?.startsWith("/services"))
              )}`}
            >
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? "rotate-180 text-champagne-500" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 top-full pt-2.5 w-[420px]"
                >
                  <div className="rounded-2xl bg-card border border-line/12 p-3 shadow-luxury">
                    <div className="px-3 py-2 border-b border-line/10 mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                        Canadian Mobility Suite
                      </span>
                      <span className="text-[11px] text-subtle">
                        Coast-to-Coast CA
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {SERVICE_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-line/[0.05] transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                                  {item.title}
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-subtle group-hover:text-accent transition-colors" />
                              </div>
                              <p className="text-xs text-muted mt-0.5 truncate">
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
            className={`px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${linkBaseClass(
              pathname === "/fleet"
            )}`}
          >
            Fleet
          </Link>

          <Link
            href="/business"
            className={`px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${linkBaseClass(
              pathname === "/business"
            )}`}
          >
            Business
          </Link>

          <Link
            href="/chauffeurs"
            className={`px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${linkBaseClass(
              pathname === "/chauffeurs"
            )}`}
          >
            Chauffeurs
          </Link>

          <Link
            href="/bookings"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${linkBaseClass(
              pathname === "/bookings"
            )}`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-champagne-500 shrink-0" />
            <span>My Rides</span>
            {activeBookingsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-champagne-500/20 text-accent border border-champagne-500/35 leading-none">
                {activeBookingsCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right Controls — Compact, Non-Wrapping + Light/Dark Theme Switcher */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light and Dark Mode"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
              useSolidSurface
                ? "bg-line/[0.05] hover:bg-line/[0.1] border-line/12 text-ink"
                : "bg-white/10 hover:bg-white/15 border-white/15 text-ivory-50"
            }`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
                <span className="hidden xl:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="hidden xl:inline">Dark</span>
              </>
            )}
          </button>

          {/* Currency Selector (CAD / USD) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setCurrencyOpen((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                useSolidSurface
                  ? "bg-line/[0.05] hover:bg-line/[0.1] border-line/12 text-ink"
                  : "bg-white/10 hover:bg-white/15 border-white/15 text-ivory-50"
              }`}
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 opacity-65" />
            </button>

            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-36 rounded-xl bg-card border border-line/15 p-1.5 shadow-luxury"
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
                          ? "bg-champagne-500/20 text-accent font-semibold"
                          : "text-muted hover:bg-line/[0.05] hover:text-ink"
                      }`}
                    >
                      <span>{CURRENCIES[code].label}</span>
                      {currency === code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-champagne-500" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth / VIP Member */}
          {user ? (
            <div
              className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full border whitespace-nowrap ${
                useSolidSurface
                  ? "bg-line/[0.05] border-champagne-500/35"
                  : "bg-white/10 border-champagne-400/35"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  useSolidSurface ? "text-ink" : "text-ivory-50"
                }`}
              >
                {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={signOut}
                title="Sign Out"
                className={`p-1.5 rounded-full transition-colors ${
                  useSolidSurface
                    ? "hover:bg-line/10 text-muted hover:text-ink"
                    : "hover:bg-white/15 text-white/70 hover:text-white"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                useSolidSurface
                  ? "bg-line/[0.05] hover:bg-line/[0.1] border-line/12 text-ink"
                  : "bg-white/10 hover:bg-white/15 border-white/15 text-ivory-50"
              }`}
            >
              <User className="w-3.5 h-3.5 text-champagne-500 shrink-0" />
              <span>Sign In</span>
            </button>
          )}

          {/* Reserve CTA */}
          <Link
            href="/book"
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.12em] whitespace-nowrap bg-gold-gradient text-obsidian-950 shadow-gold-glow hover:brightness-110 transition-all shrink-0"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile / Tablet Controls (< 1024px) */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2 rounded-xl border transition-colors ${
              useSolidSurface
                ? "bg-line/[0.05] border-line/12 text-ink"
                : "bg-white/10 border-white/15 text-ivory-50"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-champagne-400" />
            ) : (
              <Moon className="w-4 h-4 text-accent" />
            )}
          </button>

          <Link
            href="/book"
            className="px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap bg-gold-gradient text-obsidian-950"
          >
            Book
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
            className={`p-2 rounded-xl border ${
              useSolidSurface
                ? "bg-line/[0.05] border-line/12 text-ink"
                : "bg-white/10 border-white/15 text-ivory-50"
            }`}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
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
            className="lg:hidden bg-card border-b border-line/15 overflow-hidden shadow-luxury"
          >
            <div className="px-4 py-5 space-y-5 max-h-[82vh] overflow-y-auto">
              <div className="space-y-1">
                <p className="px-3 text-[10px] uppercase tracking-[0.22em] text-accent font-semibold mb-2">
                  Canadian Chauffeur Services
                </p>
                {SERVICE_LINKS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-line/[0.05] text-ink"
                    >
                      <Icon className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <div className="text-sm font-semibold">{s.title}</div>
                        <div className="text-xs text-muted">{s.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-line/10 pt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/fleet"
                  className="px-3.5 py-2.5 rounded-xl bg-field text-sm font-medium text-ink"
                >
                  Fleet
                </Link>
                <Link
                  href="/business"
                  className="px-3.5 py-2.5 rounded-xl bg-field text-sm font-medium text-ink"
                >
                  For Business
                </Link>
                <Link
                  href="/chauffeurs"
                  className="px-3.5 py-2.5 rounded-xl bg-field text-sm font-medium text-ink"
                >
                  Become a Partner
                </Link>
                <Link
                  href="/bookings"
                  className="px-3.5 py-2.5 rounded-xl bg-field text-sm font-semibold text-accent flex items-center justify-between"
                >
                  <span>My Rides</span>
                  <span className="px-2 py-0.5 rounded-full bg-champagne-500/20 text-xs">
                    {activeBookingsCount}
                  </span>
                </Link>
              </div>

              <div className="border-t border-line/10 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        currency === code
                          ? "bg-champagne-500 text-obsidian-950"
                          : "bg-field text-muted"
                      }`}
                    >
                      {code}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-field text-ink flex items-center gap-1.5"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-champagne-500" /> Light
                        Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-accent" /> Dark Mode
                      </>
                    )}
                  </button>
                </div>

                {user ? (
                  <button
                    type="button"
                    onClick={signOut}
                    className="px-4 py-2 rounded-xl bg-field text-xs font-semibold text-ink"
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
                    className="px-4 py-2 rounded-xl bg-field text-xs font-semibold text-ink"
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
