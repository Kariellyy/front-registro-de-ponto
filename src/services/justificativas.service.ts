import { api } from "@/lib/api";
import {
  AprovarJustificativaRequest,
  CriarJustificativaRequest,
  EstatisticasJustificativas,
  FiltrosJustificativas,
  Justificativa,
} from "@/types/justificativa";

export class JustificativasService {
  private basePath = "/justificativas";

  async criarJustificativa(
    registroId: string,
    dados: CriarJustificativaRequest
  ): Promise<Justificativa> {
    return api.post<Justificativa>(`${this.basePath}/${registroId}`, dados);
  }

  async buscarMinhasJustificativas(): Promise<Justificativa[]> {
    return api.get<Justificativa[]>(`${this.basePath}/minhas`);
  }

  async buscarJustificativaPorId(id: string): Promise<Justificativa> {
    return api.get<Justificativa>(`${this.basePath}/${id}`);
  }

  async buscarTodasJustificativas(
    filtros?: FiltrosJustificativas
  ): Promise<Justificativa[]> {
    const params = new URLSearchParams();

    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.tipo) params.append("tipo", filtros.tipo);
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.usuarioId) params.append("usuarioId", filtros.usuarioId);

    return api.get<Justificativa[]>(`${this.basePath}?${params.toString()}`);
  }

  async aprovarJustificativa(
    id: string,
    dados: AprovarJustificativaRequest
  ): Promise<Justificativa> {
    return api.patch<Justificativa>(`${this.basePath}/${id}/aprovar`, dados);
  }

  async deletarJustificativa(id: string): Promise<void> {
    return api.delete(`${this.basePath}/${id}`);
  }

  async buscarEstatisticas(): Promise<EstatisticasJustificativas> {
    return api.get(`${this.basePath}/estatisticas`);
  }
}

export const justificativasService = new JustificativasService();
