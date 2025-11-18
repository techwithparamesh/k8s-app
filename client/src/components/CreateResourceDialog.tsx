import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Terminal, FileCode, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceType: "pod" | "deployment" | "service";
  onSubmit?: (data: any) => void;
}

export function CreateResourceDialog({
  open,
  onOpenChange,
  resourceType,
  onSubmit,
}: CreateResourceDialogProps) {
  const [activeTab, setActiveTab] = useState<"command" | "yaml">("command");
  const { toast } = useToast();

  // Command Form State
  const [commandForm, setCommandForm] = useState({
    name: "",
    namespace: "default",
    image: "",
    replicas: "1",
    port: "",
    serviceType: "ClusterIP",
  });

  // YAML State
  const [yamlContent, setYamlContent] = useState("");

  const handleCommandSubmit = () => {
    if (!commandForm.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name is required",
      });
      return;
    }

    if (resourceType !== "service" && !commandForm.image) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Image is required",
      });
      return;
    }

    toast({
      title: "Resource Created",
      description: `${resourceType} "${commandForm.name}" created successfully`,
    });

    onSubmit?.(commandForm);
    onOpenChange(false);
    resetForm();
  };

  const handleYamlSubmit = () => {
    if (!yamlContent.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "YAML content is required",
      });
      return;
    }

    try {
      // Basic YAML validation (you can enhance this)
      if (!yamlContent.includes("apiVersion") || !yamlContent.includes("kind")) {
        throw new Error("Invalid YAML: missing required fields");
      }

      toast({
        title: "Resource Created",
        description: `${resourceType} created from YAML successfully`,
      });

      onSubmit?.({ yaml: yamlContent });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "YAML Error",
        description: error.message || "Invalid YAML format",
      });
    }
  };

  const resetForm = () => {
    setCommandForm({
      name: "",
      namespace: "default",
      image: "",
      replicas: "1",
      port: "",
      serviceType: "ClusterIP",
    });
    setYamlContent("");
    setActiveTab("command");
  };

  const getYamlTemplate = () => {
    switch (resourceType) {
      case "pod":
        return `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: default
  labels:
    app: my-app
spec:
  containers:
  - name: my-container
    image: nginx:latest
    ports:
    - containerPort: 80`;

      case "deployment":
        return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
  namespace: default
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"`;

      case "service":
        return `apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080`;

      default:
        return "";
    }
  };

  const loadTemplate = () => {
    setYamlContent(getYamlTemplate());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Choose between command-based creation or YAML manifest
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "command" | "yaml")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="command" className="gap-2">
              <Terminal className="w-4 h-4" />
              Command
            </TabsTrigger>
            <TabsTrigger value="yaml" className="gap-2">
              <FileCode className="w-4 h-4" />
              YAML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder={`my-${resourceType}`}
                    value={commandForm.name}
                    onChange={(e) => setCommandForm({ ...commandForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namespace">Namespace</Label>
                  <Select
                    value={commandForm.namespace}
                    onValueChange={(value) => setCommandForm({ ...commandForm, namespace: value })}
                  >
                    <SelectTrigger id="namespace">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">default</SelectItem>
                      <SelectItem value="production">production</SelectItem>
                      <SelectItem value="staging">staging</SelectItem>
                      <SelectItem value="kube-system">kube-system</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {resourceType !== "service" && (
                <div className="space-y-2">
                  <Label htmlFor="image">Container Image *</Label>
                  <Input
                    id="image"
                    placeholder="nginx:latest"
                    value={commandForm.image}
                    onChange={(e) => setCommandForm({ ...commandForm, image: e.target.value })}
                  />
                </div>
              )}

              {resourceType === "deployment" && (
                <div className="space-y-2">
                  <Label htmlFor="replicas">Replicas</Label>
                  <Input
                    id="replicas"
                    type="number"
                    min="0"
                    placeholder="3"
                    value={commandForm.replicas}
                    onChange={(e) => setCommandForm({ ...commandForm, replicas: e.target.value })}
                  />
                </div>
              )}

              {resourceType === "service" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      value={commandForm.serviceType}
                      onValueChange={(value) => setCommandForm({ ...commandForm, serviceType: value })}
                    >
                      <SelectTrigger id="serviceType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ClusterIP">ClusterIP</SelectItem>
                        <SelectItem value="NodePort">NodePort</SelectItem>
                        <SelectItem value="LoadBalancer">LoadBalancer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      placeholder="80"
                      value={commandForm.port}
                      onChange={(e) => setCommandForm({ ...commandForm, port: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="port">Container Port</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="8080"
                  value={commandForm.port}
                  onChange={(e) => setCommandForm({ ...commandForm, port: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCommandSubmit}>
                Create {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="yaml" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="yaml-content">YAML Manifest</Label>
                <Button variant="outline" size="sm" onClick={loadTemplate}>
                  Load Template
                </Button>
              </div>
              <Textarea
                id="yaml-content"
                placeholder={`Paste your YAML manifest here or click "Load Template"`}
                className="font-mono text-sm min-h-[400px]"
                value={yamlContent}
                onChange={(e) => setYamlContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleYamlSubmit}>
                Create from YAML
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
