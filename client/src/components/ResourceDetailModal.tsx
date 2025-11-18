import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Pod, Node, Deployment, Service } from "@shared/schema";

type Resource = Pod | Node | Deployment | Service;

interface ResourceDetailModalProps {
  resource: Resource | null;
  type: "pod" | "node" | "deployment" | "service";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetailModal({
  resource,
  type,
  open,
  onOpenChange,
}: ResourceDetailModalProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]" data-testid="modal-resource-detail">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold" data-testid="text-modal-title">
            {resource.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Metadata Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Metadata</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Name" value={resource.name} />
                {"namespace" in resource && (
                  <DetailItem label="Namespace" value={resource.namespace} />
                )}
                {"status" in resource && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <StatusBadge
                      status={resource.status}
                      type={type === "pod" ? "pod" : type === "node" ? "node" : "pod"}
                    />
                  </div>
                )}
                {"age" in resource && <DetailItem label="Age" value={resource.age || "N/A"} />}
              </div>
            </div>

            {/* Type-specific sections */}
            {type === "pod" && "restarts" in resource && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Pod Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Restarts" value={String(resource.restarts || 0)} />
                  <DetailItem label="Status" value={resource.status} />
                </div>
              </div>
            )}

            {type === "node" && "cpu" in resource && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Resource Usage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="CPU" value={resource.cpu || "N/A"} mono />
                  <DetailItem label="Memory" value={resource.memory || "N/A"} mono />
                  {"pods" in resource && (
                    <DetailItem label="Pods" value={String(resource.pods || 0)} />
                  )}
                </div>
              </div>
            )}

            {type === "deployment" &&
              "replicas" in resource &&
              "ready" in resource &&
              "upToDate" in resource && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Deployment Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Replicas" value={String(resource.replicas)} />
                    <DetailItem label="Ready" value={String(resource.ready)} />
                    <DetailItem label="Up-to-date" value={String(resource.upToDate || 0)} />
                    <DetailItem label="Available" value={String(resource.available || 0)} />
                  </div>
                </div>
              )}

            {type === "service" &&
              "type" in resource &&
              "clusterIP" in resource && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Service Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <DetailItem
                      label="Cluster IP"
                      value={resource.clusterIP || "None"}
                      mono
                    />
                    {"externalIP" in resource && (
                      <DetailItem
                        label="External IP"
                        value={resource.externalIP || "<none>"}
                        mono
                      />
                    )}
                    {"ports" in resource && (
                      <DetailItem label="Ports" value={resource.ports || "N/A"} />
                    )}
                  </div>
                </div>
              )}

            {/* Labels/Annotations placeholder */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Labels</h3>
              <div className="bg-muted/30 rounded-md p-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">app={resource.name.split("-")[0]}</Badge>
                  <Badge variant="secondary">
                    version=
                    {resource.name.includes("v2")
                      ? "2.0"
                      : resource.name.includes("v1")
                        ? "1.0"
                        : "1.0"}
                  </Badge>
                  {"namespace" in resource && (
                    <Badge variant="secondary">namespace={resource.namespace}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  mono?: boolean;
}

function DetailItem({ label, value, mono = false }: DetailItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
