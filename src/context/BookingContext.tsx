"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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

export interface SavedPlace {
  id: string;
  label: "Home" | "Office" | "Airport" | "Favorite";
  address: string;
  coords: { lat: number; lng: number } | null;
}

export interface BookingDraft {
  rideType: "oneway" | "hourly";
  pickup: string;
  dropoff: string;
  extraStops: string[];
  pickupCoords: { lat: number; lng: number } | null;
  dropoffCoords: { lat: number; lng: number } | null;
  durationHours: number;
  date: string;
  time: string;
  roundTrip: boolean;
  returnDate: string;
  returnTime: string;
  passengersCount: number;
  luggageCount: number;
  vipAddons: string[];
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
  ownerEmail: string;
  createdAt: string;
  totalUsd: number; // stored in base CAD
  subtotalBeforeTaxCad?: number;
  hstTaxCad?: number;
  distanceKm: number;
  durationMin: number;
  status: DispatchStage;
  ratingScore?: number;
  ratingComment?: string;
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
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  company?: string;
  gstNumber?: string;
  preferredLanguage?: "English" | "Français" | "Bilingual EN/FR";
  tier: string;
  memberSince: string;
  savedPlaces: SavedPlace[];
  defaultCabin: CabinPreferences;
}

interface LocalVaultUser extends UserProfile {
  passwordPlainHash: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  user?: UserProfile;
}

interface BookingContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (m: ThemeMode) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (baseCad: number) => string;
  storageMode: "postgres" | "hybrid";
  draft: BookingDraft;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  updateCabin: (patch: Partial<CabinPreferences>) => void;
  bookings: ConfirmedBooking[]; // User's own bookings (or all if admin)
  allBookings: ConfirmedBooking[]; // All platform bookings (for Admin Dispatch)
  confirmCurrentBooking: (
    totalCad: number,
    distanceKm: number,
    durationMin: number,
    explicitOwnerEmail?: string
  ) => Promise<{ booking: ConfirmedBooking; emailStatus: "accepted" | "unavailable" | "failed" }>;
  cancelBooking: (reference: string) => Promise<boolean>;
  advanceBookingStatus: (reference: string) => void;
  updateBookingSchedule: (
    reference: string,
    newTime: string,
    newNotes: string
  ) => Promise<boolean>;
  rateBooking: (reference: string, score: number, comment: string) => void;
  user: UserProfile | null;
  registerAccount: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    company?: string;
  }) => Promise<AuthResult>;
  loginAccount: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateUserProfile: (patch: Partial<UserProfile>) => Promise<boolean>;
  addSavedPlace: (place: Omit<SavedPlace, "id">) => Promise<boolean>;
  removeSavedPlace: (id: string) => Promise<boolean>;
  loyaltyPoints: number;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

function getFutureDateIso(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const DEFAULT_CABIN: CabinPreferences = {
  temperature: "21°C Balanced",
  conversation: "Discreet Silence",
  refreshment: "Sparkling Perrier",
  childSeat: "None",
  notes: "Please text upon arrival outside Terminal 1 Arrivals.",
};

const DEFAULT_DRAFT: BookingDraft = {
  rideType: "oneway",
  pickup: "",
  dropoff: "",
  extraStops: [],
  pickupCoords: null,
  dropoffCoords: null,
  durationHours: 4,
  date: "2026-11-05",
  time: "18:30",
  roundTrip: false,
  returnDate: "2026-11-07",
  returnTime: "14:00",
  passengersCount: 2,
  luggageCount: 2,
  vipAddons: ["Inside-Terminal Meet & Greet"],
  selectedClassId: "first",
  bookingFor: "myself",
  guestTitle: "Mr.",
  firstName: "",
  lastName: "",
  email: "",
  phone: "+1 (416) ",
  flightNumber: "AC 857",
  pickupSign: "VIP EXECUTIVE GUEST",
  cabin: DEFAULT_CABIN,
  promoCode: "",
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [currency, setCurrency] = useState<CurrencyCode>("CAD");
  const [storageMode, setStorageMode] = useState<"postgres" | "hybrid">(
    "hybrid"
  );
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    ...DEFAULT_DRAFT,
    date: getFutureDateIso(1),
    returnDate: getFutureDateIso(3),
  }));
  const [allBookings, setAllBookings] = useState<ConfirmedBooking[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Sync local storage & server session on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(
        "limoblack_theme_v2"
      ) as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }

      const savedCurrency = localStorage.getItem(
        "limoblack_ca_currency_v2"
      ) as CurrencyCode | null;
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }


    } catch {}

    // Check server JWT session (/api/auth/me)
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.storageMode) {
          setStorageMode(data.storageMode);
        }
        if (data?.user?.email) {
          const mergedUser: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email.toLowerCase(),
            phone: data.user.phone || "",
            role: data.user.role === "admin" ? "admin" : "customer",
            company: data.user.company,
            tier: data.user.tier || "Obsidian VIP Canada",
            memberSince: data.user.memberSince || "2026",
            savedPlaces: data.user.savedPlaces || [],
            defaultCabin: data.user.defaultCabin || DEFAULT_CABIN,
            preferredLanguage: data.user.preferredLanguage || "English",
          };
          setUser(mergedUser);
          prefillDraftFromUser(mergedUser);
          try {
            localStorage.setItem(
              "limoblack_ca_active_user_v3",
              JSON.stringify(mergedUser)
            );
          } catch {}

          if (Array.isArray(data.bookings)) {
            setAllBookings(data.bookings as ConfirmedBooking[]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const getLocalVault = (): Record<string, LocalVaultUser> => {
    try {
      const raw = localStorage.getItem("limoblack_ca_accounts_v3");
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return {};
  };

  const saveLocalVault = (vault: Record<string, LocalVaultUser>) => {
    try {
      localStorage.setItem("limoblack_ca_accounts_v3", JSON.stringify(vault));
    } catch {}
  };

  const prefillDraftFromUser = (profile: UserProfile) => {
    const parts = profile.name.trim().split(" ");
    const first = parts[0] || "";
    const last = parts.slice(1).join(" ") || "";
    setDraft((prev) => ({
      ...prev,
      firstName: prev.firstName || first,
      lastName: prev.lastName || last,
      email: profile.email,
      phone:
        profile.phone && profile.phone.length > 8 ? profile.phone : prev.phone,
      pickupSign:
        prev.pickupSign === "VIP EXECUTIVE GUEST" && profile.name
          ? profile.name.toUpperCase()
          : prev.pickupSign,
      cabin: profile.defaultCabin || prev.cabin,
    }));
  };

  const mergeCloudBookings = (incoming: ConfirmedBooking[]) => {
    setAllBookings((prev) => {
      const map = new Map<string, ConfirmedBooking>();
      for (const b of prev) map.set(b.reference, b);
      for (const b of incoming) {
        if (b && b.reference) map.set(b.reference, b);
      }
      const merged = Array.from(map.values()).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
      try {
        localStorage.setItem("limoblack_ca_bookings_v3", JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const setThemeMode = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
    try {
      localStorage.setItem("limoblack_theme_v2", nextTheme);
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
    setAllBookings(next);
    try {
      localStorage.setItem("limoblack_ca_bookings_v3", JSON.stringify(next));
    } catch {}
  };

  // Authentication is always decided by the server; local storage is not an identity provider.
  const authenticate = async (path: string, input: Record<string, string | undefined>): Promise<AuthResult> => {
    try {
      const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const data = await res.json();
      if (!res.ok || !data.user) return { ok: false, error: data.error || "Unable to sign in." };
      const profileResponse = await fetch("/api/profile");
      const saved = profileResponse.ok ? (await profileResponse.json()).profile : {};
      const profile: UserProfile = {
        id: data.user.id, name: saved.name || data.user.name, email: data.user.email.toLowerCase(), phone: saved.phone || data.user.phone || "",
        role: data.user.role === "admin" ? "admin" : "customer", company: saved.company || data.user.company, preferredLanguage: saved.preferredLanguage || "English",
        tier: data.user.tier || "Member", memberSince: data.user.memberSince || new Date().getFullYear().toString(),
        savedPlaces: saved.savedPlaces || [], defaultCabin: saved.defaultCabin || DEFAULT_CABIN,
      };
      setUser(profile);
      setAllBookings(Array.isArray(data.bookings) ? data.bookings : []);
      if (data.storageMode) setStorageMode(data.storageMode);
      prefillDraftFromUser(profile);
      setAuthModalOpen(false);
      return { ok: true, user: profile };
    } catch {
      return { ok: false, error: "Unable to reach the account service. Please try again." };
    }
  };
  const registerAccount = (input: { name: string; email: string; phone: string; password: string; company?: string }): Promise<AuthResult> => authenticate("/api/auth/signup", input);
  const loginAccount = (email: string, password: string): Promise<AuthResult> => authenticate("/api/auth/login", { email, password });

  const signOut = async () => {
    setUser(null);
    setAllBookings([]);
    try {
      localStorage.removeItem("limoblack_ca_active_user_v3");
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
  };

  const updateUserProfile = async (patch: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...patch };
    try {
      const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: updated.name, phone: updated.phone, company: updated.company || "", preferredLanguage: updated.preferredLanguage || "English", savedPlaces: updated.savedPlaces, defaultCabin: updated.defaultCabin }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save profile.");
      setUser({ ...updated, ...data.profile });
      return true;
    } catch (error) { window.alert(error instanceof Error ? error.message : "Could not save profile."); return false; }
  };
  const addSavedPlace = async (place: Omit<SavedPlace, "id">): Promise<boolean> => user ? updateUserProfile({ savedPlaces: [...user.savedPlaces, { ...place, id: crypto.randomUUID() }] }) : false;
  const removeSavedPlace = async (id: string): Promise<boolean> => user ? updateUserProfile({ savedPlaces: user.savedPlaces.filter((p) => p.id !== id) }) : false;

  const confirmCurrentBooking = async (totalCad: number, distanceKm: number, durationMin: number): Promise<{ booking: ConfirmedBooking; emailStatus: "accepted" | "unavailable" | "failed" }> => {
    if (!user) throw new Error("Please sign in or create an account to submit a booking.");
    const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking: { ...draft, totalUsd: totalCad, distanceKm, durationMin } }) });
    const data = await response.json();
    if (!response.ok || !data.booking) throw new Error(data.error || "Unable to submit booking.");
    const booking = data.booking as ConfirmedBooking;
    setAllBookings((prev) => [booking, ...prev]);
    return { booking, emailStatus: data.emailStatus === "accepted" || data.emailStatus === "unavailable" ? data.emailStatus : "failed" };
  };
  const cancelBooking = async (reference: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference, action: "cancel" }) });
      const data = await response.json();
      if (!response.ok || !data.booking) throw new Error(data.error || "Unable to cancel booking.");
      setAllBookings((prev) => prev.map((b) => b.reference === reference ? data.booking : b));
      return true;
    } catch (error) { window.alert(error instanceof Error ? error.message : "Unable to cancel booking."); return false; }
  };
  // Dispatch and booking edits are intentionally disabled until their server APIs are available.
  const syncUpdatedBookingToServer = (_updated?: ConfirmedBooking) => {};

  const advanceBookingStatus = (reference: string) => {
    const order: DispatchStage[] = [
      "Confirmed",
      "Chauffeur Assigned",
      "Chauffeur En Route",
      "Chauffeur Arrived",
      "Completed",
    ];
    let target: ConfirmedBooking | undefined;
    const next = allBookings.map((b) => {
      if (b.reference !== reference || b.status === "Cancelled") return b;
      const idx = order.indexOf(b.status);
      const nextStage = order[Math.min(order.length - 1, idx + 1)];
      target = { ...b, status: nextStage };
      return target;
    });
    persistBookings(next);
    syncUpdatedBookingToServer(target);
  };

  const updateBookingSchedule = async (reference: string, newTime: string, newNotes: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference, action: "schedule", time: newTime, notes: newNotes }) });
      const data = await response.json();
      if (!response.ok || !data.booking) throw new Error(data.error || "Unable to update booking.");
      setAllBookings((prev) => prev.map((b) => b.reference === reference ? data.booking : b));
      return true;
    } catch (error) { window.alert(error instanceof Error ? error.message : "Unable to update booking."); return false; }
  };

  const rateBooking = (reference: string, score: number, comment: string) => {
    let target: ConfirmedBooking | undefined;
    const next = allBookings.map((b) => {
      if (b.reference !== reference) return b;
      target = { ...b, ratingScore: score, ratingComment: comment };
      return target;
    });
    persistBookings(next);
    syncUpdatedBookingToServer(target);
  };

  // Strict per-user filtering: logged-in customer sees ONLY their own bookings!
  const myBookings = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return allBookings;
    return allBookings.filter(
      (b) => b.ownerEmail?.toLowerCase() === user.email.toLowerCase()
    );
  }, [allBookings, user]);

  const loyaltyPoints = useMemo(() => {
    return myBookings
      .filter((b) => b.status !== "Cancelled")
      .reduce((acc, b) => acc + Math.round(b.totalUsd * 10), 1500);
  }, [myBookings]);

  return (
    <BookingContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode,
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        storageMode,
        draft,
        updateDraft,
        updateCabin,
        bookings: myBookings,
        allBookings,
        confirmCurrentBooking,
        cancelBooking,
        advanceBookingStatus,
        updateBookingSchedule,
        rateBooking,
        user,
        registerAccount,
        loginAccount,
        signOut,
        updateUserProfile,
        addSavedPlace,
        removeSavedPlace,
        loyaltyPoints,
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
