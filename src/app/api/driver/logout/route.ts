import { NextResponse } from 'next/server';
import { DRIVER_COOKIE, sameOrigin } from '@/lib/driverAuth';
export async function POST() {
  if (!await sameOrigin()) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DRIVER_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
