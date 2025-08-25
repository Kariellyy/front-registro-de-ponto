"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { ExtratoItem, ExtratoResumo } from "@/types/funcionario";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// Dados mockados do extrato
const mockExtrato: ExtratoItem[] = [
  {
    id: 1,
    data: new Date(2024, 7, 24),
    tipo: "entrada" as const,
    hora: "08:00",
    saldo: 0,
    acumulado: 0,
  },
  {
    id: 2,
    data: new Date(2024, 7, 24),
    tipo: "saida" as const,
    hora: "18:00",
    saldo: 2,
    acumulado: 2,
  },
  {
    id: 3,
    data: new Date(2024, 7, 23),
    tipo: "entrada" as const,
    hora: "08:15",
    saldo: -0.25,
    acumulado: 1.75,
  },
  {
    id: 4,
    data: new Date(2024, 7, 23),
    tipo: "saida" as const,
    hora: "18:30",
    saldo: 0.5,
    acumulado: 2.25,
  },
  {
    id: 5,
    data: new Date(2024, 7, 22),
    tipo: "entrada" as const,
    hora: "07:45",
    saldo: 0.25,
    acumulado: 2.5,
  },
  {
    id: 6,
    data: new Date(2024, 7, 22),
    tipo: "saida" as const,
    hora: "17:30",
    saldo: -0.5,
    acumulado: 2,
  },
];

const mockResumo: ExtratoResumo = {
  saldoInicial: 0,
  saldoFinal: 2.5,
  totalHorasTrabalhadas: 160,
  totalHorasPrevistas: 160,
  saldoMes: 1.5,
  saldoTotal: 2.5,
  mes: "Agosto",
  ano: 2024,
};

export default function ExtratoPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    toast.success("Download do extrato iniciado!");
  };

  const handleVoltar = () => {
    window.close();
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatarSaldo = (saldo: number) => {
    const horas = Math.floor(Math.abs(saldo));
    const minutos = Math.round((Math.abs(saldo) - horas) * 60);
    const sinal = saldo >= 0 ? "+" : "-";
    return `${sinal}${horas}h${
      minutos > 0 ? minutos.toString().padStart(2, "0") : ""
    }`;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "entrada":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "saida":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      entrada: "Entrada",
      saida: "Saída",
      intervalo_inicio: "Início do Intervalo",
      intervalo_fim: "Fim do Intervalo",
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <toast.ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoltar}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Extrato de Banco de Horas
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.name} - {mockResumo.mes} {mockResumo.ano}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Resumo */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Resumo do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {mockResumo.totalHorasTrabalhadas}h
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Horas Trabalhadas
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +{mockResumo.saldoMes}h
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Saldo do Mês
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {mockResumo.saldoTotal}h
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Saldo Total
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {mockResumo.totalHorasPrevistas}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Horas Previstas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extrato Detalhado */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Extrato Detalhado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {mockExtrato.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {getTipoIcon(item.tipo)}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {getTipoLabel(item.tipo)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatarData(item.data)} às {item.hora}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            item.saldo >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatarSaldo(item.saldo)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Acumulado: {formatarSaldo(item.acumulado)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legenda */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Legenda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Entrada - Início do trabalho
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Saída - Fim do trabalho
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Saldo positivo (horas extras)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
