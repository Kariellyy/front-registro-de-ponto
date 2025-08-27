export enum TipoJustificativa {
  FORA_RAIO = "fora_raio",
  PROBLEMA_TECNICO = "problema_tecnico",
  REUNIAO_EXTERNA = "reuniao_externa",
  VIAGEM_SERVICO = "viagem_servico",
  OUTROS = "outros",
}

export enum StatusJustificativa {
  PENDENTE = "pendente",
  APROVADA = "aprovada",
  REJEITADA = "rejeitada",
}

export interface Justificativa {
  id: string;
  registroPontoId: string;
  motivo: string;
  observacoes?: string;
  tipo: TipoJustificativa;
  status: StatusJustificativa;
  aprovadoPor?: string;
  dataAprovacao?: string;
  createdAt: string;
  updatedAt: string;
  registroPonto?: {
    id: string;
    tipo: string;
    dataHora: string;
    latitude?: number;
    longitude?: number;
    usuario: {
      id: string;
      nome: string;
      email: string;
    };
  };
  aprovador?: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface CriarJustificativaRequest {
  motivo: string;
  observacoes?: string;
  tipo: TipoJustificativa;
}

export interface AprovarJustificativaRequest {
  status: StatusJustificativa.APROVADA | StatusJustificativa.REJEITADA;
  observacoes?: string;
}

export interface FiltrosJustificativas {
  status?: StatusJustificativa;
  tipo?: TipoJustificativa;
  dataInicio?: string;
  dataFim?: string;
  usuarioId?: string;
}

export interface EstatisticasJustificativas {
  total: number;
  pendentes: number;
  aprovadas: number;
  rejeitadas: number;
}
