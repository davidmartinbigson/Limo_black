"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CITY_TO_CITY_ROUTES } from "@/data/limoData";
import { useBooking } from "@/context/BookingContext";

const TOP_CANADIAN_CITIES = [
  {
    name: "Toronto",
    routesCount: "14 routes to/from this city",
    image: "/images/city-toronto.jpg",
    pickup: "Toronto Pearson International Airport (YYZ)",
    dropoff: "Fairmont Royal York Hotel, 100 Front St W, Toronto, ON",
  },
  {
    name: "Vancouver",
    routesCount: "11 routes to/from this city",
    image: "/images/city-vancouver.jpg",
    pickup: "Vancouver International Airport (YVR)",
    dropoff: "Four Seasons Resort & Residences Whistler, BC",
  },
  {
    name: "Montréal",
    routesCount: "12 routes to/from this city",
    image: "/images/city-montreal.jpg",
    pickup: "Montréal–Trudeau International Airport (YUL)",
    dropoff: "Ritz-Carlton Montréal, 1228 Sherbrooke St W, QC",
  },
  {
    name: "Calgary",
    routesCount: "9 routes to/from this city",
    image: "/images/city-calgary.jpg",
    pickup: "Calgary International Airport (YYC)",
    dropoff: "Fairmont Banff Springs, 405 Spray Ave, Banff, AB",
  },
];

export default function CityRoutesExplorer() {
  const router = useRouter();
  const { updateDraft, formatPrice } = useBooking();

  const handleSelectRoute = (pickup: string, dropoff: string) => {
    updateDraft({
      rideType: "oneway",
      pickup,
      dropoff,
      pickupCoords: null,
      dropoffCoords: null,
    });
    router.push("/book");
  };

  return (
    <section className="py-20 sm:py-24 bg-surface border-y border-line/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Section Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            City-to-City routes
          </h2>
          <p className="text-sm sm:text-base text-muted mt-2">
            Door-to-door intercity chauffeur rides across Canada — the stress-free
            alternative to short-haul flights and regional trains.
          </p>
        </div>

        {/* Top Cities (Blacklane 4 Photo Cards) */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Top cities
            </h3>
            <Link
              href="/services/city-to-city"
              className="text-sm font-semibold text-ink hover:text-accent underline underline-offset-4 transition-colors"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOP_CANADIAN_CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectRoute(city.pickup, city.dropoff)}
                className="group text-left rounded-xl bg-card border border-line/12 hover:border-champagne-500/50 overflow-hidden shadow-luxury transition-all"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="font-serif text-base font-bold text-ink group-hover:text-accent transition-colors">
                    {city.name}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {city.routesCount}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Routes (Blacklane 8 Clean Route Cards) */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Top routes
            </h3>
            <Link
              href="/services/city-to-city"
              className="text-sm font-semibold text-ink hover:text-accent underline underline-offset-4 transition-colors"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CITY_TO_CITY_ROUTES.slice(0, 8).map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() =>
                  handleSelectRoute(route.pickupFull, route.dropoffFull)
                }
                className="group text-left p-4 rounded-xl bg-card border border-line/12 hover:border-champagne-500/50 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-ink group-hover:text-accent transition-colors">
                  <span className="truncate">{route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  <span className="truncate">{route.to}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    {route.duration} · {route.distanceKm} km
                  </span>
                  <span className="font-semibold text-ink">
                    from {formatPrice(route.startingCad)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blacklane "Have a route in mind?" Callout Box */}
        <div className="rounded-xl bg-card border border-line/12 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
              Have a Canadian route in mind?
            </h4>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Enter your pickup and drop-off locations to see the guaranteed
              all-inclusive CAD price.
            </p>
          </div>
          <a
            href="#booking-widget"
            className="px-6 py-3 rounded-xl bg-ink text-canvas hover:opacity-90 font-semibold text-xs sm:text-sm whitespace-nowrap text-center transition-opacity"
          >
            Book a City-to-City ride
          </a>
        </div>
      </div>
    </section>
  );
}
