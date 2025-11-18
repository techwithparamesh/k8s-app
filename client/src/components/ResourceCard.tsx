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
  const getGradientClass = (color: string) => {
    if (color.includes('blue')) return 'gradient-primary';
    if (color.includes('green') || color.includes('emerald')) return 'gradient-success';
    if (color.includes('purple')) return 'gradient-info';
    if (color.includes('orange') || color.includes('yellow')) return 'gradient-warning';
    if (color.includes('red')) return 'gradient-danger';
    if (color.includes('cyan')) return 'gradient-info';
    return 'gradient-primary';
  };

  return (
    <Card className="card-hover-lift border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden animate-slide-in-up" data-testid={testId}>
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl"></div>
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              {title}
            </p>
            <h3 className="text-4xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70" data-testid={`${testId}-value`}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2 font-medium">{subtitle}</p>
            )}
          </div>
          <div className={`w-14 h-14 rounded-xl ${getGradientClass(iconColor)} flex items-center justify-center shadow-lg transform transition-transform hover:scale-110`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
