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
import type { Pod } from "@shared/schema";

export default function Pods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Pods</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor your cluster pods
          </p>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
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
          <h1 className="text-2xl font-semibold">Pods</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor your cluster pods
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">Failed to load pods</p>
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
            Pods
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor your cluster pods
          </p>
        </div>
        <div className="w-64">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search pods..."
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Namespace</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Restarts</TableHead>
              <TableHead className="font-semibold">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPods.length > 0 ? (
              filteredPods.map((pod) => (
                <TableRow
                  key={pod.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => {
                    setSelectedPod(pod);
                    setModalOpen(true);
                  }}
                  data-testid={`row-pod-${pod.id}`}
                >
                  <TableCell className="font-medium" data-testid={`text-pod-name-${pod.id}`}>
                    {pod.name}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{pod.namespace}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={pod.status} type="pod" />
                  </TableCell>
                  <TableCell>{pod.restarts || 0}</TableCell>
                  <TableCell className="text-muted-foreground">{pod.age || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {searchQuery ? "No pods match your search" : "No pods found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResourceDetailModal
        resource={selectedPod}
        type="pod"
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
