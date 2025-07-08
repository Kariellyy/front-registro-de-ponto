import { Download, FileText, Calendar, Clock, Filter } from "lucide-react";

const relatorioMensal = {
  mes: "Janeiro 2024",
  totalFuncionarios: 50,
  horasRegulares: 8800,
  horasExtras: 127,
  horasDebito: 23,
  saldoBancoHoras: 104,
};

const funcionarios = [
  {
    id: "1",
    nome: "João Silva",
    horasRegulares: 176,
    horasExtras: 12,
    horasDebito: 0,
    saldoMes: 12,
    saldoAcumulado: 25,
  },
  {
    id: "2",
    nome: "Maria Santos",
    horasRegulares: 176,
    horasExtras: 8,
    horasDebito: 2,
    saldoMes: 6,
    saldoAcumulado: 18,
  },
  {
    id: "3",
    nome: "Pedro Costa",
    horasRegulares: 172,
    horasExtras: 0,
    horasDebito: 4,
    saldoMes: -4,
    saldoAcumulado: 2,
  },
];

export default function RelatorioContadorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Relatório para Contador
          </h1>
          <p className="text-gray-600">
            Relatórios de banco de horas para envio ao contador
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Gerar Relatório
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Seletor de período */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período do Relatório
            </label>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Janeiro</option>
                <option>Fevereiro</option>
                <option>Março</option>
                <option>Abril</option>
                <option>Maio</option>
                <option>Junho</option>
                <option>Julho</option>
                <option>Agosto</option>
                <option>Setembro</option>
                <option>Outubro</option>
                <option>Novembro</option>
                <option>Dezembro</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Resumo do período */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo - {relatorioMensal.mes}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {relatorioMensal.totalFuncionarios}
            </div>
            <div className="text-sm text-gray-600">Funcionários</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {relatorioMensal.horasRegulares}h
            </div>
            <div className="text-sm text-gray-600">Horas Regulares</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {relatorioMensal.horasExtras}h
            </div>
            <div className="text-sm text-gray-600">Horas Extras</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {relatorioMensal.horasDebito}h
            </div>
            <div className="text-sm text-gray-600">Horas Débito</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {relatorioMensal.saldoBancoHoras}h
            </div>
            <div className="text-sm text-gray-600">Saldo Banco Horas</div>
          </div>
        </div>
      </div>

      {/* Detalhamento por funcionário */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalhamento por Funcionário
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Regulares
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Extras
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Débito
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo do Mês
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Acumulado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {funcionario.nome}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {funcionario.horasRegulares}h
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-purple-600 font-medium">
                    {funcionario.horasExtras}h
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">
                    {funcionario.horasDebito}h
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <span
                      className={
                        funcionario.saldoMes >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {funcionario.saldoMes >= 0 ? "+" : ""}
                      {funcionario.saldoMes}h
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <span
                      className={
                        funcionario.saldoAcumulado >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {funcionario.saldoAcumulado >= 0 ? "+" : ""}
                      {funcionario.saldoAcumulado}h
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informações para o contador */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              Informações para o Contador
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Este relatório contém o banco de horas detalhado de todos os
                funcionários
              </li>
              <li>
                • Horas extras devem ser pagas conforme legislação trabalhista
                (50% ou 100%)
              </li>
              <li>• Horas débito podem ser compensadas no próximo período</li>
              <li>
                • Saldo acumulado representa o total do banco de horas do
                funcionário
              </li>
              <li>
                • Recomenda-se zerar o banco de horas semestralmente conforme
                acordo coletivo
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
