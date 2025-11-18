import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="p-8 animate-fade-in">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border-2 border-dashed border-border/50 bg-muted/10">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">Failed to load data</p>
            <p className="text-sm text-muted-foreground">
              We encountered an error while fetching the data. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} className="mt-4" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
