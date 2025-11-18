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
import type { Pod } from "@shared/schema";

export default function Pods() {
  const { data: pods, isLoading } = useQuery<Pod[]>({
    queryKey: ["/api/pods"],
  });

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Pods
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and monitor your cluster pods
        </p>
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
            {pods && pods.length > 0 ? (
              pods.map((pod) => (
                <TableRow key={pod.id} className="hover-elevate" data-testid={`row-pod-${pod.id}`}>
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
                  No pods found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
