import { api } from "@/lib/api";

export interface Falta {
  id: string;
  usuarioId: string;
  data: Date;
  tipo:
    | "falta_justificada"
    | "falta_injustificada"
    | "atraso"
    | "saida_antecipada"
    | "falta_parcial";
  status: "pendente" | "aprovada" | "rejeitada";
  motivo?: string;
  observacoes?: string;
  horarioInicioEfetivo?: string;
  horarioFimEfetivo?: string;
  minutosAtraso?: number;
  minutosSaidaAntecipada?: number;
  aprovadoPor?: string;
  dataAprovacao?: Date;
  createdAt: Date;
  updatedAt: Date;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  aprovador?: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface RegistrarFaltaData {
  data: string;
  tipo: Falta["tipo"];
  motivo?: string;
  observacoes?: string;
  horarioInicioEfetivo?: string;
  horarioFimEfetivo?: string;
  minutosAtraso?: number;
  minutosSaidaAntecipada?: number;
}

export interface AprovarFaltaData {
  observacoes?: string;
}

export interface RejeitarFaltaData {
  motivo: string;
}

class FaltasService {
  async buscarFaltas(dataInicio?: string, dataFim?: string): Promise<Falta[]> {
    const params = new URLSearchParams();
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    const response = await api.get(`/faltas?${params.toString()}`);
    return response.data;
  }

  async buscarFaltasPendentes(): Promise<Falta[]> {
    const response = await api.get("/faltas/pendentes");
    return response.data;
  }

  async registrarFalta(data: RegistrarFaltaData): Promise<Falta> {
    const response = await api.post("/faltas", data);
    return response.data;
  }

  async aprovarFalta(faltaId: string, data: AprovarFaltaData): Promise<Falta> {
    const response = await api.put(`/faltas/${faltaId}/aprovar`, data);
    return response.data;
  }

  async rejeitarFalta(
    faltaId: string,
    data: RejeitarFaltaData
  ): Promise<Falta> {
    const response = await api.put(`/faltas/${faltaId}/rejeitar`, data);
    return response.data;
  }

  async deletarFalta(faltaId: string): Promise<void> {
    await api.delete(`/faltas/${faltaId}`);
  }

  async detectarFaltasAutomaticas(data: string): Promise<void> {
    await api.post("/faltas/detectar-automaticas", { data });
  }

  async detectarFaltasRetroativas(
    dataInicio: string,
    dataFim: string
  ): Promise<void> {
    await api.post("/faltas/detectar-retroativas", { dataInicio, dataFim });
  }
}

export const faltasService = new FaltasService();
