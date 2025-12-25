import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/prototypes
  app.get(api.prototypes.list.path, async (req, res) => {
    const prototypes = await storage.getPrototypes();
    res.json(prototypes);
  });

  // POST /api/prototypes
  app.post(api.prototypes.create.path, async (req, res) => {
    try {
      const input = api.prototypes.create.input.parse(req.body);
      const prototype = await storage.createPrototype(input);
      res.status(201).json(prototype);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // GET /api/prototypes/:id
  app.get(api.prototypes.get.path, async (req, res) => {
    const prototype = await storage.getPrototype(Number(req.params.id));
    if (!prototype) {
      return res.status(404).json({ message: 'Prototype not found' });
    }
    res.json(prototype);
  });

  // Seed default data if empty
  const existing = await storage.getPrototypes();
  if (existing.length === 0) {
    await storage.createPrototype({
      name: "Demo Project",
      device: "iphone-15-pro-max",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #333;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { font-size: 1rem; opacity: 0.8; }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 80%;
    }
    button {
      background: #007AFF;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.1s;
    }
    button:active { transform: scale(0.95); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World</h1>
    <p>This is a live preview inside an iPhone 15 Pro Max frame.</p>
    <button onclick="alert('It works!')">Tap me</button>
  </div>
</body>
</html>`
    });
  }

  return httpServer;
}
