import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { TableLoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Shield, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Route } from "@shared/schema";

export default function Routes() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: routes, isLoading, isError } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const filteredRoutes = useMemo(() => {
    if (!routes) return [];
    if (!searchQuery.trim()) return routes;

    const query = searchQuery.toLowerCase();
    return routes.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.namespace.toLowerCase().includes(query) ||
        route.host.toLowerCase().includes(query)
    );
  }, [routes, searchQuery]);

  if (isLoading) {
    return <TableLoadingState title="Routes" description="OpenShift routes for external access" />;
  }

  if (isError) {
    return <ErrorState title="Routes" description="OpenShift routes for external access" />;
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
          <p className="text-base text-muted-foreground">
            OpenShift routes for external access to services
          </p>
        </div>
        <div className="w-80">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search routes..."
          />
        </div>
      </div>

      <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg animate-slide-in-up">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-bold text-xs uppercase tracking-wider">Name</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Namespace</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Host</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Path</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Target</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">TLS</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <TableRow
                  key={route.id}
                  className="hover:bg-muted/20 cursor-pointer transition-colors border-b border-border/30"
                >
                  <TableCell className="font-semibold">{route.name}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{route.namespace}</span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://${route.host}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {route.host}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{route.path || "/"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{route.targetService}:{route.targetPort}</span>
                  </TableCell>
                  <TableCell>
                    {route.tls ? (
                      <Badge className="gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50">
                        <Shield className="w-3 h-3" />
                        Secured
                      </Badge>
                    ) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{route.age || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  {searchQuery ? "No routes match your search" : "No routes found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
