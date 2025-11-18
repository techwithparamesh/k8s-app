import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { SearchInput } from "@/components/SearchInput";
import { ResourceDetailModal } from "@/components/ResourceDetailModal";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: nodes, isLoading, isError } = useQuery<Node[]>({
    queryKey: ["/api/nodes"],
  });

  const filteredNodes = useMemo(() => {
    if (!nodes) return [];
    if (!searchQuery.trim()) return nodes;

    const query = searchQuery.toLowerCase();
    return nodes.filter(
      (node) =>
        node.name.toLowerCase().includes(query) ||
        node.status.toLowerCase().includes(query)
    );
  }, [nodes, searchQuery]);

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

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Nodes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor cluster node resources and health
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">Failed to load nodes</p>
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
            Nodes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor cluster node resources and health
          </p>
        </div>
        <div className="w-64">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search nodes..."
          />
        </div>
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
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => (
                <TableRow
                  key={node.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => {
                    setSelectedNode(node);
                    setModalOpen(true);
                  }}
                  data-testid={`row-node-${node.id}`}
                >
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
                  {searchQuery ? "No nodes match your search" : "No nodes found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResourceDetailModal
        resource={selectedNode}
        type="node"
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
