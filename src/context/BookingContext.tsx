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
  ) => ConfirmedBooking;
  cancelBooking: (reference: string) => void;
  advanceBookingStatus: (reference: string) => void;
  updateBookingSchedule: (
    reference: string,
    newTime: string,
    newNotes: string
  ) => void;
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
  signIn: (name: string, email: string) => void;
  signOut: () => Promise<void>;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  addSavedPlace: (place: Omit<SavedPlace, "id">) => void;
  removeSavedPlace: (id: string) => void;
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

function simpleHash(str: string): string {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `h_${(h >>> 0).toString(16)}`;
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

const SEED_VIP_BOOKING: ConfirmedBooking = {
  ...DEFAULT_DRAFT,
  firstName: "David",
  lastName: "MacLeod",
  email: "d.macleod@baystreetcapital.ca",
  phone: "+1 (416) 555-0194",
  ownerEmail: "d.macleod@baystreetcapital.ca",
  selectedClassId: "suv",
  pickup: "Vancouver International Airport (YVR)",
  dropoff: "Four Seasons Resort & Residences Whistler, BC",
  pickupCoords: { lat: 49.1967, lng: -123.1815 },
  dropoffCoords: { lat: 50.1163, lng: -122.9486 },
  flightNumber: "AC 215",
  pickupSign: "MR. DAVID MACLEOD",
  reference: "LB-904812",
  createdAt: "2026-11-03T09:15:00Z",
  totalUsd: 495,
  subtotalBeforeTaxCad: 438,
  hstTaxCad: 57,
  distanceKm: 136,
  durationMin: 115,
  status: "Chauffeur Assigned",
  chauffeur: {
    name: "Liam MacLeod",
    rating: "4.99",
    languages: "English, Français",
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

const DEFAULT_DEMO_ACCOUNTS: Record<string, LocalVaultUser> = {
  "d.macleod@baystreetcapital.ca": {
    id: "usr-vip-01",
    name: "David MacLeod",
    email: "d.macleod@baystreetcapital.ca",
    phone: "+1 (416) 555-0194",
    role: "customer",
    company: "Bay Street Capital Partners",
    preferredLanguage: "English",
    tier: "Obsidian VIP Canada",
    memberSince: "2025",
    passwordPlainHash: simpleHash("Canada123!"),
    savedPlaces: [
      {
        id: "sp-1",
        label: "Office",
        address: "Bay Street Financial District (First Canadian Place), Toronto, ON",
        coords: { lat: 43.6487, lng: -79.3817 },
      },
      {
        id: "sp-2",
        label: "Airport",
        address: "Toronto Pearson International Airport (YYZ)",
        coords: { lat: 43.6777, lng: -79.6248 },
      },
    ],
    defaultCabin: DEFAULT_CABIN,
  },
  "admin@limoblack.ca": {
    id: "usr-admin-01",
    name: "Limo Black Dispatch Admin",
    email: "admin@limoblack.ca",
    phone: "+1 (888) 555-5466",
    role: "admin",
    company: "Limo Black Canada HQ",
    preferredLanguage: "Bilingual EN/FR",
    tier: "Dispatch Administrator",
    memberSince: "2025",
    passwordPlainHash: simpleHash("Admin123!"),
    savedPlaces: [],
    defaultCabin: DEFAULT_CABIN,
  },
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
  const [allBookings, setAllBookings] = useState<ConfirmedBooking[]>([
    SEED_VIP_BOOKING,
  ]);
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

      const savedBookings = localStorage.getItem("limoblack_ca_bookings_v3");
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllBookings(parsed);
        }
      }

      const savedCurrency = localStorage.getItem(
        "limoblack_ca_currency_v2"
      ) as CurrencyCode | null;
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }

      const savedActiveUser = localStorage.getItem(
        "limoblack_ca_active_user_v3"
      );
      if (savedActiveUser) {
        const parsedUser = JSON.parse(savedActiveUser) as UserProfile;
        setUser(parsedUser);
        prefillDraftFromUser(parsedUser);
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
          const vault = getLocalVault();
          const existingLocal = vault[data.user.email.toLowerCase()];
          const mergedUser: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email.toLowerCase(),
            phone: data.user.phone || existingLocal?.phone || "+1 (416) 555-0100",
            role: data.user.role === "admin" ? "admin" : "customer",
            company: data.user.company || existingLocal?.company,
            tier: data.user.tier || "Obsidian VIP Canada",
            memberSince: data.user.memberSince || "2026",
            savedPlaces: existingLocal?.savedPlaces || [],
            defaultCabin: existingLocal?.defaultCabin || DEFAULT_CABIN,
          };
          setUser(mergedUser);
          prefillDraftFromUser(mergedUser);
          try {
            localStorage.setItem(
              "limoblack_ca_active_user_v3",
              JSON.stringify(mergedUser)
            );
          } catch {}

          if (Array.isArray(data.bookings) && data.bookings.length > 0) {
            mergeCloudBookings(data.bookings as ConfirmedBooking[]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const getLocalVault = (): Record<string, LocalVaultUser> => {
    try {
      const raw = localStorage.getItem("limoblack_ca_accounts_v3");
      if (raw) {
        return { ...DEFAULT_DEMO_ACCOUNTS, ...JSON.parse(raw) };
      }
    } catch {}
    return { ...DEFAULT_DEMO_ACCOUNTS };
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

  // Register a real user account (API + local hybrid vault)
  const registerAccount = async (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    company?: string;
  }): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase();
    const vault = getLocalVault();

    if (vault[email]) {
      return {
        ok: false,
        error: "An account with this email already exists. Please sign in.",
      };
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();

      if (!res.ok && res.status === 409) {
        return { ok: false, error: data.error || "Email already registered." };
      }
      if (!res.ok && res.status === 400) {
        return { ok: false, error: data.error || "Invalid signup details." };
      }

      if (data?.storageMode) setStorageMode(data.storageMode);
    } catch {
      // Fallback gracefully if offline
    }

    const newProfile: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      role: email === "admin@limoblack.ca" ? "admin" : "customer",
      company: input.company?.trim() || undefined,
      preferredLanguage: "English",
      tier:
        email === "admin@limoblack.ca"
          ? "Dispatch Administrator"
          : "Obsidian VIP Canada",
      memberSince: new Date().getFullYear().toString(),
      savedPlaces: [],
      defaultCabin: draft.cabin,
    };

    vault[email] = {
      ...newProfile,
      passwordPlainHash: simpleHash(input.password),
    };
    saveLocalVault(vault);
    setUser(newProfile);
    prefillDraftFromUser(newProfile);
    setAuthModalOpen(false);
    try {
      localStorage.setItem(
        "limoblack_ca_active_user_v3",
        JSON.stringify(newProfile)
      );
    } catch {}

    return { ok: true, user: newProfile };
  };

  // Login an existing user account (Server API + Local Hybrid Vault check)
  const loginAccount = async (
    rawEmail: string,
    password: string
  ): Promise<AuthResult> => {
    const email = rawEmail.trim().toLowerCase();
    const vault = getLocalVault();
    const localAcc = vault[email];

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data?.user) {
        if (data.storageMode) setStorageMode(data.storageMode);
        const profile: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email.toLowerCase(),
          phone: data.user.phone || localAcc?.phone || "+1 (416) 555-0100",
          role: data.user.role === "admin" ? "admin" : "customer",
          company: data.user.company || localAcc?.company,
          tier: data.user.tier || "Obsidian VIP Canada",
          memberSince: data.user.memberSince || "2025",
          savedPlaces: localAcc?.savedPlaces || [],
          defaultCabin: localAcc?.defaultCabin || DEFAULT_CABIN,
        };
        setUser(profile);
        prefillDraftFromUser(profile);
        setAuthModalOpen(false);
        try {
          localStorage.setItem(
            "limoblack_ca_active_user_v3",
            JSON.stringify(profile)
          );
        } catch {}

        if (Array.isArray(data.bookings) && data.bookings.length > 0) {
          mergeCloudBookings(data.bookings as ConfirmedBooking[]);
        }
        return { ok: true, user: profile };
      }

      // If server returned wrong password explicitly (and not cold-start USER_NOT_FOUND)
      if (!res.ok && data?.code !== "USER_NOT_FOUND" && !localAcc) {
        return {
          ok: false,
          error: data?.error || "Invalid email or password.",
        };
      }
    } catch {}

    // Hybrid local vault verification (handles serverless cold-starts when no Postgres DB env var is attached yet)
    if (localAcc) {
      if (localAcc.passwordPlainHash !== simpleHash(password)) {
        return {
          ok: false,
          error: "Incorrect password. Please check your password and try again.",
        };
      }
      const { passwordPlainHash: _unused, ...cleanProfile } = localAcc;
      void _unused;
      setUser(cleanProfile);
      prefillDraftFromUser(cleanProfile);
      setAuthModalOpen(false);
      try {
        localStorage.setItem(
          "limoblack_ca_active_user_v3",
          JSON.stringify(cleanProfile)
        );
      } catch {}
      return { ok: true, user: cleanProfile };
    }

    return {
      ok: false,
      error: "No account found with this email. Please Sign Up first.",
    };
  };

  const signIn = (name: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const vault = getLocalVault();
    const existing = vault[cleanEmail];
    const profile: UserProfile = existing
      ? {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          phone: existing.phone,
          role: existing.role,
          company: existing.company,
          tier: existing.tier,
          memberSince: existing.memberSince,
          savedPlaces: existing.savedPlaces,
          defaultCabin: existing.defaultCabin,
        }
      : {
          id: `usr-${Date.now().toString(36)}`,
          name,
          email: cleanEmail,
          phone: "+1 (416) 555-0194",
          role: cleanEmail === "admin@limoblack.ca" ? "admin" : "customer",
          tier:
            cleanEmail === "admin@limoblack.ca"
              ? "Dispatch Administrator"
              : "Obsidian VIP Canada",
          memberSince: "2025",
          savedPlaces: [],
          defaultCabin: DEFAULT_CABIN,
        };
    setUser(profile);
    prefillDraftFromUser(profile);
    setAuthModalOpen(false);
    try {
      localStorage.setItem(
        "limoblack_ca_active_user_v3",
        JSON.stringify(profile)
      );
    } catch {}
  };

  const signOut = async () => {
    setUser(null);
    try {
      localStorage.removeItem("limoblack_ca_active_user_v3");
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...patch };
    setUser(updated);
    const vault = getLocalVault();
    if (vault[user.email]) {
      vault[user.email] = { ...vault[user.email], ...updated };
      saveLocalVault(vault);
    }
    try {
      localStorage.setItem(
        "limoblack_ca_active_user_v3",
        JSON.stringify(updated)
      );
    } catch {}
  };

  const addSavedPlace = (place: Omit<SavedPlace, "id">) => {
    if (!user) return;
    const nextPlaces: SavedPlace[] = [
      ...user.savedPlaces,
      { ...place, id: `sp-${Date.now().toString(36)}` },
    ];
    updateUserProfile({ savedPlaces: nextPlaces });
  };

  const removeSavedPlace = (id: string) => {
    if (!user) return;
    updateUserProfile({
      savedPlaces: user.savedPlaces.filter((p) => p.id !== id),
    });
  };

  const confirmCurrentBooking = (
    totalCad: number,
    distanceKm: number,
    durationMin: number,
    explicitOwnerEmail?: string
  ): ConfirmedBooking => {
    const randomNum = Math.floor(100000 + Math.random() * 899999);
    const reference = `LB-${randomNum}`;
    const chosenFleet =
      FLEET_CLASSES.find((f) => f.id === draft.selectedClassId) ||
      FLEET_CLASSES[0];
    const assigned =
      CHAUFFEUR_ROSTER[randomNum % CHAUFFEUR_ROSTER.length];

    const ownerEmail = (
      explicitOwnerEmail ||
      user?.email ||
      draft.email ||
      "guest@limoblack.ca"
    )
      .trim()
      .toLowerCase();

    const subtotalBeforeTaxCad = Math.round(totalCad / 1.13);
    const hstTaxCad = totalCad - subtotalBeforeTaxCad;

    const newBooking: ConfirmedBooking = {
      ...draft,
      ownerEmail,
      reference,
      createdAt: new Date().toISOString(),
      totalUsd: totalCad,
      subtotalBeforeTaxCad,
      hstTaxCad,
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

    const next = [newBooking, ...allBookings];
    persistBookings(next);

    // Sync to server / cloud Postgres API
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking: newBooking }),
    }).catch(() => {});

    return newBooking;
  };

  const syncUpdatedBookingToServer = (updated?: ConfirmedBooking) => {
    if (!updated) return;
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking: updated }),
    }).catch(() => {});
  };

  const cancelBooking = (reference: string) => {
    let target: ConfirmedBooking | undefined;
    const next = allBookings.map((b) => {
      if (b.reference === reference) {
        target = { ...b, status: "Cancelled" as DispatchStage };
        return target;
      }
      return b;
    });
    persistBookings(next);
    syncUpdatedBookingToServer(target);
  };

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

  const updateBookingSchedule = (
    reference: string,
    newTime: string,
    newNotes: string
  ) => {
    let target: ConfirmedBooking | undefined;
    const next = allBookings.map((b) => {
      if (b.reference !== reference) return b;
      target = {
        ...b,
        time: newTime,
        cabin: { ...b.cabin, notes: newNotes },
      };
      return target;
    });
    persistBookings(next);
    syncUpdatedBookingToServer(target);
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
        signIn,
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
