import { sql } from "drizzle-orm";
import { getDb } from "./index";

export type DatabaseStatus =
  | { ok: true }
  | { ok: false; message: string };

export async function pingDatabase(): Promise<DatabaseStatus> {
  if (!process.env.DATABASE_URL) {
    return { ok: false, message: "DATABASE_URL is not set" };
  }

  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database query failed";
    return { ok: false, message };
  }
}
