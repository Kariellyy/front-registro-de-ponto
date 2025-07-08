import { Search, Filter, Download, Eye } from "lucide-react";

const funcionarios = [
  {
    id: "1",
    nome: "João Silva",
    cargo: "Desenvolvedor",
    entrada: "08:00",
    saida: "17:00",
    horasTrabalhadas: "8h 0m",
    status: "Presente",
  },
  {
    id: "2",
    nome: "Maria Santos",
    cargo: "Designer",
    entrada: "08:15",
    saida: "-",
    horasTrabalhadas: "6h 45m",
    status: "Trabalhando",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    cargo: "Gerente",
    entrada: "-",
    saida: "-",
    horasTrabalhadas: "0h 0m",
    status: "Ausente",
  },
];

export default function JornadaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Controle de Jornada
          </h1>
          <p className="text-gray-600">
            Acompanhe a jornada de trabalho dos funcionários
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
            <option>Presente</option>
            <option>Ausente</option>
            <option>Trabalhando</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* Tabela de funcionários */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrada
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saída
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Trabalhadas
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
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {funcionario.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {funcionario.cargo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {funcionario.entrada}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {funcionario.saida}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {funcionario.horasTrabalhadas}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        funcionario.status === "Presente"
                          ? "bg-green-100 text-green-800"
                          : funcionario.status === "Trabalhando"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {funcionario.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
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
