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

  const getStatusColor = () => {
    if (type === "pod") {
      switch (status) {
        case "Running":
        case "Succeeded":
          return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50";
        case "Pending":
          return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50";
        case "Failed":
          return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";
        default:
          return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900/50";
      }
    } else {
      switch (status) {
        case "Ready":
          return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50";
        case "NotReady":
          return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";
        default:
          return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900/50";
      }
    }
  };

  const getDotColor = () => {
    if (type === "pod") {
      switch (status) {
        case "Running":
        case "Succeeded":
          return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
        case "Pending":
          return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
        case "Failed":
          return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
        default:
          return "bg-gray-500";
      }
    } else {
      switch (status) {
        case "Ready":
          return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
        case "NotReady":
          return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
        default:
          return "bg-gray-500";
      }
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor()}`} data-testid={`badge-status-${status.toLowerCase()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} animate-pulse`} />
      {status}
    </div>
  );
}
