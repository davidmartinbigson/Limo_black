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
      seeded: false,
    };
  }
  const store = globalThis.__limoBlackMemStore;
  if (!store.seeded) {
    store.seeded = true;
    const vipHash = bcrypt.hashSync("Canada123!", 8);
    const adminHash = bcrypt.hashSync("Admin123!", 8);

    store.users.set("d.macleod@baystreetcapital.ca", {
      id: "usr-vip-01",
      name: "David MacLeod",
      email: "d.macleod@baystreetcapital.ca",
      phone: "+1 (416) 555-0194",
      passwordHash: vipHash,
      role: "customer",
      company: "Bay Street Capital Partners",
      createdAt: "2025-06-15T12:00:00Z",
    });

    store.users.set("admin@limoblack.ca", {
      id: "usr-admin-01",
      name: "Limo Black Dispatch Admin",
      email: "admin@limoblack.ca",
      phone: "+1 (888) 555-5466",
      passwordHash: adminHash,
      role: "admin",
      company: "Limo Black Canada HQ",
      createdAt: "2025-01-01T00:00:00Z",
    });
  }
  return store;
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
  if (!url) return null;
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
  const id = `usr-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const passwordHash = await bcrypt.hash(input.password, 10);
  const role: "customer" | "admin" =
    email === "admin@limoblack.ca" ? "admin" : "customer";
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
    await sql`
      INSERT INTO limo_bookings (reference, user_email, payload)
      VALUES (${reference}, ${email}, ${JSON.stringify(payload)}::jsonb)
      ON CONFLICT (reference)
      DO UPDATE SET payload = EXCLUDED.payload;
    `;
    return;
  }

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
