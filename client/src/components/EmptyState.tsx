import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        {icon && (
          <div className="mb-6 p-4 rounded-full bg-muted/30 text-muted-foreground">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        <div className="flex items-center gap-3">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} size="lg">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(secondaryAction.href, "_blank")}
              >
                {secondaryAction.label}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
