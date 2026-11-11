import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  bootstrapOwner,
  consumeLoginAttempt,
  clearLoginAttempts,
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

    if (!(await consumeLoginAttempt(email))) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
    const isOwnerLogin = email === "muhammadzubair";
    let found = await findUserByEmail(isOwnerLogin ? "owner@limoblack.invalid" : email);
    if (!found && isOwnerLogin) found = await bootstrapOwner(password);
    if (isOwnerLogin && found?.role !== "admin") found = null;
    if (!found) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, found.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await clearLoginAttempts(email);
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Authentication service unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
