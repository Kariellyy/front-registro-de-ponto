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
    const response = await api.get(`/empresas/${empresaId}`);
    return response.data;
  }

  async updateEmpresa(
    empresaId: string,
    data: UpdateEmpresaRequest
  ): Promise<EmpresaCompleta> {
    const response = await api.patch(`/empresas/${empresaId}`, data);
    return response.data;
  }
}

export const empresasService = new EmpresasService();
