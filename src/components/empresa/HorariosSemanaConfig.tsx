"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { calcularCargaHorariaSemanal, diasSemanaLabels } from "@/lib/horarios";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
  temIntervalo: boolean;
  intervaloInicio?: string;
  intervaloFim?: string;
}

interface HorariosSemanaConfigProps {
  horarios: { [diaSemana: string]: HorarioDia };
  onChange: (horarios: { [diaSemana: string]: HorarioDia }) => void;
  title?: string;
  subtitle?: string;
}

const diasSemana = diasSemanaLabels();

export function HorariosSemanaConfig({
  horarios,
  onChange,
  title = "Horários de Funcionamento",
  subtitle = "Configure os horários para cada dia da semana",
}: HorariosSemanaConfigProps) {
  const [localHorarios, setLocalHorarios] = useState(horarios);

  const updateHorario = (dia: string, campo: keyof HorarioDia, valor: any) => {
    const novosHorarios = {
      ...localHorarios,
      [dia]: {
        ...localHorarios[dia],
        [campo]: valor,
      },
    };
    setLocalHorarios(novosHorarios);
    onChange(novosHorarios);
  };

  const calcularCargaHoraria = () => {
    return calcularCargaHorariaSemanal(localHorarios);
  };

  const aplicarParaTodos = () => {
    const horarioBase = localHorarios["1"] || {
      ativo: true,
      inicio: "08:00",
      fim: "18:00",
      temIntervalo: true,
      intervaloInicio: "12:00",
      intervaloFim: "13:00",
    };

    const novosHorarios = { ...localHorarios };
    ["1", "2", "3", "4", "5"].forEach((dia) => {
      novosHorarios[dia] = { ...horarioBase };
    });

    setLocalHorarios(novosHorarios);
    onChange(novosHorarios);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {title}
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={aplicarParaTodos}
            >
              Aplicar Seg-Sex
            </Button>
            <div className="text-sm font-medium">
              <Clock className="w-4 h-4 inline mr-1" />
              {calcularCargaHoraria()}h semanais
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {diasSemana.map((dia) => {
          const horario = localHorarios[dia.key] || {
            ativo: false,
            inicio: "",
            fim: "",
            temIntervalo: false,
            intervaloInicio: "",
            intervaloFim: "",
          };

          return (
            <div key={dia.key} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={horario.ativo}
                    onCheckedChange={(checked) =>
                      updateHorario(dia.key, "ativo", checked)
                    }
                  />
                  <Label className="font-medium">{dia.nome}</Label>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {dia.abrev}
                </span>
              </div>

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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
