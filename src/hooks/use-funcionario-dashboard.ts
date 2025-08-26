import {
  BancoHoras,
  pontoService,
  RegistroPonto,
} from "@/services/ponto.service";
import { useEffect, useState } from "react";
import { useGeolocation } from "./use-geolocation";

export function useFuncionarioDashboard() {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [bancoHoras, setBancoHoras] = useState<BancoHoras | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ultimoRegistro, setUltimoRegistro] = useState<RegistroPonto | null>(
    null
  );
  const { getCurrentPosition } = useGeolocation();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const [registrosData, bancoHorasData] = await Promise.all([
          pontoService.buscarRegistros(),
          pontoService.calcularBancoHoras(
            new Date().getMonth() + 1,
            new Date().getFullYear()
          ),
        ]);

        setRegistros(registrosData);
        setBancoHoras(bancoHorasData);
        setUltimoRegistro(registrosData[0] || null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getProximoTipoRegistro = ():
    | "entrada"
    | "saida"
    | "intervalo_inicio"
    | "intervalo_fim"
    | null => {
    if (!registros || registros.length === 0) {
      return "entrada";
    }

    // Buscar registros de hoje
    const hoje = new Date().toISOString().split("T")[0];
    const registrosHoje = registros.filter((registro) => {
      const dataRegistro = new Date(registro.dataHora)
        .toISOString()
        .split("T")[0];
      return dataRegistro === hoje;
    });

    if (registrosHoje.length === 0) {
      return "entrada";
    }

    // Verificar se já foram feitos todos os registros do dia (máximo 4)
    if (registrosHoje.length >= 4) {
      return null; // Não pode fazer mais registros hoje
    }

    // Verificar se já existe cada tipo de registro
    const tiposRegistrados = registrosHoje.map((r) => r.tipo);

    if (!tiposRegistrados.includes("entrada")) {
      return "entrada";
    }
    if (!tiposRegistrados.includes("intervalo_inicio")) {
      return "intervalo_inicio";
    }
    if (!tiposRegistrados.includes("intervalo_fim")) {
      return "intervalo_fim";
    }
    if (!tiposRegistrados.includes("saida")) {
      return "saida";
    }

    // Todos os registros foram feitos
    return null;
  };

  const registrarPonto = async (
    observacoes?: string
  ): Promise<RegistroPonto> => {
    try {
      // Determinar o tipo de registro
      const tipo = getProximoTipoRegistro();

      if (!tipo) {
        throw new Error("Todos os registros do dia já foram feitos");
      }

      // Obter localização atual com configurações otimizadas
      const position = await getCurrentPosition({
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 30000,
        retries: 2,
        minAccuracy: 50, // 50 metros para registro de ponto
      });

      const novoRegistro = await pontoService.registrarPonto({
        tipo,
        latitude: position.latitude,
        longitude: position.longitude,
        observacoes,
      });

      setRegistros((prev) => [novoRegistro, ...prev]);
      setUltimoRegistro(novoRegistro);

      return novoRegistro;
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      throw error;
    }
  };

  const atualizarRegistro = async (
    registroId: string,
    dados: Partial<RegistroPonto>
  ): Promise<RegistroPonto> => {
    try {
      const registroAtualizado =
        await pontoService.atualizarRegistroComJustificativa(
          registroId,
          dados.observacoes || ""
        );

      setRegistros((prev) =>
        prev.map((registro) =>
          registro.id === registroId ? registroAtualizado : registro
        )
      );

      return registroAtualizado;
    } catch (error) {
      console.error("Erro ao atualizar registro:", error);
      throw error;
    }
  };

  const recarregarDados = async () => {
    setIsLoading(true);
    try {
      const [registrosData, bancoHorasData] = await Promise.all([
        pontoService.buscarRegistros(),
        pontoService.calcularBancoHoras(
          new Date().getMonth() + 1,
          new Date().getFullYear()
        ),
      ]);

      setRegistros(registrosData);
      setBancoHoras(bancoHorasData);
      setUltimoRegistro(registrosData[0] || null);
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registros,
    bancoHoras,
    ultimoRegistro,
    isLoading,
    registrarPonto,
    atualizarRegistro,
    getProximoTipoRegistro,
    recarregarDados,
  };
}
