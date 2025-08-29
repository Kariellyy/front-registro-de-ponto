"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFaltas } from "@/hooks/use-faltas";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    User,
    XCircle,
} from "lucide-react";
import { useState } from "react";

export default function AusenciasPage() {
  const { user } = useAuth();
  const toast = useToast();
  const {
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
  } = useFaltas();

  const [showRegistrarFalta, setShowRegistrarFalta] = useState(false);
  const [showAprovarFalta, setShowAprovarFalta] = useState(false);
  const [showRejeitarFalta, setShowRejeitarFalta] = useState(false);
  const [showDeletarFalta, setShowDeletarFalta] = useState(false);
  const [faltaSelecionada, setFaltaSelecionada] = useState<any>(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  // Formulário de nova falta
  const [novaFalta, setNovaFalta] = useState({
    data: "",
    tipo: "",
    motivo: "",
    observacoes: "",
    horarioInicioEfetivo: "",
    horarioFimEfetivo: "",
    minutosAtraso: "",
    minutosSaidaAntecipada: "",
  });

  const getTipoLabel = (tipo: string) => {
    const labels = {
      falta_justificada: "Falta Justificada",
      falta_injustificada: "Falta Injustificada",
      atraso: "Atraso",
      saida_antecipada: "Saída Antecipada",
      falta_parcial: "Falta Parcial",
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "aprovada":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejeitada":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pendente":
        return "secondary";
      case "aprovada":
        return "default";
      case "rejeitada":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleRegistrarFalta = async () => {
    try {
      await registrarFalta({
        data: novaFalta.data,
        tipo: novaFalta.tipo as any,
        motivo: novaFalta.motivo || undefined,
        observacoes: novaFalta.observacoes || undefined,
        horarioInicioEfetivo: novaFalta.horarioInicioEfetivo || undefined,
        horarioFimEfetivo: novaFalta.horarioFimEfetivo || undefined,
        minutosAtraso: novaFalta.minutosAtraso
          ? Number(novaFalta.minutosAtraso)
          : undefined,
        minutosSaidaAntecipada: novaFalta.minutosSaidaAntecipada
          ? Number(novaFalta.minutosSaidaAntecipada)
          : undefined,
      });

      toast.success("Falta registrada com sucesso!");
      setShowRegistrarFalta(false);
      setNovaFalta({
        data: "",
        tipo: "",
        motivo: "",
        observacoes: "",
        horarioInicioEfetivo: "",
        horarioFimEfetivo: "",
        minutosAtraso: "",
        minutosSaidaAntecipada: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao registrar falta");
    }
  };

  const handleAprovarFalta = async () => {
    if (!faltaSelecionada) return;

    try {
      await aprovarFalta(faltaSelecionada.id, {
        observacoes: observacoes || undefined,
      });

      toast.success("Falta aprovada com sucesso!");
      setShowAprovarFalta(false);
      setFaltaSelecionada(null);
      setObservacoes("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao aprovar falta");
    }
  };

  const handleRejeitarFalta = async () => {
    if (!faltaSelecionada || !motivoRejeicao.trim()) return;

    try {
      await rejeitarFalta(faltaSelecionada.id, {
        motivo: motivoRejeicao,
      });

      toast.success("Falta rejeitada com sucesso!");
      setShowRejeitarFalta(false);
      setFaltaSelecionada(null);
      setMotivoRejeicao("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao rejeitar falta");
    }
  };

  const handleDeletarFalta = async () => {
    if (!faltaSelecionada) return;

    try {
      await deletarFalta(faltaSelecionada.id);
      toast.success("Falta deletada com sucesso!");
      setShowDeletarFalta(false);
      setFaltaSelecionada(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao deletar falta");
    }
  };

  const handleDetectarFaltas = async () => {
    try {
      // Detectar faltas dos últimos 7 dias
      const hoje = new Date();
      const dataInicio = new Date();
      dataInicio.setDate(hoje.getDate() - 7);
      const dataInicioStr = dataInicio.toISOString().split("T")[0];
      const dataFim = hoje.toISOString().split("T")[0];

      await detectarFaltasRetroativas(dataInicioStr, dataFim);
      toast.success("Detecção de faltas executada com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao detectar faltas");
    }
  };

  const handleFiltrar = () => {
    carregarFaltas(dataInicio || undefined, dataFim || undefined);
  };

  const handleLimparFiltros = () => {
    setDataInicio("");
    setDataFim("");
    carregarFaltas();
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <toast.ToastContainer />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciamento de Ausências
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie faltas, atrasos e ausências dos funcionários
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowRegistrarFalta(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Falta
              </Button>
              <Button
                onClick={handleDetectarFaltas}
                variant="outline"
                disabled={isLoadingPendentes}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isLoadingPendentes ? "animate-spin" : ""
                  }`}
                />
                Detectar Faltas
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleFiltrar} className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button onClick={handleLimparFiltros} variant="outline">
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faltas Pendentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Faltas Pendentes ({faltasPendentes?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPendentes ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (faltasPendentes?.length || 0) === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma falta pendente
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(faltasPendentes || []).map((falta) => (
                      <TableRow key={falta.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {falta.usuario?.nome}
                          </div>
                        </TableCell>
                        <TableCell>{formatarData(falta.data)}</TableCell>
                        <TableCell>{getTipoLabel(falta.tipo)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {falta.motivo || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(falta.status)}>
                            {getStatusIcon(falta.status)}
                            <span className="ml-1 capitalize">
                              {falta.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setFaltaSelecionada(falta);
                                setShowAprovarFalta(true);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setFaltaSelecionada(falta);
                                setShowRejeitarFalta(true);
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Todas as Faltas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Todas as Ausências ({faltas?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (faltas?.length || 0) === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma ausência encontrada
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(faltas || []).map((falta) => (
                      <TableRow key={falta.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {falta.usuario?.nome}
                          </div>
                        </TableCell>
                        <TableCell>{formatarData(falta.data)}</TableCell>
                        <TableCell>{getTipoLabel(falta.tipo)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {falta.motivo || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(falta.status)}>
                            {getStatusIcon(falta.status)}
                            <span className="ml-1 capitalize">
                              {falta.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {falta.observacoes || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {falta.status === "pendente" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setFaltaSelecionada(falta);
                                    setShowAprovarFalta(true);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setFaltaSelecionada(falta);
                                    setShowRejeitarFalta(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {falta.status === "pendente" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setFaltaSelecionada(falta);
                                  setShowDeletarFalta(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Registrar Falta */}
      <Dialog open={showRegistrarFalta} onOpenChange={setShowRegistrarFalta}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Nova Falta</DialogTitle>
            <DialogDescription>
              Preencha os dados para registrar uma nova ausência
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={novaFalta.data}
                onChange={(e) =>
                  setNovaFalta({ ...novaFalta, data: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={novaFalta.tipo}
                onValueChange={(value) =>
                  setNovaFalta({ ...novaFalta, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="falta_justificada">
                    Falta Justificada
                  </SelectItem>
                  <SelectItem value="falta_injustificada">
                    Falta Injustificada
                  </SelectItem>
                  <SelectItem value="atraso">Atraso</SelectItem>
                  <SelectItem value="saida_antecipada">
                    Saída Antecipada
                  </SelectItem>
                  <SelectItem value="falta_parcial">Falta Parcial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea
                id="motivo"
                value={novaFalta.motivo}
                onChange={(e) =>
                  setNovaFalta({ ...novaFalta, motivo: e.target.value })
                }
                placeholder="Descreva o motivo da ausência..."
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={novaFalta.observacoes}
                onChange={(e) =>
                  setNovaFalta({ ...novaFalta, observacoes: e.target.value })
                }
                placeholder="Observações adicionais..."
              />
            </div>
            <div>
              <Label htmlFor="horarioInicio">Horário Início Efetivo</Label>
              <Input
                id="horarioInicio"
                type="time"
                value={novaFalta.horarioInicioEfetivo}
                onChange={(e) =>
                  setNovaFalta({
                    ...novaFalta,
                    horarioInicioEfetivo: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="horarioFim">Horário Fim Efetivo</Label>
              <Input
                id="horarioFim"
                type="time"
                value={novaFalta.horarioFimEfetivo}
                onChange={(e) =>
                  setNovaFalta({
                    ...novaFalta,
                    horarioFimEfetivo: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="minutosAtraso">Minutos de Atraso</Label>
              <Input
                id="minutosAtraso"
                type="number"
                value={novaFalta.minutosAtraso}
                onChange={(e) =>
                  setNovaFalta({ ...novaFalta, minutosAtraso: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="minutosSaida">Minutos Saída Antecipada</Label>
              <Input
                id="minutosSaida"
                type="number"
                value={novaFalta.minutosSaidaAntecipada}
                onChange={(e) =>
                  setNovaFalta({
                    ...novaFalta,
                    minutosSaidaAntecipada: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRegistrarFalta(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRegistrarFalta}
              disabled={!novaFalta.data || !novaFalta.tipo}
            >
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Aprovar Falta */}
      <Dialog open={showAprovarFalta} onOpenChange={setShowAprovarFalta}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Aprovar Falta
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Aprovar a falta de {faltaSelecionada?.usuario?.nome} em{" "}
              {faltaSelecionada && formatarData(faltaSelecionada.data)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label
              htmlFor="observacoesAprovacao"
              className="text-sm font-semibold text-gray-900"
            >
              Observações (opcional)
            </Label>
            <Textarea
              id="observacoesAprovacao"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações sobre a aprovação..."
              className="min-h-[100px] resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAprovarFalta(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAprovarFalta}
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Rejeitar Falta */}
      <Dialog open={showRejeitarFalta} onOpenChange={setShowRejeitarFalta}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Rejeitar Falta
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Rejeitar a falta de {faltaSelecionada?.usuario?.nome} em{" "}
              {faltaSelecionada && formatarData(faltaSelecionada.data)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label
              htmlFor="motivoRejeicao"
              className="text-sm font-semibold text-gray-900"
            >
              Motivo da Rejeição *
            </Label>
            <Textarea
              id="motivoRejeicao"
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Descreva o motivo da rejeição..."
              required
              className="min-h-[100px] resize-none border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowRejeitarFalta(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRejeitarFalta}
              variant="destructive"
              disabled={!motivoRejeicao.trim()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Deletar Falta */}
      <AlertDialog open={showDeletarFalta} onOpenChange={setShowDeletarFalta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a falta de{" "}
              {faltaSelecionada?.usuario?.nome} em{" "}
              {faltaSelecionada && formatarData(faltaSelecionada.data)}? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletarFalta}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
