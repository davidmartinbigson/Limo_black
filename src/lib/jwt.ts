import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  company?: string;
}

const getSecret = () => {
  const raw =
    process.env.JWT_SECRET ||
    process.env.AUTH_SECRET ||
    "limo-black-canada-vip-session-secret-key-2026";
  return new TextEncoder().encode(raw);
};

export const SESSION_COOKIE_NAME = "limoblack_ca_session";

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload || typeof payload.email !== "string") return null;
    return {
      id: String(payload.id || ""),
      name: String(payload.name || "Guest"),
      email: String(payload.email),
      phone: String(payload.phone || ""),
      role: payload.role === "admin" ? "admin" : "customer",
      company: payload.company ? String(payload.company) : undefined,
    };
  } catch {
    return null;
  }
}
