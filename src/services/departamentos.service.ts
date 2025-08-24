import { api } from "@/lib/api";

export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  empresaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartamentoRequest {
  nome: string;
  descricao?: string;
}

export interface UpdateDepartamentoRequest extends Partial<CreateDepartamentoRequest> {}

export class DepartamentosService {
  private readonly basePath = "/departamentos";

  async list(): Promise<Departamento[]> {
    return api.get<Departamento[]>(this.basePath);
  }

  async getById(id: string): Promise<Departamento> {
    return api.get<Departamento>(`${this.basePath}/${id}`);
  }

  async create(data: CreateDepartamentoRequest): Promise<Departamento> {
    return api.post<Departamento>(this.basePath, data);
  }

  async update(id: string, data: UpdateDepartamentoRequest): Promise<Departamento> {
    return api.patch<Departamento>(`${this.basePath}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete<void>(`${this.basePath}/${id}`);
  }
}

export const departamentosService = new DepartamentosService();
