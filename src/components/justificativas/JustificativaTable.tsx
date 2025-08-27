import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Justificativa } from "@/types/justificativa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface JustificativaTableProps {
  justificativas: Justificativa[];
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

export function JustificativaTable({
  justificativas,
  onAprovar,
  onRejeitar,
  onVerDetalhes,
  isAdmin = false,
}: JustificativaTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {justificativas.map((justificativa) => {
            const status = statusConfig[justificativa.status];
            const StatusIcon = status.icon;

            return (
              <TableRow key={justificativa.id}>
                <TableCell className="font-medium">
                  {justificativa.registroPonto?.usuario.nome}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {tipoLabels[justificativa.tipo]}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {format(new Date(justificativa.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                    <div className="text-muted-foreground">
                      {format(new Date(justificativa.createdAt), "HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    <p
                      className="text-sm truncate"
                      title={justificativa.motivo}
                    >
                      {justificativa.motivo}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={status.variant}
                    className="flex items-center gap-1 w-fit"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onVerDetalhes && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVerDetalhes(justificativa.id)}
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
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onRejeitar?.(justificativa.id)}
                        >
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
