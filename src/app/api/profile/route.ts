import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";
import { getUserProfile, setUserProfile } from "@/lib/serverDb";

async function session() { const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value; return token ? verifySessionToken(token) : null; }
export async function GET() {
  const user = await session();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try { return NextResponse.json({ profile: await getUserProfile(user.id) }); }
  catch { return NextResponse.json({ error: "Profile service unavailable." }, { status: 503 }); }
}
export async function PUT(req: Request) {
  const user = await session();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    const p = await req.json();
    if (!p || typeof p !== "object" || typeof p.name !== "string" || p.name.trim().length < 1 || p.name.length > 100 || typeof p.phone !== "string" || p.phone.length > 40 || typeof p.company !== "string" || p.company.length > 150 || !["English", "Français", "Bilingual EN/FR"].includes(p.preferredLanguage) || !Array.isArray(p.savedPlaces) || p.savedPlaces.length > 25 || !p.defaultCabin || typeof p.defaultCabin !== "object") return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
    const c = p.defaultCabin;
    if (!["19°C Cool", "21°C Balanced", "23°C Warm"].includes(c.temperature) || !["Discreet Silence", "Warm & Conversational"].includes(c.conversation) || !["Still Artisan Water", "Sparkling Perrier", "Chilled Espresso"].includes(c.refreshment) || !["None", "Infant Carrier", "Toddler Seat", "Booster Seat"].includes(c.childSeat) || typeof c.notes !== "string" || c.notes.length > 1000) return NextResponse.json({ error: "Invalid cabin preferences." }, { status: 400 });
    const places = p.savedPlaces.map((v: Record<string, unknown>) => {
      if (!v || typeof v.id !== "string" || v.id.length > 80 || !["Home", "Office", "Airport", "Favorite"].includes(String(v.label)) || typeof v.address !== "string" || !v.address.trim() || v.address.length > 500) throw new Error("Invalid place");
      const coords = v.coords as { lat?: unknown; lng?: unknown } | null;
      if (coords !== null && (!coords || typeof coords.lat !== "number" || typeof coords.lng !== "number" || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng) || Math.abs(coords.lat) > 90 || Math.abs(coords.lng) > 180)) throw new Error("Invalid coordinates");
      return { id: v.id, label: v.label, address: v.address, coords };
    });
    const profile = { name: p.name.trim(), phone: p.phone.trim(), company: p.company.trim(), preferredLanguage: p.preferredLanguage, savedPlaces: places, defaultCabin: { temperature: c.temperature, conversation: c.conversation, refreshment: c.refreshment, childSeat: c.childSeat, notes: c.notes } };
    await setUserProfile(user.id, profile);
    return NextResponse.json({ profile });
  } catch { return NextResponse.json({ error: "Unable to save profile. Check your details and try again." }, { status: 400 }); }
}
