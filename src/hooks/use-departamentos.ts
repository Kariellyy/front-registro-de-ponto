import {
  CreateDepartamentoRequest,
  UpdateDepartamentoRequest,
  departamentosService,
} from "@/services/departamentos.service";
import { Departamento } from "@/services/departamentos.service";
import { useCallback, useEffect, useState } from "react";

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departamentosService.list();
      setDepartamentos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar departamentos";
      setError(errorMessage);
      console.error("Erro ao buscar departamentos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  const createDepartamento = useCallback(
    async (data: CreateDepartamentoRequest): Promise<Departamento | null> => {
      try {
        setLoading(true);
        setError(null);
        const departamento = await departamentosService.create(data);
        setDepartamentos(prev => [...prev, departamento]);
        return departamento;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar departamento";
        setError(errorMessage);
        console.error("Erro ao criar departamento:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateDepartamento = useCallback(
    async (
      id: string,
      data: UpdateDepartamentoRequest
    ): Promise<Departamento | null> => {
      try {
        setLoading(true);
        setError(null);
        const departamento = await departamentosService.update(id, data);
        setDepartamentos(prev => 
          prev.map(d => d.id === id ? departamento : d)
        );
        return departamento;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar departamento";
        setError(errorMessage);
        console.error("Erro ao atualizar departamento:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteDepartamento = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await departamentosService.delete(id);
        setDepartamentos(prev => prev.filter(d => d.id !== id));
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir departamento";
        setError(errorMessage);
        console.error("Erro ao excluir departamento:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  return {
    departamentos,
    loading,
    error,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
    refresh,
  };
}
