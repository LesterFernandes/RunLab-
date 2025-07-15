import { db } from "@db/connect";
import { eq } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

export async function slugExists(table: PgTableWithColumns<any>, slug: string) {
  const res = await db.select().from(table).where(eq(table.slug, slug));
  return res.length > 0;
}
