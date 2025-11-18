import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard statistics
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get all pods
  app.get("/api/pods", async (_req, res) => {
    try {
      const pods = await storage.getPods();
      res.json(pods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pods" });
    }
  });

  // Get all nodes
  app.get("/api/nodes", async (_req, res) => {
    try {
      const nodes = await storage.getNodes();
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nodes" });
    }
  });

  // Get all deployments
  app.get("/api/deployments", async (_req, res) => {
    try {
      const deployments = await storage.getDeployments();
      res.json(deployments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deployments" });
    }
  });

  // Get all services
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Scale deployment
  app.patch("/api/deployments/:id/scale", async (req, res) => {
    try {
      const { id } = req.params;
      const { replicas } = req.body;

      if (typeof replicas !== "number" || replicas < 0) {
        return res.status(400).json({ error: "Invalid replicas value" });
      }

      const deployment = await storage.scaleDeployment(id, replicas);
      res.json(deployment);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to scale deployment";
      res.status(404).json({ error: message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
