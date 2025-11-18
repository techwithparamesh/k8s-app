import { useQuery } from "@tanstack/react-query";
import { Server, Box, Layers, Network } from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Stats } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your Kubernetes cluster
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your Kubernetes cluster
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">Failed to load dashboard data</p>
            <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your Kubernetes cluster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResourceCard
          title="Total Nodes"
          value={stats?.totalNodes || 0}
          subtitle={`${stats?.readyNodes || 0} ready`}
          icon={Server}
          iconColor="bg-blue-600"
          testId="card-nodes"
        />
        <ResourceCard
          title="Total Pods"
          value={stats?.totalPods || 0}
          subtitle={`${stats?.runningPods || 0} running, ${stats?.failedPods || 0} failed`}
          icon={Box}
          iconColor="bg-green-600"
          testId="card-pods"
        />
        <ResourceCard
          title="Deployments"
          value={stats?.totalDeployments || 0}
          icon={Layers}
          iconColor="bg-purple-600"
          testId="card-deployments"
        />
        <ResourceCard
          title="Services"
          value={stats?.totalServices || 0}
          icon={Network}
          iconColor="bg-orange-600"
          testId="card-services"
        />
        <ResourceCard
          title="Running Pods"
          value={stats?.runningPods || 0}
          subtitle={`${((stats?.runningPods || 0) / (stats?.totalPods || 1) * 100).toFixed(0)}% of total`}
          icon={Box}
          iconColor="bg-emerald-600"
          testId="card-running-pods"
        />
        <ResourceCard
          title="Ready Nodes"
          value={stats?.readyNodes || 0}
          subtitle={`${((stats?.readyNodes || 0) / (stats?.totalNodes || 1) * 100).toFixed(0)}% of total`}
          icon={Server}
          iconColor="bg-cyan-600"
          testId="card-ready-nodes"
        />
      </div>
    </div>
  );
}
