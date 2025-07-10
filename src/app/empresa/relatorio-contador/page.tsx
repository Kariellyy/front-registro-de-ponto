import { Download, FileText, Calendar, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
          <h1 className="text-2xl font-bold text-foreground">
            Relatório para Contador
          </h1>
          <p className="text-muted-foreground">
            Relatórios de banco de horas para envio ao contador
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Gerar Relatório
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Seletor de período */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Período do Relatório
              </label>
              <div className="flex gap-2">
                <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
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
                <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do período */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Resumo - {relatorioMensal.mes}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {relatorioMensal.totalFuncionarios}
              </div>
              <div className="text-sm text-muted-foreground">Funcionários</div>
            </div>
            <div className="bg-success/10 dark:bg-success/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {relatorioMensal.horasRegulares}h
              </div>
              <div className="text-sm text-muted-foreground">Horas Regulares</div>
            </div>
            <div className="bg-secondary/10 dark:bg-secondary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-secondary-foreground">
                {relatorioMensal.horasExtras}h
              </div>
              <div className="text-sm text-muted-foreground">Horas Extras</div>
            </div>
            <div className="bg-destructive/10 dark:bg-destructive/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-destructive">
                {relatorioMensal.horasDebito}h
              </div>
              <div className="text-sm text-muted-foreground">Horas Débito</div>
            </div>
            <div className="bg-warning/10 dark:bg-warning/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {relatorioMensal.saldoBancoHoras}h
              </div>
              <div className="text-sm text-muted-foreground">Saldo Banco Horas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por funcionário */}
      <Card>
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Detalhamento por Funcionário
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Horas Regulares
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Horas Extras
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Horas Débito
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Saldo do Mês
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Saldo Acumulado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {funcionario.nome}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-foreground">
                    {funcionario.horasRegulares}h
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-secondary-foreground font-medium">
                    {funcionario.horasExtras}h
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-destructive font-medium">
                    {funcionario.horasDebito}h
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <span
                      className={
                        funcionario.saldoMes >= 0
                          ? "text-success"
                          : "text-destructive"
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
                          ? "text-success"
                          : "text-destructive"
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
      </Card>

      {/* Informações para o contador */}
      <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Informações para o Contador
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
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
        </CardContent>
      </Card>
    </div>
  );
}
