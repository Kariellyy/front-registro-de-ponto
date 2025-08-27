import { api } from "@/lib/api";

export interface Falta {
  id: string;
  usuarioId: string;
  data: string;
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
  dataAprovacao?: string;
  createdAt: string;
  updatedAt: string;
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

    const response = await api.get<Falta[]>(
      `/faltas/empresa?${params.toString()}`
    );
    return response || [];
  }

  async buscarFaltasUsuario(
    dataInicio?: string,
    dataFim?: string
  ): Promise<Falta[]> {
    const params = new URLSearchParams();
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    const response = await api.get<Falta[]>(`/faltas?${params.toString()}`);
    return response || [];
  }

  async buscarFaltasPendentes(): Promise<Falta[]> {
    const response = await api.get<Falta[]>("/faltas/pendentes");
    return response || [];
  }

  async registrarFalta(data: RegistrarFaltaData): Promise<Falta> {
    const response = await api.post<Falta>("/faltas", data);
    return response;
  }

  async aprovarFalta(faltaId: string, data: AprovarFaltaData): Promise<Falta> {
    const response = await api.patch<Falta>(`/faltas/${faltaId}/aprovar`, data);
    return response;
  }

  async rejeitarFalta(
    faltaId: string,
    data: RejeitarFaltaData
  ): Promise<Falta> {
    const response = await api.patch<Falta>(
      `/faltas/${faltaId}/rejeitar`,
      data
    );
    return response;
  }

  async deletarFalta(faltaId: string): Promise<void> {
    await api.delete(`/faltas/${faltaId}`);
  }

  async detectarFaltasRetroativas(
    dataInicio: string,
    dataFim: string
  ): Promise<void> {
    await api.post("/faltas/detectar-retroativas", { dataInicio, dataFim });
  }
}

export const faltasService = new FaltasService();
