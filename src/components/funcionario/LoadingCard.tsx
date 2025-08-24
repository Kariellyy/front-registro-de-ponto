import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingCardProps {
  lines?: number;
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
      <CardHeader>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
