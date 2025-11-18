import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check, Download, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeploymentConfig } from "@shared/schema";
import yaml from "js-yaml";

interface YAMLViewerProps {
  resourceId: string;
  resourceType: "deployment" | "service" | "pod";
  resourceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function YAMLViewer({
  resourceId,
  resourceType,
  resourceName,
  open,
  onOpenChange,
}: YAMLViewerProps) {
  const [copied, setCopied] = useState(false);

  const { data: config, isLoading } = useQuery<DeploymentConfig>({
    queryKey: [`/api/${resourceType}s/${resourceId}/config`],
    enabled: open,
  });

  const yamlString = config ? yaml.dump(config, { indent: 2, lineWidth: 120 }) : "";
  const jsonString = config ? JSON.stringify(config, null, 2) : "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, extension: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resourceName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            {resourceName} Configuration
          </DialogTitle>
          <DialogDescription>
            View and export the {resourceType} configuration in YAML or JSON format
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading configuration...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="yaml" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="yaml">YAML</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="yaml" className="flex-1 mt-4 relative">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(yamlString)}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(yamlString, "yaml")}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
              <div className="h-[500px] overflow-auto border rounded-lg bg-muted/30">
                <pre className="p-4 text-xs font-mono">
                  <code className="language-yaml">{yamlString}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="json" className="flex-1 mt-4 relative">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(jsonString)}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(jsonString, "json")}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
              <div className="h-[500px] overflow-auto border rounded-lg bg-muted/30">
                <pre className="p-4 text-xs font-mono">
                  <code className="language-json">{jsonString}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
