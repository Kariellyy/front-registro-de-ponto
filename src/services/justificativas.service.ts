import { api } from "@/lib/api";
import {
  AprovarJustificativaRequest,
  CriarJustificativaRequest,
  EstatisticasJustificativas,
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

  async buscarTodasJustificativas(): Promise<Justificativa[]> {
    return api.get<Justificativa[]>(`${this.basePath}`);
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
