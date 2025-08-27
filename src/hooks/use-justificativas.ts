import { justificativasService } from "@/services/justificativas.service";
import {
  AprovarJustificativaRequest,
  FiltrosJustificativas,
  Justificativa,
} from "@/types/justificativa";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseJustificativasProps {
  isAdmin?: boolean;
}

export function useJustificativas({
  isAdmin = false,
}: UseJustificativasProps = {}) {
  const [justificativas, setJustificativas] = useState<Justificativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosJustificativas>({});
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    pendentes: 0,
    aprovadas: 0,
    rejeitadas: 0,
  });

  const carregarJustificativas = useCallback(async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await justificativasService.buscarTodasJustificativas(filtros)
        : await justificativasService.buscarMinhasJustificativas();
      setJustificativas(data);
    } catch (error) {
      console.error("Erro ao carregar justificativas:", error);
      toast.error("Erro ao carregar justificativas");
    } finally {
      setLoading(false);
    }
  }, [filtros, isAdmin]);

  const carregarEstatisticas = useCallback(async () => {
    try {
      const stats = await justificativasService.buscarEstatisticas();
      setEstatisticas(stats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }, []);

  const aprovarJustificativa = useCallback(
    async (id: string, dados: AprovarJustificativaRequest) => {
      try {
        await justificativasService.aprovarJustificativa(id, dados);
        toast.success(
          `Justificativa ${
            dados.status === "aprovada" ? "aprovada" : "rejeitada"
          } com sucesso!`
        );
        await carregarJustificativas();
        await carregarEstatisticas();
      } catch (error) {
        console.error("Erro ao aprovar justificativa:", error);
        toast.error("Erro ao processar justificativa");
        throw error;
      }
    },
    [carregarJustificativas, carregarEstatisticas]
  );

  const deletarJustificativa = useCallback(
    async (id: string) => {
      try {
        await justificativasService.deletarJustificativa(id);
        toast.success("Justificativa deletada com sucesso!");
        await carregarJustificativas();
        await carregarEstatisticas();
      } catch (error) {
        console.error("Erro ao deletar justificativa:", error);
        toast.error("Erro ao deletar justificativa");
        throw error;
      }
    },
    [carregarJustificativas, carregarEstatisticas]
  );

  const atualizarFiltros = useCallback(
    (novosFiltros: FiltrosJustificativas) => {
      setFiltros(novosFiltros);
    },
    []
  );

  const limparFiltros = useCallback(() => {
    setFiltros({});
  }, []);

  useEffect(() => {
    carregarJustificativas();
    carregarEstatisticas();
  }, [carregarJustificativas, carregarEstatisticas]);

  const justificativasPendentes = justificativas.filter(
    (j) => j.status === "pendente"
  );
  const justificativasAprovadas = justificativas.filter(
    (j) => j.status === "aprovada"
  );
  const justificativasRejeitadas = justificativas.filter(
    (j) => j.status === "rejeitada"
  );

  return {
    justificativas,
    justificativasPendentes,
    justificativasAprovadas,
    justificativasRejeitadas,
    loading,
    filtros,
    estatisticas,
    aprovarJustificativa,
    deletarJustificativa,
    atualizarFiltros,
    limparFiltros,
    recarregar: carregarJustificativas,
  };
}
