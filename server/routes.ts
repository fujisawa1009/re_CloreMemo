import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemoSchema, updateMemoSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all memos
  app.get("/api/memos", async (req: Request, res: Response) => {
    try {
      const memos = await storage.getMemos();
      res.json(memos);
    } catch (error) {
      console.error("Error fetching memos:", error);
      res.status(500).json({ message: "Failed to fetch memos" });
    }
  });

  // Get a specific memo
  app.get("/api/memos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid memo ID" });
      }
      
      const memo = await storage.getMemo(id);
      
      if (!memo) {
        return res.status(404).json({ message: "Memo not found" });
      }
      
      res.json(memo);
    } catch (error) {
      console.error("Error fetching memo:", error);
      res.status(500).json({ message: "Failed to fetch memo" });
    }
  });

  // Create a new memo
  app.post("/api/memos", async (req: Request, res: Response) => {
    try {
      const validationResult = insertMemoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newMemo = await storage.createMemo(validationResult.data);
      res.status(201).json(newMemo);
    } catch (error) {
      console.error("Error creating memo:", error);
      res.status(500).json({ message: "Failed to create memo" });
    }
  });

  // Update a memo
  app.put("/api/memos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid memo ID" });
      }
      
      const validationResult = updateMemoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedMemo = await storage.updateMemo(id, validationResult.data);
      
      if (!updatedMemo) {
        return res.status(404).json({ message: "Memo not found" });
      }
      
      res.json(updatedMemo);
    } catch (error) {
      console.error("Error updating memo:", error);
      res.status(500).json({ message: "Failed to update memo" });
    }
  });

  // Delete a memo
  app.delete("/api/memos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid memo ID" });
      }
      
      const success = await storage.deleteMemo(id);
      
      if (!success) {
        return res.status(404).json({ message: "Memo not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting memo:", error);
      res.status(500).json({ message: "Failed to delete memo" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
