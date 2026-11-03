# Limo Black — Global Private Limousine & Chauffeur Service

A fully animated, luxury global limousine & private chauffeur booking web application inspired by Blacklane and crafted with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **Framer Motion**.

## Key Features

- **Interactive Global Booking Engine** (`One Way` & `By the Hour` 2–24h standby) with smart airport/hotel/district autocomplete, IATA airport detection (`60m free wait & flight tracking`), live Haversine distance/duration estimation, and multi-currency conversion (`USD`, `EUR`, `GBP`, `AED`).
- **4-Step Reservation Checkout (`/book`)**:
  1. **Service Class Selection**: *Business Class*, *Electric Class (Zero-Emission)*, *First Class*, *Business Van/SUV*, and flagship *Royal Stretch Limousine (Maybach Pullman)*.
  2. **Pickup Protocol & Bespoke Cabin Staging**: Flight telemetry input, live illuminated **Meet & Greet Digital Tablet Nameboard** preview, and personalized cabin climate, etiquette, and refreshment staging.
  3. **Guest & Executive Checkout**: Interactive Obsidian Metal Card preview, Corporate Invoice & Express Pay options, plus Privilege Code (`LIMOBLACK15` for 15% off).
  4. **Instant Confirmation & Itinerary**: Generates a persistent booking reference (`LB-XXXXXX`), assigns a senior chauffeur, and supports printable receipts + return trip booking.
- **Manage Rides & Live Chauffeur Telemetry (`/bookings`)**: Lookup reservations, simulate live chauffeur dispatch stages, view digital pickup signs, or cancel free of charge.
- **Dedicated Pages**:
  - `/fleet` — Complete 5-class fleet showcase + interactive **Party & Luggage Fit Calculator**.
  - `/services/airport-transfers`, `/services/hourly`, `/services/city-to-city` (with interactive 1-Step vs 7-Step Short-Haul Flight diagram), and `/services/limousine`.
  - `/business` — Corporate travel, GDS agencies, and interactive **Enterprise Spend & Time-Saved Estimator**.
  - `/chauffeurs` — Fleet Partner onboarding + interactive **Monthly Partner Settlement Calculator**.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Framework Preset is automatically detected as **Next.js** (`npm run build`). Click **Deploy** — zero environment variables required!
