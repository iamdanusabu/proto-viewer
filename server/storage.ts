import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  prototypes,
  type Prototype,
  type InsertPrototype
} from "@shared/schema";

export interface IStorage {
  getPrototypes(): Promise<Prototype[]>;
  getPrototype(id: number): Promise<Prototype | undefined>;
  createPrototype(prototype: InsertPrototype): Promise<Prototype>;
}

export class DatabaseStorage implements IStorage {
  async getPrototypes(): Promise<Prototype[]> {
    return await db.select().from(prototypes);
  }

  async getPrototype(id: number): Promise<Prototype | undefined> {
    const [prototype] = await db.select().from(prototypes).where(eq(prototypes.id, id));
    return prototype;
  }

  async createPrototype(insertPrototype: InsertPrototype): Promise<Prototype> {
    const [prototype] = await db.insert(prototypes).values(insertPrototype).returning();
    return prototype;
  }
}

export const storage = new DatabaseStorage();
