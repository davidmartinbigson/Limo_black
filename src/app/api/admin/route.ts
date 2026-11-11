import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/jwt';
import { findUserByEmail, getAdminData, createAdminDriver, changeDriverActive, assignAdminDriver, changeAdminBookingStatus } from '@/lib/serverDb';

async function authorize() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session || session.role !== 'admin') return false;
  const user = await findUserByEmail(session.email);
  return !!user && user.id === session.id && user.role === 'admin';
}
async function sameOrigin() {
  const h = await headers();
  const origin = h.get('origin');
  const host = h.get('x-forwarded-host') || h.get('host');
  try { return !!origin && new URL(origin).host === host; } catch { return false; }
}
export async function GET() {
  try {
    if (!await authorize()) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    return NextResponse.json(await getAdminData(), { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Admin data unavailable.' }, { status: 503 }); }
}
export async function POST(req: Request) {
  try {
    if (!await sameOrigin()) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    if (!await authorize()) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    const b = await req.json();
    const clean = (v: unknown, max: number) => typeof v === 'string' && v.trim().length <= max ? v.trim() : null;
    if (b.action === 'createDriver') {
      const name = clean(b.name, 120), phone = clean(b.phone, 40), email = clean(b.email, 254), vehicleModel = clean(b.vehicleModel, 120), plate = clean(b.plate, 30);
      if (!name || !phone || email === null || vehicleModel === null || plate === null || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return NextResponse.json({ error: 'Enter a name, phone number and valid driver details.' }, { status: 400 });
      await createAdminDriver({ name, phone, email, vehicleModel, plate });
    } else if (b.action === 'driverActive' && typeof b.id === 'string' && b.id.length <= 80 && typeof b.active === 'boolean') {
      if (!await changeDriverActive(b.id, b.active)) return NextResponse.json({ error: 'Driver not found.' }, { status: 404 });
    } else if (b.action === 'assign' && typeof b.reference === 'string' && b.reference.length <= 80 && typeof b.driverId === 'string' && b.driverId.length <= 80) {
      if (!await assignAdminDriver(b.reference, b.driverId)) return NextResponse.json({ error: 'Booking or active driver not found, or booking cannot be assigned.' }, { status: 409 });
    } else if (b.action === 'status' && typeof b.reference === 'string' && b.reference.length <= 80 && ['Chauffeur En Route', 'Chauffeur Arrived', 'Completed', 'Cancelled'].includes(b.status)) {
      if (!await changeAdminBookingStatus(b.reference, b.status)) return NextResponse.json({ error: 'This status change is not available. Refresh and try again.' }, { status: 409 });
    } else return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Unable to save changes.' }, { status: 503 }); }
}
