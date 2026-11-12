"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { SERVICES_DATA } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

const SERVICE_LIST = Object.values(SERVICES_DATA);

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, bookings } = useBooking();

  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!(event.target as Element).closest("[data-account-menu]")) setAccountOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setAccountOpen(false); };
    document.addEventListener("click", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", escape); };
  }, []);

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== "Cancelled"
  ).length;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-[#0B0B0D] border-b border-white/[0.08] ${
        scrolled ? "shadow-2xl" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-4">
        {/* Left: Official / LIMOBLACK Wordmark */}
        <Link
          href="/"
          aria-label="LimoBlack Home"
          className="flex items-center shrink-0 py-1 group"
        >
          <BrandLogo
            size="md"
            variant="dark"
            className="group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Center: Clean 4-Link Navigation Matching Reference */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-[#DFBE6F] transition-colors py-2 whitespace-nowrap"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? "rotate-180 text-[#DFBE6F]" : "text-white/70"
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
                  className="absolute left-0 top-full pt-2 w-64"
                >
                  <div className="rounded-xl bg-[#141518] shadow-2xl border border-[#C9A55C]/25 py-2 overflow-hidden">
                    {SERVICE_LIST.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="block px-4 py-2.5 text-sm font-medium text-white/85 hover:text-[#DFBE6F] hover:bg-white/[0.04] transition-colors"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/fleet"
            className={`text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/fleet"
                ? "text-[#DFBE6F]"
                : "text-white/90 hover:text-[#DFBE6F]"
            }`}
          >
            Fleet
          </Link>

          <Link
            href="/business"
            className={`text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/business"
                ? "text-[#DFBE6F]"
                : "text-white/90 hover:text-[#DFBE6F]"
            }`}
          >
            For Business
          </Link>

          <Link
            href="/chauffeurs"
            className={`text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/chauffeurs"
                ? "text-[#DFBE6F]"
                : "text-white/90 hover:text-[#DFBE6F]"
            }`}
          >
            Chauffeurs
          </Link>

          {pathname === "/book" && (
            <Link
              href="/#faq"
              className="text-sm font-medium text-white/90 hover:text-[#DFBE6F] whitespace-nowrap transition-colors"
            >
              Help
            </Link>
          )}

          {user && user.role !== "admin" && (
            <Link
              href="/account"
              className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === "/account" || pathname === "/bookings"
                  ? "text-[#DFBE6F]"
                  : "text-white/90 hover:text-[#DFBE6F]"
              }`}
            >
              <span>My Rides</span>
              {activeBookingsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#D4AF61] text-[#0B0B0D] leading-none">
                  {activeBookingsCount}
                </span>
              )}
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:underline whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right: Gold-Bordered Sign In Button Matching Reference */}
        <div className="hidden xl:flex items-center gap-2 shrink-0">
          {user ? (
            <div className="relative" data-account-menu>
              <button type="button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-controls="account-menu" className="flex items-center gap-2 rounded-xl border border-[#C9A55C]/60 bg-white/[0.03] px-4 py-2 text-sm text-white hover:border-[#DFBE6F]">
                <User className="h-4 w-4 text-[#DFBE6F]" /><span className="max-w-[120px] truncate">{user.name.split(" ")[0]}</span><ChevronDown className="h-4 w-4" />
              </button>
              {accountOpen && <div id="account-menu" className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#C9A55C]/30 bg-[#141518] p-2 shadow-2xl">
                {user.role === "admin" ? <Link href="/admin" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/10">Owner Dashboard</Link> : <>
                  <a href="/account" className="block rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/10">Dashboard</a>
                  <a href="/account?tab=rides" className="block rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/10">My Bookings</a>
                  <a href="/account?tab=tracking" className="block rounded-lg px-3 py-2.5 text-sm text-[#DFBE6F] hover:bg-white/10">Live Tracking</a>
                  <a href="/account?tab=profile" className="block rounded-lg px-3 py-2.5 text-sm text-white hover:bg-white/10">Profile Settings</a>
                </>}
                <button type="button" onClick={() => { setAccountOpen(false); void signOut(); }} className="w-full rounded-lg border-t border-white/10 px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/10">Sign Out</button>
              </div>}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:border-[#DFBE6F] whitespace-nowrap">Customer Login</Link>
              <Link href="/signup" className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:border-[#DFBE6F] whitespace-nowrap">Customer Sign Up</Link>
            </div>
          )}
          {!user && <><Link href="/driver/login" className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:border-[#DFBE6F] hover:text-[#DFBE6F] whitespace-nowrap">Driver Login</Link>
          <Link href="/driver/signup" className="rounded-xl border border-[#C9A55C]/65 px-3 py-2 text-xs font-semibold text-[#DFBE6F] hover:bg-[#C9A55C]/10 whitespace-nowrap">Driver Sign Up</Link></>}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-xl border border-white/15 bg-white/5 text-white"
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
            className="xl:hidden bg-[#0B0B0D] text-white border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-[#DFBE6F] font-semibold px-3 mb-2">
                  Services
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
                  Fleet
                </Link>
                <Link
                  href="/business"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90"
                >
                  For Business
                </Link>
                <Link
                  href="/chauffeurs"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white/90"
                >
                  Chauffeurs
                </Link>
                <Link
                  href={user?.role === "admin" ? "/admin" : user ? "/account" : "/bookings"}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#DFBE6F]"
                >
                  {user?.role === "admin" ? "Owner Dashboard" : user ? `My Account (${user.name})` : "Manage Rides"}
                </Link>
              </div>

              {user && user.role !== "admin" && <div className="border-t border-white/10 pt-3 space-y-1">
                <a href="/account?tab=rides" className="block rounded-lg px-3 py-2 text-sm text-white">My Bookings</a>
                <a href="/account?tab=tracking" className="block rounded-lg px-3 py-2 text-sm text-[#DFBE6F]">Live Tracking</a>
                <a href="/account?tab=profile" className="block rounded-lg px-3 py-2 text-sm text-white">Profile Settings</a>
              </div>}
              <div className="border-t border-white/10 pt-4">
                {user ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white"
                  >
                    Sign Out ({user.email})
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/20 px-3 py-3 text-center text-sm font-semibold text-white">Customer Login</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/20 px-3 py-3 text-center text-sm font-semibold text-white">Customer Sign Up</Link>
                  </div>
                )}
                {!user && <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link href="/driver/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/20 px-3 py-3 text-center text-sm font-semibold text-white hover:border-[#DFBE6F]">Driver Login</Link>
                  <Link href="/driver/signup" onClick={() => setMobileOpen(false)} className="rounded-xl border border-[#C9A55C]/65 px-3 py-3 text-center text-sm font-semibold text-[#DFBE6F] hover:bg-[#C9A55C]/10">Driver Sign Up</Link>
                </div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
