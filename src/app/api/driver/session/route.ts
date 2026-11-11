import { NextResponse } from 'next/server';
import { currentDriver } from '@/lib/driverAuth';
import { listDriverBookings } from '@/lib/serverDb';
export async function GET() {
  try {
    const driver = await currentDriver();
    if (!driver) return NextResponse.json({ error: 'Driver sign-in required.' }, { status: 401 });
    const bookings = await listDriverBookings(String(driver.id), Number(driver.tokenVersion));
    const { tokenVersion: _tokenVersion, ...safeDriver } = driver;
    return NextResponse.json({ driver: safeDriver, bookings }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Unable to load driver dashboard.' }, { status: 503 }); }
}
