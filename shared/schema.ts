import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("student"),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  instructor: text("instructor").notNull(),
  description: text("description"),
  term: text("term").notNull(),
  credits: integer("credits").notNull(),
  meetingTimes: text("meeting_times"),
  location: text("location"),
  progress: integer("progress").notNull().default(0),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  priority: text("priority").notNull().default("medium"),
  completed: boolean("completed").notNull().default(false),
  courseId: varchar("course_id"),
});

export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  grade: integer("grade"),
  maxGrade: integer("max_grade").notNull().default(100),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
