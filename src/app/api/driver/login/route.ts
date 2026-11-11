import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { consumeLoginAttempt, clearLoginAttempts, findDriverLogin } from '@/lib/serverDb';
import { DRIVER_COOKIE, sameOrigin, signDriver } from '@/lib/driverAuth';
export async function POST(req: Request) {
  try {
    if (!await sameOrigin()) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    const b = await req.json();
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
    const password = typeof b.password === 'string' ? b.password : '';
    if (!email || email.length > 254 || !password || Buffer.byteLength(password, 'utf8') > 72) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    const key = `driver-login:${email}`;
    if (!await consumeLoginAttempt(key)) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
    const driver = await findDriverLogin(email);
    if (!driver || !await bcrypt.compare(password, String(driver.passwordHash))) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    if (!driver.approved || !driver.active) return NextResponse.json({ error: driver.approved ? 'Your driver account is inactive. Contact the owner.' : 'Your application is awaiting owner approval.' }, { status: 403 });
    await clearLoginAttempts(key);
    const token = await signDriver(String(driver.id), Number(driver.tokenVersion));
    const res = NextResponse.json({ ok: true });
    res.cookies.set(DRIVER_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 24 * 3600 });
    return res;
  } catch { return NextResponse.json({ error: 'Driver sign-in unavailable. Please try again.' }, { status: 503 }); }
}
