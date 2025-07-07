import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  userId: uuid("userId").primaryKey().notNull().defaultRandom(),
  userName: varchar("userName", { length: 100 }).notNull().unique(),
});

export const problemsSchema = pgTable("problems", {
  problemId: uuid("problemId").primaryKey().notNull().defaultRandom(),
  title: varchar("title", { length: 100 }).notNull().unique(),
  desc: text("desc"),
});
