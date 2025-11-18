import { useNamespace } from "@/contexts/NamespaceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";

export function NamespaceSelector() {
  const { selectedNamespace, setSelectedNamespace, namespaces } = useNamespace();

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <Package className="w-4 h-4 text-muted-foreground" />
      <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
        <SelectTrigger className="h-9 bg-background/50 border-border/50">
          <SelectValue placeholder="Select namespace" />
        </SelectTrigger>
        <SelectContent>
          {namespaces.map((namespace) => (
            <SelectItem key={namespace} value={namespace}>
              {namespace === "all" ? "All Namespaces" : namespace}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
