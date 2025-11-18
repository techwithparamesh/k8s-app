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
  totalRoutes: z.number().optional(),
  totalIngress: z.number().optional(),
  totalConfigMaps: z.number().optional(),
  totalSecrets: z.number().optional(),
  totalPVCs: z.number().optional(),
});

export type Stats = z.infer<typeof statsSchema>;

// Route schema (OpenShift Routes)
export const routeSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  host: z.string(),
  path: z.string().optional(),
  targetService: z.string(),
  targetPort: z.string(),
  tls: z.boolean().optional(),
  age: z.string().optional(),
});

export type Route = z.infer<typeof routeSchema>;

// Ingress schema
export const ingressSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  hosts: z.array(z.string()),
  addresses: z.array(z.string()).optional(),
  ports: z.string().optional(),
  age: z.string().optional(),
});

export type Ingress = z.infer<typeof ingressSchema>;

// ConfigMap schema
export const configMapSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  dataCount: z.number(),
  age: z.string().optional(),
});

export type ConfigMap = z.infer<typeof configMapSchema>;

// Secret schema
export const secretSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  type: z.string(),
  dataCount: z.number(),
  age: z.string().optional(),
});

export type Secret = z.infer<typeof secretSchema>;

// PersistentVolumeClaim schema
export const pvcSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  status: z.enum(["Bound", "Pending", "Lost"]),
  volume: z.string().optional(),
  capacity: z.string().optional(),
  accessModes: z.string(),
  storageClass: z.string().optional(),
  age: z.string().optional(),
});

export type PVC = z.infer<typeof pvcSchema>;

// NetworkPolicy schema
export const networkPolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  podSelector: z.string(),
  policyTypes: z.array(z.string()),
  age: z.string().optional(),
});

export type NetworkPolicy = z.infer<typeof networkPolicySchema>;

// Deployment Config (YAML format)
export const deploymentConfigSchema = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.object({
    name: z.string(),
    namespace: z.string(),
    labels: z.record(z.string()).optional(),
    annotations: z.record(z.string()).optional(),
  }),
  spec: z.any(),
  status: z.any().optional(),
});

export type DeploymentConfig = z.infer<typeof deploymentConfigSchema>;
