import { Search, Plus, Eye, Check, X } from "lucide-react";

const ausencias = [
  {
    id: "1",
    funcionario: "Ana Lima",
    tipo: "Atestado Médico",
    dataInicio: "2024-01-20",
    dataFim: "2024-01-22",
    dias: 3,
    motivo: "Consulta médica de emergência",
    status: "pendente",
  },
  {
    id: "2",
    funcionario: "Carlos Silva",
    tipo: "Licença",
    dataInicio: "2024-01-25",
    dataFim: "2024-01-25",
    dias: 1,
    motivo: "Assuntos pessoais",
    status: "aprovada",
  },
  {
    id: "3",
    funcionario: "Beatriz Costa",
    tipo: "Falta",
    dataInicio: "2024-01-18",
    dataFim: "2024-01-18",
    dias: 1,
    motivo: "Não informado",
    status: "rejeitada",
  },
];

export default function AusenciasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Controle de Ausências
          </h1>
          <p className="text-gray-600">
            Gerencie as solicitações de ausências dos funcionários
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nova Ausência
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar funcionário..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Todos os tipos</option>
            <option>Atestado Médico</option>
            <option>Licença</option>
            <option>Falta</option>
            <option>Feriado</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Todos os status</option>
            <option>Pendente</option>
            <option>Aprovada</option>
            <option>Rejeitada</option>
          </select>
        </div>
      </div>

      {/* Lista de ausências */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dias
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ausencias.map((ausencia) => (
                <tr key={ausencia.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {ausencia.funcionario}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ausencia.motivo}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {ausencia.tipo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(ausencia.dataInicio).toLocaleDateString("pt-BR")}{" "}
                    - {new Date(ausencia.dataFim).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {ausencia.dias} dia{ausencia.dias > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ausencia.status === "pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : ausencia.status === "aprovada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ausencia.status === "pendente"
                        ? "Pendente"
                        : ausencia.status === "aprovada"
                        ? "Aprovada"
                        : "Rejeitada"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      {ausencia.status === "pendente" && (
                        <>
                          <button className="text-green-600 hover:text-green-700">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
