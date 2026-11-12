import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendBookingRequestEmail } from "@/lib/mail";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";
import { cancelOwnedBooking, listBookingsForUser, saveBookingRecord, rescheduleOwnedBooking, consumeLoginAttempt } from "@/lib/serverDb";

async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try { return NextResponse.json({ bookings: await listBookingsForUser(session.email, session.role === "admin") }); }
  catch { return NextResponse.json({ error: "Booking service unavailable." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in to submit a booking." }, { status: 401 });
  try {
    const { booking: b } = await req.json();
    if (!b || typeof b !== "object" || !["business", "first", "suv", "van"].includes(b.selectedClassId) || !["oneway", "hourly"].includes(b.rideType) || typeof b.pickup !== "string" || !b.pickup.trim() || b.pickup.length > 500 || (b.rideType === "oneway" && (typeof b.dropoff !== "string" || !b.dropoff.trim() || b.dropoff.length > 500)) || !/^\d{4}-\d{2}-\d{2}$/.test(b.date || "") || !/^\d{2}:\d{2}$/.test(b.time || "") || !Number.isInteger(b.passengersCount) || b.passengersCount < 1 || b.passengersCount > 14) {
      return NextResponse.json({ error: "Please provide valid trip details." }, { status: 400 });
    }
    // This is a non-binding estimate, not a payment or verified dispatch.
    if (typeof b.totalUsd !== "number" || !Number.isFinite(b.totalUsd) || b.totalUsd < 0 || b.totalUsd > 100000) return NextResponse.json({ error: "Invalid estimate." }, { status: 400 });
    const reference = `LB-${randomBytes(8).toString("hex").toUpperCase()}`;
    const booking = { ...b, reference, ownerEmail: session.email, createdAt: new Date().toISOString(), status: "Confirmed", chauffeur: { name: "", rating: "", languages: "", phone: "", vehicleModel: "", plate: "" }, subtotalBeforeTaxCad: undefined, hstTaxCad: undefined };
    await saveBookingRecord(reference, session.email, booking);
    // Saving and sending are separate: SMTP failure must never undo a saved booking.
    let emailStatus: 'accepted' | 'unavailable' | 'failed' = 'failed';
    try {
      const h = await headers();
      const ip = (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').slice(0, 100);
      if (await consumeLoginAttempt(`booking-email-user:${session.id}`) && await consumeLoginAttempt(`booking-email-ip:${ip}`)) emailStatus = await sendBookingRequestEmail(session.email, booking);
    } catch { emailStatus = 'failed'; }
    return NextResponse.json({ booking, emailStatus }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to save your booking. Please try again." }, { status: 503 }); }
}
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    const body = await req.json();
    if (typeof body.reference !== "string" || body.reference.length > 80) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    let booking;
    if (body.action === "cancel") booking = await cancelOwnedBooking(body.reference, session.email);
    else if (body.action === "schedule" && typeof body.time === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(body.time) && typeof body.notes === "string" && body.notes.length <= 1000) booking = await rescheduleOwnedBooking(body.reference, session.email, body.time, body.notes);
    else return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    if (!booking) return NextResponse.json({ error: "Booking not found or cannot be changed." }, { status: 404 });
    return NextResponse.json({ booking });
  } catch { return NextResponse.json({ error: "Unable to cancel the booking." }, { status: 503 }); }
}
