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
  saldoTotal: number;
  diasTrabalhados: number;
  diasUteis: number;
  horasSemanais: number;
  semanasTrabalhadas: number;
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
}

export const pontoService = new PontoService();
