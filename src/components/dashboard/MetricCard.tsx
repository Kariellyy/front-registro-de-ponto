import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "blue" | "green" | "red" | "yellow" | "purple";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  green: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  red: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  yellow: "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  purple: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-2">
                <Badge
                  variant={trend.isPositive ? "default" : "destructive"}
                  className="text-xs"
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  vs mês anterior
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-2 rounded-lg border", colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
