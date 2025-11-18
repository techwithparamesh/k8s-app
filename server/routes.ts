import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
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

  // WebSocket server for logs and terminal
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const type = url.searchParams.get("type");
    const podId = url.searchParams.get("podId");

    if (type === "logs" && podId) {
      // Simulate streaming logs
      const logMessages = [
        `Starting pod ${podId}...`,
        `Pulling image "nginx:latest"...`,
        `Successfully pulled image`,
        `Creating container...`,
        `Container created successfully`,
        `Starting container...`,
        `Container started`,
        `[INFO] Application listening on port 8080`,
        `[INFO] Database connection established`,
        `[INFO] Ready to accept connections`,
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < logMessages.length) {
          ws.send(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              message: logMessages[index],
            })
          );
          index++;
        } else {
          // Send periodic updates
          const randomLogs = [
            "[INFO] Health check passed",
            "[DEBUG] Processing request",
            "[INFO] Request completed successfully",
            "[DEBUG] Cache hit",
          ];
          ws.send(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              message: randomLogs[Math.floor(Math.random() * randomLogs.length)],
            })
          );
        }
      }, 1000);

      ws.on("close", () => {
        clearInterval(interval);
      });
    } else if (type === "terminal" && podId) {
      // Simulate terminal session
      ws.send(
        JSON.stringify({
          type: "output",
          data: `Connected to pod ${podId}\nroot@${podId}:/# `,
        })
      );

      ws.on("message", (data) => {
        const message = data.toString();
        let response = "";

        // Simulate basic command responses
        if (message.includes("ls")) {
          response = "app.js  node_modules  package.json  README.md\n";
        } else if (message.includes("pwd")) {
          response = "/app\n";
        } else if (message.includes("whoami")) {
          response = "root\n";
        } else if (message.includes("date")) {
          response = new Date().toString() + "\n";
        } else if (message.includes("echo")) {
          response = message.replace("echo ", "") + "\n";
        } else {
          response = `bash: ${message.trim()}: command not found\n`;
        }

        ws.send(
          JSON.stringify({
            type: "output",
            data: response + `root@${podId}:/# `,
          })
        );
      });
    }
  });

  return httpServer;
}
