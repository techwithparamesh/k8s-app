import { useQuery } from "@tanstack/react-query";
import { Network, Globe, Shield, Database } from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Route, Ingress, NetworkPolicy } from "@shared/schema";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Networking() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: routes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const { data: ingresses, isLoading: ingressLoading } = useQuery<Ingress[]>({
    queryKey: ["/api/ingresses"],
  });

  const { data: policies, isLoading: policiesLoading } = useQuery<NetworkPolicy[]>({
    queryKey: ["/api/networkpolicies"],
  });

  const filteredPolicies = useMemo(() => {
    if (!policies) return [];
    if (!searchQuery.trim()) return policies;
    const query = searchQuery.toLowerCase();
    return policies.filter(p => p.name.toLowerCase().includes(query) || p.namespace.toLowerCase().includes(query));
  }, [policies, searchQuery]);

  if (routesLoading || ingressLoading || policiesLoading) {
    return <LoadingState title="Networking" description="Network configuration and policies" />;
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Networking</h1>
        <p className="text-base text-muted-foreground">
          Manage network routes, ingress controllers, and policies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up">
        <ResourceCard
          title="Routes"
          value={routes?.length || 0}
          icon={Globe}
          iconColor="bg-blue-600"
          subtitle="OpenShift routes"
        />
        <ResourceCard
          title="Ingress"
          value={ingresses?.length || 0}
          icon={Network}
          iconColor="bg-purple-600"
          subtitle="Ingress controllers"
        />
        <ResourceCard
          title="Network Policies"
          value={policies?.length || 0}
          icon={Shield}
          iconColor="bg-orange-600"
          subtitle="Traffic control"
        />
        <ResourceCard
          title="Load Balancers"
          value={routes?.filter(r => r.tls).length || 0}
          icon={Database}
          iconColor="bg-emerald-600"
          subtitle="Secured routes"
        />
      </div>

      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="policies">Network Policies</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="ingress">Ingress</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Control traffic flow between pods and namespaces
            </p>
            <div className="w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search policies..."
              />
            </div>
          </div>
          
          <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Pod Selector</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Policy Types</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-muted/20 transition-colors border-b border-border/30">
                    <TableCell className="font-semibold">{policy.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{policy.namespace}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{policy.podSelector}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {policy.policyTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{policy.age}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            OpenShift routes provide external access to services
          </p>
          <div className="grid gap-4">
            {routes?.map((route) => (
              <div key={route.id} className="p-4 border border-border/50 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{route.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {route.host}{route.path || "/"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Target: {route.targetService}:{route.targetPort}
                    </p>
                  </div>
                  {route.tls && (
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      TLS Enabled
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ingress" className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Kubernetes ingress resources for HTTP/HTTPS routing
          </p>
          <div className="grid gap-4">
            {ingresses?.map((ingress) => (
              <div key={ingress.id} className="p-4 border border-border/50 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                <h3 className="font-semibold">{ingress.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Namespace: {ingress.namespace}</p>
                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-xs font-medium">Hosts:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ingress.hosts.map((host) => (
                        <Badge key={host} variant="outline" className="text-xs">{host}</Badge>
                      ))}
                    </div>
                  </div>
                  {ingress.addresses && ingress.addresses.length > 0 && (
                    <div>
                      <span className="text-xs font-medium">Addresses:</span>
                      <p className="text-xs text-muted-foreground mt-1">{ingress.addresses.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
