export type CurrencyCode = "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1, label: "USD ($)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)" },
  AED: { code: "AED", symbol: "AED ", rate: 3.67, label: "AED (د.إ)" },
};

export interface LocationItem {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  country: string;
  type: "airport" | "hotel" | "district" | "landmark";
  iata?: string;
  lat: number;
  lng: number;
}

export const GLOBAL_LOCATIONS: LocationItem[] = [
  {
    id: "jfk",
    name: "John F. Kennedy International Airport (JFK)",
    subtitle: "Queens, New York, NY · All Terminals & Private FBO",
    city: "New York",
    country: "United States",
    type: "airport",
    iata: "JFK",
    lat: 40.6413,
    lng: -73.7781,
  },
  {
    id: "aman-ny",
    name: "Aman New York, Fifth Avenue",
    subtitle: "730 Fifth Ave, Crown Building, Manhattan, NY",
    city: "New York",
    country: "United States",
    type: "hotel",
    lat: 40.7629,
    lng: -73.9749,
  },
  {
    id: "wall-st",
    name: "Manhattan Financial District & Wall Street",
    subtitle: "Lower Manhattan, New York, NY",
    city: "New York",
    country: "United States",
    type: "district",
    lat: 40.7074,
    lng: -74.0113,
  },
  {
    id: "east-hampton",
    name: "East Hampton Village & Private Estates",
    subtitle: "Main Street, East Hampton, Long Island, NY",
    city: "East Hampton",
    country: "United States",
    type: "landmark",
    lat: 40.9634,
    lng: -72.1848,
  },
  {
    id: "lhr",
    name: "London Heathrow Airport (LHR)",
    subtitle: "Terminals 2, 3, 4, 5 & Windsor VIP Suite, London",
    city: "London",
    country: "United Kingdom",
    type: "airport",
    iata: "LHR",
    lat: 51.47,
    lng: -0.4543,
  },
  {
    id: "claridges",
    name: "Claridge's Mayfair",
    subtitle: "Brook Street, Mayfair, London W1K 4HR",
    city: "London",
    country: "United Kingdom",
    type: "hotel",
    lat: 51.5126,
    lng: -0.1479,
  },
  {
    id: "canary-wharf",
    name: "Canary Wharf Financial Plaza",
    subtitle: "One Canada Square, London E14",
    city: "London",
    country: "United Kingdom",
    type: "district",
    lat: 51.5054,
    lng: -0.0235,
  },
  {
    id: "dxb",
    name: "Dubai International Airport (DXB)",
    subtitle: "Terminal 3 VIP & Executive Jet Al Majlis, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    type: "airport",
    iata: "DXB",
    lat: 25.2532,
    lng: 55.3657,
  },
  {
    id: "burj-al-arab",
    name: "Burj Al Arab & Jumeirah Royal Suite",
    subtitle: "Umm Suqeim 3, Jumeirah Beach Rd, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    type: "hotel",
    lat: 25.1412,
    lng: 55.1852,
  },
  {
    id: "difc",
    name: "Dubai International Financial Centre (DIFC)",
    subtitle: "Gate Village, Sheikh Zayed Road, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    type: "district",
    lat: 25.2116,
    lng: 55.2797,
  },
  {
    id: "abu-dhabi-emirates",
    name: "Emirates Palace Mandarin Oriental",
    subtitle: "West Corniche Road, Abu Dhabi",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    type: "hotel",
    lat: 24.4616,
    lng: 54.3173,
  },
  {
    id: "cdg",
    name: "Paris Charles de Gaulle Airport (CDG)",
    subtitle: "Terminals 1, 2E & Salon Paris VIP, Roissy",
    city: "Paris",
    country: "France",
    type: "airport",
    iata: "CDG",
    lat: 49.0097,
    lng: 2.5479,
  },
  {
    id: "ritz-paris",
    name: "Ritz Paris, Place Vendôme",
    subtitle: "15 Place Vendôme, 1st Arrondissement, Paris",
    city: "Paris",
    country: "France",
    type: "hotel",
    lat: 48.868,
    lng: 2.3289,
  },
  {
    id: "lax",
    name: "Los Angeles International Airport (LAX)",
    subtitle: "PS Private Suite & Tom Bradley Intl, Los Angeles, CA",
    city: "Los Angeles",
    country: "United States",
    type: "airport",
    iata: "LAX",
    lat: 33.9416,
    lng: -118.4085,
  },
  {
    id: "beverly-hills",
    name: "The Beverly Hills Hotel, Sunset Boulevard",
    subtitle: "9641 Sunset Blvd, Beverly Hills, CA 90210",
    city: "Los Angeles",
    country: "United States",
    type: "hotel",
    lat: 34.0816,
    lng: -118.4137,
  },
  {
    id: "zrh",
    name: "Zurich Airport (ZRH)",
    subtitle: "VIP Service & General Aviation Center, Zurich",
    city: "Zurich",
    country: "Switzerland",
    type: "airport",
    iata: "ZRH",
    lat: 47.4582,
    lng: 8.5555,
  },
  {
    id: "st-moritz",
    name: "Badrutt's Palace Hotel, St. Moritz",
    subtitle: "Via Serlas 27, 7500 St. Moritz, Swiss Alps",
    city: "St. Moritz",
    country: "Switzerland",
    type: "hotel",
    lat: 46.497,
    lng: 9.841,
  },
  {
    id: "sin",
    name: "Singapore Changi Airport (SIN)",
    subtitle: "JetQuay CIP Terminal & Jewel, Singapore",
    city: "Singapore",
    country: "Singapore",
    type: "airport",
    iata: "SIN",
    lat: 1.3644,
    lng: 103.9915,
  },
  {
    id: "marina-bay",
    name: "Marina Bay Sands & Raffles Singapore",
    subtitle: "10 Bayfront Avenue, Downtown Core, Singapore",
    city: "Singapore",
    country: "Singapore",
    type: "hotel",
    lat: 1.2834,
    lng: 103.8607,
  },
  {
    id: "mia",
    name: "Miami International Airport (MIA)",
    subtitle: "Concourse D–J & Signature Flight Support, Miami, FL",
    city: "Miami",
    country: "United States",
    type: "airport",
    iata: "MIA",
    lat: 25.7959,
    lng: -80.287,
  },
  {
    id: "faena-miami",
    name: "Faena Hotel & Four Seasons Surfside",
    subtitle: "3201 Collins Ave, Miami Beach, FL",
    city: "Miami",
    country: "United States",
    type: "hotel",
    lat: 25.8078,
    lng: -80.1235,
  },
];

export type FleetClassId =
  | "business"
  | "electric"
  | "first"
  | "suv"
  | "limousine";

export interface FleetClass {
  id: FleetClassId;
  name: string;
  badge: string;
  tagline: string;
  vehicles: string;
  maxPassengers: number;
  maxCarryOn: number;
  maxCheckIn: number;
  baseFareUsd: number;
  perKmUsd: number;
  hourlyRateUsd: number;
  image: string;
  cabinImage: string;
  zeroEmission?: boolean;
  flagship?: boolean;
  description: string;
  highlights: string[];
  idealFor: string[];
}

export const FLEET_CLASSES: FleetClass[] = [
  {
    id: "business",
    name: "Business Class",
    badge: "Executive Standard",
    tagline: "Refined precision for seamless executive mobility.",
    vehicles: "Mercedes-Benz E-Class, BMW 5 Series, Audi A6, or similar",
    maxPassengers: 3,
    maxCarryOn: 2,
    maxCheckIn: 2,
    baseFareUsd: 88,
    perKmUsd: 2.35,
    hourlyRateUsd: 95,
    image: "/images/fleet-business.jpg",
    cabinImage: "/images/service-corporate.jpg",
    description:
      "Our signature black executive sedan pairs whisper-quiet acoustic glass with ergonomic Nappa leather seating, complimentary high-speed Wi-Fi, and universal device charging.",
    highlights: [
      "60 minutes complimentary airport wait & live flight tracking",
      "Chilled still & sparkling artisan water in every door",
      "High-speed 5G cabin Wi-Fi & dual USB-C / Lightning chargers",
      "All taxes, tolls, fees & gratuity included upfront",
    ],
    idealFor: ["Airport Transfers", "Executive Meetings", "Point-to-Point"],
  },
  {
    id: "electric",
    name: "Electric Class",
    badge: "100% Zero Tailpipe",
    tagline: "Sustainable ultra-luxury in near-total acoustic silence.",
    vehicles: "Mercedes-Benz EQS, BMW i7, Lucid Air Touring, or similar",
    maxPassengers: 3,
    maxCarryOn: 2,
    maxCheckIn: 2,
    baseFareUsd: 102,
    perKmUsd: 2.6,
    hourlyRateUsd: 110,
    image: "/images/fleet-electric.jpg",
    cabinImage: "/images/service-interior.jpg",
    zeroEmission: true,
    description:
      "Glide silently through metropolitan centers in flagship electric limousines engineered for ESG-conscious executives who refuse to compromise on rear-seat indulgence.",
    highlights: [
      "Zero-emission electric powertrain + verified carbon-negative badge",
      "Panoramic electrochromic glass roof & HEPA air filtration",
      "Whisper-silent cabin ideal for confidential calls",
      "60 minutes complimentary airport wait & terminal Meet & Greet",
    ],
    idealFor: ["ESG Corporate Travel", "Silent Transfers", "City Commutes"],
  },
  {
    id: "first",
    name: "First Class",
    badge: "VIP Lounge Sedan",
    tagline: "Uncompromising long-wheelbase prestige for distinguished arrivals.",
    vehicles: "Mercedes-Benz S-Class LWB, BMW 7 Series, Audi A8 L, or similar",
    maxPassengers: 3,
    maxCarryOn: 2,
    maxCheckIn: 2,
    baseFareUsd: 142,
    perKmUsd: 3.45,
    hourlyRateUsd: 155,
    image: "/images/fleet-first.jpg",
    cabinImage: "/images/service-interior.jpg",
    description:
      "Make an unmistakable statement upon arrival. Featuring extended rear legroom, reclining massage seats, rear climate zones, and our highest-tenured senior chauffeurs.",
    highlights: [
      "Extended-wheelbase reclining executive lounge seats with massage",
      "Senior protocol-trained chauffeur in bespoke black attire",
      "Individual rear climate, ambient lighting & privacy sunblinds",
      "Priority VIP tarmac & five-star porte-cochère coordination",
    ],
    idealFor: ["C-Suite Roadshows", "VIP Arrivals", "Evening Dining & Galas"],
  },
  {
    id: "suv",
    name: "Business Van / SUV",
    badge: "Spacious Group Luxury",
    tagline: "Commanding presence and generous capacity for up to five guests.",
    vehicles:
      "Cadillac Escalade ESV, Mercedes-Benz V-Class, GMC Yukon Denali, or similar",
    maxPassengers: 5,
    maxCarryOn: 8,
    maxCheckIn: 5,
    baseFareUsd: 134,
    perKmUsd: 3.15,
    hourlyRateUsd: 145,
    image: "/images/fleet-suv.jpg",
    cabinImage: "/images/service-airport.jpg",
    description:
      "Designed for executive delegations, families, and ski or golf retreats requiring expansive luggage space alongside conference-style leather seating.",
    highlights: [
      "Accommodates up to 5 passengers & 5 large check-in suitcases",
      "Conference-facing or captain-chair leather seating layouts",
      "Complimentary child & booster seats available upon request",
      "Effortless curbside or terminal arrivals hall luggage assistance",
    ],
    idealFor: ["Group Airport Runs", "Family Travel", "Alpine & Golf Trips"],
  },
  {
    id: "limousine",
    name: "Royal Stretch Limousine",
    badge: "Limo Black Flagship",
    tagline: "The pinnacle of private limousine artistry — Maybach Pullman & Stretch.",
    vehicles:
      "Mercedes-Maybach S680 Pullman, Rolls-Royce Extended, Bespoke Stretch Limousine",
    maxPassengers: 6,
    maxCarryOn: 4,
    maxCheckIn: 4,
    baseFareUsd: 265,
    perKmUsd: 5.2,
    hourlyRateUsd: 275,
    image: "/images/fleet-stretch-limo.jpg",
    cabinImage: "/images/service-interior.jpg",
    flagship: true,
    description:
      "Crafted for heads of state, red-carpet galas, weddings, and milestone celebrations. Complete acoustic partition, bespoke crystal refreshment console, and white-glove chauffeur protocol.",
    highlights: [
      "Electrochromic privacy partition & starlight ambient ceiling",
      "Chilled crystal glassware console & bespoke non-alcoholic cuvée",
      "White-glove diplomatic & red-carpet protocol chauffeur",
      "Dedicated 24/7 Private Concierge desk monitoring your itinerary",
    ],
    idealFor: [
      "Weddings & Galas",
      "Red Carpet & Proms",
      "Diplomatic & Private Jet",
    ],
  },
];

export interface CityRoute {
  id: string;
  from: string;
  to: string;
  pickupFull: string;
  dropoffFull: string;
  region: "North America" | "Europe" | "Middle East";
  duration: string;
  distanceKm: number;
  distanceLabel: string;
  startingUsd: number;
  flightTimeSaved: string;
  highlight: string;
}

export const CITY_TO_CITY_ROUTES: CityRoute[] = [
  {
    id: "nyc-hamptons",
    from: "New York",
    to: "East Hampton",
    pickupFull: "Aman New York, Fifth Avenue",
    dropoffFull: "East Hampton Village & Private Estates",
    region: "North America",
    duration: "2h 25m",
    distanceKm: 168,
    distanceLabel: "104 mi · 168 km",
    startingUsd: 395,
    flightTimeSaved: "Saves 1h 45m vs heli/train transfer",
    highlight: "Weekend Coastal Sanctuary",
  },
  {
    id: "nyc-philly",
    from: "New York",
    to: "Philadelphia",
    pickupFull: "Manhattan Financial District & Wall Street",
    dropoffFull: "Rittenhouse Square, Philadelphia, PA",
    region: "North America",
    duration: "1h 50m",
    distanceKm: 152,
    distanceLabel: "95 mi · 152 km",
    startingUsd: 340,
    flightTimeSaved: "Door-to-door mobile boardroom",
    highlight: "Executive Corridor",
  },
  {
    id: "london-oxford",
    from: "London",
    to: "Oxford & Cotswolds",
    pickupFull: "Claridge's Mayfair",
    dropoffFull: "The Randolph Hotel, Beaumont St, Oxford",
    region: "Europe",
    duration: "1h 40m",
    distanceKm: 96,
    distanceLabel: "60 mi · 96 km",
    startingUsd: 265,
    flightTimeSaved: "Zero rail transfers or luggage handling",
    highlight: "Heritage & Countryside",
  },
  {
    id: "dubai-abudhabi",
    from: "Dubai",
    to: "Abu Dhabi",
    pickupFull: "Dubai International Financial Centre (DIFC)",
    dropoffFull: "Emirates Palace Mandarin Oriental",
    region: "Middle East",
    duration: "1h 15m",
    distanceKm: 138,
    distanceLabel: "86 mi · 138 km",
    startingUsd: 245,
    flightTimeSaved: "Chilled S-Class / Maybach highway cruiser",
    highlight: "Gulf Royal Express",
  },
  {
    id: "paris-reims",
    from: "Paris",
    to: "Reims (Champagne)",
    pickupFull: "Ritz Paris, Place Vendôme",
    dropoffFull: "Domaine Les Crayères, Reims, Champagne",
    region: "Europe",
    duration: "1h 55m",
    distanceKm: 144,
    distanceLabel: "89 mi · 144 km",
    startingUsd: 355,
    flightTimeSaved: "Private vineyard-to-door luxury",
    highlight: "Grand Cru Vineyard Route",
  },
  {
    id: "zurich-stmoritz",
    from: "Zurich",
    to: "St. Moritz",
    pickupFull: "Zurich Airport (ZRH)",
    dropoffFull: "Badrutt's Palace Hotel, St. Moritz",
    region: "Europe",
    duration: "2h 50m",
    distanceKm: 204,
    distanceLabel: "127 mi · 204 km",
    startingUsd: 540,
    flightTimeSaved: "All-wheel-drive alpine ski-equipped fleet",
    highlight: "Swiss Alpine Transfer",
  },
  {
    id: "la-palmsprings",
    from: "Los Angeles",
    to: "Palm Springs",
    pickupFull: "The Beverly Hills Hotel, Sunset Boulevard",
    dropoffFull: "Parker Palm Springs, E Palm Canyon Dr",
    region: "North America",
    duration: "2h 10m",
    distanceKm: 178,
    distanceLabel: "110 mi · 178 km",
    startingUsd: 385,
    flightTimeSaved: "Skip LAX queues — depart on your schedule",
    highlight: "Desert Retreat",
  },
  {
    id: "nice-sttropez",
    from: "Nice Airport",
    to: "Saint-Tropez",
    pickupFull: "Nice Côte d'Azur Airport (NCE) VIP Terminal",
    dropoffFull: "Cheval Blanc St-Tropez, Plage de la Bouillabaisse",
    region: "Europe",
    duration: "1h 40m",
    distanceKm: 112,
    distanceLabel: "70 mi · 112 km",
    startingUsd: 330,
    flightTimeSaved: "Direct Riviera coastal arrival",
    highlight: "French Riviera",
  },
];

export interface ServiceDetail {
  slug: "airport-transfers" | "hourly" | "city-to-city" | "limousine";
  eyebrow: string;
  title: string;
  headline: string;
  subtitle: string;
  heroImage: string;
  defaultTab: "oneway" | "hourly";
  stats: { value: string; label: string }[];
  pillars: { title: string; description: string }[];
  occasions: { title: string; description: string }[];
}

export const SERVICES_DATA: Record<ServiceDetail["slug"], ServiceDetail> = {
  "airport-transfers": {
    slug: "airport-transfers",
    eyebrow: "Global Airport Chauffeur & FBO Service",
    title: "Airport Transfers",
    headline: "Smooth landings, every single time.",
    subtitle:
      "Real-time satellite flight telemetry, 60 minutes of complimentary arrival wait time, and a tailored chauffeur greeting you inside arrivals with a personalized digital nameboard.",
    heroImage: "/images/service-airport.jpg",
    defaultTab: "oneway",
    stats: [
      { value: "60 Min", label: "Complimentary Wait Time" },
      { value: "1,200+", label: "Commercial & Private FBO Airports" },
      { value: "99.94%", label: "On-Time Arrival Precision" },
      { value: "1 Hour", label: "Prior Free Cancellation" },
    ],
    pillars: [
      {
        title: "Automatic Flight Telemetry Adjustment",
        description:
          "Enter your commercial flight number or private tail code once. Whether your aircraft touches down 35 minutes early or faces a 3-hour transatlantic delay, your chauffeur adjusts automatically at zero extra charge.",
      },
      {
        title: "Bespoke Inside-Terminal Meet & Greet",
        description:
          "Step past customs to find your chauffeur waiting with an illuminated Limo Black tablet displaying your preferred title, ready to escort you and handle every piece of luggage to the waiting car.",
      },
      {
        title: "Guaranteed Fixed All-Inclusive Rates",
        description:
          "Airport parking fees, congestion tolls, taxes, and chauffeur gratuity are locked in at booking. Traffic delays never inflate your fare.",
      },
    ],
    occasions: [
      {
        title: "Commercial First & Business Arrivals",
        description:
          "Seamless baggage-claim pickup across Heathrow, JFK, DXB, CDG, Changi, LAX, and 500+ global hubs.",
      },
      {
        title: "Private Aviation & FBO Tarmac",
        description:
          "Direct planeside coordination with Signature, Jetex, Farnborough, Teterboro, and Le Bourget.",
      },
      {
        title: "Early-Morning Red-Eye Departures",
        description:
          "Guaranteed pre-scheduled dispatch with chauffeur details sent via SMS 60 minutes prior.",
      },
    ],
  },
  hourly: {
    slug: "hourly",
    eyebrow: "Dedicated Standby Limousine & Chauffeur",
    title: "Hourly & Full-Day Hire",
    headline: "Seize the day with a chauffeur on standby.",
    subtitle:
      "Reserve a private limousine and senior chauffeur from 2 to 24 hours. Leave your briefcase or eveningwear safely inside while your car waits steps from every doorway.",
    heroImage: "/images/service-chauffeur.jpg",
    defaultTab: "hourly",
    stats: [
      { value: "2 – 24h", label: "Flexible Standby Duration" },
      { value: "40 km/h", label: "Generous Distance Included" },
      { value: "Unlimited", label: "In-City Stops & Detours" },
      { value: "Zero", label: "Parking or Hail Wait Stress" },
    ],
    pillars: [
      {
        title: "Dynamic Fluid Itineraries",
        description:
          "Meetings run late, dinner venues change, spontaneous gallery visits arise. Direct your chauffeur in real time without ever opening a ride-hail app.",
      },
      {
        title: "Your Private Sanctuary Between Stops",
        description:
          "Keep shopping bags, confidential pitch decks, or gala attire securely inside a climate-controlled cabin maintained at your exact preferred temperature.",
      },
      {
        title: "Consistent Chauffeur All Day",
        description:
          "Build rapport with a single vetted local professional fluent in English and discreet diplomatic etiquette throughout your entire engagement.",
      },
    ],
    occasions: [
      {
        title: "Financial Roadshows & Board Days",
        description:
          "Back-to-back institutional meetings across Mayfair, Canary Wharf, Midtown, or DIFC with zero lost minutes.",
      },
      {
        title: "Luxury Boutique & Couture Shopping",
        description:
          "Door-to-door drops on Avenue Montaigne, Bond Street, Fifth Avenue, or Via Montenapoleone.",
      },
      {
        title: "Concerts, Stadium Suites & Opera Nights",
        description:
          "Bypass post-event gridlock — your chauffeur waits in the VIP staging lane ready to depart immediately.",
      },
    ],
  },
  "city-to-city": {
    slug: "city-to-city",
    eyebrow: "Intercity Private Executive Corridors",
    title: "City-to-City Rides",
    headline: "Between cities, elevated beyond short-haul flights.",
    subtitle:
      "Replace airport security queues, rail strikes, and cramped transfers with uninterrupted door-to-door serenity in a flagship limousine.",
    heroImage: "/images/service-corporate.jpg",
    defaultTab: "oneway",
    stats: [
      { value: "350+", label: "Curated Intercity Corridors" },
      { value: "1 Step", label: "Doorstep to Doorstep" },
      { value: "Per Car", label: "Pricing — Never Per Seat" },
      { value: "100%", label: "Carbon-Offset Journeys" },
    ],
    pillars: [
      {
        title: "Reclaim Productive & Restorative Hours",
        description:
          "Turn a 200-kilometer regional hop into uninterrupted focus time with 5G Wi-Fi, ergonomic reclining seats, and total acoustic privacy.",
      },
      {
        title: "Pay Per Limousine, Not Per Ticket",
        description:
          "Travel with up to 3–6 colleagues or family members and full luggage capacity for one transparent vehicle rate.",
      },
      {
        title: "Depart on Your Exact Clock",
        description:
          "Morning meeting wraps 40 minutes early? Message concierge to bring your departure forward, or cancel free up to 1 hour before pickup.",
      },
    ],
    occasions: [
      {
        title: "Executive Regional Shuttles",
        description:
          "New York ↔ Philadelphia, London ↔ Oxford, Dubai ↔ Abu Dhabi, Frankfurt ↔ Zurich.",
      },
      {
        title: "Alpine Ski & Coastal Retreats",
        description:
          "Zurich ↔ St. Moritz, Geneva ↔ Courchevel, Manhattan ↔ East Hampton, Nice ↔ Saint-Tropez.",
      },
      {
        title: "Vineyard & Gastronomy Tours",
        description:
          "Paris ↔ Reims Champagne, San Francisco ↔ Napa Valley, Milan ↔ Lake Como.",
      },
    ],
  },
  limousine: {
    slug: "limousine",
    eyebrow: "Maybach Pullman, Rolls-Royce & Stretch Limousines",
    title: "Royal Limousine & Events",
    headline: "Unforgettable arrivals for life's defining occasions.",
    subtitle:
      "From red-carpet premieres and black-tie weddings to diplomatic summits, experience the flagship fleet that gives Limo Black its name.",
    heroImage: "/images/fleet-stretch-limo.jpg",
    defaultTab: "hourly",
    stats: [
      { value: "Maybach", label: "& Stretch Flagship Fleet" },
      { value: "6 Guests", label: "Rear Lounge Capacity" },
      { value: "24/7", label: "Dedicated Event Concierge" },
      { value: "5.0 ★", label: "VIP Protocol Rating" },
    ],
    pillars: [
      {
        title: "True Extended-Wheelbase & Stretch Coachwork",
        description:
          "Select our Royal Stretch Limousine class for whisper-quiet acoustic partitions, starlight headliners, face-to-face lounge seating, and crystal beverage consoles.",
      },
      {
        title: "White-Glove Event Coordination",
        description:
          "Our special events desk coordinates directly with wedding planners, venue security, and FBO tarmac marshals so every entrance unfolds to the second.",
      },
      {
        title: "Bespoke Cabin Staging",
        description:
          "Pre-select cabin temperature, floral ribbons, chilled non-alcoholic vintage sparkling cuvées, and custom music playlists before stepping aboard.",
      },
    ],
    occasions: [
      {
        title: "Black-Tie Weddings & Anniversaries",
        description:
          "Immaculately detailed obsidian limousines with white-gloved chauffeurs and bridal party SUV escorts.",
      },
      {
        title: "Film Galas, Fashion Weeks & Proms",
        description:
          "Show-stopping red-carpet arrivals in Paris, Milan, New York, London, Cannes, and Los Angeles.",
      },
      {
        title: "Heads of State & Royal Delegations",
        description:
          "Multi-vehicle convoy coordination with NDA-bound protocol chauffeurs.",
      },
    ],
  },
};

export interface ClientReview {
  id: string;
  author: string;
  role: string;
  route: string;
  category: "Airport Transfers" | "Stretch Limousine" | "Corporate" | "City-to-City";
  rating: number;
  date: string;
  title: string;
  quote: string;
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: "r1",
    author: "Alexander Sterling",
    role: "Managing Partner, Private Equity",
    route: "JFK Terminal 4 → Aman New York",
    category: "Airport Transfers",
    rating: 5,
    date: "2 days ago",
    title: "Flawless touchdown despite a 2-hour Atlantic delay",
    quote:
      "My BA flight out of Heathrow landed nearly two hours behind schedule. Before my wheels even stopped taxiing, I had an SMS from my Limo Black chauffeur, Marcus, confirming he was waiting outside customs with an S-Class cooled to 20°C.",
  },
  {
    id: "r2",
    author: "Camille Laurent-Vasseur",
    role: "Creative Director, Haute Joaillerie",
    route: "Ritz Paris → Palais Garnier Gala",
    category: "Stretch Limousine",
    rating: 5,
    date: "5 days ago",
    title: "The Maybach Pullman exceeded every expectation",
    quote:
      "We reserved two Royal Stretch Limousines and three First Class sedans for our autumn high-jewelry unveiling in Paris. Every vehicle gleamed like black glass, and the white-glove protocol was worthy of a state visit.",
  },
  {
    id: "r3",
    author: "Tariq Al-Mansoor",
    role: "VP Global Operations",
    route: "DIFC Dubai ↔ Emirates Palace Abu Dhabi",
    category: "City-to-City",
    rating: 5,
    date: "1 week ago",
    title: "Our mobile boardroom between Dubai and Abu Dhabi",
    quote:
      "Using Limo Black City-to-City twice weekly has transformed how I work. High-speed Wi-Fi, complete silence in the rear lounge, and never a dirham of surprise charges.",
  },
  {
    id: "r4",
    author: "Eleanor Vance-Kerr",
    role: "Head of Executive Travel, FinTech",
    route: "London Canary Wharf · 45+ Monthly Rides",
    category: "Corporate",
    rating: 5,
    date: "1 week ago",
    title: "Consolidated 14 global offices onto one platform",
    quote:
      "Before Limo Black, booking reliable black cars across Tokyo, Zurich, London, and New York meant juggling six local vendors. Now our EAs book in 20 seconds with consolidated monthly ESG reporting.",
  },
  {
    id: "r5",
    author: "Dr. Jonathan & Sophia Meyer",
    role: "Private Clients",
    route: "Zurich Airport (ZRH) → St. Moritz",
    category: "City-to-City",
    rating: 5,
    date: "2 weeks ago",
    title: "Effortless winter alpine transfer with all ski gear",
    quote:
      "Four suitcases, two ski bags, and two tired children after an overnight flight — our Escalade ESV chauffeur handled everything with warmth, precision, and smooth mountain driving.",
  },
  {
    id: "r6",
    author: "Victoria Chen",
    role: "Senior Event Producer",
    route: "Beverly Hills · 10-Hour Standby",
    category: "Stretch Limousine",
    rating: 5,
    date: "3 weeks ago",
    title: "Award-season perfection from afternoon fittings to afterparty",
    quote:
      "Having our dedicated Stretch Limousine on 10-hour standby meant zero stress across four venues. Chilled Perrier, phone chargers, and instant curbside pickup the second we texted.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "What makes Limo Black different from standard ride-hailing apps?",
    answer:
      "Unlike on-demand ride-hail networks with surge pricing and variable vehicle quality, every Limo Black reservation guarantees a late-model obsidian luxury vehicle, a vetted career chauffeur in bespoke attire, fixed all-inclusive pricing locked at booking, 60 minutes of complimentary airport wait time, and customizable cabin preferences.",
  },
  {
    question: "How does airport flight tracking and complimentary wait time work?",
    answer:
      "Simply provide your commercial flight number or private aviation tail number during booking. Our dispatch telemetry monitors your flight in real time and automatically adjusts your pickup time for early arrivals or delays. You enjoy 60 full minutes of complimentary wait time from actual touchdown (15 minutes for non-airport pickups).",
  },
  {
    question: "What is your cancellation and modification policy?",
    answer:
      "Plans evolve — which is why you can modify pickup details or cancel any one-way or hourly booking completely free of charge up until 1 hour before your scheduled pickup time directly from our Manage Rides portal.",
  },
  {
    question: "Are taxes, highway tolls, and chauffeur gratuity included in the fare?",
    answer:
      "Yes, 100%. The price displayed when you select your vehicle class is the exact final price you pay. All airport fees, congestion charges, highway tolls, taxes, and chauffeur gratuity are included upfront — you never need cash or tip calculations.",
  },
  {
    question: "When do I receive my chauffeur's name and vehicle license plate?",
    answer:
      "Once your booking is confirmed, you receive an immediate itinerary receipt. Exactly 60 minutes prior to pickup, we send your chauffeur's full name, direct mobile number, portrait badge, vehicle make/model, and registration plate via email and SMS.",
  },
  {
    question: "Can I book a Royal Stretch Limousine or multi-car fleet for weddings and corporate events?",
    answer:
      "Absolutely. You can reserve our Royal Stretch Limousine (Mercedes-Maybach Pullman / Executive Stretch) directly online for point-to-point or 2-to-24-hour standby, or connect with our 24/7 Special Events & Corporate Concierge for coordinated multi-vehicle convoys.",
  },
];

export const GLOBAL_CITIES_DIRECTORY: Record<string, string[]> = {
  "North America": [
    "New York",
    "Los Angeles",
    "Miami",
    "Chicago",
    "San Francisco",
    "Boston",
    "Dallas",
    "Toronto",
    "Las Vegas",
    "Washington D.C.",
  ],
  Europe: [
    "London",
    "Paris",
    "Zurich",
    "Milan",
    "Geneva",
    "Munich",
    "Monaco",
    "Madrid",
    "Amsterdam",
    "Vienna",
  ],
  "Middle East": [
    "Dubai",
    "Abu Dhabi",
    "Riyadh",
    "Doha",
    "Jeddah",
    "Muscat",
    "Kuwait City",
    "Manama",
  ],
  "Asia-Pacific": [
    "Singapore",
    "Tokyo",
    "Hong Kong",
    "Sydney",
    "Seoul",
    "Melbourne",
    "Bangkok",
    "Osaka",
  ],
};

/**
 * Estimates realistic driving distance (km) and travel duration (minutes)
 * from pickup & dropoff strings, matching known locations or computing smart deterministic distances.
 */
export function estimateRouteMetrics(
  pickup: string,
  dropoff: string
): { distanceKm: number; durationMin: number; isAirport: boolean } {
  const pLower = pickup.toLowerCase();
  const dLower = dropoff.toLowerCase();

  const isAirport =
    pLower.includes("airport") ||
    dLower.includes("airport") ||
    /\b(jfk|lhr|dxb|cdg|lax|zrh|sin|mia|ord|nce)\b/i.test(
      `${pickup} ${dropoff}`
    );

  // Check if matches any curated city-to-city route
  const matchedRoute = CITY_TO_CITY_ROUTES.find(
    (r) =>
      (pLower.includes(r.from.toLowerCase()) &&
        dLower.includes(r.to.toLowerCase())) ||
      (pLower.includes(r.pickupFull.toLowerCase().slice(0, 12)) &&
        dLower.includes(r.dropoffFull.toLowerCase().slice(0, 12)))
  );

  if (matchedRoute) {
    const hMatch = matchedRoute.duration.match(/(\d+)h/);
    const mMatch = matchedRoute.duration.match(/(\d+)m/);
    const mins =
      (hMatch ? parseInt(hMatch[1], 10) * 60 : 0) +
      (mMatch ? parseInt(mMatch[1], 10) : 0);
    return {
      distanceKm: matchedRoute.distanceKm,
      durationMin: mins || 110,
      isAirport,
    };
  }

  // Match coordinates from GLOBAL_LOCATIONS
  const locA = GLOBAL_LOCATIONS.find(
    (l) =>
      l.name.toLowerCase() === pLower ||
      pLower.includes(l.name.toLowerCase().slice(0, 14))
  );
  const locB = GLOBAL_LOCATIONS.find(
    (l) =>
      l.name.toLowerCase() === dLower ||
      dLower.includes(l.name.toLowerCase().slice(0, 14))
  );

  if (locA && locB && locA.id !== locB.id) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(locB.lat - locA.lat);
    const dLng = toRad(locB.lng - locA.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(locA.lat)) *
        Math.cos(toRad(locB.lat)) *
        Math.sin(dLng / 2) ** 2;
    const straightKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Cap intercontinental combinations gracefully so demo fares always stay realistic
    if (straightKm > 600) {
      return { distanceKm: 42, durationMin: 48, isAirport };
    }
    const roadKm = Math.max(12, Math.round(straightKm * 1.28));
    const durationMin = Math.max(22, Math.round((roadKm / 52) * 60 + 12));
    return { distanceKm: roadKm, durationMin, isAirport };
  }

  // Deterministic fallback hash for custom user addresses
  const combined = `${pickup}-${dropoff}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 1000;
  }
  const distanceKm = 24 + (hash % 45);
  const durationMin = Math.round((distanceKm / 46) * 60 + 14);
  return { distanceKm, durationMin, isAirport };
}

export function calculateClassPriceUsd(
  fleetClass: FleetClass,
  rideType: "oneway" | "hourly",
  distanceKm: number,
  durationHours: number
): number {
  if (rideType === "hourly") {
    // Slight volume privilege for 6+ hours
    const multiplier = durationHours >= 8 ? 0.92 : durationHours >= 5 ? 0.96 : 1;
    return Math.round(fleetClass.hourlyRateUsd * durationHours * multiplier);
  }
  return Math.round(fleetClass.baseFareUsd + distanceKm * fleetClass.perKmUsd);
}
