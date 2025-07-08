import { Search, Plus, Calendar, Eye } from "lucide-react";

const ferias = [
  {
    id: "1",
    funcionario: "João Silva",
    periodoAquisitivo: "2023/2024",
    diasDireito: 30,
    diasUsados: 15,
    diasRestantes: 15,
    proximoPeriodo: {
      inicio: "2024-02-15",
      fim: "2024-02-29",
      dias: 15,
      status: "agendado",
    },
  },
  {
    id: "2",
    funcionario: "Maria Santos",
    periodoAquisitivo: "2023/2024",
    diasDireito: 30,
    diasUsados: 10,
    diasRestantes: 20,
    proximoPeriodo: {
      inicio: "2024-03-01",
      fim: "2024-03-15",
      dias: 10,
      status: "agendado",
    },
  },
  {
    id: "3",
    funcionario: "Pedro Costa",
    periodoAquisitivo: "2023/2024",
    diasDireito: 30,
    diasUsados: 30,
    diasRestantes: 0,
    proximoPeriodo: null,
  },
];

export default function FeriasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Férias</h1>
          <p className="text-gray-600">
            Controle os períodos de férias dos funcionários
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Agendar Férias
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
            <option>Período Aquisitivo</option>
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Status</option>
            <option>Com saldo</option>
            <option>Sem saldo</option>
            <option>Férias agendadas</option>
          </select>
        </div>
      </div>

      {/* Cards de férias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ferias.map((funcionarioFerias) => (
          <div
            key={funcionarioFerias.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {funcionarioFerias.funcionario}
              </h3>
              <button className="text-blue-600 hover:text-blue-700">
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Período:</span>{" "}
                {funcionarioFerias.periodoAquisitivo}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">
                    {funcionarioFerias.diasDireito}
                  </div>
                  <div className="text-xs text-gray-600">Direito</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">
                    {funcionarioFerias.diasUsados}
                  </div>
                  <div className="text-xs text-gray-600">Usados</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-yellow-600">
                    {funcionarioFerias.diasRestantes}
                  </div>
                  <div className="text-xs text-gray-600">Restantes</div>
                </div>
              </div>

              {funcionarioFerias.proximoPeriodo ? (
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">Próximas Férias</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>
                      {new Date(
                        funcionarioFerias.proximoPeriodo.inicio
                      ).toLocaleDateString("pt-BR")}{" "}
                      -{" "}
                      {new Date(
                        funcionarioFerias.proximoPeriodo.fim
                      ).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span>{funcionarioFerias.proximoPeriodo.dias} dias</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          funcionarioFerias.proximoPeriodo.status === "agendado"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {funcionarioFerias.proximoPeriodo.status === "agendado"
                          ? "Agendado"
                          : "Em andamento"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-3 text-center text-sm text-gray-500">
                  Nenhuma férias agendada
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo estatístico */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Geral
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Funcionários</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Férias Agendadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">35</div>
            <div className="text-sm text-gray-600">Dias Restantes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-gray-600">Sem Saldo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
