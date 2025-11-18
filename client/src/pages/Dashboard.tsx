import { useQuery } from "@tanstack/react-query";
import { Server, Box, Layers, Network, TrendingUp, Activity, AlertCircle, CheckCircle2, Globe, HardDrive, Shield, Zap } from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Stats } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return <LoadingState title="Dashboard" description="Overview of your Kubernetes cluster" />;
  }

  if (isError) {
    return <ErrorState title="Dashboard" description="Overview of your Kubernetes cluster" />;
  }

  const podHealthPercentage = ((stats?.runningPods ?? 0) / (stats?.totalPods ?? 1)) * 100;
  const nodeHealthPercentage = ((stats?.readyNodes ?? 0) / (stats?.totalNodes ?? 1)) * 100;
  const clusterHealth = (podHealthPercentage + nodeHealthPercentage) / 2;

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Header with Cluster Status */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">
            Dashboard
          </h1>
          <p className="text-base text-muted-foreground">
            Real-time overview of your Kubernetes cluster
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium">Cluster Healthy</span>
            <Badge variant="secondary" className="ml-2">{clusterHealth.toFixed(0)}%</Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up">
        <ResourceCard
          title="Total Nodes"
          value={stats?.totalNodes ?? 0}
          subtitle={`${stats?.readyNodes ?? 0} ready`}
          icon={Server}
          iconColor="bg-blue-600"
          testId="card-nodes"
        />
        <ResourceCard
          title="Total Pods"
          value={stats?.totalPods ?? 0}
          subtitle={`${stats?.runningPods ?? 0} running`}
          icon={Box}
          iconColor="bg-emerald-600"
          testId="card-pods"
        />
        <ResourceCard
          title="Deployments"
          value={stats?.totalDeployments ?? 0}
          subtitle={`Active workloads`}
          icon={Layers}
          iconColor="bg-purple-600"
          testId="card-deployments"
        />
        <ResourceCard
          title="Services"
          value={stats?.totalServices ?? 0}
          subtitle={`Network endpoints`}
          icon={Network}
          iconColor="bg-orange-600"
          testId="card-services"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cluster Health */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Cluster Health
                </CardTitle>
                <CardDescription className="mt-1">Resource availability and status</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pod Health */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">Pod Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stats?.runningPods ?? 0} / {stats?.totalPods ?? 0}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {podHealthPercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <Progress value={podHealthPercentage} className="h-2" />
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {stats?.runningPods ?? 0} Running
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  {stats?.failedPods ?? 0} Failed
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-amber-500" />
                  {(stats?.totalPods ?? 0) - (stats?.runningPods ?? 0) - (stats?.failedPods ?? 0)} Pending
                </span>
              </div>
            </div>

            {/* Node Health */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Node Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stats?.readyNodes ?? 0} / {stats?.totalNodes ?? 0}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {nodeHealthPercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <Progress value={nodeHealthPercentage} className="h-2" />
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {stats?.readyNodes ?? 0} Ready
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  {(stats?.totalNodes ?? 0) - (stats?.readyNodes ?? 0)} Not Ready
                </span>
              </div>
            </div>

            {/* Overall Cluster Score */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Overall Cluster Score</span>
                </div>
                <span className={`text-2xl font-bold ${
                  clusterHealth >= 90 ? 'text-emerald-600' : 
                  clusterHealth >= 70 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {clusterHealth.toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={clusterHealth} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Networking */}
        <div className="space-y-6">
          {/* Networking Resources */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-4 h-4 text-primary" />
                Networking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-info flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Routes</p>
                    <p className="text-xs text-muted-foreground">External access</p>
                  </div>
                </div>
                <span className="text-xl font-bold">{stats?.totalRoutes ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Network className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ingress</p>
                    <p className="text-xs text-muted-foreground">HTTP routing</p>
                  </div>
                </div>
                <span className="text-xl font-bold">{stats?.totalIngress ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Storage & Config */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HardDrive className="w-4 h-4 text-primary" />
                Storage & Config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-success flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">PVCs</p>
                    <p className="text-xs text-muted-foreground">Volume claims</p>
                  </div>
                </div>
                <span className="text-xl font-bold">{stats?.totalPVCs ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-warning flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">ConfigMaps</p>
                    <p className="text-xs text-muted-foreground">Configurations</p>
                  </div>
                </div>
                <span className="text-xl font-bold">{stats?.totalConfigMaps ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resource Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm card-hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold">{stats?.runningPods ?? 0}</h3>
            <p className="text-sm text-muted-foreground mt-1">Running Pods</p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">
                {podHealthPercentage.toFixed(0)}% capacity
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm card-hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Ready
              </Badge>
            </div>
            <h3 className="text-2xl font-bold">{stats?.readyNodes ?? 0}</h3>
            <p className="text-sm text-muted-foreground mt-1">Ready Nodes</p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <Zap className="w-3 h-3 text-blue-600" />
              <span className="text-blue-600 font-medium">
                {nodeHealthPercentage.toFixed(0)}% available
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm card-hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-danger flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Issues
              </Badge>
            </div>
            <h3 className="text-2xl font-bold">{stats?.failedPods ?? 0}</h3>
            <p className="text-sm text-muted-foreground mt-1">Failed Pods</p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              {(stats?.failedPods ?? 0) > 0 ? (
                <>
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span className="text-red-600 font-medium">Needs attention</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">All healthy</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm card-hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-info flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold">{stats?.totalDeployments ?? 0}</h3>
            <p className="text-sm text-muted-foreground mt-1">Deployments</p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <Activity className="w-3 h-3 text-purple-600" />
              <span className="text-purple-600 font-medium">Workloads running</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
