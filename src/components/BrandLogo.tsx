"use client";

import React from "react";
import { useBooking } from "@/context/BookingContext";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "auto" | "dark" | "light" | "mark";
  className?: string;
  showCanadaBadge?: boolean;
}

/**
 * Renders the official `/ LIMOBLACK` wordmark (aspect ratio 1683:178 ≈ 9.45:1)
 * with true alpha transparency and automatic Light / Dark Mode adaptation.
 */
export default function BrandLogo({
  size = "md",
  variant = "auto",
  className = "",
  showCanadaBadge = false,
}: BrandLogoProps) {
  const { theme } = useBooking();

  if (variant === "mark") {
    return (
      <img
        src="/images/limoblack-mark.png"
        alt="LimoBlack"
        className={`w-9 h-9 rounded-xl object-contain border border-champagne-500/35 shadow-sm select-none ${className}`}
      />
    );
  }

  // On dark backgrounds use white+gold wordmark; on light backgrounds use obsidian+gold wordmark
  const useDarkWordmark =
    variant === "dark" || (variant === "auto" && theme === "dark");

  const heightClasses =
    size === "sm"
      ? "h-[18px] sm:h-[20px]"
      : size === "lg"
      ? "h-[24px] sm:h-[28px]"
      : "h-[20px] sm:h-[23px] xl:h-[25px]";

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <img
        src={
          useDarkWordmark
            ? "/images/limoblack-logo-dark.png"
            : "/images/limoblack-logo-light.png"
        }
        alt="LimoBlack Canada"
        width={220}
        height={24}
        className={`${heightClasses} w-auto object-contain shrink-0 transition-opacity duration-200`}
      />
      {showCanadaBadge && (
        <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-champagne-500/15 border border-champagne-500/35 text-[9px] font-bold tracking-[0.16em] text-accent uppercase leading-none">
          CA
        </span>
      )}
    </span>
  );
}
