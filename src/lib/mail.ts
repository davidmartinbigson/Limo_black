import 'server-only';
import nodemailer from 'nodemailer';

/** A successful result means Gmail accepted the message, not that it reached the inbox. */
export async function sendBookingRequestEmail(recipient: string, booking: Record<string, unknown>): Promise<'accepted' | 'unavailable' | 'failed'> {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.replace(/\s/g, '');
  if (!user || !pass) return 'unavailable';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) || recipient.endsWith('.invalid')) return 'failed';
  const field = (v: unknown) => typeof v === 'string' ? v.replace(/[\r\n]/g, ' ').slice(0, 500) : '';
  const reference = field(booking.reference);
  const destination = booking.rideType === 'hourly' ? `${Number(booking.durationHours) || 0} hour charter` : field(booking.dropoff);
  const price = typeof booking.totalUsd === 'number' && Number.isFinite(booking.totalUsd) ? `CAD $${booking.totalUsd.toFixed(2)}` : 'Not available';
  const text = [`Limo Black — Booking Request Received`, '', `Reference: ${reference}`, `Date: ${field(booking.date)}`, `Time: ${field(booking.time)}`, `Pickup: ${field(booking.pickup)}`, `Destination: ${destination}`, `Estimated fare: ${price}`, '', 'This is a booking request, not a confirmed dispatch. Payment has not been processed. The fare is an estimate.', '', 'Sign in to your Limo Black account to review your request.'].join('\n');
  try {
    const transport = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000 });
    const info = await transport.sendMail({ from: { name: 'Limo Black Canada', address: user }, to: recipient, subject: `Booking request received — ${reference}`, text });
    return info.accepted.length > 0 ? 'accepted' : 'failed';
  } catch { return 'failed'; }
}
