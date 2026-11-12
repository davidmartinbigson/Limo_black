import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/jwt';
import { consumeLoginAttempt, findOwnedBooking } from '@/lib/serverDb';
import { sendBookingRequestEmail } from '@/lib/mail';
export async function POST(req: Request) {
  try {
    const h = await headers();
    const origin = h.get('origin'); const host = h.get('x-forwarded-host') || h.get('host');
    if (!origin || new URL(origin).host !== host) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    const body = await req.json();
    if (typeof body.reference !== 'string' || !/^LB-[A-F0-9]{16}$/.test(body.reference)) return NextResponse.json({ error: 'Invalid booking reference.' }, { status: 400 });
    const booking = await findOwnedBooking(body.reference, session.email);
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    if (booking.status === 'Cancelled') return NextResponse.json({ error: 'Cancelled bookings cannot be resent as requests.' }, { status: 400 });
    const ip = (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').slice(0, 100);
    if (!(await consumeLoginAttempt(`booking-email-user:${session.id}`)) || !(await consumeLoginAttempt(`booking-email-ip:${ip}`))) return NextResponse.json({ error: 'Too many email requests. Please try again later.' }, { status: 429 });
    const status = await sendBookingRequestEmail(session.email, booking);
    if (status !== 'accepted') return NextResponse.json({ error: status === 'unavailable' ? 'Email service is not configured yet.' : 'Email could not be sent. Please try again later.' }, { status: 503 });
    return NextResponse.json({ status: 'accepted' });
  } catch { return NextResponse.json({ error: 'Unable to send email. Please try again later.' }, { status: 503 }); }
}
