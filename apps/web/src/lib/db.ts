import { createDb, type Database } from "@bwash/database";

let _db: Database | null = null;

export function getDb(): Database {
  if (!_db) {
    _db = createDb(process.env.DATABASE_URL!);
  }
  return _db;
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
