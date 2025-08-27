import { api } from "@/lib/api";

export interface RegistrarPontoRequest {
  tipo: "entrada" | "saida" | "intervalo_inicio" | "intervalo_fim";
  latitude: number;
  longitude: number;
  observacoes?: string;
}

export interface RegistroPonto {
  id: string;
  tipo: "entrada" | "saida" | "intervalo_inicio" | "intervalo_fim";
  status: "aprovado" | "pendente" | "justificado" | "rejeitado";
  dataHora: string;
  latitude?: number;
  longitude?: number;
  dentroDoRaio: boolean;
  observacoes?: string;
  mensagem?: string;
  temJustificativaPendente: boolean;
  createdAt: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface BancoHoras {
  saldoMes: number;
  horasTrabalhadas: number;
  horasPrevistas: number;
  horasJustificadas: number;
  saldoTotal: number;
  diasTrabalhados: number;
  diasUteis: number;
  horasSemanais: number;
  semanasTrabalhadas: number;
  dataCalculoAte: string;
}

export interface Justificativa {
  id: string;
  registroPontoId: string;
  motivo: string;
  observacoes?: string;
  tipo:
    | "fora_raio"
    | "problema_tecnico"
    | "reuniao_externa"
    | "viagem_servico"
    | "outros";
  status: "pendente" | "aprovada" | "rejeitada";
  aprovadoPor?: string;
  dataAprovacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CriarJustificativaRequest {
  motivo: string;
  observacoes?: string;
  tipo:
    | "fora_raio"
    | "problema_tecnico"
    | "reuniao_externa"
    | "viagem_servico"
    | "outros";
}

export class PontoService {
  private basePath = "/ponto";

  async registrarPonto(data: RegistrarPontoRequest): Promise<RegistroPonto> {
    return api.post<RegistroPonto>(`${this.basePath}/registrar`, data);
  }

  async buscarRegistros(
    dataInicio?: string,
    dataFim?: string
  ): Promise<RegistroPonto[]> {
    const params = new URLSearchParams();
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    return api.get<RegistroPonto[]>(
      `${this.basePath}/registros?${params.toString()}`
    );
  }

  async buscarUltimoRegistro(): Promise<RegistroPonto | null> {
    return api.get<RegistroPonto | null>(`${this.basePath}/ultimo-registro`);
  }

  async calcularBancoHoras(mes: number, ano: number): Promise<BancoHoras> {
    return api.get<BancoHoras>(
      `${this.basePath}/banco-horas?mes=${mes}&ano=${ano}`
    );
  }

  async atualizarRegistroComJustificativa(
    registroId: string,
    observacoes: string
  ): Promise<RegistroPonto> {
    return api.patch<RegistroPonto>(
      `${this.basePath}/registros/${registroId}/justificativa`,
      { observacoes }
    );
  }

  // Métodos para justificativas
  async criarJustificativa(
    registroId: string,
    dados: CriarJustificativaRequest
  ): Promise<Justificativa> {
    return api.post<Justificativa>(`/justificativas/${registroId}`, dados);
  }

  async buscarMinhasJustificativas(): Promise<Justificativa[]> {
    return api.get<Justificativa[]>("/justificativas/minhas");
  }

  async buscarJustificativaPorId(id: string): Promise<Justificativa> {
    return api.get<Justificativa>(`/justificativas/${id}`);
  }
}

export const pontoService = new PontoService();
