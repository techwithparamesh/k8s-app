import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { EmptyState } from "@/components/EmptyState";
import { TableLoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Ingress } from "@shared/schema";

export default function IngressPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ingresses, isLoading, isError } = useQuery<Ingress[]>({
    queryKey: ["/api/ingresses"],
  });

  const filteredIngresses = useMemo(() => {
    if (!ingresses) return [];
    if (!searchQuery.trim()) return ingresses;

    const query = searchQuery.toLowerCase();
    return ingresses.filter(
      (ingress) =>
        ingress.name.toLowerCase().includes(query) ||
        ingress.namespace.toLowerCase().includes(query) ||
        ingress.hosts.some((host) => host.toLowerCase().includes(query))
    );
  }, [ingresses, searchQuery]);

  if (isLoading) {
    return <TableLoadingState title="Ingress" description="Manage HTTP and HTTPS routing" />;
  }

  if (isError) {
    return <ErrorState title="Ingress" description="Manage HTTP and HTTPS routing" />;
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ingress</h1>
          <p className="text-base text-muted-foreground">
            Manage HTTP and HTTPS routing to services
          </p>
        </div>
        <div className="w-80">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ingress..."
          />
        </div>
      </div>

      {filteredIngresses.length === 0 && !searchQuery ? (
        <EmptyState
          icon={<Globe className="w-12 h-12" />}
          title="No Ingress Controllers Found"
          description="Create your first ingress controller to route external HTTP/HTTPS traffic to services in your Kubernetes cluster"
          secondaryAction={{
            label: "Learn More",
            href: "https://kubernetes.io/docs/concepts/services-networking/ingress/",
          }}
        />
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg animate-slide-in-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Hosts</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Addresses</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Ports</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngresses.length > 0 ? (
                filteredIngresses.map((ingress) => (
                  <TableRow
                    key={ingress.id}
                    className="hover:bg-muted/20 transition-colors border-b border-border/30"
                  >
                    <TableCell className="font-semibold">{ingress.name}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{ingress.namespace}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {ingress.hosts.map((host, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {host}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ingress.addresses && ingress.addresses.length > 0 ? (
                        <span className="font-mono text-sm">{ingress.addresses.join(", ")}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{ingress.ports ?? "80, 443"}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ingress.age ?? "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No ingress controllers match your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
