"use client";

import { LoadingCard } from "@/components/ponto/LoadingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFuncionarioDashboard } from "@/hooks/use-funcionario-dashboard";
import { pontoService } from "@/services/ponto.service";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
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
    atualizarRegistro,
    getProximoTipoRegistro,
    recarregarDados,
  } = useFuncionarioDashboard();
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [showJustificativaModal, setShowJustificativaModal] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [registroPendente, setRegistroPendente] = useState<any>(null);

  const handleRegistrarPonto = async () => {
    setIsRegistrando(true);

    try {
      const resultado = await registrarPonto();

      // Verificar se o registro foi aprovado ou está pendente
      if (resultado.status === "aprovado") {
        toast.success("Ponto registrado com sucesso!");
      } else if (resultado.status === "pendente" && !resultado.dentroDoRaio) {
        // Apenas informar; justificativa pode ser feita pelo item na lista
        toast.info(
          "Ponto registrado fora do raio. Toque em Justificar no registro pendente."
        );
      } else if (resultado.status === "pendente") {
        toast.info("Ponto registrado. Aguardando aprovação.");
      }
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

  // Abrir modal de justificativa a partir da lista de registros
  const abrirJustificativaPara = (registro: any) => {
    setRegistroPendente(registro);
    setJustificativa("");
    setShowJustificativaModal(true);
  };

  const handleConfirmarJustificativa = async () => {
    if (!registroPendente || !justificativa.trim()) return;
    try {
      await pontoService.criarJustificativa(registroPendente.id, {
        motivo: justificativa,
        tipo: "fora_raio",
        observacoes: justificativa,
      });
      toast.success("Justificativa enviada. Aguardando aprovação.");
      setShowJustificativaModal(false);
      setJustificativa("");
      setRegistroPendente(null);
      // Recarregar dados
      await recarregarDados();
    } catch (err) {
      toast.error("Não foi possível enviar a justificativa.");
    }
  };

  const handleCancelarJustificativa = () => {
    setShowJustificativaModal(false);
    setJustificativa("");
    setRegistroPendente(null);
  };

  const atualizarRegistroComJustificativa = async (
    registroId: string,
    justificativa: string
  ) => {
    try {
      const resultado = await atualizarRegistro(registroId, {
        observacoes: justificativa,
      });
      return resultado;
    } catch (error) {
      console.error("Erro ao atualizar registro com justificativa:", error);
      throw error;
    }
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

  const getStatusIcon = (
    status: string,
    temJustificativaPendente: boolean = false
  ) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "justificado":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "pendente":
        if (temJustificativaPendente) {
          return <AlertCircle className="w-4 h-4 text-blue-500" />;
        }
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "rejeitado":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatHoursHM = (value: number): string => {
    const sign = value < 0 ? -1 : 1;
    const abs = Math.abs(value);
    const hours = Math.trunc(abs);
    const minutes = Math.round((abs - hours) * 60);
    const signPrefix = sign < 0 ? "-" : "+";
    return `${signPrefix}${hours}h ${minutes}min`;
  };

  const formatHoursPlain = (value: number): string => {
    const abs = Math.abs(value);
    const hours = Math.trunc(abs);
    const minutes = Math.round((abs - hours) * 60);
    return `${hours}h ${minutes}min`;
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
                {/* Saldo Atual */}
                <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Saldo Atual
                  </div>
                  <div
                    className={`text-4xl font-bold ${
                      bancoHoras.saldoMes >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatHoursHM(bancoHoras.saldoMes)}
                  </div>
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-blue-600 dark:text-blue-400">
                      Horas trabalhadas no mês
                    </div>
                    <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      {formatHoursPlain(bancoHoras.horasTrabalhadas)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="text-gray-600 dark:text-gray-400">
                      Horas previstas até hoje
                    </div>
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {formatHoursPlain(bancoHoras.horasPrevistas)}
                    </div>
                  </div>
                </div>

                {/* Progresso do mês (barra) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {formatHoursPlain(bancoHoras.horasTrabalhadas)}{" "}
                      trabalhadas
                    </span>
                    <span>
                      {formatHoursPlain(bancoHoras.horasPrevistas)} previstas
                      até hoje
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (bancoHoras.horasTrabalhadas /
                        Math.max(1, bancoHoras.horasPrevistas)) *
                        100
                    )}
                  />
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
                          {getStatusIcon(
                            registro.status,
                            registro.temJustificativaPendente
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getTipoLabel(registro.tipo)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatarData(registro.dataHora)} às{" "}
                              {formatarHora(registro.dataHora)}
                            </div>
                            {registro.status === "pendente" &&
                              !registro.temJustificativaPendente && (
                                <div className="mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      abrirJustificativaPara(registro)
                                    }
                                  >
                                    Justificar
                                  </Button>
                                </div>
                              )}
                            {registro.status === "pendente" &&
                              registro.temJustificativaPendente && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>
                                      Justificativa enviada - Aguardando
                                      aprovação
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            registro.status === "aprovado"
                              ? "default"
                              : registro.status === "justificado"
                              ? "outline"
                              : registro.status === "pendente" &&
                                registro.temJustificativaPendente
                              ? "outline"
                              : "secondary"
                          }
                          className="text-xs capitalize"
                        >
                          {registro.status === "pendente" &&
                          registro.temJustificativaPendente
                            ? "justificada"
                            : registro.status}
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
              <div className="grid grid-cols-1 gap-3">
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

      {/* Modal de Justificativa */}
      <Dialog
        open={showJustificativaModal}
        onOpenChange={setShowJustificativaModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justificar registro fora do raio</DialogTitle>
            <DialogDescription>
              Informe o motivo para avaliação do gestor. O registro permanecerá
              pendente até aprovação.
            </DialogDescription>
          </DialogHeader>
          {registroPendente && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Registro: {getTipoLabel(registroPendente.tipo)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Data: {formatarData(registroPendente.dataHora)} às{" "}
                  {formatarHora(registroPendente.dataHora)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Status:{" "}
                  <Badge variant="secondary" className="text-xs capitalize">
                    {registroPendente.status}
                  </Badge>
                </div>
              </div>
              <Label htmlFor="justificativa">Motivo da justificativa</Label>
              <Textarea
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Ex: Reunião externa, visita a cliente, atividade em campo..."
                rows={5}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelarJustificativa}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarJustificativa}
              disabled={!justificativa.trim()}
            >
              Enviar justificativa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
