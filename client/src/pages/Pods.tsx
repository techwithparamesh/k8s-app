import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { SearchInput } from "@/components/SearchInput";
import { ResourceDetailModal } from "@/components/ResourceDetailModal";
import { LogViewer } from "@/components/LogViewer";
import { Terminal } from "@/components/Terminal";
import { YAMLViewer } from "@/components/YAMLViewer";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { EmptyState } from "@/components/EmptyState";
import { TableLoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { FileText, Terminal as TerminalIcon, FileCode, Plus, Box } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Pod } from "@shared/schema";

export default function Pods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [logsPod, setLogsPod] = useState<{ id: string; name: string } | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const [terminalPod, setTerminalPod] = useState<{ id: string; name: string } | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [yamlViewerOpen, setYamlViewerOpen] = useState(false);
  const [yamlPod, setYamlPod] = useState<Pod | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: pods, isLoading, isError } = useQuery<Pod[]>({
    queryKey: ["/api/pods"],
  });

  const filteredPods = useMemo(() => {
    if (!pods) return [];
    if (!searchQuery.trim()) return pods;

    const query = searchQuery.toLowerCase();
    return pods.filter(
      (pod) =>
        pod.name.toLowerCase().includes(query) ||
        pod.namespace.toLowerCase().includes(query) ||
        pod.status.toLowerCase().includes(query)
    );
  }, [pods, searchQuery]);

  if (isLoading) {
    return <TableLoadingState title="Pods" description="Manage and monitor your cluster pods" />;
  }

  if (isError) {
    return <ErrorState title="Pods" description="Manage and monitor your cluster pods" />;
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
            Pods
          </h1>
          <p className="text-base text-muted-foreground">
            Manage and monitor your cluster pods
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search pods..."
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Pod
          </Button>
        </div>
      </div>

      {filteredPods.length === 0 && !searchQuery ? (
        <EmptyState
          icon={<Box className="w-12 h-12" />}
          title="No Pods Found"
          description="Create your first pod to run containerized applications in your Kubernetes cluster"
          primaryAction={{
            label: "Create Pod",
            onClick: () => setCreateDialogOpen(true),
          }}
          secondaryAction={{
            label: "Learn More",
            href: "https://kubernetes.io/docs/concepts/workloads/pods/",
          }}
        />
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg animate-slide-in-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Restarts</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPods.length > 0 ? (
                filteredPods.map((pod) => (
                  <TableRow
                    key={pod.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors border-b border-border/30"
                    onClick={() => {
                      setSelectedPod(pod);
                      setModalOpen(true);
                    }}
                    data-testid={`row-pod-${pod.id}`}
                  >
                    <TableCell className="font-semibold" data-testid={`text-pod-name-${pod.id}`}>
                      {pod.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{pod.namespace}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pod.status} type="pod" />
                    </TableCell>
                    <TableCell>{pod.restarts ?? 0}</TableCell>
                    <TableCell className="text-muted-foreground">{pod.age ?? "N/A"}</TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setYamlPod(pod);
                            setYamlViewerOpen(true);
                          }}
                          className="gap-1"
                        >
                          <FileCode className="h-3.5 w-3.5" />
                          YAML
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogsPod({ id: pod.id, name: pod.name });
                            setLogsOpen(true);
                          }}
                          data-testid={`button-logs-${pod.id}`}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTerminalPod({ id: pod.id, name: pod.name });
                            setTerminalOpen(true);
                          }}
                          data-testid={`button-terminal-${pod.id}`}
                        >
                          <TerminalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No pods match your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ResourceDetailModal
        resource={selectedPod}
        type="pod"
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {logsPod && (
        <LogViewer
          podId={logsPod.id}
          podName={logsPod.name}
          open={logsOpen}
          onOpenChange={(open) => {
            setLogsOpen(open);
            if (!open) {
              setLogsPod(null);
            }
          }}
        />
      )}

      {terminalPod && (
        <Terminal
          podId={terminalPod.id}
          podName={terminalPod.name}
          open={terminalOpen}
          onOpenChange={(open) => {
            setTerminalOpen(open);
            if (!open) {
              setTerminalPod(null);
            }
          }}
        />
      )}

      {yamlPod && (
        <YAMLViewer
          resourceId={yamlPod.id}
          resourceType="pod"
          resourceName={yamlPod.name}
          open={yamlViewerOpen}
          onOpenChange={setYamlViewerOpen}
        />
      )}

      <CreateResourceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        resourceType="pod"
      />
    </div>
  );
}
