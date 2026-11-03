"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CURRENCIES,
  CurrencyCode,
  FleetClassId,
  FLEET_CLASSES,
} from "@/data/limoData";

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
  totalUsd: number;
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
  tier: "Obsidian VIP" | "Corporate Executive";
  memberSince: string;
}

interface BookingContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (usd: number) => string;
  draft: BookingDraft;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  updateCabin: (patch: Partial<CabinPreferences>) => void;
  bookings: ConfirmedBooking[];
  confirmCurrentBooking: (
    totalUsd: number,
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
  pickup: "John F. Kennedy International Airport (JFK)",
  dropoff: "Aman New York, Fifth Avenue",
  durationHours: 4,
  date: "2026-11-05",
  time: "18:30",
  selectedClassId: "first",
  bookingFor: "myself",
  guestTitle: "Mr.",
  firstName: "Alexander",
  lastName: "Sterling",
  email: "a.sterling@sterlingcapital.com",
  phone: "+1 (212) 555-0194",
  flightNumber: "BA 117",
  pickupSign: "MR. ALEXANDER STERLING",
  cabin: {
    temperature: "21°C Balanced",
    conversation: "Discreet Silence",
    refreshment: "Sparkling Perrier",
    childSeat: "None",
    notes: "Please text upon arrival outside Terminal 8 VIP customs exit.",
  },
  promoCode: "",
};

const SEED_BOOKING: ConfirmedBooking = {
  ...DEFAULT_DRAFT,
  selectedClassId: "limousine",
  pickup: "London Heathrow Airport (LHR)",
  dropoff: "Claridge's Mayfair",
  flightNumber: "BA 001",
  pickupSign: "STERLING EXECUTIVE PARTY",
  reference: "LB-904812",
  createdAt: "2026-11-03T09:15:00Z",
  totalUsd: 410,
  distanceKm: 28,
  durationMin: 46,
  status: "Chauffeur Assigned",
  chauffeur: {
    name: "Julian Kensington",
    rating: "4.99",
    languages: "English, French",
    phone: "+44 20 7946 0821",
    vehicleModel: "Mercedes-Maybach S680 Pullman",
    plate: "LB 01 MAY",
  },
};

const CHAUFFEUR_ROSTER = [
  {
    name: "Marcus Vance",
    rating: "4.99",
    languages: "English, German",
    phone: "+1 (212) 555-0842",
    plate: "LB 88 VIP",
  },
  {
    name: "Henri Delacroix",
    rating: "5.00",
    languages: "English, French, Italian",
    phone: "+33 1 86 95 44 10",
    plate: "LB 07 PAR",
  },
  {
    name: "Tariq Al-Harbi",
    rating: "4.99",
    languages: "English, Arabic",
    phone: "+971 4 555 9102",
    plate: "DXB 11 LB",
  },
];

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    ...DEFAULT_DRAFT,
    date: getTomorrowIso(),
  }));
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([SEED_BOOKING]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("limoblack_bookings_v1");
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
        }
      }
      const savedCurrency = localStorage.getItem(
        "limoblack_currency_v1"
      ) as CurrencyCode | null;
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }
      const savedUser = localStorage.getItem("limoblack_user_v1");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleSetCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    try {
      localStorage.setItem("limoblack_currency_v1", c);
    } catch {}
  };

  const formatPrice = (usd: number): string => {
    const info = CURRENCIES[currency];
    const converted = Math.round(usd * info.rate);
    return `${info.symbol}${converted.toLocaleString("en-US")}`;
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
      localStorage.setItem("limoblack_bookings_v1", JSON.stringify(next));
    } catch {}
  };

  const confirmCurrentBooking = (
    totalUsd: number,
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
      totalUsd,
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
      tier: "Obsidian VIP",
      memberSince: "2024",
    };
    setUser(profile);
    setAuthModalOpen(false);
    try {
      localStorage.setItem("limoblack_user_v1", JSON.stringify(profile));
    } catch {}
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("limoblack_user_v1");
    } catch {}
  };

  return (
    <BookingContext.Provider
      value={{
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
