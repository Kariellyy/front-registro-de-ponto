"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  calcularCargaHorariaSemanal,
  diasSemanaLabels,
  gerarHorariosPadrao,
  validarHorario,
} from "@/lib/horarios";
import { AlertTriangle, Calendar, Clock, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
  temIntervalo: boolean;
  intervaloInicio?: string;
  intervaloFim?: string;
}

interface HorariosFuncionarioConfigProps {
  horarios: { [diaSemana: string]: HorarioDia };
  horariosEmpresa: { [diaSemana: string]: HorarioDia };
  onChange: (
    horarios: { [diaSemana: string]: HorarioDia },
    cargaHoraria: number
  ) => void;
}

const diasSemana = diasSemanaLabels();

export function HorariosFuncionarioConfig({
  horarios,
  horariosEmpresa,
  onChange,
}: HorariosFuncionarioConfigProps) {
  const [localHorarios, setLocalHorarios] = useState(horarios);
  const [erros, setErros] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    setLocalHorarios(horarios);
  }, [horarios]);

  const updateHorario = (dia: string, campo: keyof HorarioDia, valor: any) => {
    const novosHorarios = {
      ...localHorarios,
      [dia]: {
        ...localHorarios[dia],
        [campo]: valor,
      },
    };

    // Validar horário após atualização
    validarHorarios(novosHorarios);

    setLocalHorarios(novosHorarios);
    const cargaHoraria = calcularCargaHorariaSemanal(novosHorarios);
    onChange(novosHorarios, cargaHoraria);
  };

  const validarHorarios = (horariosParaValidar: {
    [diaSemana: string]: HorarioDia;
  }) => {
    const novosErros: { [key: string]: string[] } = {};

    Object.entries(horariosParaValidar).forEach(([dia, horario]) => {
      const errosDia: string[] = [];

      if (horario.ativo) {
        // Validações básicas do horário
        const errosBasicos = validarHorario(horario);
        errosDia.push(...errosBasicos);

        // Validar se está dentro dos horários da empresa
        const horarioEmpresa = horariosEmpresa[dia];
        if (horarioEmpresa && horarioEmpresa.ativo) {
          if (horario.inicio < horarioEmpresa.inicio) {
            errosDia.push(
              `Início deve ser após ${horarioEmpresa.inicio} (horário da empresa)`
            );
          }
          if (horario.fim > horarioEmpresa.fim) {
            errosDia.push(
              `Fim deve ser antes de ${horarioEmpresa.fim} (horário da empresa)`
            );
          }

          // Intervalo do funcionário é independente do da empresa
          // Apenas validar se está dentro do horário de trabalho do funcionário
          if (
            horario.temIntervalo &&
            horario.intervaloInicio &&
            horario.intervaloFim
          ) {
            const [horaInicio, minInicio] = horario.inicio
              .split(":")
              .map(Number);
            const [horaFim, minFim] = horario.fim.split(":").map(Number);
            const [horaIntInicio, minIntInicio] = horario.intervaloInicio
              .split(":")
              .map(Number);
            const [horaIntFim, minIntFim] = horario.intervaloFim
              .split(":")
              .map(Number);

            const inicioMinutos = horaInicio * 60 + minInicio;
            const fimMinutos = horaFim * 60 + minFim;
            const intInicioMinutos = horaIntInicio * 60 + minIntInicio;
            const intFimMinutos = horaIntFim * 60 + minIntFim;

            if (intInicioMinutos <= inicioMinutos) {
              errosDia.push(`Intervalo deve iniciar após ${horario.inicio}`);
            }
            if (intFimMinutos >= fimMinutos) {
              errosDia.push(`Intervalo deve terminar antes de ${horario.fim}`);
            }
          }
        } else if (horarioEmpresa && !horarioEmpresa.ativo) {
          errosDia.push("Empresa não funciona neste dia");
        }
      }

      if (errosDia.length > 0) {
        novosErros[dia] = errosDia;
      }
    });

    setErros(novosErros);
  };

  const aplicarHorarioEmpresa = (dia: string) => {
    const horarioEmpresa = horariosEmpresa[dia];
    if (horarioEmpresa) {
      updateHorario(dia, "ativo", horarioEmpresa.ativo);
      updateHorario(dia, "inicio", horarioEmpresa.inicio);
      updateHorario(dia, "fim", horarioEmpresa.fim);
      updateHorario(dia, "temIntervalo", horarioEmpresa.temIntervalo);
      updateHorario(
        dia,
        "intervaloInicio",
        horarioEmpresa.intervaloInicio || ""
      );
      updateHorario(dia, "intervaloFim", horarioEmpresa.intervaloFim || "");
    }
  };

  const aplicarTodosHorariosEmpresa = () => {
    const novosHorarios = { ...localHorarios };

    Object.keys(horariosEmpresa).forEach((dia) => {
      const horarioEmpresa = horariosEmpresa[dia];
      if (horarioEmpresa) {
        novosHorarios[dia] = {
          ativo: horarioEmpresa.ativo,
          inicio: horarioEmpresa.inicio,
          fim: horarioEmpresa.fim,
          temIntervalo: horarioEmpresa.temIntervalo,
          intervaloInicio: horarioEmpresa.intervaloInicio || "",
          intervaloFim: horarioEmpresa.intervaloFim || "",
        };
      }
    });

    validarHorarios(novosHorarios);
    setLocalHorarios(novosHorarios);
    const cargaHoraria = calcularCargaHorariaSemanal(novosHorarios);
    onChange(novosHorarios, cargaHoraria);
  };

  const calcularCargaHoraria = () => {
    return calcularCargaHorariaSemanal(localHorarios);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Horários do Funcionário
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure os horários específicos do funcionário
          </p>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={aplicarTodosHorariosEmpresa}
            >
              Usar Horários da Empresa
            </Button>
            <div className="text-sm font-medium">
              <Clock className="w-4 h-4 inline mr-1" />
              {calcularCargaHoraria()}h semanais
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            Os horários do funcionário devem estar dentro dos horários de
            funcionamento da empresa. O intervalo do funcionário é independente
            e pode ser configurado livremente dentro do seu horário de trabalho.
          </AlertDescription>
        </Alert>

        {diasSemana.map((dia) => {
          const horarioPadrao = gerarHorariosPadrao()[dia.key] || {
            ativo: false,
            inicio: "",
            fim: "",
            temIntervalo: false,
            intervaloInicio: "",
            intervaloFim: "",
          };

          const horario = localHorarios[dia.key] || horarioPadrao;

          const horarioEmpresa = horariosEmpresa[dia.key];
          const temErros = erros[dia.key] && erros[dia.key].length > 0;

          return (
            <div
              key={dia.key}
              className={`border rounded-lg p-4 space-y-3 ${
                temErros ? "border-red-300 bg-red-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={horario.ativo}
                    onCheckedChange={(checked) =>
                      updateHorario(dia.key, "ativo", checked)
                    }
                    disabled={!horarioEmpresa?.ativo}
                  />
                  <Label className="font-medium">{dia.nome}</Label>
                  {!horarioEmpresa?.ativo && (
                    <span className="text-xs text-red-500">
                      (Empresa fechada)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {horarioEmpresa?.ativo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => aplicarHorarioEmpresa(dia.key)}
                      className="text-xs"
                    >
                      Usar Empresa
                    </Button>
                  )}
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {dia.abrev}
                  </span>
                </div>
              </div>

              {horarioEmpresa?.ativo && (
                <div className="text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <strong>Empresa:</strong> {horarioEmpresa.inicio} às{" "}
                  {horarioEmpresa.fim}
                </div>
              )}

              {horario.ativo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Horário de Trabalho</Label>
                    <div className="flex gap-2">
                      <div>
                        <Label className="text-xs text-gray-500">Início</Label>
                        <Input
                          type="time"
                          value={horario.inicio}
                          onChange={(e) =>
                            updateHorario(dia.key, "inicio", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Fim</Label>
                        <Input
                          type="time"
                          value={horario.fim}
                          onChange={(e) =>
                            updateHorario(dia.key, "fim", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={horario.temIntervalo}
                        onCheckedChange={(checked) =>
                          updateHorario(dia.key, "temIntervalo", checked)
                        }
                      />
                      <Label className="text-sm">Tem intervalo</Label>
                    </div>

                    {horario.temIntervalo && (
                      <div className="flex gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">
                            Início
                          </Label>
                          <Input
                            type="time"
                            value={horario.intervaloInicio || ""}
                            onChange={(e) =>
                              updateHorario(
                                dia.key,
                                "intervaloInicio",
                                e.target.value
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Fim</Label>
                          <Input
                            type="time"
                            value={horario.intervaloFim || ""}
                            onChange={(e) =>
                              updateHorario(
                                dia.key,
                                "intervaloFim",
                                e.target.value
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {temErros && (
                <Alert variant="destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {erros[dia.key].map((erro, index) => (
                        <li key={index}>{erro}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
