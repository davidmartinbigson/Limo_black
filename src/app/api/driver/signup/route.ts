import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createDriverAccount, consumeLoginAttempt } from '@/lib/serverDb';
import { sameOrigin, parseDriverInput } from '@/lib/driverAuth';
export async function POST(req: Request) {
  try {
    if (!await sameOrigin()) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    const h = await headers();
    const ip = (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim().slice(0, 100);
    if (!await consumeLoginAttempt(`driver-signup:${ip}`)) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    const input = parseDriverInput(await req.json());
    if (!input) return NextResponse.json({ error: 'Enter a name, phone, valid email and password of 12–72 bytes.' }, { status: 400 });
    await createDriverAccount(input, false);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return NextResponse.json({ error: 'This driver email is already registered.' }, { status: 409 });
    return NextResponse.json({ error: 'Driver registration is unavailable. Please try again.' }, { status: 503 });
  }
}
