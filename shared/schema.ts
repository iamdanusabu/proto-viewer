import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prototypes = pgTable("prototypes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Untitled Prototype"),
  code: text("code").notNull(), // Stores the HTML/CSS/JS content
  device: text("device").notNull().default("iphone-15-pro-max"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPrototypeSchema = createInsertSchema(prototypes).omit({ 
  id: true, 
  createdAt: true 
});

export type Prototype = typeof prototypes.$inferSelect;
export type InsertPrototype = z.infer<typeof insertPrototypeSchema>;
