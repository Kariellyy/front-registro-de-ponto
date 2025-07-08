import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AttendanceChart from "@/components/dashboard/AttendanceChart";

export default function EmpresaDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de ponto</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alertas Importantes
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">
                8 justificativas aguardando aprovação
              </p>
              <p className="text-sm text-yellow-700">
                Funcionários aguardando análise de justificativas de ponto
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">
                Relatório mensal disponível
              </p>
              <p className="text-sm text-blue-700">
                Relatório de horas do mês passado pronto para envio ao contador
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
