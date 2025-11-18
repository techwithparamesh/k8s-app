import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { ResourceDetailModal } from "@/components/ResourceDetailModal";
import { YAMLViewer } from "@/components/YAMLViewer";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { EmptyState } from "@/components/EmptyState";
import { TableLoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Minus, Plus, FileCode, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Deployment } from "@shared/schema";

export default function Deployments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [yamlViewerOpen, setYamlViewerOpen] = useState(false);
  const [yamlDeployment, setYamlDeployment] = useState<Deployment | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: deployments, isLoading, isError } = useQuery<Deployment[]>({
    queryKey: ["/api/deployments"],
  });

  const scaleMutation = useMutation({
    mutationFn: async ({ id, replicas }: { id: string; replicas: number }) => {
      return apiRequest("PATCH", `/api/deployments/${id}/scale`, { replicas });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
      toast({
        title: "Deployment scaled",
        description: "Replica count updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Scaling failed",
        description: error.message || "Failed to scale deployment",
      });
    },
  });

  const filteredDeployments = useMemo(() => {
    if (!deployments) return [];
    if (!searchQuery.trim()) return deployments;

    const query = searchQuery.toLowerCase();
    return deployments.filter(
      (deployment) =>
        deployment.name.toLowerCase().includes(query) ||
        deployment.namespace.toLowerCase().includes(query)
    );
  }, [deployments, searchQuery]);

  if (isLoading) {
    return <TableLoadingState title="Deployments" description="Manage your application deployments" />;
  }

  if (isError) {
    return <ErrorState title="Deployments" description="Manage your application deployments" />;
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
            Deployments
          </h1>
          <p className="text-base text-muted-foreground">
            Manage your application deployments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search deployments..."
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Deployment
          </Button>
        </div>
      </div>

      {filteredDeployments.length === 0 && !searchQuery ? (
        <EmptyState
          icon={<Layers className="w-12 h-12" />}
          title="No Deployments Found"
          description="Create your first deployment to manage application replicas and rolling updates in your Kubernetes cluster"
          primaryAction={{
            label: "Create Deployment",
            onClick: () => setCreateDialogOpen(true),
          }}
          secondaryAction={{
            label: "Learn More",
            href: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
          }}
        />
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg animate-slide-in-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Ready</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Up-to-date</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Available</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeployments.length > 0 ? (
                filteredDeployments.map((deployment) => (
                  <TableRow
                    key={deployment.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors border-b border-border/30"
                    onClick={() => {
                      setSelectedDeployment(deployment);
                      setModalOpen(true);
                    }}
                    data-testid={`row-deployment-${deployment.id}`}
                  >
                    <TableCell className="font-semibold" data-testid={`text-deployment-name-${deployment.id}`}>
                      {deployment.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{deployment.namespace}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={deployment.ready === deployment.replicas ? "default" : "secondary"}>
                        {deployment.ready}/{deployment.replicas}
                      </Badge>
                    </TableCell>
                    <TableCell>{deployment.upToDate ?? 0}</TableCell>
                    <TableCell>{deployment.available ?? 0}</TableCell>
                    <TableCell className="text-muted-foreground">{deployment.age ?? "N/A"}</TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setYamlDeployment(deployment);
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
                          onClick={() =>
                            scaleMutation.mutate({
                              id: deployment.id,
                              replicas: Math.max(0, deployment.replicas - 1),
                            })
                          }
                          disabled={deployment.replicas === 0 || scaleMutation.isPending}
                          data-testid={`button-scale-down-${deployment.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {deployment.replicas}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            scaleMutation.mutate({
                              id: deployment.id,
                              replicas: deployment.replicas + 1,
                            })
                          }
                          disabled={scaleMutation.isPending}
                          data-testid={`button-scale-up-${deployment.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No deployments match your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ResourceDetailModal
        resource={selectedDeployment}
        type="deployment"
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {yamlDeployment && (
        <YAMLViewer
          resourceId={yamlDeployment.id}
          resourceType="deployment"
          resourceName={yamlDeployment.name}
          open={yamlViewerOpen}
          onOpenChange={setYamlViewerOpen}
        />
      )}

      <CreateResourceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        resourceType="deployment"
      />
    </div>
  );
}
