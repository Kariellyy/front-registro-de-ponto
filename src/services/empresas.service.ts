import { api } from "@/lib/api";

export interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
  temIntervalo: boolean;
  intervaloInicio?: string;
  intervaloFim?: string;
}

export interface HorarioEmpresa {
  id?: string;
  diaSemana: number;
  ativo: boolean;
  horarioInicio: string | null;
  horarioFim: string | null;
  temIntervalo: boolean;
  intervaloInicio?: string | null;
  intervaloFim?: string | null;
  empresaId?: string;
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
  horarios?: HorarioEmpresa[];
  horariosSemanais?: { [diaSemana: string]: HorarioDia }; // Backward compatibility
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
  horarios?: HorarioEmpresa[];
}

// Funções de utilidade para converter entre formatos
export function horariosArrayToObject(horarios: HorarioEmpresa[]): {
  [diaSemana: string]: HorarioDia;
} {
  const result: { [diaSemana: string]: HorarioDia } = {};

  horarios.forEach((horario) => {
    // Converter formato HH:MM:SS para HH:MM se necessário
    const formatTime = (time: string | null): string => {
      if (!time) return "";
      return time.length === 8 ? time.substring(0, 5) : time;
    };

    result[horario.diaSemana.toString()] = {
      ativo: horario.ativo,
      inicio: formatTime(horario.horarioInicio),
      fim: formatTime(horario.horarioFim),
      temIntervalo: horario.temIntervalo,
      intervaloInicio: formatTime(horario.intervaloInicio || null),
      intervaloFim: formatTime(horario.intervaloFim || null),
    };
  });

  return result;
}

export function horariosObjectToArray(horariosObj: {
  [diaSemana: string]: HorarioDia;
}): HorarioEmpresa[] {
  const result: HorarioEmpresa[] = [];

  Object.entries(horariosObj).forEach(([diaSemana, horario]) => {
    // Converter formato HH:MM para HH:MM:SS para o backend
    const formatTimeForBackend = (time: string): string | null => {
      if (!time || time === "") return null;
      return time.length === 5 ? `${time}:00` : time;
    };

    result.push({
      diaSemana: parseInt(diaSemana),
      ativo: horario.ativo,
      horarioInicio: horario.ativo
        ? formatTimeForBackend(horario.inicio)
        : null,
      horarioFim: horario.ativo ? formatTimeForBackend(horario.fim) : null,
      temIntervalo: horario.ativo ? horario.temIntervalo : false,
      intervaloInicio:
        horario.ativo && horario.temIntervalo
          ? formatTimeForBackend(horario.intervaloInicio || "")
          : null,
      intervaloFim:
        horario.ativo && horario.temIntervalo
          ? formatTimeForBackend(horario.intervaloFim || "")
          : null,
    });
  });

  return result.sort((a, b) => a.diaSemana - b.diaSemana);
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

      // Converter horários para formato compatível se necessário
      if (data.horarios && data.horarios.length > 0) {
        data.horariosSemanais = horariosArrayToObject(data.horarios);
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

      // SEMPRE converter horários para formato compatível com o frontend
      if (
        data.horarios &&
        Array.isArray(data.horarios) &&
        data.horarios.length > 0
      ) {
        console.log("Horários do backend:", data.horarios);
        data.horariosSemanais = horariosArrayToObject(data.horarios);
        console.log(
          "Horários convertidos para frontend:",
          data.horariosSemanais
        );
      } else {
        console.warn(
          "Nenhum horário encontrado na resposta da API",
          data.horarios
        );
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
