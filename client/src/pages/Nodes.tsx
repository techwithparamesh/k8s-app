import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Node } from "@shared/schema";

export default function Nodes() {
  const { data: nodes, isLoading } = useQuery<Node[]>({
    queryKey: ["/api/nodes"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Nodes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor cluster node resources and health
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Nodes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor cluster node resources and health
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">CPU</TableHead>
              <TableHead className="font-semibold">Memory</TableHead>
              <TableHead className="font-semibold">Pods</TableHead>
              <TableHead className="font-semibold">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes && nodes.length > 0 ? (
              nodes.map((node) => (
                <TableRow key={node.id} className="hover-elevate" data-testid={`row-node-${node.id}`}>
                  <TableCell className="font-medium" data-testid={`text-node-name-${node.id}`}>
                    {node.name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={node.status} type="node" />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{node.cpu}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{node.memory}</span>
                  </TableCell>
                  <TableCell>{node.pods || 0}</TableCell>
                  <TableCell className="text-muted-foreground">{node.age || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No nodes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
