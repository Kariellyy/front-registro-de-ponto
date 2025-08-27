import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Justificativa } from "@/types/justificativa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  User,
  XCircle,
} from "lucide-react";

interface DetalhesJustificativaProps {
  justificativa: Justificativa;
}

const tipoLabels = {
  fora_raio: "Fora do Raio",
  problema_tecnico: "Problema Técnico",
  reuniao_externa: "Reunião Externa",
  viagem_servico: "Viagem a Serviço",
  outros: "Outros",
};

const statusConfig = {
  pendente: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: AlertCircle,
    color: "text-yellow-600",
  },
  aprovada: {
    label: "Aprovada",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600",
  },
  rejeitada: {
    label: "Rejeitada",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600",
  },
};

export function DetalhesJustificativa({
  justificativa,
}: DetalhesJustificativaProps) {
  const status = statusConfig[justificativa.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {tipoLabels[justificativa.tipo]}
          </h2>
          <p className="text-muted-foreground">Detalhes da justificativa</p>
        </div>
        <Badge
          variant={status.variant}
          className="flex items-center gap-1 px-3 py-1"
        >
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">Funcionário:</span>
                <span>{justificativa.registroPonto?.usuario.nome}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data de Criação:</span>
                <span>
                  {format(new Date(justificativa.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Hora de Criação:</span>
                <span>
                  {format(new Date(justificativa.createdAt), "HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Motivo:</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {justificativa.motivo}
              </p>
            </div>

            {justificativa.observacoes && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Observações:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {justificativa.observacoes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações do Registro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Registro de Ponto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Tipo de Registro:</span>
                <Badge variant="outline">
                  {justificativa.registroPonto?.tipo === "entrada" && "Entrada"}
                  {justificativa.registroPonto?.tipo === "saida" && "Saída"}
                  {justificativa.registroPonto?.tipo === "intervalo_inicio" &&
                    "Início do Intervalo"}
                  {justificativa.registroPonto?.tipo === "intervalo_fim" &&
                    "Fim do Intervalo"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data/Hora do Registro:</span>
                <span>
                  {justificativa.registroPonto?.dataHora &&
                    format(
                      new Date(justificativa.registroPonto.dataHora),
                      "dd/MM/yyyy HH:mm",
                      { locale: ptBR }
                    )}
                </span>
              </div>
            </div>

            {justificativa.registroPonto?.latitude &&
              justificativa.registroPonto?.longitude && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Latitude: {justificativa.registroPonto.latitude}</p>
                      <p>Longitude: {justificativa.registroPonto.longitude}</p>
                    </div>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Informações de Aprovação */}
      {justificativa.aprovador && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Informações de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">Aprovado por:</span>
                <span>{justificativa.aprovador.nome}</span>
              </div>

              {justificativa.dataAprovacao && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Data de Aprovação:</span>
                  <span>
                    {format(
                      new Date(justificativa.dataAprovacao),
                      "dd/MM/yyyy HH:mm",
                      { locale: ptBR }
                    )}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Atualizações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Última Atualização:</span>
              <span>
                {format(new Date(justificativa.updatedAt), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
