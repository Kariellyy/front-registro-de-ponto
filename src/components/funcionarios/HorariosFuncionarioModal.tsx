"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Funcionario } from "@/types";
import { Clock, X } from "lucide-react";

interface HorariosFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: Funcionario | null;
}

const diasSemana = [
  { key: "0", nome: "Domingo", abrev: "DOM" },
  { key: "1", nome: "Segunda-feira", abrev: "SEG" },
  { key: "2", nome: "Terça-feira", abrev: "TER" },
  { key: "3", nome: "Quarta-feira", abrev: "QUA" },
  { key: "4", nome: "Quinta-feira", abrev: "QUI" },
  { key: "5", nome: "Sexta-feira", abrev: "SEX" },
  { key: "6", nome: "Sábado", abrev: "SÁB" },
];

export function HorariosFuncionarioModal({
  isOpen,
  onClose,
  funcionario,
}: HorariosFuncionarioModalProps) {
  if (!isOpen || !funcionario) return null;

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.length === 8 ? time.substring(0, 5) : time;
  };

  const calcularHorasDia = (horario: any) => {
    if (!horario.ativo || !horario.horarioInicio || !horario.horarioFim) {
      return 0;
    }

    const [inicioHour, inicioMin] = horario.horarioInicio
      .split(":")
      .map(Number);
    const [fimHour, fimMin] = horario.horarioFim.split(":").map(Number);

    let horasDia = fimHour + fimMin / 60 - (inicioHour + inicioMin / 60);

    // Descontar intervalo se existir
    if (
      horario.temIntervalo &&
      horario.intervaloInicio &&
      horario.intervaloFim
    ) {
      const [intInicioHour, intInicioMin] = horario.intervaloInicio
        .split(":")
        .map(Number);
      const [intFimHour, intFimMin] = horario.intervaloFim
        .split(":")
        .map(Number);
      const horasIntervalo =
        intFimHour + intFimMin / 60 - (intInicioHour + intInicioMin / 60);
      horasDia -= horasIntervalo;
    }

    return Math.max(0, horasDia);
  };

  const calcularCargaHorariaSemanal = () => {
    if (!funcionario.horarios) return 0;

    return funcionario.horarios.reduce((total, horario) => {
      return total + calcularHorasDia(horario);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Trabalho
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {funcionario.nome}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {calcularCargaHorariaSemanal().toFixed(1)}h
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Carga Horária Semanal
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {funcionario.horarios?.filter((h) => h.ativo).length || 0}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Dias Ativos
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {funcionario.horarios?.filter((h) => h.temIntervalo).length ||
                    0}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Dias com Intervalo
                </div>
              </div>
            </div>

            {/* Tabela de Horários */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dia
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Horário de Trabalho
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Intervalo
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {diasSemana.map((dia) => {
                    const horario = funcionario.horarios?.find(
                      (h) => h.diaSemana === parseInt(dia.key)
                    );
                    const horasDia = horario ? calcularHorasDia(horario) : 0;

                    return (
                      <tr key={dia.key} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-foreground">
                              {dia.nome}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {dia.abrev}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              horario?.ativo
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                            }`}
                          >
                            {horario?.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {horario?.ativo ? (
                            <div className="text-sm">
                              <div className="font-medium">
                                {formatTime(horario.horarioInicio)} -{" "}
                                {formatTime(horario.horarioFim)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {horario?.ativo && horario.temIntervalo ? (
                            <div className="text-sm">
                              <div className="font-medium">
                                {formatTime(horario.intervaloInicio)} -{" "}
                                {formatTime(horario.intervaloFim)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {horario?.ativo ? "Sem intervalo" : "-"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">
                            {horario?.ativo ? `${horasDia.toFixed(1)}h` : "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Botão de Fechar */}
            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
