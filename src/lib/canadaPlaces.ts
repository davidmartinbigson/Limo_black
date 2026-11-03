import { GLOBAL_LOCATIONS, LocationItem } from "@/data/limoData";

const PROVINCE_MAP: Record<string, string> = {
  ontario: "ON",
  quebec: "QC",
  québec: "QC",
  "british columbia": "BC",
  alberta: "AB",
  manitoba: "MB",
  saskatchewan: "SK",
  "nova scotia": "NS",
  "new brunswick": "NB",
  "newfoundland and labrador": "NL",
  "prince edward island": "PE",
  "northwest territories": "NT",
  yukon: "YT",
  nunavut: "NU",
};

function shortProvince(state?: string): string {
  if (!state) return "CA";
  const key = state.trim().toLowerCase();
  return PROVINCE_MAP[key] || state;
}

/**
 * Google-Maps-style real-time Canadian address autocomplete!
 * Combines instant curated Canadian airports/hotels/landmarks with live street-level
 * Canadian address lookups via OpenStreetMap Nominatim (countrycodes=ca) + Photon fallback.
 */
export async function searchCanadianAddresses(
  query: string,
  signal?: AbortSignal
): Promise<LocationItem[]> {
  const q = query.trim();
  if (!q) {
    return GLOBAL_LOCATIONS.slice(0, 8);
  }

  const qLower = q.toLowerCase();

  // 1. Instant local matches from curated Canadian hubs & airports
  const localMatches = GLOBAL_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(qLower) ||
      loc.city.toLowerCase().includes(qLower) ||
      loc.subtitle.toLowerCase().includes(qLower) ||
      loc.province.toLowerCase() === qLower ||
      (loc.iata && loc.iata.toLowerCase().includes(qLower))
  ).slice(0, 4);

  if (q.length < 2) {
    return localMatches.length > 0 ? localMatches : GLOBAL_LOCATIONS.slice(0, 6);
  }

  // 2. Live real-world Canadian street & place search (Nominatim CA + Photon CA fallback)
  let remoteResults: LocationItem[] = [];

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ca&limit=7&accept-language=en&q=${encodeURIComponent(
      q
    )}`;

    const res = await fetch(nominatimUrl, {
      signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        remoteResults = data
          .map((item: Record<string, unknown>, idx: number): LocationItem | null => {
            const lat = Number(item.lat);
            const lng = Number(item.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

            const addr = (item.address || {}) as Record<string, string>;
            const houseNumber = addr.house_number || "";
            const road = addr.road || addr.pedestrian || "";
            const placeName =
              (item.name as string) ||
              addr.amenity ||
              addr.building ||
              addr.hotel ||
              addr.aeroway ||
              "";

            const city =
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.village ||
              addr.suburb ||
              addr.county ||
              "Canada";
            const prov = shortProvince(addr.state);
            const postcode = addr.postcode ? ` ${addr.postcode}` : "";

            let primaryTitle = "";
            if (placeName && road && placeName !== road) {
              primaryTitle = houseNumber
                ? `${placeName}, ${houseNumber} ${road}`
                : `${placeName}, ${road}`;
            } else if (houseNumber && road) {
              primaryTitle = `${houseNumber} ${road}`;
            } else if (placeName) {
              primaryTitle = placeName;
            } else {
              primaryTitle = String(item.display_name || "")
                .split(",")
                .slice(0, 2)
                .join(",")
                .trim();
            }

            const fullFormatted = `${primaryTitle}, ${city}, ${prov}${postcode}`;
            const secondaryParts = [
              addr.neighbourhood || addr.suburb || "",
              `${city}, ${prov}${postcode}`,
              "Canada",
            ].filter(Boolean);

            const category = String(item.category || "");
            const itemType: LocationItem["type"] =
              category === "aeroway" ||
              primaryTitle.toLowerCase().includes("airport")
                ? "airport"
                : category === "tourism" || addr.hotel
                ? "hotel"
                : "address";

            return {
              id: `ca-nom-${item.place_id || idx}`,
              name: fullFormatted,
              subtitle: secondaryParts.join(" · "),
              city,
              province: prov,
              country: "Canada",
              type: itemType,
              lat,
              lng,
            };
          })
          .filter((x): x is LocationItem => x !== null);
      }
    }
  } catch (err) {
    if ((err as Error)?.name === "AbortError") {
      throw err;
    }
  }

  // Fallback to Photon Komoot geocoder if Nominatim returned nothing
  if (remoteResults.length === 0) {
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        `${q} Canada`
      )}&limit=8&lang=en`;
      const res = await fetch(photonUrl, { signal });
      if (res.ok) {
        const json = await res.json();
        const features = Array.isArray(json?.features) ? json.features : [];
        remoteResults = features
          .filter(
            (f: { properties?: { countrycode?: string } }) =>
              f?.properties?.countrycode?.toUpperCase() === "CA"
          )
          .map(
            (
              f: {
                geometry?: { coordinates?: [number, number] };
                properties?: Record<string, string>;
              },
              idx: number
            ): LocationItem | null => {
              const coords = f.geometry?.coordinates;
              if (!coords || coords.length < 2) return null;
              const [lng, lat] = coords;
              const p = f.properties || {};
              const streetPart = [p.housenumber, p.street]
                .filter(Boolean)
                .join(" ");
              const mainLabel = p.name || streetPart || p.city || q;
              const city = p.city || p.district || p.county || "Canada";
              const prov = shortProvince(p.state);
              const postcode = p.postcode ? ` ${p.postcode}` : "";
              const full =
                p.name && streetPart && p.name !== streetPart
                  ? `${p.name}, ${streetPart}, ${city}, ${prov}${postcode}`
                  : `${mainLabel}, ${city}, ${prov}${postcode}`;

              return {
                id: `ca-pho-${idx}-${lat}`,
                name: full,
                subtitle: `${city}, ${prov}${postcode} · Canada`,
                city,
                province: prov,
                country: "Canada",
                type:
                  p.osm_key === "aeroway"
                    ? "airport"
                    : p.osm_value === "hotel"
                    ? "hotel"
                    : "address",
                lat,
                lng,
              };
            }
          )
          .filter((x: LocationItem | null): x is LocationItem => x !== null);
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        throw err;
      }
    }
  }

  // Deduplicate by normalized name
  const seen = new Set<string>();
  const combined: LocationItem[] = [];
  for (const item of [...localMatches, ...remoteResults]) {
    const norm = item.name.toLowerCase().slice(0, 32);
    if (!seen.has(norm)) {
      seen.add(norm);
      combined.push(item);
    }
  }

  return combined.slice(0, 8);
}
