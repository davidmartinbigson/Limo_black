import { NextResponse } from "next/server";
import {
  createUserAccount,
  findUserByEmail,
  getPostgresUrl,
} from "@/lib/serverDb";
import { SESSION_COOKIE_NAME, signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "+1 (416) 555-0100").trim();
    const password = String(body.password || "");
    const company = body.company ? String(body.company).trim() : undefined;

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid full name and email address." },
        { status: 400 }
      );
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters and no more than 72 bytes." },
        { status: 400 }
      );
    }

    if (email === "owner@limoblack.invalid") return NextResponse.json({ error: "This email cannot be used." }, { status: 400 });

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    const created = await createUserAccount({
      name,
      email,
      phone,
      password,
      company,
    });

    const token = await signSessionToken({
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      role: created.role,
      company: created.company,
    });

    const res = NextResponse.json({
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        role: created.role,
        company: created.company,
        tier:
          created.role === "admin"
            ? "Dispatch Administrator"
            : "Obsidian VIP Canada",
        memberSince: new Date().getFullYear().toString(),
      },
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
      { error: "Account service unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
