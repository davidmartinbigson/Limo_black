"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Loader2,
  MapPin,
  Navigation,
  Plane,
  X,
} from "lucide-react";
import { GLOBAL_LOCATIONS, LocationItem } from "@/data/limoData";
import { searchCanadianAddresses } from "@/lib/canadaPlaces";

interface CanadianAddressInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (
    nextValue: string,
    coords?: { lat: number; lng: number } | null
  ) => void;
  compact?: boolean;
  darkSurface?: boolean;
  lightSurface?: boolean;
}

export default function CanadianAddressInput({
  label,
  value,
  placeholder = "Search Canadian street address, postal code, hotel, or airport...",
  onChange,
  compact = false,
  darkSurface = false,
  lightSurface = false,
}: CanadianAddressInputProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LocationItem[]>(() =>
    GLOBAL_LOCATIONS.slice(0, 7)
  );
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const q = value.trim();
    if (!q) {
      setResults(GLOBAL_LOCATIONS.slice(0, 8));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const items = await searchCanadianAddresses(q, controller.signal);
        setResults(items);
        setHighlightIdx(-1);
      } catch {
        // Ignore aborted requests
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, open]);

  const handleSelect = (item: LocationItem) => {
    onChange(item.name, { lat: item.lat, lng: item.lng });
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className={`block mb-1.5 ${
          darkSurface
            ? "text-xs font-medium text-white/90"
            : lightSurface
            ? "text-xs font-semibold text-[#222226]"
            : "text-[11px] uppercase tracking-[0.16em] text-muted font-semibold ml-1"
        }`}
      >
        {label}
      </label>

      <div className="relative">
        <MapPin
          className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
            darkSurface || lightSurface ? "text-[#C8A24D]" : "text-accent"
          }`}
        />
        <input
          type="text"
          value={value}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            onChange(e.target.value, null);
            setOpen(true);
          }}
          placeholder={placeholder}
          className={
            darkSurface
              ? "w-full pl-10 pr-8 py-3 rounded-xl bg-[#1E1F24] border border-white/12 focus:border-[#D4AF61] text-xs sm:text-sm text-white placeholder:text-white/45 focus:outline-none transition-colors"
              : lightSurface
              ? "w-full pl-10 pr-8 py-3 rounded-xl bg-white border border-[#DEDED8] focus:border-[#C8A24D] text-sm text-[#141416] placeholder:text-[#8A8A90] focus:outline-none transition-colors"
              : `w-full pl-10 pr-9 rounded-2xl bg-field border border-line/15 focus:border-champagne-500 text-sm text-ink placeholder:text-subtle focus:outline-none transition-colors ${
                  compact ? "py-2.5 text-xs" : "py-3.5"
                }`
          }
        />

        {loading ? (
          <Loader2 className="w-4 h-4 text-[#C8A24D] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
        ) : (
          value && (
            <button
              type="button"
              onClick={() => {
                onChange("", null);
                setOpen(true);
              }}
              title="Clear address"
              className={`p-1 rounded-full absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${
                darkSurface
                  ? "hover:bg-white/10 text-white/45 hover:text-white"
                  : lightSurface
                  ? "hover:bg-black/5 text-[#77777C] hover:text-[#141416]"
                  : "hover:bg-line/10 text-subtle hover:text-ink"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {/* Live Canadian Map Suggestions Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 sm:min-w-[360px] right-0 top-full mt-2 z-50 rounded-2xl p-2 shadow-luxury max-h-80 overflow-y-auto ${
              darkSurface
                ? "bg-[#16171B] border border-white/15 text-white"
                : lightSurface
                ? "bg-white border border-[#E4E4DE] text-[#141416] shadow-xl"
                : "bg-card border border-line/15 text-ink"
            }`}
          >
            <div
              className={`px-3 py-1.5 flex items-center justify-between border-b mb-1 ${
                darkSurface
                  ? "border-white/10"
                  : lightSurface
                  ? "border-[#ECECE6]"
                  : "border-line/10"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8923B] font-semibold flex items-center gap-1.5">
                <Navigation className="w-3 h-3" />
                {value.trim()
                  ? "Live Canada Address Results"
                  : "Popular Canadian Airports & Landmarks"}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  darkSurface
                    ? "text-white/50"
                    : lightSurface
                    ? "text-[#77777C]"
                    : "text-subtle"
                }`}
              >
                Canada Only 🇨🇦
              </span>
            </div>

            {results.length === 0 && !loading ? (
              <div
                className={`px-3 py-4 text-xs text-center ${
                  darkSurface
                    ? "text-white/60"
                    : lightSurface
                    ? "text-[#66666B]"
                    : "text-muted"
                }`}
              >
                No matching Canadian address found. Try adding city or province
                (e.g. Toronto, ON).
              </div>
            ) : (
              results.map((loc, idx) => {
                const active = idx === highlightIdx;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(loc)}
                    className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                      active
                        ? lightSurface
                          ? "bg-[#FAF6EC]"
                          : "bg-champagne-500/20"
                        : darkSurface
                        ? "hover:bg-white/[0.06]"
                        : lightSurface
                        ? "hover:bg-[#F7F6F2]"
                        : "hover:bg-line/[0.06]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        darkSurface
                          ? "bg-[#1F2026] border border-white/10"
                          : lightSurface
                          ? "bg-[#F7F6F2] border border-[#E6E5DF]"
                          : "bg-field border border-line/10"
                      }`}
                    >
                      {loc.type === "airport" ? (
                        <Plane className="w-3.5 h-3.5 text-[#C8A464]" />
                      ) : loc.type === "hotel" ? (
                        <Building2 className="w-3.5 h-3.5 text-[#C8A464]" />
                      ) : (
                        <MapPin
                          className={`w-3.5 h-3.5 ${
                            darkSurface
                              ? "text-white/50"
                              : lightSurface
                              ? "text-[#66666B]"
                              : "text-muted"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            darkSurface
                              ? "text-white"
                              : lightSurface
                              ? "text-[#141416]"
                              : "text-ink"
                          }`}
                        >
                          {loc.name}
                        </span>
                        {loc.iata && (
                          <span className="px-1.5 py-0.5 rounded bg-[#C8A464]/20 text-[#9B7828] text-[10px] font-bold shrink-0">
                            {loc.iata}
                          </span>
                        )}
                        {!loc.iata && loc.province && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                              darkSurface
                                ? "bg-white/10 text-white/70"
                                : lightSurface
                                ? "bg-[#F0EFEA] text-[#55555A]"
                                : "bg-line/[0.06] text-muted"
                            }`}
                          >
                            {loc.province}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          darkSurface
                            ? "text-white/55"
                            : lightSurface
                            ? "text-[#66666B]"
                            : "text-muted"
                        }`}
                      >
                        {loc.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
