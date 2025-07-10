import { Search, Plus, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <h1 className="text-2xl font-bold text-foreground">
            Controle de Ausências
          </h1>
          <p className="text-muted-foreground">
            Gerencie as solicitações de ausências dos funcionários
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Ausência
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionário..."
                  className="pl-10"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Todos os tipos</option>
              <option>Atestado Médico</option>
              <option>Licença</option>
              <option>Falta</option>
              <option>Feriado</option>
            </select>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Todos os status</option>
              <option>Pendente</option>
              <option>Aprovada</option>
              <option>Rejeitada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de ausências */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Período
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Dias
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
              {ausencias.map((ausencia) => (
                <tr key={ausencia.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {ausencia.funcionario}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ausencia.motivo}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {ausencia.tipo}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(ausencia.dataInicio).toLocaleDateString("pt-BR")}{" "}
                    - {new Date(ausencia.dataFim).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {ausencia.dias} dia{ausencia.dias > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        ausencia.status === "pendente"
                          ? "warning"
                          : ausencia.status === "aprovada"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {ausencia.status === "pendente"
                        ? "Pendente"
                        : ausencia.status === "aprovada"
                        ? "Aprovada"
                        : "Rejeitada"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {ausencia.status === "pendente" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-success hover:text-success/70">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/70">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
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
