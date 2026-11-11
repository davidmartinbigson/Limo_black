"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, User } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const pathname = usePathname();
  const { user, setAuthModalOpen } = useBooking();

  if (pathname === "/book") {
    return null;
  }

  return (
    <footer className="bg-[#070709] text-white border-t border-white/10 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <BrandLogo size="lg" variant="dark" />
            </Link>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-[230px]">
              Premium chauffeur services in Toronto &amp; the GTA.
            </p>
          </div>

          {/* Cols 2-5: Services, Fleet, Company, Help */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                Services
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li>
                  <Link
                    href="/services/airport-transfers"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Airport Transfers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/hourly"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Hourly Chauffeur
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/city-to-city"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    City-to-City
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Corporate Travel
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                Fleet
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li>
                  <Link
                    href="/fleet"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Business Class
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fleet"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    First Class
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fleet"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Electric Class
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fleet"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    SUV
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/limousine"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Stretch
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                Company
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li>
                  <Link
                    href="/business"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    For Business
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chauffeurs"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Chauffeurs
                  </Link>
                </li>
                <li>
                  <Link
                    href={user?.role === "admin" ? "/admin" : user ? "/account" : "/bookings"}
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Manage Rides
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                Help
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/60">
                <li>
                  <Link
                    href="/#faq"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business#corporate-onboarding"
                    className="hover:text-[#DFBE6F] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Vertical Divider + Contact Info & Sign In */}
          <div className="lg:col-span-3 lg:border-l lg:border-white/12 lg:pl-8 space-y-3.5 text-xs sm:text-sm text-white/85">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#DFBE6F] shrink-0" />
              <span>Toronto, ON, Canada</span>
            </div>

            <a
              href="mailto:support@limoblack.ca"
              className="flex items-center gap-3 hover:text-[#DFBE6F] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#DFBE6F] shrink-0" />
              <span>support@limoblack.ca</span>
            </a>

            {user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/account"}
                className="flex items-center gap-3 hover:text-[#DFBE6F] transition-colors pt-0.5"
              >
                <User className="w-4 h-4 text-[#DFBE6F] shrink-0" />
                <span>{user.role === "admin" ? "Owner Dashboard" : `My Account (${user.name.split(" ")[0]})`}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-3 hover:text-[#DFBE6F] transition-colors pt-0.5"
              >
                <User className="w-4 h-4 text-[#DFBE6F] shrink-0" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
