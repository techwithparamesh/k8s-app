import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: "pod" | "node";
}

export function StatusBadge({ status, type = "pod" }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === "pod") {
      switch (status) {
        case "Running":
        case "Succeeded":
          return "default";
        case "Pending":
          return "secondary";
        case "Failed":
          return "destructive";
        default:
          return "outline";
      }
    } else {
      switch (status) {
        case "Ready":
          return "default";
        case "NotReady":
          return "destructive";
        default:
          return "outline";
      }
    }
  };

  const getDotColor = () => {
    if (type === "pod") {
      switch (status) {
        case "Running":
        case "Succeeded":
          return "bg-green-500";
        case "Pending":
          return "bg-yellow-500";
        case "Failed":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    } else {
      switch (status) {
        case "Ready":
          return "bg-green-500";
        case "NotReady":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    }
  };

  return (
    <Badge variant={getVariant()} className="gap-1.5" data-testid={`badge-status-${status.toLowerCase()}`}>
      <span className={`w-2 h-2 rounded-full ${getDotColor()}`} />
      {status}
    </Badge>
  );
}
