import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  getPostgresUrl,
  listBookingsForUser,
} from "@/lib/serverDb";
import { SESSION_COOKIE_NAME, signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const found = await findUserByEmail(email);
    if (!found) {
      return NextResponse.json(
        {
          error:
            "No account found on server for this email, or please check your credentials.",
          code: "USER_NOT_FOUND",
        },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, found.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      role: found.role,
      company: found.company,
    });

    const userBookings = await listBookingsForUser(
      found.email,
      found.role === "admin"
    );

    const res = NextResponse.json({
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role,
        company: found.company,
        tier:
          found.role === "admin"
            ? "Dispatch Administrator"
            : "Obsidian VIP Canada",
        memberSince: "2025",
      },
      bookings: userBookings,
      storageMode: getPostgresUrl() ? "postgres" : "hybrid",
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error)?.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
