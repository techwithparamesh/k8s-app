import { useQuery } from "@tanstack/react-query";
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
import type { Service } from "@shared/schema";

export default function Services() {
  const { data: services, isLoading, isError } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage network services and endpoints
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
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage network services and endpoints
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">Failed to load services</p>
            <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Services
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage network services and endpoints
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Namespace</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Cluster IP</TableHead>
              <TableHead className="font-semibold">External IP</TableHead>
              <TableHead className="font-semibold">Ports</TableHead>
              <TableHead className="font-semibold">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id} className="hover-elevate" data-testid={`row-service-${service.id}`}>
                  <TableCell className="font-medium" data-testid={`text-service-name-${service.id}`}>
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
                    <span className="font-mono text-sm">{service.clusterIP || "None"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{service.externalIP || "<none>"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{service.ports || "N/A"}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{service.age || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
