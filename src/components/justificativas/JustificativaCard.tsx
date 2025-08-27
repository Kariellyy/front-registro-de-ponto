import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Justificativa } from "@/types/justificativa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  User,
  XCircle,
} from "lucide-react";

interface JustificativaCardProps {
  justificativa: Justificativa;
  onAprovar?: (id: string) => void;
  onRejeitar?: (id: string) => void;
  onVerDetalhes?: (id: string) => void;
  isAdmin?: boolean;
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

export function JustificativaCard({
  justificativa,
  onAprovar,
  onRejeitar,
  onVerDetalhes,
  isAdmin = false,
}: JustificativaCardProps) {
  const status = statusConfig[justificativa.status];
  const StatusIcon = status.icon;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {tipoLabels[justificativa.tipo]}
          </CardTitle>
          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{justificativa.registroPonto?.usuario.nome}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(justificativa.createdAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(new Date(justificativa.createdAt), "HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Motivo:</h4>
          <p className="text-sm text-muted-foreground">
            {justificativa.motivo}
          </p>
        </div>

        {justificativa.observacoes && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Observações:</h4>
            <p className="text-sm text-muted-foreground">
              {justificativa.observacoes}
            </p>
          </div>
        )}

        {justificativa.aprovador && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Aprovado por:</h4>
            <p className="text-sm text-muted-foreground">
              {justificativa.aprovador.nome}
            </p>
            {justificativa.dataAprovacao && (
              <p className="text-xs text-muted-foreground">
                {format(
                  new Date(justificativa.dataAprovacao),
                  "dd/MM/yyyy HH:mm",
                  { locale: ptBR }
                )}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onVerDetalhes && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVerDetalhes(justificativa.id)}
              className="flex-1"
            >
              Ver Detalhes
            </Button>
          )}

          {isAdmin && justificativa.status === "pendente" && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAprovar?.(justificativa.id)}
                className="flex-1"
              >
                Aprovar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRejeitar?.(justificativa.id)}
                className="flex-1"
              >
                Rejeitar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
