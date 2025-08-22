import AttendanceChart from "@/components/dashboard/AttendanceChart";
import MetricCard from "@/components/dashboard/MetricCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertTriangle,
    Calendar,
    Clock,
    UserCheck,
    Users,
    UserX,
} from "lucide-react";

export default function EmpresaDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total de Funcionários"
          value={50}
          icon={Users}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Presentes Hoje"
          value={47}
          icon={UserCheck}
          color="green"
          trend={{ value: 2, isPositive: true }}
        />
        <MetricCard
          title="Ausentes Hoje"
          value={3}
          icon={UserX}
          color="red"
          trend={{ value: 1, isPositive: false }}
        />
        <MetricCard
          title="Horas Extras (Mês)"
          value="127h"
          icon={Clock}
          color="purple"
          trend={{ value: 15, isPositive: false }}
        />
        <MetricCard
          title="Justificativas Pendentes"
          value={8}
          icon={AlertTriangle}
          color="yellow"
        />
        <MetricCard
          title="Férias Agendadas"
          value={12}
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Gráficos e atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <RecentActivity />
      </div>

      {/* Alertas e notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950/20 dark:border-yellow-800/50">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300">
                8 justificativas aguardando aprovação
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Funcionários aguardando análise de justificativas de ponto
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800/50">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Relatório mensal disponível
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Relatório de horas do mês passado pronto para envio ao contador
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
