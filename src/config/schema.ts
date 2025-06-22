import {
  integer,
  pgTable,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
});

export const voiceInterviewTable = pgTable("voice_interview", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  interview_id: varchar("interview_id", { length: 255 }).notNull(),
  company: varchar("company", { length: 50 }).notNull(),
  questions: jsonb("questions").default([]),
  answers: jsonb("answers").default([]),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
