import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { ResourceDetailModal } from "@/components/ResourceDetailModal";
import { YAMLViewer } from "@/components/YAMLViewer";
import { CreateResourceDialog } from "@/components/CreateResourceDialog";
import { EmptyState } from "@/components/EmptyState";
import { TableLoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { FileCode, Plus, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@shared/schema";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [yamlViewerOpen, setYamlViewerOpen] = useState(false);
  const [yamlService, setYamlService] = useState<Service | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: services, isLoading, isError } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (!searchQuery.trim()) return services;

    const query = searchQuery.toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.namespace.toLowerCase().includes(query) ||
        service.type.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  if (isLoading) {
    return <TableLoadingState title="Services" description="Manage network services and endpoints" />;
  }

  if (isError) {
    return <ErrorState title="Services" description="Manage network services and endpoints" />;
  }

  const getServiceTypeVariant = (type: string) => {
    switch (type) {
      case "LoadBalancer":
        return "default";
      case "NodePort":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
            Services
          </h1>
          <p className="text-base text-muted-foreground">
            Manage network services and endpoints
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search services..."
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Service
          </Button>
        </div>
      </div>

      {filteredServices.length === 0 && !searchQuery ? (
        <EmptyState
          icon={<Network className="w-12 h-12" />}
          title="No Services Found"
          description="Create your first service to expose your applications and enable network communication within your Kubernetes cluster"
          primaryAction={{
            label: "Create Service",
            onClick: () => setCreateDialogOpen(true),
          }}
          secondaryAction={{
            label: "Learn More",
            href: "https://kubernetes.io/docs/concepts/services-networking/service/",
          }}
        />
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg animate-slide-in-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Type</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Cluster IP</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">External IP</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Ports</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors border-b border-border/30"
                    onClick={() => {
                      setSelectedService(service);
                      setModalOpen(true);
                    }}
                    data-testid={`row-service-${service.id}`}
                  >
                    <TableCell className="font-semibold" data-testid={`text-service-name-${service.id}`}>
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{service.namespace}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getServiceTypeVariant(service.type)}>
                        {service.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{service.clusterIP ?? "None"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{service.externalIP ?? "<none>"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{service.ports ?? "N/A"}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{service.age ?? "N/A"}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setYamlService(service);
                          setYamlViewerOpen(true);
                        }}
                        className="gap-1"
                      >
                        <FileCode className="h-3.5 w-3.5" />
                        YAML
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No services match your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ResourceDetailModal
        resource={selectedService}
        type="service"
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {yamlService && (
        <YAMLViewer
          resourceId={yamlService.id}
          resourceType="service"
          resourceName={yamlService.name}
          open={yamlViewerOpen}
          onOpenChange={setYamlViewerOpen}
        />
      )}

      <CreateResourceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        resourceType="service"
      />
    </div>
  );
}
