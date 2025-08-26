import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Eye, Search } from "lucide-react";

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
        <h1 className="text-2xl font-bold text-foreground">
          Controle de Jornada
        </h1>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar funcionário..." className="pl-10" />
              </div>
            </div>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Todos os status</option>
              <option>Presente</option>
              <option>Ausente</option>
              <option>Trabalhando</option>
            </select>
            <Input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de funcionários */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Entrada
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Saída
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Horas Trabalhadas
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-card-foreground">
                        {funcionario.nome}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {funcionario.cargo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {funcionario.entrada}
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {funcionario.saida}
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {funcionario.horasTrabalhadas}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        funcionario.status === "Presente"
                          ? "default"
                          : funcionario.status === "Trabalhando"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        funcionario.status === "Presente"
                          ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400"
                          : funcionario.status === "Trabalhando"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
                          : undefined
                      }
                    >
                      {funcionario.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
