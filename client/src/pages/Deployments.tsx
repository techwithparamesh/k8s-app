import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { ResourceDetailModal } from "@/components/ResourceDetailModal";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Deployment } from "@shared/schema";

export default function Deployments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Deployments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your application deployments
          </p>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Deployments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your application deployments
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">Failed to load deployments</p>
            <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">
            Deployments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your application deployments
          </p>
        </div>
        <div className="w-64">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search deployments..."
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Namespace</TableHead>
              <TableHead className="font-semibold">Ready</TableHead>
              <TableHead className="font-semibold">Up-to-date</TableHead>
              <TableHead className="font-semibold">Available</TableHead>
              <TableHead className="font-semibold">Age</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeployments.length > 0 ? (
              filteredDeployments.map((deployment) => (
                <TableRow
                  key={deployment.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => {
                    setSelectedDeployment(deployment);
                    setModalOpen(true);
                  }}
                  data-testid={`row-deployment-${deployment.id}`}
                >
                  <TableCell className="font-medium" data-testid={`text-deployment-name-${deployment.id}`}>
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
                  <TableCell>{deployment.upToDate || 0}</TableCell>
                  <TableCell>{deployment.available || 0}</TableCell>
                  <TableCell className="text-muted-foreground">{deployment.age || "N/A"}</TableCell>
                  <TableCell>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                  {searchQuery ? "No deployments match your search" : "No deployments found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResourceDetailModal
        resource={selectedDeployment}
        type="deployment"
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
