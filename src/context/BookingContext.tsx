"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CURRENCIES,
  CurrencyCode,
  FleetClassId,
  FLEET_CLASSES,
} from "@/data/limoData";

export type ThemeMode = "dark" | "light";

export interface CabinPreferences {
  temperature: "19°C Cool" | "21°C Balanced" | "23°C Warm";
  conversation: "Discreet Silence" | "Warm & Conversational";
  refreshment: "Still Artisan Water" | "Sparkling Perrier" | "Chilled Espresso";
  childSeat: "None" | "Infant Carrier" | "Toddler Seat" | "Booster Seat";
  notes: string;
}

export interface BookingDraft {
  rideType: "oneway" | "hourly";
  pickup: string;
  dropoff: string;
  pickupCoords: { lat: number; lng: number } | null;
  dropoffCoords: { lat: number; lng: number } | null;
  durationHours: number;
  date: string;
  time: string;
  selectedClassId: FleetClassId;
  bookingFor: "myself" | "guest";
  guestTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flightNumber: string;
  pickupSign: string;
  cabin: CabinPreferences;
  promoCode: string;
}

export type DispatchStage =
  | "Confirmed"
  | "Chauffeur Assigned"
  | "Chauffeur En Route"
  | "Chauffeur Arrived"
  | "Completed"
  | "Cancelled";

export interface ConfirmedBooking extends BookingDraft {
  reference: string;
  createdAt: string;
  totalUsd: number; // stored in base CAD
  distanceKm: number;
  durationMin: number;
  status: DispatchStage;
  chauffeur: {
    name: string;
    rating: string;
    languages: string;
    phone: string;
    vehicleModel: string;
    plate: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  tier: "Obsidian VIP Canada" | "Corporate Executive";
  memberSince: string;
}

interface BookingContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (m: ThemeMode) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (baseCad: number) => string;
  draft: BookingDraft;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  updateCabin: (patch: Partial<CabinPreferences>) => void;
  bookings: ConfirmedBooking[];
  confirmCurrentBooking: (
    totalCad: number,
    distanceKm: number,
    durationMin: number
  ) => ConfirmedBooking;
  cancelBooking: (reference: string) => void;
  advanceBookingStatus: (reference: string) => void;
  user: UserProfile | null;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

function getTomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const DEFAULT_DRAFT: BookingDraft = {
  rideType: "oneway",
  pickup: "Toronto Pearson International Airport (YYZ)",
  dropoff: "Fairmont Royal York Hotel, 100 Front St W, Toronto, ON",
  pickupCoords: { lat: 43.6777, lng: -79.6248 },
  dropoffCoords: { lat: 43.6456, lng: -79.3814 },
  durationHours: 4,
  date: "2026-11-05",
  time: "18:30",
  selectedClassId: "first",
  bookingFor: "myself",
  guestTitle: "Mr.",
  firstName: "David",
  lastName: "MacLeod",
  email: "d.macleod@baystreetcapital.ca",
  phone: "+1 (416) 555-0194",
  flightNumber: "AC 857",
  pickupSign: "MR. DAVID MACLEOD",
  cabin: {
    temperature: "21°C Balanced",
    conversation: "Discreet Silence",
    refreshment: "Sparkling Perrier",
    childSeat: "None",
    notes: "Please text upon arrival outside Terminal 1 Domestic/Intl Arrivals.",
  },
  promoCode: "",
};

const SEED_BOOKING: ConfirmedBooking = {
  ...DEFAULT_DRAFT,
  selectedClassId: "suv",
  pickup: "Vancouver International Airport (YVR)",
  dropoff: "Four Seasons Resort & Residences Whistler, BC",
  pickupCoords: { lat: 49.1967, lng: -123.1815 },
  dropoffCoords: { lat: 50.1163, lng: -122.9486 },
  flightNumber: "AC 215",
  pickupSign: "MACLEOD EXECUTIVE PARTY",
  reference: "LB-904812",
  createdAt: "2026-11-03T09:15:00Z",
  totalUsd: 495,
  distanceKm: 136,
  durationMin: 115,
  status: "Chauffeur Assigned",
  chauffeur: {
    name: "Liam MacLeod",
    rating: "4.99",
    languages: "English, French",
    phone: "+1 (604) 555-0821",
    vehicleModel: "Cadillac Escalade ESV 4WD",
    plate: "BC 88 VIP",
  },
};

const CHAUFFEUR_ROSTER = [
  {
    name: "Liam Vance",
    rating: "4.99",
    languages: "English",
    phone: "+1 (416) 555-0842",
    plate: "ON LB 88",
  },
  {
    name: "Jean-Luc Tremblay",
    rating: "5.00",
    languages: "English, Français",
    phone: "+1 (514) 555-4410",
    plate: "QC LB 07",
  },
  {
    name: "Devon Gill",
    rating: "4.99",
    languages: "English, Punjabi",
    phone: "+1 (604) 555-9102",
    plate: "BC 11 LB",
  },
];

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [currency, setCurrency] = useState<CurrencyCode>("CAD");
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    ...DEFAULT_DRAFT,
    date: getTomorrowIso(),
  }));
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([SEED_BOOKING]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(
        "limoblack_theme_v1"
      ) as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      const savedBookings = localStorage.getItem("limoblack_ca_bookings_v2");
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
        }
      }
      const savedCurrency = localStorage.getItem(
        "limoblack_ca_currency_v2"
      ) as CurrencyCode | null;
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }
      const savedUser = localStorage.getItem("limoblack_ca_user_v2");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setThemeMode = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
    try {
      localStorage.setItem("limoblack_theme_v1", nextTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setThemeMode(theme === "dark" ? "light" : "dark");
  };

  const handleSetCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    try {
      localStorage.setItem("limoblack_ca_currency_v2", c);
    } catch {}
  };

  const formatPrice = (baseCad: number): string => {
    const info = CURRENCIES[currency];
    const converted = Math.round(baseCad * info.rate);
    return `${info.symbol}${converted.toLocaleString("en-CA")}`;
  };

  const updateDraft = (patch: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const updateCabin = (patch: Partial<CabinPreferences>) => {
    setDraft((prev) => ({
      ...prev,
      cabin: { ...prev.cabin, ...patch },
    }));
  };

  const persistBookings = (next: ConfirmedBooking[]) => {
    setBookings(next);
    try {
      localStorage.setItem("limoblack_ca_bookings_v2", JSON.stringify(next));
    } catch {}
  };

  const confirmCurrentBooking = (
    totalCad: number,
    distanceKm: number,
    durationMin: number
  ): ConfirmedBooking => {
    const randomNum = Math.floor(100000 + Math.random() * 899999);
    const reference = `LB-${randomNum}`;
    const chosenFleet =
      FLEET_CLASSES.find((f) => f.id === draft.selectedClassId) ||
      FLEET_CLASSES[0];
    const assigned =
      CHAUFFEUR_ROSTER[randomNum % CHAUFFEUR_ROSTER.length];

    const newBooking: ConfirmedBooking = {
      ...draft,
      reference,
      createdAt: new Date().toISOString(),
      totalUsd: totalCad,
      distanceKm,
      durationMin,
      status: "Chauffeur Assigned",
      chauffeur: {
        name: assigned.name,
        rating: assigned.rating,
        languages: assigned.languages,
        phone: assigned.phone,
        vehicleModel: chosenFleet.vehicles.split(",")[0],
        plate: assigned.plate,
      },
    };

    const next = [newBooking, ...bookings];
    persistBookings(next);
    return newBooking;
  };

  const cancelBooking = (reference: string) => {
    const next = bookings.map((b) =>
      b.reference === reference
        ? { ...b, status: "Cancelled" as DispatchStage }
        : b
    );
    persistBookings(next);
  };

  const advanceBookingStatus = (reference: string) => {
    const order: DispatchStage[] = [
      "Confirmed",
      "Chauffeur Assigned",
      "Chauffeur En Route",
      "Chauffeur Arrived",
      "Completed",
    ];
    const next = bookings.map((b) => {
      if (b.reference !== reference || b.status === "Cancelled") return b;
      const idx = order.indexOf(b.status);
      const nextStage = order[Math.min(order.length - 1, idx + 1)];
      return { ...b, status: nextStage };
    });
    persistBookings(next);
  };

  const signIn = (name: string, email: string) => {
    const profile: UserProfile = {
      name,
      email,
      tier: "Obsidian VIP Canada",
      memberSince: "2024",
    };
    setUser(profile);
    setAuthModalOpen(false);
    try {
      localStorage.setItem("limoblack_ca_user_v2", JSON.stringify(profile));
    } catch {}
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("limoblack_ca_user_v2");
    } catch {}
  };

  return (
    <BookingContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode,
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        draft,
        updateDraft,
        updateCabin,
        bookings,
        confirmCurrentBooking,
        cancelBooking,
        advanceBookingStatus,
        user,
        signIn,
        signOut,
        isAuthModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return ctx;
}
