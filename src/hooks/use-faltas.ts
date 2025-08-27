import {
  AprovarFaltaData,
  Falta,
  faltasService,
  RegistrarFaltaData,
  RejeitarFaltaData,
} from "@/services/faltas.service";
import { useEffect, useState } from "react";

export function useFaltas() {
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [faltasPendentes, setFaltasPendentes] = useState<Falta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPendentes, setIsLoadingPendentes] = useState(true);

  const carregarFaltas = async (dataInicio?: string, dataFim?: string) => {
    setIsLoading(true);
    try {
      const data = await faltasService.buscarFaltas(dataInicio, dataFim);
      setFaltas(data || []);
    } catch (error) {
      console.error("Erro ao carregar faltas:", error);
      setFaltas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const carregarFaltasPendentes = async () => {
    setIsLoadingPendentes(true);
    try {
      const data = await faltasService.buscarFaltasPendentes();
      setFaltasPendentes(data || []);
    } catch (error) {
      console.error("Erro ao carregar faltas pendentes:", error);
      setFaltasPendentes([]);
    } finally {
      setIsLoadingPendentes(false);
    }
  };

  const registrarFalta = async (data: RegistrarFaltaData): Promise<Falta> => {
    const novaFalta = await faltasService.registrarFalta(data);
    setFaltas((prev) => [novaFalta, ...(prev || [])]);
    await carregarFaltasPendentes();
    return novaFalta;
  };

  const aprovarFalta = async (
    faltaId: string,
    data: AprovarFaltaData
  ): Promise<Falta> => {
    const faltaAtualizada = await faltasService.aprovarFalta(faltaId, data);

    setFaltas((prev) =>
      (prev || []).map((falta) =>
        falta.id === faltaId ? faltaAtualizada : falta
      )
    );

    setFaltasPendentes((prev) =>
      (prev || []).filter((falta) => falta.id !== faltaId)
    );

    return faltaAtualizada;
  };

  const rejeitarFalta = async (
    faltaId: string,
    data: RejeitarFaltaData
  ): Promise<Falta> => {
    const faltaAtualizada = await faltasService.rejeitarFalta(faltaId, data);

    setFaltas((prev) =>
      (prev || []).map((falta) =>
        falta.id === faltaId ? faltaAtualizada : falta
      )
    );

    setFaltasPendentes((prev) =>
      (prev || []).filter((falta) => falta.id !== faltaId)
    );

    return faltaAtualizada;
  };

  const deletarFalta = async (faltaId: string): Promise<void> => {
    await faltasService.deletarFalta(faltaId);
    setFaltas((prev) => (prev || []).filter((falta) => falta.id !== faltaId));
    setFaltasPendentes((prev) =>
      (prev || []).filter((falta) => falta.id !== faltaId)
    );
  };

  const detectarFaltasRetroativas = async (
    dataInicio: string,
    dataFim: string
  ): Promise<void> => {
    await faltasService.detectarFaltasRetroativas(dataInicio, dataFim);
    await carregarFaltasPendentes();
  };

  useEffect(() => {
    carregarFaltas();
    carregarFaltasPendentes();
  }, []);

  return {
    faltas,
    faltasPendentes,
    isLoading,
    isLoadingPendentes,
    carregarFaltas,
    carregarFaltasPendentes,
    registrarFalta,
    aprovarFalta,
    rejeitarFalta,
    deletarFalta,
    detectarFaltasRetroativas,
  };
}
