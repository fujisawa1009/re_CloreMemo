import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Memo schema
export const memos = pgTable("memos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  color: text("color").notNull().default("#ffffff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMemoSchema = createInsertSchema(memos).pick({
  title: true,
  content: true,
  color: true,
});

export const updateMemoSchema = createInsertSchema(memos).pick({
  title: true,
  content: true,
  color: true,
});

export type InsertMemo = z.infer<typeof insertMemoSchema>;
export type UpdateMemo = z.infer<typeof updateMemoSchema>;
export type Memo = typeof memos.$inferSelect;
