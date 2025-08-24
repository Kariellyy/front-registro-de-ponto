"use client";

import { LoadingCard } from "@/components/funcionario/LoadingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFuncionarioDashboard } from "@/hooks/use-funcionario-dashboard";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  LogOut,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function FuncionarioPage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const {
    registros,
    bancoHoras,
    ultimoRegistro,
    isLoading,
    registrarPonto,
    getProximoTipoRegistro,
  } = useFuncionarioDashboard();
  const [isRegistrando, setIsRegistrando] = useState(false);

  const handleRegistrarPonto = async () => {
    setIsRegistrando(true);

    try {
      await registrarPonto();
      toast.success("Ponto registrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao registrar ponto:", error);

      // Tratar erros específicos de geolocalização
      if (error?.code) {
        toast.error(error.message);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao registrar ponto. Tente novamente.");
      }
    } finally {
      setIsRegistrando(false);
    }
  };

  const handleSolicitarJustificativa = () => {
    toast.info("Funcionalidade de justificativa será implementada em breve!");
  };

  const handleAbrirExtrato = () => {
    window.open("/funcionario/extrato", "_blank");
  };

  const formatarHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  const getProximoTipoLabel = () => {
    const proximoTipo = getProximoTipoRegistro();
    if (!proximoTipo) return "Registros Completos";
    return getTipoLabel(proximoTipo);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pendente":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "rejeitado":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
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
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Funcionário
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Card de Registro de Ponto */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Registrar Ponto
              </CardTitle>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatarData(new Date().toISOString())} -{" "}
                  {formatarHora(new Date().toISOString())}
                </p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Próximo: {getProximoTipoLabel()}
                </p>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={handleRegistrarPonto}
                disabled={isRegistrando || !getProximoTipoRegistro()}
                className={`w-full h-16 text-lg font-semibold rounded-xl shadow-lg ${
                  !getProximoTipoRegistro()
                    ? "bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isRegistrando ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registrando...
                  </div>
                ) : !getProximoTipoRegistro() ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    {getProximoTipoLabel()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Registrar {getProximoTipoLabel()}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Card de Banco de Horas */}
          {isLoading ? (
            <LoadingCard lines={4} />
          ) : bancoHoras ? (
            <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Banco de Horas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {new Date().toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                {/* Estatísticas do Mês */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {bancoHoras.horasTrabalhadas}h
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Horas Trabalhadas
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {bancoHoras.horasPrevistas}h
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Horas Previstas
                    </div>
                  </div>
                </div>

                {/* Informações Gerais */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Carga horária semanal:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {bancoHoras.horasSemanais || 40}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dias trabalhados:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {bancoHoras.diasTrabalhados} de {bancoHoras.diasUteis}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Média semanal:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {bancoHoras.semanasTrabalhadas > 0
                        ? Math.round(
                            (bancoHoras.horasTrabalhadas /
                              bancoHoras.semanasTrabalhadas) *
                              100
                          ) / 100
                        : 0}
                      h
                    </span>
                  </div>
                </div>

                {/* Saldo do Mês */}
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                    Saldo do Mês
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      bancoHoras.saldoMes >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {bancoHoras.saldoMes >= 0 ? "+" : ""}
                    {bancoHoras.saldoMes}h
                  </div>
                </div>

                {/* Saldo Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Saldo Total Acumulado
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        bancoHoras.saldoTotal >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {bancoHoras.saldoTotal >= 0 ? "+" : ""}
                      {bancoHoras.saldoTotal}h
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Card de Últimos Registros */}
          {isLoading ? (
            <LoadingCard lines={4} />
          ) : (
            <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Últimos Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {registros
                    .slice(-4)
                    .reverse()
                    .map((registro) => (
                      <div
                        key={registro.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(registro.status)}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getTipoLabel(registro.tipo)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatarData(registro.dataHora)} às{" "}
                              {formatarHora(registro.dataHora)}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            registro.status === "aprovado"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {registro.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card de Ações Rápidas */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleSolicitarJustificativa}
                  className="h-12 flex flex-col items-center justify-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Justificativa</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAbrirExtrato}
                  className="h-12 flex flex-col items-center justify-center gap-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">Extrato</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
