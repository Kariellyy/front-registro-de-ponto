import { Clock, UserCheck, UserX, AlertTriangle } from "lucide-react";

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
      return <UserCheck className="w-4 h-4 text-green-600" />;
    case "saida":
      return <UserX className="w-4 h-4 text-blue-600" />;
    case "ausencia":
      return <UserX className="w-4 h-4 text-yellow-600" />;
    case "justificativa":
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Atividades Recentes
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.funcionario}
              </p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        Ver todas as atividades
      </button>
    </div>
  );
}
