import { Search, Filter, Check, X, Eye, Download } from "lucide-react";

const justificativas = [
  {
    id: "1",
    funcionario: "João Silva",
    data: "2024-01-15",
    motivo: "Atraso por trânsito",
    descricao: "Atraso de 30 minutos devido a acidente na via principal",
    status: "pendente",
    dataJustificativa: "2024-01-15",
  },
  {
    id: "2",
    funcionario: "Maria Santos",
    data: "2024-01-14",
    motivo: "Consulta médica",
    descricao: "Saída antecipada para consulta médica agendada",
    status: "aprovada",
    dataJustificativa: "2024-01-14",
  },
  {
    id: "3",
    funcionario: "Pedro Costa",
    data: "2024-01-13",
    motivo: "Esquecimento de bater ponto",
    descricao: "Esqueci de bater o ponto na saída do almoço",
    status: "rejeitada",
    dataJustificativa: "2024-01-13",
  },
];

export default function JustificativasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Justificativas de Pontos
          </h1>
          <p className="text-gray-600">
            Gerencie as solicitações de justificativas dos funcionários
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Exportar Relatório
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
            <option>Todos os status</option>
            <option>Pendente</option>
            <option>Aprovada</option>
            <option>Rejeitada</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lista de justificativas */}
      <div className="space-y-4">
        {justificativas.map((justificativa) => (
          <div
            key={justificativa.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {justificativa.funcionario}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      justificativa.status === "pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : justificativa.status === "aprovada"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {justificativa.status === "pendente"
                      ? "Pendente"
                      : justificativa.status === "aprovada"
                      ? "Aprovada"
                      : "Rejeitada"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Data do Ponto:</span>{" "}
                    {new Date(justificativa.data).toLocaleDateString("pt-BR")}
                  </div>
                  <div>
                    <span className="font-medium">Data da Justificativa:</span>{" "}
                    {new Date(
                      justificativa.dataJustificativa
                    ).toLocaleDateString("pt-BR")}
                  </div>
                  <div>
                    <span className="font-medium">Motivo:</span>{" "}
                    {justificativa.motivo}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="font-medium text-sm text-gray-600">
                    Descrição:
                  </span>
                  <p className="text-gray-700 mt-1">
                    {justificativa.descricao}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                {justificativa.status === "pendente" && (
                  <>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-600">
          Mostrando 3 de 3 justificativas
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            disabled
          >
            Anterior
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
            1
          </button>
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            disabled
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
