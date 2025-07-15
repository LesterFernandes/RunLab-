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
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  userId: uuid("user_id").primaryKey().notNull().defaultRandom(),
  userName: varchar("user_name", { length: 100 }).notNull().unique(),
});

export const problemsSchema = pgTable("problems", {
  problemId: uuid("problem_id").primaryKey().notNull().defaultRandom(),
  title: varchar({ length: 100 }).notNull(),
  desc: text(),
  slug: varchar({ length: 100 }).notNull().unique(),
});

export const langsEnum = pgEnum("langs", ["py", "js", "ts", "go"]);

export const solutionsSchema = pgTable("solutions", {
  solutionId: uuid("solution_id").primaryKey().notNull().defaultRandom(),
  code: text(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problemsSchema.problemId),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersSchema.userId),
  lang: langsEnum(),
});

export const testCasesSchema = pgTable("test_cases", {
  testCaseId: uuid("test_case_id").primaryKey().defaultRandom(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problemsSchema.problemId),
  input: jsonb("input").notNull(),
  expectedOutput: jsonb("expected_output").notNull(),
  isHidden: boolean("is_hidden").default(false),
  isExample: boolean("is_example").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
