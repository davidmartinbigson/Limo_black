import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "customer" | "admin";
  company?: string;
  gstNumber?: string;
  createdAt: string;
}

export interface StoredBookingRow {
  reference: string;
  userEmail: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

interface MemoryStore {
  users: Map<string, StoredUser>;
  bookings: Map<string, StoredBookingRow>;
  profiles: Map<string, Record<string, unknown>>;
  authAttempts: Map<string, { count: number; until: number }>;
  seeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __limoBlackMemStore: MemoryStore | undefined;
}

function getMemStore(): MemoryStore {
  if (!globalThis.__limoBlackMemStore) {
    globalThis.__limoBlackMemStore = {
      users: new Map(),
      bookings: new Map(),
      profiles: new Map(),
      authAttempts: new Map(),
      seeded: false,
    };
  }
  return globalThis.__limoBlackMemStore;
}

export function getPostgresUrl(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    null
  );
}

let pgSchemaReady = false;

async function getPgClient() {
  const url = getPostgresUrl();
  if (!url) {
    if (process.env.NODE_ENV === "production") throw new Error("Database is not configured");
    return null;
  }
  const sql = neon(url);
  if (!pgSchemaReady) {
    await sql`
      CREATE TABLE IF NOT EXISTS limo_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        company TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS limo_bookings (
        reference TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE TABLE IF NOT EXISTS limo_profiles (user_id TEXT PRIMARY KEY REFERENCES limo_users(id) ON DELETE CASCADE, payload JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS limo_auth_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL)`;
    pgSchemaReady = true;
  }
  return sql;
}

export async function findUserByEmail(
  rawEmail: string
): Promise<StoredUser | null> {
  const email = rawEmail.trim().toLowerCase();
  const sql = await getPgClient();
  if (sql) {
    const rows = await sql`
      SELECT id, name, email, phone, password_hash, role, company, created_at
      FROM limo_users
      WHERE email = ${email}
      LIMIT 1;
    `;
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: String(r.id),
      name: String(r.name),
      email: String(r.email),
      phone: String(r.phone),
      passwordHash: String(r.password_hash),
      role: r.role === "admin" ? "admin" : "customer",
      company: r.company ? String(r.company) : undefined,
      createdAt: String(r.created_at),
    };
  }

  return getMemStore().users.get(email) || null;
}

export async function createUserAccount(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  company?: string;
}): Promise<StoredUser> {
  const email = input.email.trim().toLowerCase();
  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(input.password, 10);
  // Public signup must never grant administrative privileges.
  const role: "customer" | "admin" = "customer";
  const createdAt = new Date().toISOString();

  const user: StoredUser = {
    id,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    passwordHash,
    role,
    company: input.company?.trim() || undefined,
    createdAt,
  };

  const sql = await getPgClient();
  if (sql) {
    await sql`
      INSERT INTO limo_users (id, name, email, phone, password_hash, role, company)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.phone}, ${user.passwordHash}, ${user.role}, ${user.company || null});
    `;
    return user;
  }

  getMemStore().users.set(email, user);
  return user;
}

export async function saveBookingRecord(
  reference: string,
  userEmail: string,
  payload: Record<string, unknown>
): Promise<void> {
  const email = userEmail.trim().toLowerCase();
  const sql = await getPgClient();
  if (sql) {
    const rows = await sql`
      INSERT INTO limo_bookings (reference, user_email, payload)
      VALUES (${reference}, ${email}, ${JSON.stringify(payload)}::jsonb)
      ON CONFLICT (reference) DO NOTHING
      RETURNING reference;
    `;
    if (!rows.length) throw new Error("Booking cannot be updated");
    return;
  }

  const existing = getMemStore().bookings.get(reference);
  if (existing) throw new Error("Booking already exists");
  getMemStore().bookings.set(reference, {
    reference,
    userEmail: email,
    payload,
    createdAt: new Date().toISOString(),
  });
}

export async function listBookingsForUser(
  userEmail: string,
  isAdmin: boolean
): Promise<Record<string, unknown>[]> {
  const email = userEmail.trim().toLowerCase();
  const sql = await getPgClient();
  if (sql) {
    const rows = isAdmin
      ? await sql`SELECT payload FROM limo_bookings ORDER BY created_at DESC LIMIT 200;`
      : await sql`SELECT payload FROM limo_bookings WHERE user_email = ${email} ORDER BY created_at DESC LIMIT 100;`;
    return rows.map((r) => (r.payload || {}) as Record<string, unknown>);
  }

  const all = Array.from(getMemStore().bookings.values());
  const filtered = isAdmin
    ? all
    : all.filter((b) => b.userEmail === email);
  return filtered.reverse().map((b) => b.payload);
}

// Updates only the authenticated owner's active booking; never replaces its owner or fare.
export async function cancelOwnedBooking(reference: string, email: string): Promise<Record<string, unknown> | null> {
  const sql = await getPgClient();
  const owner = email.trim().toLowerCase();
  if (sql) {
    const rows = await sql`UPDATE limo_bookings SET payload = jsonb_set(payload, '{status}', '"Cancelled"'::jsonb)
      WHERE reference = ${reference} AND user_email = ${owner}
      AND payload->>'status' NOT IN ('Cancelled', 'Completed') RETURNING payload`;
    return rows.length ? rows[0].payload as Record<string, unknown> : null;
  }
  const record = getMemStore().bookings.get(reference);
  if (!record || record.userEmail !== owner || ["Cancelled", "Completed"].includes(String(record.payload.status))) return null;
  record.payload = { ...record.payload, status: "Cancelled" };
  return record.payload;
}

export async function getUserProfile(id: string): Promise<Record<string, unknown>> {
  const sql = await getPgClient();
  if (sql) { const rows = await sql`SELECT payload FROM limo_profiles WHERE user_id = ${id}`; return rows.length ? rows[0].payload as Record<string, unknown> : {}; }
  return getMemStore().profiles.get(id) || {};
}
export async function setUserProfile(id: string, profile: Record<string, unknown>): Promise<void> {
  const sql = await getPgClient();
  if (sql) { await sql`INSERT INTO limo_profiles (user_id, payload) VALUES (${id}, ${JSON.stringify(profile)}::jsonb) ON CONFLICT (user_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`; return; }
  getMemStore().profiles.set(id, profile);
}

export async function rescheduleOwnedBooking(reference: string, email: string, time: string, notes: string): Promise<Record<string, unknown> | null> {
  const sql = await getPgClient();
  const owner = email.trim().toLowerCase();
  if (sql) {
    const rows = await sql`UPDATE limo_bookings SET payload = jsonb_set(jsonb_set(payload, '{time}', to_jsonb(${time}::text)), '{cabin,notes}', to_jsonb(${notes}::text))
      WHERE reference = ${reference} AND user_email = ${owner} AND payload->>'status' = 'Confirmed' AND jsonb_typeof(payload->'cabin') = 'object' RETURNING payload`;
    return rows.length ? rows[0].payload as Record<string, unknown> : null;
  }
  const record = getMemStore().bookings.get(reference);
  if (!record || record.userEmail !== owner || record.payload.status !== "Confirmed" || !record.payload.cabin || typeof record.payload.cabin !== "object") return null;
  record.payload = { ...record.payload, time, cabin: { ...(record.payload.cabin as Record<string, unknown>), notes } };
  return record.payload;
}

// Initial owner is created only after a secret supplied through server configuration is verified.
export async function bootstrapOwner(password: string): Promise<StoredUser | null> {
  const bootstrap = process.env.OWNER_BOOTSTRAP_PASSWORD;
  if (!bootstrap || bootstrap.length < 12 || Buffer.byteLength(bootstrap, "utf8") > 72) return null;
  const { timingSafeEqual } = await import("crypto");
  const a = Buffer.from(password); const b = Buffer.from(bootstrap);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const email = "owner@limoblack.invalid";
  if (await findUserByEmail(email)) return null;
  const sql = await getPgClient();
  if (!sql) return null;
  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 12);
  const rows = await sql`INSERT INTO limo_users (id, name, email, phone, password_hash, role) VALUES (${id}, 'Owner', ${email}, '', ${hash}, 'admin') ON CONFLICT (email) DO NOTHING RETURNING id`;
  return rows.length ? findUserByEmail(email) : null;
}

export async function consumeLoginAttempt(identifier: string): Promise<boolean> {
  const { createHash } = await import("crypto");
  const key = createHash("sha256").update(identifier.toLowerCase()).digest("hex");
  const sql = await getPgClient();
  if (sql) {
    const rows = await sql`INSERT INTO limo_auth_limits (key, attempts, expires_at) VALUES (${key}, 1, NOW() + INTERVAL '15 minutes') ON CONFLICT (key) DO UPDATE SET attempts = CASE WHEN limo_auth_limits.expires_at < NOW() THEN 1 ELSE limo_auth_limits.attempts + 1 END, expires_at = CASE WHEN limo_auth_limits.expires_at < NOW() THEN NOW() + INTERVAL '15 minutes' ELSE limo_auth_limits.expires_at END RETURNING attempts`;
    return Number(rows[0].attempts) <= 10;
  }
  const store = getMemStore().authAttempts; let current = store.get(key);
  if (!current || current.until < Date.now()) current = { count: 0, until: Date.now() + 900000 };
  current.count++; store.set(key, current); return current.count <= 10;
}
export async function clearLoginAttempts(identifier: string): Promise<void> {
  const { createHash } = await import("crypto"); const key = createHash("sha256").update(identifier.toLowerCase()).digest("hex");
  const sql = await getPgClient(); if (sql) await sql`DELETE FROM limo_auth_limits WHERE key = ${key}`; else getMemStore().authAttempts.delete(key);
}

// Owner operations use persistent PostgreSQL only; never silently fall back to a fake store.
async function adminDb() {
  const sql = await getPgClient();
  if (!sql) throw new Error('Database is not configured');
  await sql`CREATE TABLE IF NOT EXISTS limo_drivers (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', vehicle_model TEXT NOT NULL DEFAULT '', plate TEXT NOT NULL DEFAULT '', active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS limo_driver_auth (driver_id TEXT PRIMARY KEY REFERENCES limo_drivers(id) ON DELETE CASCADE, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, approved BOOLEAN NOT NULL DEFAULT FALSE, token_version INTEGER NOT NULL DEFAULT 1)`;
  return sql;
}
export async function getAdminData() {
  const sql = await adminDb();
  const [bookings, drivers, customers] = await Promise.all([
    sql`SELECT payload FROM limo_bookings ORDER BY created_at DESC`,
    sql`SELECT d.id, d.name, d.phone, COALESCE(a.email, d.email) AS email, d.vehicle_model AS "vehicleModel", d.plate, d.active, d.created_at AS "createdAt", a.approved, (a.driver_id IS NOT NULL) AS "hasLogin" FROM limo_drivers d LEFT JOIN limo_driver_auth a ON a.driver_id = d.id ORDER BY d.created_at DESC`,
    sql`SELECT u.id, u.name, u.email, u.phone, u.company, u.created_at AS "createdAt", COUNT(b.reference)::int AS "bookingCount" FROM limo_users u LEFT JOIN limo_bookings b ON b.user_email = u.email WHERE u.role = 'customer' GROUP BY u.id ORDER BY u.created_at DESC`
  ]);
  return { bookings: bookings.map(row => row.payload), drivers, customers };
}
export async function createDriverAccount(input: { name: string; phone: string; email: string; vehicleModel: string; plate: string; password: string }, approved: boolean) {
  const sql = await adminDb();
  const hash = await bcrypt.hash(input.password, 12);
  const id = crypto.randomUUID();
  // A single statement ensures a duplicate login cannot leave an orphaned driver.
  await sql`WITH new_driver AS (INSERT INTO limo_drivers (id, name, phone, email, vehicle_model, plate, active) VALUES (${id}, ${input.name}, ${input.phone}, ${input.email}, ${input.vehicleModel}, ${input.plate}, ${approved}) RETURNING id) INSERT INTO limo_driver_auth (driver_id, email, password_hash, approved) SELECT id, ${input.email}, ${hash}, ${approved} FROM new_driver`;
}
export async function setDriverCredentials(id: string, email: string, password: string) {
  const sql = await adminDb(); const hash = await bcrypt.hash(password, 12);
  const rows = await sql`INSERT INTO limo_driver_auth (driver_id, email, password_hash, approved) SELECT d.id, ${email}, ${hash}, TRUE FROM limo_drivers d WHERE d.id = ${id} AND NOT EXISTS (SELECT 1 FROM limo_driver_auth a WHERE a.driver_id = d.id AND a.approved = FALSE) ON CONFLICT (driver_id) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, token_version = limo_driver_auth.token_version + 1 RETURNING driver_id`;
  return rows.length > 0;
}
export async function approveDriver(id: string) {
  const sql = await adminDb();
  const rows = await sql`WITH approved AS (UPDATE limo_driver_auth SET approved = TRUE, token_version = token_version + 1 WHERE driver_id = ${id} AND approved = FALSE RETURNING driver_id) UPDATE limo_drivers SET active = TRUE WHERE id IN (SELECT driver_id FROM approved) RETURNING id`;
  return rows.length > 0;
}
export async function findDriverLogin(email: string) {
  const sql = await adminDb();
  const rows = await sql`SELECT d.id, d.name, d.phone, d.active, a.email, a.password_hash AS "passwordHash", a.approved, a.token_version AS "tokenVersion" FROM limo_driver_auth a JOIN limo_drivers d ON d.id = a.driver_id WHERE a.email = ${email} LIMIT 1`;
  return rows[0] || null;
}
export async function getDriverSession(id: string, version: number) {
  const sql = await adminDb();
  const rows = await sql`SELECT d.id, d.name, d.phone, a.email, a.token_version AS "tokenVersion" FROM limo_drivers d JOIN limo_driver_auth a ON a.driver_id = d.id WHERE d.id = ${id} AND d.active = TRUE AND a.approved = TRUE AND a.token_version = ${version}`;
  return rows[0] || null;
}
export async function listDriverBookings(id: string, version: number) {
  const sql = await adminDb();
  const rows = await sql`SELECT b.payload FROM limo_bookings b JOIN limo_drivers d ON d.id = b.payload->'chauffeur'->>'driverId' JOIN limo_driver_auth a ON a.driver_id = d.id WHERE d.id = ${id} AND d.active = TRUE AND a.approved = TRUE AND a.token_version = ${version} ORDER BY b.created_at DESC`;
  // Return only fields required to fulfil assigned rides, not customer accounts or payment data.
  return rows.map(({ payload: p }) => ({ reference: p.reference, date: p.date, time: p.time, pickup: p.pickup, dropoff: p.dropoff, extraStops: p.extraStops, rideType: p.rideType, durationHours: p.durationHours, passengersCount: p.passengersCount, luggageCount: p.luggageCount, firstName: p.firstName, lastName: p.lastName, phone: p.phone, flightNumber: p.flightNumber, status: p.status, selectedClassId: p.selectedClassId, cabin: p.cabin }));
}
export async function changeDriverActive(id: string, active: boolean) {
  const sql = await adminDb();
  const rows = await sql`WITH revoked AS (UPDATE limo_driver_auth SET token_version = token_version + 1 WHERE driver_id = ${id} AND ${active} = FALSE RETURNING driver_id) UPDATE limo_drivers SET active = ${active} WHERE id = ${id} AND (${active} = FALSE OR NOT EXISTS (SELECT 1 FROM limo_driver_auth a WHERE a.driver_id = ${id} AND a.approved = FALSE)) RETURNING id`;
  return rows.length > 0;
}
export async function assignAdminDriver(reference: string, driverId: string) {
  const sql = await adminDb();
  const rows = await sql`UPDATE limo_bookings b SET payload = jsonb_set(jsonb_set(b.payload, '{chauffeur}', jsonb_build_object('name', d.name, 'phone', d.phone, 'vehicleModel', d.vehicle_model, 'plate', d.plate, 'rating', '', 'languages', '', 'driverId', d.id)), '{status}', to_jsonb('Chauffeur Assigned'::text)) FROM limo_drivers d WHERE b.reference = ${reference} AND d.id = ${driverId} AND d.active = TRUE AND b.payload->>'status' IN ('Confirmed', 'Chauffeur Assigned') RETURNING b.reference`;
  return rows.length > 0;
}
export async function changeAdminBookingStatus(reference: string, status: string) {
  const sql = await adminDb();
  // Compare current status in the update itself, avoiding overwriting concurrent changes.
  const rows = await sql`UPDATE limo_bookings SET payload = jsonb_set(payload, '{status}', to_jsonb(${status}::text)) WHERE reference = ${reference} AND (( ${status} = 'Chauffeur En Route' AND payload->>'status' = 'Chauffeur Assigned') OR (${status} = 'Chauffeur Arrived' AND payload->>'status' = 'Chauffeur En Route') OR (${status} = 'Completed' AND payload->>'status' = 'Chauffeur Arrived') OR (${status} = 'Cancelled' AND payload->>'status' IN ('Confirmed', 'Chauffeur Assigned', 'Chauffeur En Route', 'Chauffeur Arrived'))) RETURNING reference`;
  return rows.length > 0;
}
