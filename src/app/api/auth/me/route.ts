import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";
import { getPostgresUrl, listBookingsForUser, getUserProfile } from "@/lib/serverDb";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({
        user: null,
        storageMode: getPostgresUrl() ? "postgres" : "hybrid",
      });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({
        user: null,
        storageMode: getPostgresUrl() ? "postgres" : "hybrid",
      });
    }

    const bookings = await listBookingsForUser(
      session.email,
      session.role === "admin"
    );

    const profile = await getUserProfile(session.id);
    return NextResponse.json({
      user: {
        ...session,
        ...profile,
        tier:
          session.role === "admin"
            ? "Dispatch Administrator"
            : "Obsidian VIP Canada",
        memberSince: "2025",
      },
      bookings,
      storageMode: getPostgresUrl() ? "postgres" : "hybrid",
    });
  } catch {
    return NextResponse.json({ user: null, storageMode: "hybrid" });
  }
}
