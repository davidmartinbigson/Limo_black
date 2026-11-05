"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Crown,
  Globe,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  User,
  X,
} from "lucide-react";
import { CurrencyCode, SERVICES_DATA } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

const SERVICE_LIST = Object.values(SERVICES_DATA);

export default function Navbar() {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    theme,
    toggleTheme,
    user,
    setAuthModalOpen,
    signOut,
    bookings,
  } = useBooking();

  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== "Cancelled"
  ).length;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-canvas/90 backdrop-blur-xl border-b border-line/10 py-3 shadow-luxury"
          : "bg-canvas/75 backdrop-blur-md border-b border-line/[0.06] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Official / LIMOBLACK Brand Logo */}
        <Link
          href="/"
          aria-label="LimoBlack Canada Home"
          className="flex items-center shrink-0 py-1 group"
        >
          <BrandLogo
            size="md"
            showCanadaBadge
            className="group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation — Clean & Non-Overlapping */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[13px] xl:text-sm font-medium text-ink/80 hover:text-accent transition-colors py-2 whitespace-nowrap"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 top-full pt-2 w-[380px]"
                >
                  <div className="rounded-2xl bg-card/95 backdrop-blur-xl p-3 shadow-luxury border border-line/12 space-y-1">
                    {SERVICE_LIST.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-line/[0.05] transition-colors group"
                      >
                        <div className="w-2 h-2 rounded-full bg-champagne-500/60 mt-2 group-hover:scale-125 group-hover:bg-champagne-400 transition-all shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                            {s.title}
                          </div>
                          <div className="text-xs text-muted line-clamp-1">
                            {s.eyebrow}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/fleet"
            className={`text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/fleet"
                ? "text-accent"
                : "text-ink/80 hover:text-accent"
            }`}
          >
            Fleet
          </Link>

          <Link
            href="/business"
            className={`text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/business"
                ? "text-accent"
                : "text-ink/80 hover:text-accent"
            }`}
          >
            Business
          </Link>

          <Link
            href="/chauffeurs"
            className={`text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/chauffeurs"
                ? "text-accent"
                : "text-ink/80 hover:text-accent"
            }`}
          >
            Chauffeurs
          </Link>

          <Link
            href={user ? "/account" : "/bookings"}
            className={`flex items-center gap-1.5 text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/bookings" || pathname === "/account"
                ? "text-accent"
                : "text-ink/80 hover:text-accent"
            }`}
          >
            <span>{user ? "My Rides" : "Track Ride"}</span>
            {user && activeBookingsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-champagne-500/20 text-accent border border-champagne-500/40 leading-none">
                {activeBookingsCount}
              </span>
            )}
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap ${
                pathname === "/admin"
                  ? "text-emerald-500"
                  : "text-emerald-600 dark:text-emerald-400 hover:underline"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="w-9 h-9 rounded-full bg-field border border-line/12 hover:border-champagne-500/50 flex items-center justify-center text-ink/80 hover:text-accent transition-all shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-champagne-400" />
            ) : (
              <Moon className="w-4 h-4 text-obsidian-800" />
            )}
          </button>

          {/* Currency Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-field border border-line/12 text-xs text-ink/85 shrink-0">
            <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
            <select
              aria-label="Select currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-ink"
            >
              <option value="CAD" className="bg-card text-ink">
                CAD $
              </option>
              <option value="USD" className="bg-card text-ink">
                USD $
              </option>
            </select>
          </div>

          {/* Auth / Personal Account */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-field border border-champagne-500/35 shrink-0">
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-accent max-w-[115px] truncate"
                title="Open Personal Account Dashboard"
              >
                <Crown className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">{user.name.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                title="Sign out"
                className="p-1 rounded-full hover:bg-line/10 text-muted hover:text-rose-500 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-ink/85 hover:text-ink bg-field hover:bg-line/[0.08] border border-line/12 transition-all whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5 text-accent" />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary CTA */}
          <Link
            href="/book"
            className="px-4 xl:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.12em] text-obsidian-950 bg-gold-gradient shadow-gold-glow hover:brightness-110 transition-all whitespace-nowrap shrink-0"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-field border border-line/12 text-ink"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-champagne-400" />
            ) : (
              <Moon className="w-4 h-4 text-obsidian-800" />
            )}
          </button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-field border border-line/12 text-ink"
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
            className="lg:hidden bg-card/98 backdrop-blur-xl border-b border-line/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent font-semibold px-2 mb-2">
                  Canadian Chauffeur Services
                </p>
                {SERVICE_LIST.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm text-ink/85 hover:text-accent hover:bg-line/[0.05]"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>

              <div className="border-t border-line/10 pt-4 space-y-1">
                <Link
                  href="/fleet"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-ink"
                >
                  Canadian Limousine Fleet
                </Link>
                <Link
                  href="/business"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-ink"
                >
                  Corporate Accounts
                </Link>
                <Link
                  href="/chauffeurs"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-ink"
                >
                  Become a Canadian Chauffeur
                </Link>
                <Link
                  href="/account"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-accent"
                >
                  {user
                    ? `My Account (${user.name})`
                    : "Sign In / My Personal Account"}
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-500"
                  >
                    Owner Dispatch Admin
                  </Link>
                )}
              </div>

              <div className="border-t border-line/10 pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-muted">Display Currency</span>
                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value as CurrencyCode)
                    }
                    className="bg-field border border-line/15 rounded-lg px-3 py-1.5 text-xs text-ink"
                  >
                    <option value="CAD">CAD ($)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                {user ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full py-2.5 rounded-xl bg-field border border-line/15 text-xs font-semibold text-ink"
                  >
                    Sign Out ({user.email})
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="py-2.5 rounded-xl bg-field border border-line/15 text-xs font-semibold text-ink text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="py-2.5 rounded-xl bg-field border border-champagne-500/35 text-xs font-semibold text-accent text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <Link
                  href="/book"
                  className="w-full py-3 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest text-center"
                >
                  Reserve a Limousine
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
