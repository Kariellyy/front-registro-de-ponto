import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FiltrosJustificativas } from "@/types/justificativa";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface FiltrosJustificativasProps {
  filtros: FiltrosJustificativas;
  onFiltrosChange: (filtros: FiltrosJustificativas) => void;
  onLimparFiltros: () => void;
}

const tipoOptions = [
  { value: "fora_raio", label: "Fora do Raio" },
  { value: "problema_tecnico", label: "Problema Técnico" },
  { value: "reuniao_externa", label: "Reunião Externa" },
  { value: "viagem_servico", label: "Viagem a Serviço" },
  { value: "outros", label: "Outros" },
];

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "aprovada", label: "Aprovada" },
  { value: "rejeitada", label: "Rejeitada" },
];

export function FiltrosJustificativas({
  filtros,
  onFiltrosChange,
  onLimparFiltros,
}: FiltrosJustificativasProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof FiltrosJustificativas, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  const hasActiveFilters = Object.values(filtros).some(
    (value) => value !== undefined
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLimparFiltros}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filtros.status || ""}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={filtros.tipo || ""}
                onValueChange={(value) => handleChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tipoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio || ""}
                onChange={(e) => handleChange("dataInicio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim || ""}
                onChange={(e) => handleChange("dataFim", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
