import { Search, Plus, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <h1 className="text-2xl font-bold text-foreground">Gestão de Férias</h1>
          <p className="text-muted-foreground">
            Controle os períodos de férias dos funcionários
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agendar Férias
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
              <option>Período Aquisitivo</option>
              <option>2023/2024</option>
              <option>2024/2025</option>
            </select>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Status</option>
              <option>Com saldo</option>
              <option>Sem saldo</option>
              <option>Férias agendadas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cards de férias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ferias.map((funcionarioFerias) => (
          <Card key={funcionarioFerias.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  {funcionarioFerias.funcionario}
                </h3>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Período:</span>{" "}
                  {funcionarioFerias.periodoAquisitivo}
                </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-2">
                  <div className="text-lg font-bold text-primary">
                    {funcionarioFerias.diasDireito}
                  </div>
                  <div className="text-xs text-muted-foreground">Direito</div>
                </div>
                <div className="bg-success/10 dark:bg-success/20 rounded-lg p-2">
                  <div className="text-lg font-bold text-success">
                    {funcionarioFerias.diasUsados}
                  </div>
                  <div className="text-xs text-muted-foreground">Usados</div>
                </div>
                <div className="bg-warning/10 dark:bg-warning/20 rounded-lg p-2">
                  <div className="text-lg font-bold text-warning">
                    {funcionarioFerias.diasRestantes}
                  </div>
                  <div className="text-xs text-muted-foreground">Restantes</div>
                </div>
              </div>

              {funcionarioFerias.proximoPeriodo ? (
                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm text-foreground">Próximas Férias</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
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
                      <Badge
                        variant={
                          funcionarioFerias.proximoPeriodo.status === "agendado"
                            ? "default"
                            : "success"
                        }
                      >
                        {funcionarioFerias.proximoPeriodo.status === "agendado"
                          ? "Agendado"
                          : "Em andamento"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border pt-3 text-center text-sm text-muted-foreground">
                  Nenhuma férias agendada
                </div>
              )}
            </div>
          </CardContent>
                  </Card>
        ))}
      </div>

      {/* Resumo estatístico */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Resumo Geral
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Funcionários</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">2</div>
              <div className="text-sm text-muted-foreground">Férias Agendadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">35</div>
              <div className="text-sm text-muted-foreground">Dias Restantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">1</div>
              <div className="text-sm text-muted-foreground">Sem Saldo</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
