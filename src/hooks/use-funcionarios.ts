import {
  CreateFuncionarioRequest,
  FuncionariosFilters,
  funcionariosService,
  UpdateFuncionarioRequest,
} from "@/services/funcionarios.service";
import { Funcionario } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useFuncionarios(initialFilters: FuncionariosFilters = {}) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FuncionariosFilters>(initialFilters);

  const fetchFuncionarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await funcionariosService.list(filters);

      setFuncionarios(response.data || []);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar funcionários";
      setError(errorMessage);
      console.error("Erro ao buscar funcionários:", err);
      setFuncionarios([]); // Garantir que sempre seja um array
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  const updateFilters = useCallback(
    (newFilters: Partial<FuncionariosFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    },
    []
  );

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  return {
    funcionarios,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refresh,
  };
}

export function useFuncionario(id?: string) {
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuncionario = useCallback(async (funcionarioId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await funcionariosService.getById(funcionarioId);
      setFuncionario(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar funcionário";
      setError(errorMessage);
      console.error("Erro ao buscar funcionário:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchFuncionario(id);
    }
  }, [id, fetchFuncionario]);

  return {
    funcionario,
    loading,
    error,
    refetch: fetchFuncionario,
  };
}

export function useFuncionarioActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFuncionario = useCallback(
    async (data: CreateFuncionarioRequest): Promise<Funcionario | null> => {
      try {
        setLoading(true);
        setError(null);
        const funcionario = await funcionariosService.create(data);
        return funcionario;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar funcionário";
        setError(errorMessage);
        console.error("Erro ao criar funcionário:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateFuncionario = useCallback(
    async (
      id: string,
      data: UpdateFuncionarioRequest
    ): Promise<Funcionario | null> => {
      try {
        setLoading(true);
        setError(null);
        const funcionario = await funcionariosService.update(id, data);
        return funcionario;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar funcionário";
        setError(errorMessage);
        console.error("Erro ao atualizar funcionário:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteFuncionario = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await funcionariosService.delete(id);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir funcionário";
        setError(errorMessage);
        console.error("Erro ao excluir funcionário:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
  };
}
