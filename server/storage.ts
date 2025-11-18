import type { Pod, Node, Deployment, Service, Stats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getStats(): Promise<Stats>;
  getPods(): Promise<Pod[]>;
  getNodes(): Promise<Node[]>;
  getDeployments(): Promise<Deployment[]>;
  getServices(): Promise<Service[]>;
  scaleDeployment(id: string, replicas: number): Promise<Deployment>;
}

export class MemStorage implements IStorage {
  private pods: Pod[];
  private nodes: Node[];
  private deployments: Deployment[];
  private services: Service[];

  constructor() {
    this.pods = this.generateMockPods();
    this.nodes = this.generateMockNodes();
    this.deployments = this.generateMockDeployments();
    this.services = this.generateMockServices();
  }

  private generateMockPods(): Pod[] {
    const namespaces = ["default", "kube-system", "production", "staging"];
    const statuses: Pod["status"][] = ["Running", "Pending", "Failed", "Succeeded"];
    const podPrefixes = [
      "frontend",
      "backend",
      "database",
      "redis",
      "nginx",
      "api",
      "worker",
      "scheduler",
    ];

    return Array.from({ length: 15 }, (_, i) => ({
      id: randomUUID(),
      name: `${podPrefixes[i % podPrefixes.length]}-pod-${Math.random().toString(36).substring(7)}`,
      status: i < 10 ? "Running" : statuses[i % statuses.length],
      namespace: namespaces[i % namespaces.length],
      restarts: Math.floor(Math.random() * 5),
      age: this.randomAge(),
    }));
  }

  private generateMockNodes(): Node[] {
    const statuses: Node["status"][] = ["Ready", "NotReady"];
    return Array.from({ length: 4 }, (_, i) => ({
      id: randomUUID(),
      name: `node-${i + 1}`,
      status: i === 3 ? "NotReady" : "Ready",
      cpu: `${Math.floor(Math.random() * 80 + 10)}%`,
      memory: `${(Math.random() * 6 + 2).toFixed(1)}GB / 8GB`,
      pods: Math.floor(Math.random() * 30 + 10),
      age: this.randomAge(),
    }));
  }

  private generateMockDeployments(): Deployment[] {
    const namespaces = ["default", "production", "staging"];
    const deploymentNames = [
      "frontend",
      "backend",
      "api-gateway",
      "auth-service",
      "payment-service",
      "notification-service",
    ];

    return deploymentNames.map((name, i) => ({
      id: randomUUID(),
      name,
      namespace: namespaces[i % namespaces.length],
      replicas: Math.floor(Math.random() * 5 + 1),
      ready: Math.floor(Math.random() * 5 + 1),
      upToDate: Math.floor(Math.random() * 5 + 1),
      available: Math.floor(Math.random() * 5 + 1),
      age: this.randomAge(),
    }));
  }

  private generateMockServices(): Service[] {
    const namespaces = ["default", "kube-system", "production"];
    const serviceTypes: Service["type"][] = [
      "ClusterIP",
      "NodePort",
      "LoadBalancer",
      "ClusterIP",
    ];
    const serviceNames = [
      "web-service",
      "api-service",
      "database-service",
      "redis-service",
      "nginx-ingress",
    ];

    return serviceNames.map((name, i) => ({
      id: randomUUID(),
      name,
      namespace: namespaces[i % namespaces.length],
      type: serviceTypes[i % serviceTypes.length],
      clusterIP: `10.96.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      externalIP:
        serviceTypes[i % serviceTypes.length] === "LoadBalancer"
          ? `34.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          : undefined,
      ports: `${Math.floor(Math.random() * 9000 + 1000)}/TCP`,
      age: this.randomAge(),
    }));
  }

  private randomAge(): string {
    const days = Math.floor(Math.random() * 365);
    if (days === 0) return `${Math.floor(Math.random() * 24)}h`;
    return `${days}d`;
  }

  async getStats(): Promise<Stats> {
    const runningPods = this.pods.filter((p) => p.status === "Running").length;
    const failedPods = this.pods.filter((p) => p.status === "Failed").length;
    const readyNodes = this.nodes.filter((n) => n.status === "Ready").length;

    return {
      totalNodes: this.nodes.length,
      totalPods: this.pods.length,
      totalDeployments: this.deployments.length,
      totalServices: this.services.length,
      runningPods,
      failedPods,
      readyNodes,
    };
  }

  async getPods(): Promise<Pod[]> {
    return this.pods;
  }

  async getNodes(): Promise<Node[]> {
    return this.nodes;
  }

  async getDeployments(): Promise<Deployment[]> {
    return this.deployments;
  }

  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async scaleDeployment(id: string, replicas: number): Promise<Deployment> {
    const deployment = this.deployments.find((d) => d.id === id);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    deployment.replicas = replicas;
    deployment.ready = Math.min(replicas, deployment.ready || 0);
    deployment.upToDate = Math.min(replicas, deployment.upToDate || 0);
    deployment.available = Math.min(replicas, deployment.available || 0);

    return deployment;
  }
}

export const storage = new MemStorage();
