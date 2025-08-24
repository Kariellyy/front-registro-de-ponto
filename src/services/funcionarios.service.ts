import { api } from "@/lib/api";
import { Funcionario } from "@/types";

export interface CreateFuncionarioRequest {
  nome: string;
  email: string;
  password?: string;
  telefone?: string;
  photoUrl?: string;
  cpf?: string;
  cargo?: string;
  departamentoId?: string;
  dataAdmissao?: string;
  horariosFuncionario?: {
    [diaSemana: string]: {
      ativo: boolean;
      inicio: string;
      fim: string;
      temIntervalo: boolean;
      intervaloInicio?: string;
      intervaloFim?: string;
    };
  };
  cargaHorariaSemanal?: number;
  papel?: "funcionario" | "administrador";
}

export interface UpdateFuncionarioRequest
  extends Partial<CreateFuncionarioRequest> {
  status?: "ativo" | "inativo" | "suspenso";
}

export interface FuncionariosListResponse {
  data: Funcionario[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FuncionariosFilters {
  page?: number;
  limit?: number;
  status?: "ativo" | "inativo" | "suspenso";
  papel?: "dono" | "administrador" | "funcionario";
  search?: string;
}

export interface DeleteResponse {
  message: string;
  deletedId: string;
}

export class FuncionariosService {
  private readonly basePath = "/usuarios";

  async list(
    filters: FuncionariosFilters = {}
  ): Promise<FuncionariosListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await api.get<any>(endpoint);

    // Verificar se o backend retorna array diretamente ou estrutura paginada
    if (Array.isArray(response)) {
      return {
        data: response,
        total: response.length,
        page: 1,
        limit: response.length,
        totalPages: 1,
      };
    }

    // Se retorna estrutura paginada
    return response;
  }

  async getById(id: string): Promise<Funcionario> {
    return api.get<Funcionario>(`${this.basePath}/${id}`);
  }

  async create(data: CreateFuncionarioRequest): Promise<Funcionario> {
    return api.post<Funcionario>(this.basePath, data);
  }

  async update(
    id: string,
    data: UpdateFuncionarioRequest
  ): Promise<Funcionario> {
    return api.patch<Funcionario>(`${this.basePath}/${id}`, data);
  }

  async delete(id: string): Promise<DeleteResponse> {
    return api.delete<DeleteResponse>(`${this.basePath}/${id}`);
  }
}

export const funcionariosService = new FuncionariosService();
