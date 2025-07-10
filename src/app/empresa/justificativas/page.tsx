import { Search, Filter, Check, X, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <h1 className="text-2xl font-bold text-foreground">
            Justificativas de Pontos
          </h1>
          <p className="text-muted-foreground">
            Gerencie as solicitações de justificativas dos funcionários
          </p>
        </div>
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
                <Input
                  placeholder="Buscar funcionário..."
                  className="pl-10"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Todos os status</option>
              <option>Pendente</option>
              <option>Aprovada</option>
              <option>Rejeitada</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de justificativas */}
      <div className="space-y-4">
        {justificativas.map((justificativa) => (
          <Card key={justificativa.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="font-semibold text-foreground">
                      {justificativa.funcionario}
                    </h3>
                    <Badge
                      variant={
                        justificativa.status === "pendente"
                          ? "warning"
                          : justificativa.status === "aprovada"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {justificativa.status === "pendente"
                        ? "Pendente"
                        : justificativa.status === "aprovada"
                        ? "Aprovada"
                        : "Rejeitada"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
                    <span className="font-medium text-sm text-muted-foreground">
                      Descrição:
                    </span>
                    <p className="text-foreground mt-1">
                      {justificativa.descricao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {justificativa.status === "pendente" && (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <Card>
        <CardContent className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando 3 de 3 justificativas
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Anterior
            </Button>
            <Button size="sm">
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
