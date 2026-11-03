import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";
import { listBookingsForUser, saveBookingRecord } from "@/lib/serverDb";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ bookings: [] });
    }
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ bookings: [] });
    }
    const bookings = await listBookingsForUser(
      session.email,
      session.role === "admin"
    );
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ bookings: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking = body.booking as Record<string, unknown> | undefined;
    if (!booking || typeof booking.reference !== "string") {
      return NextResponse.json(
        { error: "Invalid booking payload." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    const ownerEmail = String(
      booking.ownerEmail || session?.email || booking.email || "guest@limoblack.ca"
    )
      .trim()
      .toLowerCase();

    await saveBookingRecord(booking.reference, ownerEmail, {
      ...booking,
      ownerEmail,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error)?.message || "Could not persist booking." },
      { status: 500 }
    );
  }
}
