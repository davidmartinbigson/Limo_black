"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
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
    const handleScroll = () => setScrolled(window.scrollY > 12);
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-obsidian-950/95 backdrop-blur-xl border-b border-white/10 ${
        scrolled ? "shadow-2xl" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        {/* Left: Official / LIMOBLACK Wordmark */}
        <Link
          href="/"
          aria-label="LimoBlack Canada Home"
          className="flex items-center shrink-0 py-1 group"
        >
          <BrandLogo
            size="md"
            variant="dark"
            className="group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Right-Aligned Blacklane-Style Navigation + Controls */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0">
          <nav className="flex items-center gap-5 xl:gap-6">
            {/* Our services dropdown (Blacklane exact label) */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors py-2 whitespace-nowrap"
              >
                <span>Our services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180 text-champagne-400" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 w-72"
                  >
                    <div className="rounded-xl bg-card shadow-luxury border border-line/12 py-2 overflow-hidden">
                      {SERVICE_LIST.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="block px-4 py-2.5 text-sm font-medium text-ink/90 hover:text-accent hover:bg-line/[0.05] transition-colors"
                        >
                          {s.title}
                        </Link>
                      ))}
                      <div className="my-1 border-t border-line/10" />
                      <Link
                        href="/fleet"
                        className="block px-4 py-2.5 text-sm font-medium text-ink/90 hover:text-accent hover:bg-line/[0.05] transition-colors"
                      >
                        Service classes & fleet
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/business"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === "/business"
                  ? "text-champagne-400"
                  : "text-white/90 hover:text-white"
              }`}
            >
              For business
            </Link>

            <Link
              href="/chauffeurs"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === "/chauffeurs"
                  ? "text-champagne-400"
                  : "text-white/90 hover:text-white"
              }`}
            >
              For chauffeurs
            </Link>

            <Link
              href="/fleet"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === "/fleet"
                  ? "text-champagne-400"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Fleet
            </Link>

            <Link
              href={user ? "/account" : "/bookings"}
              className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === "/bookings" || pathname === "/account"
                  ? "text-champagne-400"
                  : "text-white/90 hover:text-white"
              }`}
            >
              <span>{user ? "My rides" : "Manage rides"}</span>
              {user && activeBookingsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-champagne-400 text-obsidian-950 leading-none">
                  {activeBookingsCount}
                </span>
              )}
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:underline whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Dispatch
              </Link>
            )}
          </nav>

          {/* Divider */}
          <div className="h-5 w-px bg-white/20" />

          {/* Utility Controls (Currency + Theme + Sign in) */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white">
              <Globe className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
              <select
                aria-label="Select currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-white"
              >
                <option value="CAD" className="bg-obsidian-950 text-white">
                  EN · CAD
                </option>
                <option value="USD" className="bg-obsidian-950 text-white">
                  EN · USD
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all shrink-0"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-champagne-400" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-xs font-semibold hover:text-champagne-300 max-w-[115px] truncate"
                >
                  <User className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
                  <span className="truncate">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-1 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-obsidian-950 hover:bg-ivory-100 transition-all whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full bg-white/10 border border-white/15 text-white"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-champagne-400" />
            ) : (
              <Moon className="w-4 h-4 text-white" />
            )}
          </button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-full bg-white/10 border border-white/15 text-white"
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
            className="lg:hidden bg-obsidian-950 text-white border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-champagne-400 font-semibold px-3 mb-2">
                  Our services
                </p>
                {SERVICE_LIST.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-1">
                <Link
                  href="/fleet"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90"
                >
                  Service classes & fleet
                </Link>
                <Link
                  href="/business"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90"
                >
                  For business
                </Link>
                <Link
                  href="/chauffeurs"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90"
                >
                  For chauffeurs
                </Link>
                <Link
                  href={user ? "/account" : "/bookings"}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-champagne-400"
                >
                  {user
                    ? `My Account (${user.name})`
                    : "Manage rides / Sign in"}
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-400"
                  >
                    Owner Dispatch Admin
                  </Link>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                {user ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white"
                  >
                    Sign out ({user.email})
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="py-2.5 rounded-xl bg-white text-obsidian-950 text-xs font-semibold text-center"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="py-2.5 rounded-xl bg-white/10 border border-champagne-400/40 text-xs font-semibold text-champagne-300 text-center"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
