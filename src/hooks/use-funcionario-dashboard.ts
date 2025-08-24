import { BancoHoras, RegistroPonto } from "@/types/funcionario";
import { useEffect, useState } from "react";

// Dados mockados
const mockRegistros: RegistroPonto[] = [
  {
    id: 1,
    tipo: "entrada",
    dataHora: new Date(2024, 7, 24, 8, 0),
    status: "aprovado",
  },
  {
    id: 2,
    tipo: "intervalo_inicio",
    dataHora: new Date(2024, 7, 24, 12, 0),
    status: "aprovado",
  },
  {
    id: 3,
    tipo: "intervalo_fim",
    dataHora: new Date(2024, 7, 24, 13, 0),
    status: "aprovado",
  },
  {
    id: 4,
    tipo: "saida",
    dataHora: new Date(2024, 7, 24, 18, 0),
    status: "aprovado",
  },
];

const mockBancoHoras: BancoHoras = {
  saldoAtual: 2.5,
  saldoMes: 1.5,
  horasExtras: 8.5,
  horasDebito: 6.0,
  mes: "Agosto",
  ano: 2024,
};

export function useFuncionarioDashboard() {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [bancoHoras, setBancoHoras] = useState<BancoHoras | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ultimoRegistro, setUltimoRegistro] = useState<RegistroPonto | null>(
    null
  );

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      setIsLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRegistros(mockRegistros);
      setBancoHoras(mockBancoHoras);
      setUltimoRegistro(mockRegistros[mockRegistros.length - 1]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const registrarPonto = async (): Promise<RegistroPonto> => {
    const agora = new Date();
    const novoRegistro: RegistroPonto = {
      id: Date.now(),
      tipo: "entrada",
      dataHora: agora,
      status: "aprovado",
    };

    // Simular delay de registro
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRegistros((prev) => [...prev, novoRegistro]);
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
