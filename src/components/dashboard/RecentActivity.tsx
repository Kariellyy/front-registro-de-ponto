import { Clock, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  type: "entrada" | "saida" | "ausencia" | "justificativa";
  funcionario: string;
  timestamp: Date;
  description: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "entrada",
    funcionario: "João Silva",
    timestamp: new Date(),
    description: "Registrou entrada às 08:00",
  },
  {
    id: "2",
    type: "justificativa",
    funcionario: "Maria Santos",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    description: "Solicitou justificativa para atraso",
  },
  {
    id: "3",
    type: "ausencia",
    funcionario: "Pedro Costa",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    description: "Solicitou ausência para amanhã",
  },
  {
    id: "4",
    type: "saida",
    funcionario: "Ana Lima",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    description: "Registrou saída às 17:30",
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "entrada":
      return <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case "saida":
      return <UserX className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "ausencia":
      return <UserX className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    case "justificativa":
      return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  return timestamp.toLocaleDateString("pt-BR");
};

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">{activity.funcionario}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {formatTimestamp(activity.timestamp)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button variant="link" className="w-full mt-4 h-auto p-0">
          Ver todas as atividades
        </Button>
      </CardContent>
    </Card>
  );
}
