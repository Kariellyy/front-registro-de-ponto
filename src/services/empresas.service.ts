import { api } from "@/lib/api";

export interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
  temIntervalo: boolean;
  intervaloInicio?: string;
  intervaloFim?: string;
}

export interface EmpresaCompleta {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  raioPermitido?: number;
  toleranciaEntrada?: number;
  toleranciaSaida?: number;
  permitirRegistroForaRaio?: boolean;
  exigirJustificativaForaRaio?: boolean;
  horariosSemanais?: { [diaSemana: string]: HorarioDia };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmpresaRequest {
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  raioPermitido?: number;
  toleranciaEntrada?: number;
  toleranciaSaida?: number;
  permitirRegistroForaRaio?: boolean;
  exigirJustificativaForaRaio?: boolean;
  horariosSemanais?: { [diaSemana: string]: HorarioDia };
}

class EmpresasService {
  async getEmpresa(empresaId: string): Promise<EmpresaCompleta> {
    try {
      // Tentar o endpoint específico primeiro
      let data: EmpresaCompleta;
      try {
        data = await api.get<EmpresaCompleta>(`/empresas/${empresaId}`);
      } catch (error) {
        // Se falhar, usar o endpoint /me como fallback
        console.log("Tentando endpoint alternativo /empresas/me");
        data = await api.get<EmpresaCompleta>("/empresas/me");
      }

      if (!data) {
        throw new Error("Dados da empresa não encontrados");
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      throw error;
    }
  }

  async getMinhaEmpresa(): Promise<EmpresaCompleta> {
    try {
      const data = await api.get<EmpresaCompleta>("/empresas/me");

      console.log("Resposta da API /empresas/me:", data);

      if (!data) {
        console.error("API retornou dados vazios:", data);
        throw new Error("Dados da empresa não encontrados");
      }

      return data;
    } catch (error: any) {
      console.error("Erro ao buscar minha empresa:", error);
      if (error.message) {
        console.error("Detalhes do erro:", error.message);
      }
      throw error;
    }
  }

  async updateEmpresa(
    empresaId: string,
    data: UpdateEmpresaRequest
  ): Promise<EmpresaCompleta> {
    try {
      const updatedData = await api.patch<EmpresaCompleta>(
        `/empresas/${empresaId}`,
        data
      );

      if (!updatedData) {
        throw new Error("Erro ao atualizar empresa");
      }

      return updatedData;
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw error;
    }
  }
}

export const empresasService = new EmpresasService();
