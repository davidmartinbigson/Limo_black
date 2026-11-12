import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { currentDriver, sameOrigin } from '@/lib/driverAuth';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/jwt';
import { findUserByEmail, findOwnedBooking, readTracking, stopTracking, writeTracking } from '@/lib/serverDb';
const refValid = (value: unknown): value is string => typeof value === 'string' && /^LB-[A-F0-9]{16}$/.test(value);
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(req: Request) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) return json({ error: 'Sign in required.' }, 401);
    const user = await findUserByEmail(session.email);
    if (!user || user.id !== session.id) return json({ error: 'Sign in required.' }, 401);
    const reference = new URL(req.url).searchParams.get('reference');
    if (!refValid(reference)) return json({ error: 'Invalid reference.' }, 400);
    const admin = user.role === 'admin';
    if (!admin && !await findOwnedBooking(reference, user.email)) return json({ error: 'Booking not found.' }, 404);
    return json({ location: await readTracking(reference, user.email, admin) });
  } catch { return json({ error: 'Tracking unavailable.' }, 503); }
}
export async function POST(req: Request) {
  try {
    if (!await sameOrigin()) return json({ error: 'Invalid request origin.' }, 403);
    const driver = await currentDriver();
    if (!driver) return json({ error: 'Driver sign-in required.' }, 401);
    const b = await req.json();
    if (!refValid(b.reference) || typeof b.sessionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(b.sessionId)) return json({ error: 'Invalid request.' }, 400);
    if (b.action === 'stop') { await stopTracking(String(driver.id), b.reference, b.sessionId); return json({ ok: true }); }
    if (!['start', 'update'].includes(b.action) || typeof b.latitude !== 'number' || !Number.isFinite(b.latitude) || Math.abs(b.latitude) > 90 || typeof b.longitude !== 'number' || !Number.isFinite(b.longitude) || Math.abs(b.longitude) > 180 || typeof b.accuracy !== 'number' || !Number.isFinite(b.accuracy) || b.accuracy < 0 || b.accuracy > 100000) return json({ error: 'Invalid location.' }, 400);
    if (!await writeTracking(String(driver.id), Number(driver.tokenVersion), b.reference, b.sessionId, b.latitude, b.longitude, b.accuracy, b.action === 'start')) return json({ error: 'Tracking stopped or ride no longer assigned. Please refresh.' }, 409);
    return json({ ok: true });
  } catch { return json({ error: 'Tracking unavailable.' }, 503); }
}
