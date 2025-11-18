import { useQuery } from "@tanstack/react-query";
import { Database, HardDrive, Key, FileText } from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { LoadingState } from "@/components/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PVC, ConfigMap, Secret } from "@shared/schema";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Storage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: pvcs, isLoading: pvcsLoading } = useQuery<PVC[]>({
    queryKey: ["/api/pvcs"],
  });

  const { data: configMaps, isLoading: configMapsLoading } = useQuery<ConfigMap[]>({
    queryKey: ["/api/configmaps"],
  });

  const { data: secrets, isLoading: secretsLoading } = useQuery<Secret[]>({
    queryKey: ["/api/secrets"],
  });

  const filteredPVCs = useMemo(() => {
    if (!pvcs) return [];
    if (!searchQuery.trim()) return pvcs;
    const query = searchQuery.toLowerCase();
    return pvcs.filter(p => p.name.toLowerCase().includes(query) || p.namespace.toLowerCase().includes(query));
  }, [pvcs, searchQuery]);

  const filteredConfigMaps = useMemo(() => {
    if (!configMaps) return [];
    if (!searchQuery.trim()) return configMaps;
    const query = searchQuery.toLowerCase();
    return configMaps.filter(c => c.name.toLowerCase().includes(query) || c.namespace.toLowerCase().includes(query));
  }, [configMaps, searchQuery]);

  const filteredSecrets = useMemo(() => {
    if (!secrets) return [];
    if (!searchQuery.trim()) return secrets;
    const query = searchQuery.toLowerCase();
    return secrets.filter(s => s.name.toLowerCase().includes(query) || s.namespace.toLowerCase().includes(query));
  }, [secrets, searchQuery]);

  if (pvcsLoading || configMapsLoading || secretsLoading) {
    return <LoadingState title="Storage & Config" description="Manage storage, configurations, and secrets" />;
  }

  const boundPVCs = pvcs?.filter(p => p.status === "Bound").length || 0;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Storage & Configuration</h1>
        <p className="text-base text-muted-foreground">
          Manage persistent volumes, configurations, and secrets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up">
        <ResourceCard
          title="Persistent Volumes"
          value={pvcs?.length || 0}
          subtitle={`${boundPVCs} bound`}
          icon={HardDrive}
          iconColor="bg-blue-600"
        />
        <ResourceCard
          title="ConfigMaps"
          value={configMaps?.length || 0}
          icon={FileText}
          iconColor="bg-purple-600"
        />
        <ResourceCard
          title="Secrets"
          value={secrets?.length || 0}
          icon={Key}
          iconColor="bg-orange-600"
        />
        <ResourceCard
          title="Total Capacity"
          value={pvcs?.reduce((sum, pvc) => sum + (parseInt(pvc.capacity || "0") || 0), 0) || 0}
          subtitle="GB allocated"
          icon={Database}
          iconColor="bg-emerald-600"
        />
      </div>

      <Tabs defaultValue="pvcs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pvcs">Persistent Volumes</TabsTrigger>
          <TabsTrigger value="configmaps">ConfigMaps</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
        </TabsList>

        <TabsContent value="pvcs" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Persistent storage claims for your applications
            </p>
            <div className="w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search PVCs..."
              />
            </div>
          </div>
          
          <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Volume</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Capacity</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Access Modes</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPVCs.map((pvc) => (
                  <TableRow key={pvc.id} className="hover:bg-muted/20 transition-colors border-b border-border/30">
                    <TableCell className="font-semibold">{pvc.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{pvc.namespace}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        pvc.status === "Bound" 
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
                          : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pvc.status === "Bound" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                        {pvc.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{pvc.volume}</code>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{pvc.capacity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{pvc.accessModes}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{pvc.age}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="configmaps" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Configuration data for your applications
            </p>
            <div className="w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search ConfigMaps..."
              />
            </div>
          </div>

          <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Data Keys</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigMaps.map((cm) => (
                  <TableRow key={cm.id} className="hover:bg-muted/20 transition-colors border-b border-border/30">
                    <TableCell className="font-semibold">{cm.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cm.namespace}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cm.dataCount} keys</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cm.age}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="secrets" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Sensitive data like passwords, tokens, and keys
            </p>
            <div className="w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search Secrets..."
              />
            </div>
          </div>

          <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Type</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Data Keys</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSecrets.map((secret) => (
                  <TableRow key={secret.id} className="hover:bg-muted/20 transition-colors border-b border-border/30">
                    <TableCell className="font-semibold flex items-center gap-2">
                      <Key className="w-4 h-4 text-orange-500" />
                      {secret.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{secret.namespace}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{secret.type}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{secret.dataCount} keys</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{secret.age}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
