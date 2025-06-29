import {
  integer,
  pgTable,
  varchar,
  timestamp,
  jsonb,
  text,
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

export const dsaInterviewTable = pgTable("dsa_interview", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  interview_id: varchar("interview_id", { length: 255 }).notNull(), // use uuid
  problem: jsonb("problem").notNull(),
  codeTemplates: jsonb("code_templates").notNull(),
  code: text("code"),
  language: varchar("language", { length: 50 }),
  timeSpent: text("time_spent"),
  testResults: jsonb("test_results"),
  feedback: jsonb("feedback"),
  score: varchar("score", { length: 10 }),
  performanceMetrics: jsonb("performance_metrics"),
  timestamp: timestamp("timestamp"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
