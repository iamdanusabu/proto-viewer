import {
  type Prototype,
  type InsertPrototype
} from "@shared/schema";

export interface IStorage {
  getPrototypes(): Promise<Prototype[]>;
  getPrototype(id: number): Promise<Prototype | undefined>;
  createPrototype(prototype: InsertPrototype): Promise<Prototype>;
}

export class MemStorage implements IStorage {
  private prototypes: Map<number, Prototype>;
  private currentId: number;

  constructor() {
    this.prototypes = new Map();
    this.currentId = 1;
  }

  async getPrototypes(): Promise<Prototype[]> {
    return Array.from(this.prototypes.values());
  }

  async getPrototype(id: number): Promise<Prototype | undefined> {
    return this.prototypes.get(id);
  }

  async createPrototype(insertPrototype: InsertPrototype): Promise<Prototype> {
    const id = this.currentId++;
    const prototype: Prototype = {
      ...insertPrototype,
      id,
      createdAt: new Date(),
      name: insertPrototype.name ?? "Untitled Prototype",
      device: insertPrototype.device ?? "iphone-15-pro-max",
    };
    this.prototypes.set(id, prototype);
    return prototype;
  }
}

export const storage = new MemStorage();
