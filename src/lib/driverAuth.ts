import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { getDriverSession } from '@/lib/serverDb';
export const DRIVER_COOKIE = 'limoblack_driver_session';
const secret = () => { const key = process.env.JWT_SECRET || process.env.AUTH_SECRET; if (!key || key.length < 32) throw new Error('Session secret missing'); return new TextEncoder().encode(key); };
export async function signDriver(id: string, version: number) {
  return new SignJWT({ version }).setProtectedHeader({ alg: 'HS256' }).setSubject(id).setIssuer('limoblack-driver').setAudience('driver').setIssuedAt().setExpirationTime('7d').sign(secret());
}
export async function currentDriver() {
  const token = (await cookies()).get(DRIVER_COOKIE)?.value;
  if (!token) return null;
  let payload;
  try { ({ payload } = await jwtVerify(token, secret(), { issuer: 'limoblack-driver', audience: 'driver', algorithms: ['HS256'] })); } catch { return null; }
  if (!payload.sub || !Number.isInteger(payload.version)) return null;
  return getDriverSession(payload.sub, payload.version as number);
}
export async function sameOrigin() {
  const h = await headers(); const origin = h.get('origin'); const host = h.get('x-forwarded-host') || h.get('host');
  try { return !!origin && new URL(origin).host === host; } catch { return false; }
}
export function parseDriverInput(b: Record<string, unknown>) {
  const text = (v: unknown, n: number) => typeof v === 'string' && v.trim().length <= n ? v.trim() : '';
  const name = text(b.name, 120), phone = text(b.phone, 40), email = text(b.email, 254).toLowerCase(), vehicleModel = text(b.vehicleModel, 120), plate = text(b.plate, 30), password = typeof b.password === 'string' ? b.password : '';
  if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72 || typeof b.vehicleModel !== 'string' || b.vehicleModel.trim().length > 120 || typeof b.plate !== 'string' || b.plate.trim().length > 30) return null;
  return { name, phone, email, password, vehicleModel, plate };
}
