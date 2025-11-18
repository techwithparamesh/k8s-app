import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ResourceCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  testId?: string;
}

export function ResourceCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "bg-primary",
  testId,
}: ResourceCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <h3 className="text-3xl font-bold mt-2" data-testid={`${testId}-value`}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
