export type CurrencyCode = "CAD" | "USD";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to base CAD
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  CAD: { code: "CAD", symbol: "CA$", rate: 1, label: "CAD ($)" },
  USD: { code: "USD", symbol: "US$", rate: 0.73, label: "USD ($)" },
};

export interface LocationItem {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  province: string;
  country: string;
  type: "airport" | "hotel" | "district" | "landmark" | "address";
  iata?: string;
  lat: number;
  lng: number;
}

export const GLOBAL_LOCATIONS: LocationItem[] = [
  // TORONTO & ONTARIO
  {
    id: "yyz",
    name: "Toronto Pearson International Airport (YYZ)",
    subtitle: "6301 Silver Dart Dr, Mississauga, ON L5P 1B2 · Terminals 1, 3 & FBO",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "airport",
    iata: "YYZ",
    lat: 43.6777,
    lng: -79.6248,
  },
  {
    id: "ytz",
    name: "Billy Bishop Toronto City Airport (YTZ)",
    subtitle: "2 Eireann Quay, Waterfront, Toronto, ON M5V 1A1",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "airport",
    iata: "YTZ",
    lat: 43.6285,
    lng: -79.396,
  },
  {
    id: "royal-york",
    name: "Fairmont Royal York Hotel",
    subtitle: "100 Front St W, Downtown Toronto, ON M5J 1E3",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "hotel",
    lat: 43.6456,
    lng: -79.3814,
  },
  {
    id: "four-seasons-toronto",
    name: "Four Seasons Hotel Toronto at Yorkville",
    subtitle: "60 Yorkville Ave, Yorkville, Toronto, ON M4W 0A4",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "hotel",
    lat: 43.6716,
    lng: -79.3897,
  },
  {
    id: "ritz-toronto",
    name: "The Ritz-Carlton, Toronto",
    subtitle: "181 Wellington St W, Entertainment District, Toronto, ON M5V 3G7",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "hotel",
    lat: 43.6453,
    lng: -79.3872,
  },
  {
    id: "bay-street",
    name: "Bay Street Financial District (First Canadian Place)",
    subtitle: "100 King St W, Toronto, ON M5X 1A9",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "district",
    lat: 43.6487,
    lng: -79.3817,
  },
  {
    id: "scotiabank-arena",
    name: "Scotiabank Arena & Union Station VIP Gate",
    subtitle: "40 Bay St, Toronto, ON M5J 2X2",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    type: "landmark",
    lat: 43.6435,
    lng: -79.3791,
  },
  {
    id: "niagara-falls",
    name: "Niagara Falls & Niagara-on-the-Lake Wine Estates",
    subtitle: "6650 Niagara Pkwy, Niagara Falls, ON L2G 0L0",
    city: "Niagara Falls",
    province: "ON",
    country: "Canada",
    type: "landmark",
    lat: 43.0828,
    lng: -79.0763,
  },
  {
    id: "muskoka",
    name: "JW Marriott The Rosseau Muskoka Resort & Spa",
    subtitle: "1050 Paignton House Rd, Minett, Muskoka, ON P0B 1G0",
    city: "Muskoka",
    province: "ON",
    country: "Canada",
    type: "hotel",
    lat: 45.1462,
    lng: -79.6223,
  },

  // VANCOUVER, WHISTLER & BC
  {
    id: "yvr",
    name: "Vancouver International Airport (YVR)",
    subtitle: "3211 Grant McConachie Way, Richmond, BC V7B 0A4 · Main & South FBO",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    type: "airport",
    iata: "YVR",
    lat: 49.1967,
    lng: -123.1815,
  },
  {
    id: "pacific-rim",
    name: "Fairmont Pacific Rim, Coal Harbour",
    subtitle: "1038 Canada Pl, Downtown Vancouver, BC V6C 0B9",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    type: "hotel",
    lat: 49.2882,
    lng: -123.1165,
  },
  {
    id: "rosewood-georgia",
    name: "Rosewood Hotel Georgia",
    subtitle: "801 W Georgia St, Vancouver, BC V6C 1P7",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    type: "hotel",
    lat: 49.2836,
    lng: -123.1188,
  },
  {
    id: "whistler-fs",
    name: "Four Seasons Resort & Residences Whistler",
    subtitle: "4591 Blackcomb Way, Whistler, BC V8E 0Y4",
    city: "Whistler",
    province: "BC",
    country: "Canada",
    type: "hotel",
    lat: 50.1163,
    lng: -122.9486,
  },
  {
    id: "yyj",
    name: "Victoria International Airport (YYJ) & Empress Hotel",
    subtitle: "1640 Electra Blvd, Sidney, Victoria, BC V8L 5V4",
    city: "Victoria",
    province: "BC",
    country: "Canada",
    type: "airport",
    iata: "YYJ",
    lat: 48.6469,
    lng: -123.4258,
  },
  {
    id: "ylw",
    name: "Kelowna International Airport (YLW)",
    subtitle: "5533 Airport Way, Kelowna, Okanagan Valley, BC V1V 1S1",
    city: "Kelowna",
    province: "BC",
    country: "Canada",
    type: "airport",
    iata: "YLW",
    lat: 49.9561,
    lng: -119.3778,
  },

  // MONTRÉAL, QUÉBEC CITY & QUÉBEC
  {
    id: "yul",
    name: "Montréal–Pierre Elliott Trudeau International Airport (YUL)",
    subtitle: "975 Roméo-Vachon Blvd N, Dorval, QC H4Y 1H1",
    city: "Montréal",
    province: "QC",
    country: "Canada",
    type: "airport",
    iata: "YUL",
    lat: 45.4657,
    lng: -73.7455,
  },
  {
    id: "ritz-montreal",
    name: "The Ritz-Carlton, Montréal",
    subtitle: "1228 Sherbrooke St W, Golden Square Mile, Montréal, QC H3G 1H6",
    city: "Montréal",
    province: "QC",
    country: "Canada",
    type: "hotel",
    lat: 45.4998,
    lng: -73.5784,
  },
  {
    id: "mont-tremblant",
    name: "Fairmont Tremblant, Mont-Tremblant Village",
    subtitle: "3045 Chemin de la Chapelle, Mont-Tremblant, QC J8E 1E1",
    city: "Mont-Tremblant",
    province: "QC",
    country: "Canada",
    type: "hotel",
    lat: 46.2125,
    lng: -74.5844,
  },
  {
    id: "chateau-frontenac",
    name: "Fairmont Le Château Frontenac, Old Québec",
    subtitle: "1 Rue des Carrières, Québec City, QC G1R 4P5",
    city: "Québec City",
    province: "QC",
    country: "Canada",
    type: "hotel",
    lat: 46.8119,
    lng: -71.2052,
  },
  {
    id: "yqb",
    name: "Québec City Jean Lesage International Airport (YQB)",
    subtitle: "505 Rue Principale, Québec City, QC G2G 0J4",
    city: "Québec City",
    province: "QC",
    country: "Canada",
    type: "airport",
    iata: "YQB",
    lat: 46.7911,
    lng: -71.3933,
  },

  // CALGARY, BANFF, EDMONTON & ALBERTA
  {
    id: "yyc",
    name: "Calgary International Airport (YYC)",
    subtitle: "2000 Airport Rd NE, Calgary, AB T2E 6W5 · Domestic & Intl Terminals",
    city: "Calgary",
    province: "AB",
    country: "Canada",
    type: "airport",
    iata: "YYC",
    lat: 51.1215,
    lng: -114.0076,
  },
  {
    id: "calgary-core",
    name: "Downtown Calgary Financial Core (Brookfield Place)",
    subtitle: "225 6 Ave SW, Calgary, AB T2P 1N2",
    city: "Calgary",
    province: "AB",
    country: "Canada",
    type: "district",
    lat: 51.0478,
    lng: -114.0669,
  },
  {
    id: "banff-springs",
    name: "Fairmont Banff Springs & Lake Louise",
    subtitle: "405 Spray Ave, Banff National Park, AB T1L 1J4",
    city: "Banff",
    province: "AB",
    country: "Canada",
    type: "hotel",
    lat: 51.1644,
    lng: -115.5618,
  },
  {
    id: "yeg",
    name: "Edmonton International Airport (YEG)",
    subtitle: "1000 Airport Rd, Edmonton Metropolitan Region, AB T9E 0V3",
    city: "Edmonton",
    province: "AB",
    country: "Canada",
    type: "airport",
    iata: "YEG",
    lat: 53.3097,
    lng: -113.5797,
  },

  // OTTAWA, HALIFAX & WINNIPEG
  {
    id: "yow",
    name: "Ottawa Macdonald–Cartier International Airport (YOW)",
    subtitle: "1000 Airport Pkwy Private, Ottawa, ON K1V 9B4",
    city: "Ottawa",
    province: "ON",
    country: "Canada",
    type: "airport",
    iata: "YOW",
    lat: 45.3225,
    lng: -75.6692,
  },
  {
    id: "chateau-laurier",
    name: "Fairmont Château Laurier & Parliament Hill",
    subtitle: "1 Rideau St, Downtown Ottawa, ON K1N 8S7",
    city: "Ottawa",
    province: "ON",
    country: "Canada",
    type: "hotel",
    lat: 45.4256,
    lng: -75.6924,
  },
  {
    id: "yhz",
    name: "Halifax Stanfield International Airport (YHZ)",
    subtitle: "1 Bell Blvd, Enfield, Halifax, NS B2T 1K2",
    city: "Halifax",
    province: "NS",
    country: "Canada",
    type: "airport",
    iata: "YHZ",
    lat: 44.8808,
    lng: -63.5086,
  },
  {
    id: "ywg",
    name: "Winnipeg Richardson International Airport (YWG)",
    subtitle: "2000 Wellington Ave, Winnipeg, MB R3H 1C2",
    city: "Winnipeg",
    province: "MB",
    country: "Canada",
    type: "airport",
    iata: "YWG",
    lat: 49.91,
    lng: -97.2399,
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
  baseFareCad: number;
  perKmCad: number;
  hourlyRateCad: number;
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
    badge: "Canadian Executive Standard",
    tagline: "All-wheel-drive precision for seamless metropolitan travel.",
    vehicles: "Mercedes-Benz E-Class 4MATIC, BMW 5 Series xDrive, Audi A6, or similar",
    maxPassengers: 3,
    maxCarryOn: 2,
    maxCheckIn: 2,
    baseFareCad: 110,
    perKmCad: 2.75,
    hourlyRateCad: 120,
    image: "/images/fleet-business.jpg",
    cabinImage: "/images/service-corporate.jpg",
    description:
      "Engineered for year-round Canadian conditions with 4MATIC / xDrive all-wheel drive, heated Nappa leather seating, high-speed Bell/Rogers 5G cabin Wi-Fi, and universal device charging.",
    highlights: [
      "60 minutes complimentary airport wait at YYZ, YVR, YUL, YYC & all Canadian hubs",
      "Heated rear leather seats & winter-rated touring tires",
      "High-speed 5G cabin Wi-Fi & dual USB-C / Lightning chargers",
      "All HST/GST taxes, 407 ETR highway tolls & gratuity included upfront",
    ],
    idealFor: ["Airport Transfers", "Bay Street Meetings", "Point-to-Point"],
  },
  {
    id: "electric",
    name: "Electric Class",
    badge: "100% Zero Tailpipe",
    tagline: "Sustainable Canadian ultra-luxury in near-total silence.",
    vehicles: "Mercedes-Benz EQS 580 4MATIC, BMW i7 xDrive60, Lucid Air, or similar",
    maxPassengers: 3,
    maxCarryOn: 2,
    maxCheckIn: 2,
    baseFareCad: 128,
    perKmCad: 3.05,
    hourlyRateCad: 138,
    image: "/images/fleet-electric.jpg",
    cabinImage: "/images/service-interior.jpg",
    zeroEmission: true,
    description:
      "Glide silently through Toronto, Vancouver, Montréal, and Ottawa in dual-motor all-wheel-drive electric limousines crafted for ESG-conscious Canadian executives.",
    highlights: [
      "Zero-emission AWD electric powertrain powered by clean Canadian grid",
      "Pre-conditioned warm cabin & panoramic electrochromic glass roof",
      "Whisper-silent rear lounge ideal for confidential calls",
      "60 minutes complimentary airport wait & inside-terminal Meet & Greet",
    ],
    idealFor: ["ESG Corporate Travel", "Silent Transfers", "Urban Commutes"],
  },
  {
    id: "first",
    name: "First Class",
    badge: "VIP Lounge Sedan",
    tagline: "Uncompromising long-wheelbase prestige for distinguished arrivals.",
    vehicles: "Mercedes-Benz S580 4MATIC LWB, BMW 760i xDrive, Audi A8 L, or similar",
    maxPassengers: 3,
    maxCarryOn: 2,
    maxCheckIn: 2,
    baseFareCad: 175,
    perKmCad: 4.1,
    hourlyRateCad: 190,
    image: "/images/fleet-first.jpg",
    cabinImage: "/images/service-interior.jpg",
    description:
      "Make an unmistakable statement from Yorkville to Coal Harbour. Extended rear legroom, heated reclining massage seats, and senior protocol-vetted Canadian chauffeurs.",
    highlights: [
      "Extended-wheelbase reclining executive lounge seats with hot-stone massage",
      "Bilingual (English/French available) senior chauffeur in bespoke black attire",
      "Individual rear climate zones, ambient lighting & privacy sunblinds",
      "Priority VIP FBO tarmac (Skyservice / Signature) coordination",
    ],
    idealFor: ["C-Suite Roadshows", "TIFF & Gala Arrivals", "Diplomatic Travel"],
  },
  {
    id: "suv",
    name: "Business Van / SUV",
    badge: "All-Season Alpine & Group",
    tagline: "Commanding 4WD presence for up to five guests & full ski/luggage gear.",
    vehicles:
      "Cadillac Escalade ESV 4WD, GMC Yukon Denali, Mercedes-Benz V-Class, or similar",
    maxPassengers: 5,
    maxCarryOn: 8,
    maxCheckIn: 5,
    baseFareCad: 165,
    perKmCad: 3.75,
    hourlyRateCad: 178,
    image: "/images/fleet-suv.jpg",
    cabinImage: "/images/service-airport.jpg",
    description:
      "The gold standard for Whistler, Banff, Mont-Tremblant, and Muskoka transfers, as well as executive delegations requiring generous luggage and ski-bag capacity.",
    highlights: [
      "Accommodates up to 5 passengers, 5 large suitcases & ski/golf bags",
      "Winter-certified 4WD traction for Sea-to-Sky & Rocky Mountain highways",
      "Complimentary Canadian-certified child & booster seats upon request",
      "Heated second-row captain chairs & tri-zone climate control",
    ],
    idealFor: ["Whistler & Banff Ski", "Group Airport Runs", "Muskoka Retreats"],
  },
  {
    id: "limousine",
    name: "Royal Stretch Limousine",
    badge: "Limo Black Canada Flagship",
    tagline: "The pinnacle of Canadian limousine artistry — Maybach Pullman & Stretch.",
    vehicles:
      "Mercedes-Maybach S680 AWD, Rolls-Royce Extended, Bespoke Stretch Limousine",
    maxPassengers: 6,
    maxCarryOn: 4,
    maxCheckIn: 4,
    baseFareCad: 325,
    perKmCad: 6.2,
    hourlyRateCad: 340,
    image: "/images/fleet-stretch-limo.jpg",
    cabinImage: "/images/service-interior.jpg",
    flagship: true,
    description:
      "Crafted for red-carpet premieres at TIFF, black-tie weddings, Parliamentary delegations, and milestone galas across Canada. Complete acoustic partition and white-glove chauffeur protocol.",
    highlights: [
      "Electrochromic privacy partition & starlight ambient ceiling",
      "Chilled crystal glassware console & artisanal Canadian sparkling cuvée (0.0%)",
      "White-glove diplomatic, wedding & red-carpet protocol chauffeur",
      "Dedicated 24/7 Canadian Private Concierge monitoring your itinerary",
    ],
    idealFor: [
      "Weddings & Galas",
      "TIFF Red Carpet & Proms",
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
  region: "Ontario" | "British Columbia" | "Québec" | "Alberta";
  duration: string;
  distanceKm: number;
  distanceLabel: string;
  startingCad: number;
  flightTimeSaved: string;
  highlight: string;
}

export const CITY_TO_CITY_ROUTES: CityRoute[] = [
  {
    id: "toronto-niagara",
    from: "Toronto",
    to: "Niagara-on-the-Lake & Falls",
    pickupFull: "Fairmont Royal York Hotel, 100 Front St W, Toronto, ON",
    dropoffFull: "6650 Niagara Pkwy, Niagara Falls, ON",
    region: "Ontario",
    duration: "1h 35m",
    distanceKm: 130,
    distanceLabel: "130 km · QEW / 407 ETR",
    startingCad: 345,
    flightTimeSaved: "407 ETR tolls included · Door-to-winery luxury",
    highlight: "Wine Country & Falls",
  },
  {
    id: "vancouver-whistler",
    from: "Vancouver (YVR)",
    to: "Whistler Village",
    pickupFull: "Vancouver International Airport (YVR)",
    dropoffFull: "Four Seasons Resort & Residences Whistler, BC",
    region: "British Columbia",
    duration: "1h 55m",
    distanceKm: 136,
    distanceLabel: "136 km · Sea-to-Sky Hwy 99",
    startingCad: 385,
    flightTimeSaved: "Winter-tire AWD Escalade & S-Class fleet",
    highlight: "Sea-to-Sky Alpine",
  },
  {
    id: "calgary-banff",
    from: "Calgary (YYC)",
    to: "Banff & Lake Louise",
    pickupFull: "Calgary International Airport (YYC)",
    dropoffFull: "Fairmont Banff Springs, 405 Spray Ave, Banff, AB",
    region: "Alberta",
    duration: "1h 30m",
    distanceKm: 142,
    distanceLabel: "142 km · Trans-Canada Hwy 1",
    startingCad: 365,
    flightTimeSaved: "Direct Rockies resort arrival with ski gear",
    highlight: "Canadian Rockies",
  },
  {
    id: "montreal-tremblant",
    from: "Montréal",
    to: "Mont-Tremblant",
    pickupFull: "The Ritz-Carlton, 1228 Sherbrooke St W, Montréal, QC",
    dropoffFull: "Fairmont Tremblant, Mont-Tremblant, QC",
    region: "Québec",
    duration: "1h 40m",
    distanceKm: 132,
    distanceLabel: "132 km · Autoroute 15 Nord",
    startingCad: 350,
    flightTimeSaved: "Bilingual chauffeur · Laurentian sanctuary",
    highlight: "Laurentian Resort",
  },
  {
    id: "ottawa-montreal",
    from: "Ottawa",
    to: "Montréal Downtown",
    pickupFull: "Fairmont Château Laurier, 1 Rideau St, Ottawa, ON",
    dropoffFull: "The Ritz-Carlton, 1228 Sherbrooke St W, Montréal, QC",
    region: "Ontario",
    duration: "2h 05m",
    distanceKm: 198,
    distanceLabel: "198 km · Hwy 417 / A-40",
    startingCad: 430,
    flightTimeSaved: "Saves 2h vs YOW–YUL short-haul flight",
    highlight: "Capital Corridor",
  },
  {
    id: "toronto-muskoka",
    from: "Toronto",
    to: "Muskoka Lakes",
    pickupFull: "Four Seasons Hotel Toronto, 60 Yorkville Ave, ON",
    dropoffFull: "JW Marriott The Rosseau Muskoka Resort, Minett, ON",
    region: "Ontario",
    duration: "2h 15m",
    distanceKm: 212,
    distanceLabel: "212 km · Hwy 400 North",
    startingCad: 465,
    flightTimeSaved: "Private dockside & cottage arrival",
    highlight: "Cottage Country",
  },
  {
    id: "montreal-quebec",
    from: "Montréal",
    to: "Québec City (Old Québec)",
    pickupFull: "Montréal-Trudeau International Airport (YUL)",
    dropoffFull: "Fairmont Le Château Frontenac, Québec City, QC",
    region: "Québec",
    duration: "2h 45m",
    distanceKm: 255,
    distanceLabel: "255 km · Autoroute 20 / 40",
    startingCad: 520,
    flightTimeSaved: "Private mobile boardroom with 5G Wi-Fi",
    highlight: "St. Lawrence Heritage",
  },
  {
    id: "kelowna-okanagan",
    from: "Kelowna (YLW)",
    to: "Okanagan Estates & Big White",
    pickupFull: "Kelowna International Airport (YLW), BC",
    dropoffFull: "Mission Hill Family Estate, West Kelowna, BC",
    region: "British Columbia",
    duration: "45m",
    distanceKm: 32,
    distanceLabel: "32 km · Okanagan Hwy 97",
    startingCad: 195,
    flightTimeSaved: "Private vineyard & alpine chalet transfer",
    highlight: "Okanagan Wine & Ski",
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
    eyebrow: "Canadian Airport Chauffeur & Private FBO Service",
    title: "Airport Transfers",
    headline: "Smooth Canadian landings, summer or winter.",
    subtitle:
      "Real-time flight tracking across YYZ, YVR, YUL, YYC, YOW & all Canadian airports, 60 minutes of complimentary arrival wait time, and a pre-warmed AWD limousine waiting steps from customs.",
    heroImage: "/images/service-airport.jpg",
    defaultTab: "oneway",
    stats: [
      { value: "60 Min", label: "Complimentary Arrival Wait" },
      { value: "25+", label: "Canadian Commercial & FBO Hubs" },
      { value: "99.94%", label: "All-Weather On-Time Rate" },
      { value: "1 Hour", label: "Prior Free Cancellation" },
    ],
    pillars: [
      {
        title: "Live Air Canada, WestJet, Porter & Intl Telemetry",
        description:
          "Enter your flight number or private tail code once. Whether your flight into Toronto Pearson (YYZ) or Vancouver (YVR) lands early or faces winter de-icing delays, your chauffeur adjusts automatically.",
      },
      {
        title: "Inside-Terminal Heated Meet & Greet",
        description:
          "Step out of customs to find your chauffeur holding an illuminated Limo Black tablet with your name, ready to carry your luggage straight into a pre-warmed or pre-cooled cabin.",
      },
      {
        title: "Fixed All-Inclusive CAD Pricing",
        description:
          "GTAA/airport pickup fees, 407 ETR highway tolls, HST/GST, and chauffeur gratuity are locked in upfront. Traffic on the Gardiner or Hwy 401 never changes your fare.",
      },
    ],
    occasions: [
      {
        title: "YYZ, YTZ, YVR, YUL & YYC Arrivals",
        description:
          "Seamless terminal Meet & Greet at every major Canadian international and downtown island airport.",
      },
      {
        title: "Private Aviation & Skyservice / Signature FBO",
        description:
          "Direct ramp & lounge coordination for private jets in Mississauga, Richmond, Dorval, and Calgary.",
      },
      {
        title: "Early-Morning Winter Departures",
        description:
          "Guaranteed pre-dawn dispatch in snow or shine, with chauffeur SMS details sent 60 minutes prior.",
      },
    ],
  },
  hourly: {
    slug: "hourly",
    eyebrow: "Dedicated Canadian Standby Limousine & Chauffeur",
    title: "Hourly & Full-Day Hire",
    headline: "Seize the city with a chauffeur on standby.",
    subtitle:
      "Reserve a private limousine and senior chauffeur from 2 to 24 hours across Toronto, Vancouver, Montréal, Calgary, or Ottawa — always warm, secure, and waiting outside every door.",
    heroImage: "/images/service-chauffeur.jpg",
    defaultTab: "hourly",
    stats: [
      { value: "2 – 24h", label: "Flexible Standby Duration" },
      { value: "40 km/h", label: "Generous Distance Included" },
      { value: "Unlimited", label: "In-City Stops & Detours" },
      { value: "Zero", label: "Winter Parking or Hail Waits" },
    ],
    pillars: [
      {
        title: "Dynamic Multi-Stop Canadian Itineraries",
        description:
          "Move effortlessly from Bay Street towers to Yorkville dining, or downtown Vancouver to North Shore meetings, without ever waiting in the cold for a ride.",
      },
      {
        title: "Your Private Climate-Controlled Sanctuary",
        description:
          "Leave winter coats, shopping bags, or confidential boardroom materials safely locked inside your dedicated vehicle while your chauffeur stands by.",
      },
      {
        title: "Bilingual & Protocol-Trained Professionals",
        description:
          "Work with career local chauffeurs fluent in English (and French in Québec & Ottawa) with deep knowledge of city shortcuts and VIP entrances.",
      },
    ],
    occasions: [
      {
        title: "Bay Street, Calgary & Montréal Roadshows",
        description:
          "Back-to-back institutional investor and legal meetings with zero wasted transit minutes.",
      },
      {
        title: "NHL Suites, Concerts & TIFF Screenings",
        description:
          "Drop-off and instant VIP pickup outside Scotiabank Arena, Bell Centre, Rogers Arena, and Roy Thomson Hall.",
      },
      {
        title: "Niagara & Okanagan Winery Day Charters",
        description:
          "Private full-day estate tasting tours with your dedicated chauffeur waiting at every cellar door.",
      },
    ],
  },
  "city-to-city": {
    slug: "city-to-city",
    eyebrow: "Intercity Canadian Private Corridors",
    title: "City-to-City Rides",
    headline: "Across Canadian corridors, beyond short-haul flights.",
    subtitle:
      "Skip Pearson/Trudeau security lines and VIA Rail schedules. Enjoy uninterrupted door-to-door luxury from Toronto to Niagara or Muskoka, Vancouver to Whistler, Calgary to Banff, and Ottawa to Montréal.",
    heroImage: "/images/service-corporate.jpg",
    defaultTab: "oneway",
    stats: [
      { value: "45+", label: "Canadian Intercity Routes" },
      { value: "1 Step", label: "Doorstep to Doorstep" },
      { value: "Per Car", label: "CAD Rate — Never Per Seat" },
      { value: "AWD", label: "Winter-Certified Fleet" },
    ],
    pillars: [
      {
        title: "Reclaim Productive & Restful Hours",
        description:
          "Turn a 2-hour highway corridor into a quiet mobile boardroom with 5G Wi-Fi, heated reclining leather seats, and panoramic Canadian scenery.",
      },
      {
        title: "Pay Per Limousine, Not Per Passenger",
        description:
          "Travel with up to 3–6 colleagues or family members plus skis, golf clubs, and luggage for one fixed all-inclusive CAD fare.",
      },
      {
        title: "Depart on Your Exact Clock",
        description:
          "You choose the exact minute of departure from your home, office, or hotel — with free cancellation up to 1 hour prior.",
      },
    ],
    occasions: [
      {
        title: "Alpine Ski & Mountain Transfers",
        description:
          "YVR ↔ Whistler Blackcomb, YYC ↔ Banff & Lake Louise, YUL ↔ Mont-Tremblant.",
      },
      {
        title: "Executive Business Corridors",
        description:
          "Ottawa ↔ Montréal, Toronto ↔ Waterloo Tech Corridor, Toronto ↔ Hamilton/Burlington, Calgary ↔ Edmonton.",
      },
      {
        title: "Wine Country & Lake Retreats",
        description:
          "Toronto ↔ Niagara-on-the-Lake, Toronto ↔ Muskoka Lakes, Kelowna ↔ Okanagan Valley.",
      },
    ],
  },
  limousine: {
    slug: "limousine",
    eyebrow: "Maybach Pullman, Rolls-Royce & Stretch Limousines",
    title: "Royal Limousine & Events",
    headline: "Grand Canadian entrances for life's defining nights.",
    subtitle:
      "From TIFF red-carpet premieres and luxury weddings in Toronto, Vancouver & Montréal to Parliamentary galas in Ottawa — experience the flagship stretch fleet that defines Limo Black Canada.",
    heroImage: "/images/fleet-stretch-limo.jpg",
    defaultTab: "hourly",
    stats: [
      { value: "Maybach", label: "& Stretch Flagship Fleet" },
      { value: "6 Guests", label: "Rear Lounge Capacity" },
      { value: "24/7", label: "Canadian Event Concierge" },
      { value: "5.0 ★", label: "VIP Protocol Rating" },
    ],
    pillars: [
      {
        title: "Extended-Wheelbase & Stretch Coachwork",
        description:
          "Reserve our Royal Stretch Limousine class for acoustic privacy partitions, starlight ceilings, lounge seating, and crystal refreshment consoles.",
      },
      {
        title: "White-Glove Canadian Event Coordination",
        description:
          "Our events desk coordinates directly with wedding planners, TIFF publicists, hotel porte-cochères, and venue security.",
      },
      {
        title: "Bespoke Cabin Staging",
        description:
          "Pre-select heated cabin climate, chilled non-alcoholic Niagara sparkling cuvées, and custom playlists before stepping aboard.",
      },
    ],
    occasions: [
      {
        title: "Luxury Weddings & Milestone Anniversaries",
        description:
          "Immaculately detailed obsidian stretch limousines across the GTA, Lower Mainland, Montréal, and Banff.",
      },
      {
        title: "TIFF Premieres, Galas & Graduations",
        description:
          "Show-stopping red-carpet arrivals on King Street West, Place des Arts, and downtown Vancouver.",
      },
      {
        title: "Diplomatic & Parliamentary Delegations",
        description:
          "Multi-vehicle convoy coordination in Ottawa, Toronto, and Montréal with NDA-bound chauffeurs.",
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
    author: "David MacLeod",
    role: "Managing Director, Bay Street Capital",
    route: "Toronto Pearson (YYZ) → King St West, Toronto",
    category: "Airport Transfers",
    rating: 5,
    date: "2 days ago",
    title: "Pre-warmed S-Class waiting despite a Pearson snow delay",
    quote:
      "My Air Canada flight from London landed 90 minutes late during an Ontario sleet storm. My chauffeur, Liam, tracked the gate change automatically, met me at Terminal 1 arrivals, and took the 407 ETR at zero extra toll charge.",
  },
  {
    id: "r2",
    author: "Geneviève Bouchard",
    role: "Executive Producer",
    route: "Ritz-Carlton Montréal → Place des Arts Gala",
    category: "Stretch Limousine",
    rating: 5,
    date: "5 days ago",
    title: "Impeccable bilingual white-glove protocol in Montréal",
    quote:
      "We booked two Royal Stretch Limousines for our gala premiere in Montréal. Spotless obsidian coachwork, effortless French and English etiquette, and true five-star grace from start to finish.",
  },
  {
    id: "r3",
    author: "Jason & Priya Grewal",
    role: "Private Clients",
    route: "Vancouver (YVR) → Four Seasons Whistler",
    category: "City-to-City",
    rating: 5,
    date: "1 week ago",
    title: "The smoothest Sea-to-Sky transfer we have ever taken",
    quote:
      "With four suitcases and two snowboard bags, our Escalade ESV handled Highway 99 effortlessly. Heated captain chairs, sparkling water, and a driver who knew every curve of the Sea-to-Sky.",
  },
  {
    id: "r4",
    author: "Sarah Jenkins-Reid",
    role: "VP Executive Operations",
    route: "Toronto, Calgary & Vancouver · 60+ Monthly Rides",
    category: "Corporate",
    rating: 5,
    date: "1 week ago",
    title: "One Canadian HST invoice across all four national offices",
    quote:
      "Managing executive ground travel across Toronto, Calgary, Ottawa, and Vancouver used to mean four separate limo vendors. Limo Black unified everything into one portal with automated GST/HST billing.",
  },
  {
    id: "r5",
    author: "Michael & Claire Thompson",
    role: "Private Clients",
    route: "Calgary Airport (YYC) → Fairmont Banff Springs",
    category: "City-to-City",
    rating: 5,
    date: "2 weeks ago",
    title: "First-class arrival into the Canadian Rockies",
    quote:
      "Watching the Rockies appear through the panoramic glass roof of an EQS while sipping chilled water after a long flight was pure magic. Worth every dollar.",
  },
  {
    id: "r6",
    author: "arman K. Sidhu",
    role: "Wedding Groom, Vaughan & Yorkville",
    route: "Yorkville Toronto · 10-Hour Wedding Standby",
    category: "Stretch Limousine",
    rating: 5,
    date: "3 weeks ago",
    title: "Made our Toronto wedding day completely stress-free",
    quote:
      "The Maybach stretch limousine turned heads all along Bloor Street. Our chauffeur arrived 25 minutes early, coordinated with our photographer, and kept the cabin at the exact temperature we asked.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Which cities and provinces across Canada does Limo Black serve?",
    answer:
      "Limo Black operates coast-to-coast across Canada, including Toronto & the Greater Toronto Area (GTA), Niagara Falls, Muskoka, Ottawa, Montréal, Mont-Tremblant, Québec City, Vancouver, Whistler, Victoria, Kelowna, Calgary, Banff & Lake Louise, Edmonton, Winnipeg, and Halifax.",
  },
  {
    question: "How does Canadian address search and instant pricing work?",
    answer:
      "Simply start typing any Canadian street address, postal code, hotel, landmark, or airport code (like YYZ, YVR, YUL, YYC) into our Pickup or Drop-off box. Live Canadian map suggestions appear automatically so you can pick your exact door-to-door address and lock in a guaranteed CAD fare.",
  },
  {
    question: "Are GST/HST taxes, 407 ETR highway tolls, and chauffeur tip included?",
    answer:
      "Yes — 100%. The CAD price shown when you select your vehicle class is the final all-inclusive price you pay. Provincial HST/GST, airport pickup levies, highway tolls (including Ontario's 407 ETR), and chauffeur gratuity are all included upfront.",
  },
  {
    question: "Are your vehicles equipped for Canadian winter snow and ski trips?",
    answer:
      "Every vehicle in our Canadian fleet features 4MATIC / xDrive / 4WD all-wheel drive, commercial winter-certified tires during winter months, heated leather seating, and pre-warmed cabins prior to your pickup.",
  },
  {
    question: "What is your cancellation and flight-delay policy?",
    answer:
      "You can modify or cancel any one-way or hourly reservation free of charge up until 1 hour before pickup. For airport pickups, we track Air Canada, WestJet, Porter, and all international flights live and include 60 minutes of complimentary arrival wait time.",
  },
  {
    question: "Do you offer bilingual English & French chauffeurs?",
    answer:
      "Yes. Bilingual English/French chauffeurs are standard across Montréal, Québec City, Mont-Tremblant, and Ottawa, and can also be requested in Toronto and other cities via your booking notes.",
  },
];

export const GLOBAL_CITIES_DIRECTORY: Record<string, string[]> = {
  Ontario: [
    "Toronto & GTA",
    "Mississauga (YYZ)",
    "Ottawa",
    "Niagara-on-the-Lake",
    "Niagara Falls",
    "Muskoka",
    "Oakville & Burlington",
    "Waterloo & Kitchener",
    "Hamilton",
    "London, ON",
  ],
  "British Columbia": [
    "Vancouver",
    "Whistler",
    "Richmond (YVR)",
    "Victoria",
    "Kelowna & Okanagan",
    "Surrey & Burnaby",
    "West Vancouver",
    "Nanaimo",
  ],
  Québec: [
    "Montréal",
    "Québec City",
    "Mont-Tremblant",
    "Laval",
    "Dorval (YUL)",
    "Gatineau",
    "Sherbrooke",
    "Trois-Rivières",
  ],
  "Alberta & Prairies / Atlantic": [
    "Calgary",
    "Banff & Lake Louise",
    "Edmonton",
    "Canmore",
    "Winnipeg",
    "Saskatoon",
    "Halifax",
    "Moncton",
  ],
};

/**
 * Computes realistic Canadian road distance (km) and driving duration (minutes)
 * using exact GPS coordinates (from live Canadian address autocomplete or curated hubs)
 * with fallback deterministic estimation.
 */
export function estimateRouteMetrics(
  pickup: string,
  dropoff: string,
  pickupCoords?: { lat: number; lng: number } | null,
  dropoffCoords?: { lat: number; lng: number } | null
): { distanceKm: number; durationMin: number; isAirport: boolean } {
  const pLower = pickup.toLowerCase();
  const dLower = dropoff.toLowerCase();

  const isAirport =
    pLower.includes("airport") ||
    dLower.includes("airport") ||
    pLower.includes("aéroport") ||
    dLower.includes("aéroport") ||
    /\b(yyz|ytz|yvr|yul|yyc|yow|yeg|yhz|yqb|yyj|ylw|ywg)\b/i.test(
      `${pickup} ${dropoff}`
    );

  // 1. If exact live GPS coordinates exist for both endpoints, compute real road distance!
  const resolvedA =
    pickupCoords ||
    GLOBAL_LOCATIONS.find(
      (l) =>
        l.name.toLowerCase() === pLower ||
        pLower.includes(l.name.toLowerCase().slice(0, 15))
    );

  const resolvedB =
    dropoffCoords ||
    GLOBAL_LOCATIONS.find(
      (l) =>
        l.name.toLowerCase() === dLower ||
        dLower.includes(l.name.toLowerCase().slice(0, 15))
    );

  if (
    resolvedA &&
    resolvedB &&
    (Math.abs(resolvedA.lat - resolvedB.lat) > 0.0005 ||
      Math.abs(resolvedA.lng - resolvedB.lng) > 0.0005)
  ) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(resolvedB.lat - resolvedA.lat);
    const dLng = toRad(resolvedB.lng - resolvedA.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(resolvedA.lat)) *
        Math.cos(toRad(resolvedB.lat)) *
        Math.sin(dLng / 2) ** 2;
    const straightKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Cap cross-country flights gracefully (e.g. Toronto to Vancouver) to realistic regional charter preview
    if (straightKm > 900) {
      return { distanceKm: 45, durationMin: 48, isAirport };
    }
    const roadKm = Math.max(8, Math.round(straightKm * 1.27));
    const avgSpeedKmh = roadKm > 75 ? 82 : 48;
    const durationMin = Math.max(18, Math.round((roadKm / avgSpeedKmh) * 60 + 10));
    return { distanceKm: roadKm, durationMin, isAirport };
  }

  // 2. Check curated Canadian City-to-City routes
  const matchedRoute = CITY_TO_CITY_ROUTES.find(
    (r) =>
      (pLower.includes(r.from.toLowerCase().split(" ")[0]) &&
        dLower.includes(r.to.toLowerCase().split(" ")[0])) ||
      (pLower.includes(r.pickupFull.toLowerCase().slice(0, 14)) &&
        dLower.includes(r.dropoffFull.toLowerCase().slice(0, 14)))
  );

  if (matchedRoute) {
    const hMatch = matchedRoute.duration.match(/(\d+)h/);
    const mMatch = matchedRoute.duration.match(/(\d+)m/);
    const mins =
      (hMatch ? parseInt(hMatch[1], 10) * 60 : 0) +
      (mMatch ? parseInt(mMatch[1], 10) : 0);
    return {
      distanceKm: matchedRoute.distanceKm,
      durationMin: mins || 95,
      isAirport,
    };
  }

  // 3. Deterministic fallback for typed custom addresses
  const combined = `${pickup}-${dropoff}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 1000;
  }
  const distanceKm = 22 + (hash % 38);
  const durationMin = Math.round((distanceKm / 48) * 60 + 12);
  return { distanceKm, durationMin, isAirport };
}

export function calculateClassPriceUsd(
  fleetClass: FleetClass,
  rideType: "oneway" | "hourly",
  distanceKm: number,
  durationHours: number
): number {
  if (rideType === "hourly") {
    const multiplier = durationHours >= 8 ? 0.92 : durationHours >= 5 ? 0.96 : 1;
    return Math.round(fleetClass.hourlyRateCad * durationHours * multiplier);
  }
  return Math.round(fleetClass.baseFareCad + distanceKm * fleetClass.perKmCad);
}
