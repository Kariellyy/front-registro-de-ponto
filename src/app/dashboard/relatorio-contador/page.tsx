import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Download } from "lucide-react";

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
      {/* Barra compacta no topo */}
      <div className="bg-background border-b border-border pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Relatório para Contador
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Filtro compacto */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Período:
            </label>
            <select className="px-3 py-1.5 text-sm border border-input rounded-md focus:ring-2 focus:ring-primary bg-background text-foreground">
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
            <select className="px-3 py-1.5 text-sm border border-input rounded-md focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
            <Button size="sm" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </div>

      {/* Resumo do período */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{backgroundColor: '#5baca3'}}></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {relatorioMensal.totalFuncionarios}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Funcionários</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{backgroundColor: '#5baca3'}}></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {relatorioMensal.horasRegulares}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Horas Regulares</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{backgroundColor: '#5baca3'}}></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {relatorioMensal.horasExtras}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Horas Extras</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{backgroundColor: '#5baca3'}}></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {relatorioMensal.horasDebito}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Horas Débito</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{backgroundColor: '#5baca3'}}></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {relatorioMensal.saldoBancoHoras}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Saldo Banco Horas</div>
        </div>
      </div>

      {/* Detalhamento por funcionário */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Funcionário
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Horas Regulares
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Horas Extras
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Horas Débito
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Saldo do Mês
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Saldo Acumulado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {funcionarios.map((funcionario, index) => (
                  <tr 
                    key={funcionario.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {funcionario.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {funcionario.horasRegulares}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {funcionario.horasExtras}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {funcionario.horasDebito}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-semibold ${
                          funcionario.saldoMes >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {funcionario.saldoMes >= 0 ? "+" : ""}
                        {funcionario.saldoMes}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-semibold ${
                          funcionario.saldoAcumulado >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
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
    </div>
  );
}
