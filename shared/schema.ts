import { z } from "zod";

// Pod schema
export const podSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["Running", "Pending", "Failed", "Succeeded", "Unknown"]),
  namespace: z.string(),
  restarts: z.number().optional(),
  age: z.string().optional(),
});

export type Pod = z.infer<typeof podSchema>;

// Node schema
export const nodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["Ready", "NotReady", "Unknown"]),
  cpu: z.string(),
  memory: z.string(),
  pods: z.number().optional(),
  age: z.string().optional(),
});

export type Node = z.infer<typeof nodeSchema>;

// Deployment schema
export const deploymentSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  replicas: z.number(),
  ready: z.number(),
  upToDate: z.number().optional(),
  available: z.number().optional(),
  age: z.string().optional(),
});

export type Deployment = z.infer<typeof deploymentSchema>;

// Service schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  type: z.enum(["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"]),
  clusterIP: z.string().optional(),
  externalIP: z.string().optional(),
  ports: z.string().optional(),
  age: z.string().optional(),
});

export type Service = z.infer<typeof serviceSchema>;

// Stats schema for dashboard
export const statsSchema = z.object({
  totalNodes: z.number(),
  totalPods: z.number(),
  totalDeployments: z.number(),
  totalServices: z.number(),
  runningPods: z.number(),
  failedPods: z.number(),
  readyNodes: z.number(),
});

export type Stats = z.infer<typeof statsSchema>;
