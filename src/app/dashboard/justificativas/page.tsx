"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { FiltrosJustificativas } from "@/components/justificativas/FiltrosJustificativas";
import { JustificativaCard } from "@/components/justificativas/JustificativaCard";
import { ModalAprovarJustificativa } from "@/components/justificativas/ModalAprovarJustificativa";
import { ModalDetalhesJustificativa } from "@/components/justificativas/ModalDetalhesJustificativa";
import { useJustificativas } from "@/hooks/use-justificativas";
import { StatusJustificativa } from "@/types/justificativa";

export default function JustificativasPage() {
  const [modalAprovar, setModalAprovar] = useState<{
    isOpen: boolean;
    justificativaId: string;
  }>({ isOpen: false, justificativaId: "" });

  const [modalDetalhes, setModalDetalhes] = useState<{
    isOpen: boolean;
    justificativaId: string;
  }>({ isOpen: false, justificativaId: "" });

  const isAdmin = true; // TODO: Implementar verificação de role do usuário

  const {
    justificativas,
    justificativasPendentes,
    justificativasAprovadas,
    justificativasRejeitadas,
    loading,
    filtros,
    estatisticas,
    aprovarJustificativa,
    atualizarFiltros,
    limparFiltros,
  } = useJustificativas({ isAdmin });

  const handleAprovarJustificativa = async (
    status: "aprovada" | "rejeitada",
    observacoes?: string
  ) => {
    try {
      await aprovarJustificativa(modalAprovar.justificativaId, {
        status:
          status === "aprovada"
            ? StatusJustificativa.APROVADA
            : StatusJustificativa.REJEITADA,
        observacoes,
      });
    } catch (error) {
      console.error("Erro ao aprovar justificativa:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Justificativas</h1>
          <p className="text-muted-foreground">
            Gerencie e aprove justificativas de registros de ponto
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {estatisticas.pendentes}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {estatisticas.aprovadas}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {estatisticas.rejeitadas}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <FiltrosJustificativas
        filtros={filtros}
        onFiltrosChange={atualizarFiltros}
        onLimparFiltros={limparFiltros}
      />

      {/* Tabs de Justificativas */}
      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">
            Todas ({justificativas.length})
          </TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes ({justificativasPendentes.length})
          </TabsTrigger>
          <TabsTrigger value="aprovadas">
            Aprovadas ({justificativasAprovadas.length})
          </TabsTrigger>
          <TabsTrigger value="rejeitadas">
            Rejeitadas ({justificativasRejeitadas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {justificativas.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma justificativa encontrada.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {justificativas.map((justificativa) => (
                <JustificativaCard
                  key={justificativa.id}
                  justificativa={justificativa}
                  isAdmin={isAdmin}
                  onAprovar={(id) =>
                    setModalAprovar({ isOpen: true, justificativaId: id })
                  }
                  onRejeitar={(id) =>
                    setModalAprovar({ isOpen: true, justificativaId: id })
                  }
                  onVerDetalhes={(id) =>
                    setModalDetalhes({ isOpen: true, justificativaId: id })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-4">
          {justificativasPendentes.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma justificativa pendente encontrada.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {justificativasPendentes.map((justificativa) => (
                <JustificativaCard
                  key={justificativa.id}
                  justificativa={justificativa}
                  isAdmin={isAdmin}
                  onAprovar={(id) =>
                    setModalAprovar({ isOpen: true, justificativaId: id })
                  }
                  onRejeitar={(id) =>
                    setModalAprovar({ isOpen: true, justificativaId: id })
                  }
                  onVerDetalhes={(id) =>
                    setModalDetalhes({ isOpen: true, justificativaId: id })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="aprovadas" className="space-y-4">
          {justificativasAprovadas.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma justificativa aprovada encontrada.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {justificativasAprovadas.map((justificativa) => (
                <JustificativaCard
                  key={justificativa.id}
                  justificativa={justificativa}
                  isAdmin={isAdmin}
                  onVerDetalhes={(id) =>
                    setModalDetalhes({ isOpen: true, justificativaId: id })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejeitadas" className="space-y-4">
          {justificativasRejeitadas.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma justificativa rejeitada encontrada.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {justificativasRejeitadas.map((justificativa) => (
                <JustificativaCard
                  key={justificativa.id}
                  justificativa={justificativa}
                  isAdmin={isAdmin}
                  onVerDetalhes={(id) =>
                    setModalDetalhes({ isOpen: true, justificativaId: id })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Aprovação */}
      <ModalAprovarJustificativa
        isOpen={modalAprovar.isOpen}
        justificativaId={modalAprovar.justificativaId}
        onClose={() => setModalAprovar({ isOpen: false, justificativaId: "" })}
        onConfirm={handleAprovarJustificativa}
      />

      {/* Modal de Detalhes */}
      <ModalDetalhesJustificativa
        isOpen={modalDetalhes.isOpen}
        justificativaId={modalDetalhes.justificativaId}
        onClose={() => setModalDetalhes({ isOpen: false, justificativaId: "" })}
      />
    </div>
  );
}
