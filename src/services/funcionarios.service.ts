import { apiClient } from '@/lib/api';
import { Funcionario } from '@/types';

export interface CreateFuncionarioRequest {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  ativo?: boolean;
  dataAdmissao: string;
  horarioTrabalho: {
    entrada: string;
    saida: string;
    intervalos: {
      inicio: string;
      fim: string;
    }[];
  };
}

export interface UpdateFuncionarioRequest extends Partial<CreateFuncionarioRequest> {}

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
  ativo?: boolean;
  departamento?: string;
  cargo?: string;
  search?: string;
}

export class FuncionariosService {
  private readonly basePath = '/funcionarios';

  async list(filters: FuncionariosFilters = {}): Promise<FuncionariosListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    return apiClient.get<FuncionariosListResponse>(endpoint);
  }

  async getById(id: string): Promise<Funcionario> {
    return apiClient.get<Funcionario>(`${this.basePath}/${id}`);
  }

  async getByCpf(cpf: string): Promise<Funcionario> {
    return apiClient.get<Funcionario>(`${this.basePath}/cpf/${cpf}`);
  }

  async getByEmail(email: string): Promise<Funcionario> {
    return apiClient.get<Funcionario>(`${this.basePath}/email/${email}`);
  }

  async getByDepartamento(departamento: string, ativo = true): Promise<Funcionario[]> {
    const params = new URLSearchParams({ ativo: ativo.toString() });
    return apiClient.get<Funcionario[]>(`${this.basePath}/departamento/${departamento}?${params}`);
  }

  async getByCargo(cargo: string, ativo = true): Promise<Funcionario[]> {
    const params = new URLSearchParams({ ativo: ativo.toString() });
    return apiClient.get<Funcionario[]>(`${this.basePath}/cargo/${cargo}?${params}`);
  }

  async create(data: CreateFuncionarioRequest): Promise<Funcionario> {
    return apiClient.post<Funcionario>(this.basePath, data);
  }

  async update(id: string, data: UpdateFuncionarioRequest): Promise<Funcionario> {
    return apiClient.patch<Funcionario>(`${this.basePath}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  async activate(id: string): Promise<Funcionario> {
    return apiClient.patch<Funcionario>(`${this.basePath}/${id}/ativar`, {});
  }

  async deactivate(id: string): Promise<Funcionario> {
    return apiClient.patch<Funcionario>(`${this.basePath}/${id}/desativar`, {});
  }

  async getStatisticsByDepartamento(): Promise<{ departamento: string; total: number }[]> {
    return apiClient.get<{ departamento: string; total: number }[]>(`${this.basePath}/estatisticas/departamentos`);
  }

  async getStatisticsByCargo(): Promise<{ cargo: string; total: number }[]> {
    return apiClient.get<{ cargo: string; total: number }[]>(`${this.basePath}/estatisticas/cargos`);
  }
}

export const funcionariosService = new FuncionariosService(); 