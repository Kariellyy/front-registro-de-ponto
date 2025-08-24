import {
  BancoHoras,
  pontoService,
  RegistroPonto,
} from "@/services/ponto.service";
import { useEffect, useState } from "react";

export function useFuncionarioDashboard() {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [bancoHoras, setBancoHoras] = useState<BancoHoras | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ultimoRegistro, setUltimoRegistro] = useState<RegistroPonto | null>(
    null
  );

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

  const registrarPonto = async (): Promise<RegistroPonto> => {
    const novoRegistro = await pontoService.registrarPonto({
      tipo: "entrada",
    });

    setRegistros((prev) => [novoRegistro, ...prev]);
    setUltimoRegistro(novoRegistro);

    return novoRegistro;
  };

  const solicitarJustificativa = async (data: string, motivo: string) => {
    // Simular envio de justificativa
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Justificativa enviada com sucesso!",
    };
  };

  return {
    registros,
    bancoHoras,
    ultimoRegistro,
    isLoading,
    registrarPonto,
    solicitarJustificativa,
  };
}
