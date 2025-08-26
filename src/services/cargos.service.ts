import { api } from "@/lib/api";

export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  baseSalarial: number;
  departamentoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCargoRequest {
  nome: string;
  descricao?: string;
  baseSalarial: number;
  departamentoId: string;
}

export interface UpdateCargoRequest extends Partial<CreateCargoRequest> {}

class CargosService {
  basePath = "/cargos";

  list(departamentoId?: string): Promise<Cargo[]> {
    const qs = departamentoId ? `?departamentoId=${departamentoId}` : "";
    return api.get<Cargo[]>(`${this.basePath}${qs}`);
  }

  getById(id: string): Promise<Cargo> {
    return api.get<Cargo>(`${this.basePath}/${id}`);
  }

  create(data: CreateCargoRequest): Promise<Cargo> {
    return api.post<Cargo>(this.basePath, data);
  }

  update(id: string, data: UpdateCargoRequest): Promise<Cargo> {
    return api.patch<Cargo>(`${this.basePath}/${id}`, data);
  }

  delete(id: string): Promise<void> {
    return api.delete<void>(`${this.basePath}/${id}`);
  }
}

export const cargosService = new CargosService();
