"use client";

import { CreateFuncionarioModal } from "@/components/funcionarios/CreateFuncionarioModal";
import { DepartamentoModal } from "@/components/funcionarios/DepartamentoModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingTable } from "@/components/ui/loading";
import { useDepartamentos } from "@/hooks/use-departamentos";
import {
  useFuncionarioActions,
  useFuncionarios,
} from "@/hooks/use-funcionarios";
import { Funcionario } from "@/types";
import {
  AlertCircle,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepartamentoModalOpen, setIsDepartamentoModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<Funcionario | null>(null);

  const { funcionarios, loading, error, refresh } = useFuncionarios({
    limit: 10,
    ...(selectedStatus && {
      status: selectedStatus.toLowerCase() as "ativo" | "inativo" | "suspenso",
    }),
  });

  const { departamentos } = useDepartamentos();

  const {
    loading: actionLoading,
    deleteFuncionario,
    updateFuncionario,
  } = useFuncionarioActions();

  // Filtros locais (você pode mover para o backend depois)
  const filteredFuncionarios = useMemo(() => {
    if (!funcionarios) return [];

    return funcionarios.filter((funcionario) => {
      const matchesSearch =
        !searchTerm ||
        funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (funcionario.cpf && funcionario.cpf.includes(searchTerm));

      const matchesDepartamento =
        !selectedDepartamento ||
        funcionario.departamento?.nome === selectedDepartamento;

      const matchesStatus =
        !selectedStatus ||
        (selectedStatus === "Ativo" && funcionario.status === "ativo") ||
        (selectedStatus === "Inativo" && funcionario.status === "inativo") ||
        (selectedStatus === "Suspenso" && funcionario.status === "suspenso");

      return matchesSearch && matchesDepartamento && matchesStatus;
    });
  }, [funcionarios, searchTerm, selectedDepartamento, selectedStatus]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    if (!funcionarios) return { ativos: 0, inativos: 0, departamentos: 0 };

    const ativos = funcionarios.filter((f) => f.status === "ativo").length;
    const inativos = funcionarios.filter(
      (f) => f.status === "inativo" || f.status === "suspenso"
    ).length;
    const departamentos = new Set(
      funcionarios.map((f) => f.departamento?.nome).filter(Boolean)
    ).size;

    return { ativos, inativos, departamentos };
  }, [funcionarios]);

  const handleStatusToggle = async (funcionario: Funcionario) => {
    const newStatus = funcionario.status === "ativo" ? "inativo" : "ativo";

    const success = await updateFuncionario(funcionario.id, {
      status: newStatus,
    });

    if (success) {
      refresh();
    }
  };

  const handleDelete = async (funcionario: Funcionario) => {
    const message = `Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?\n\nEsta ação não pode ser desfeita e removerá todos os dados relacionados a este funcionário.`;

    if (confirm(message)) {
      const success = await deleteFuncionario(funcionario.id);
      if (success) {
        refresh();
      }
    }
  };

  const handleCreateSuccess = () => {
    refresh();
  };

  const handleEdit = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsEditModalOpen(true);
  };

  const formatHorario = (horarioTrabalho: Funcionario["horarioTrabalho"]) => {
    if (!horarioTrabalho) return "Não definido";
    return `${horarioTrabalho.entrada} - ${horarioTrabalho.saida}`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
            <p className="text-muted-foreground">
              Gerencie os funcionários da empresa
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>Erro ao carregar funcionários: {error}</span>
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDepartamentoModalOpen(true)}
          >
            Gerenciar Departamentos
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionário por nome, email ou CPF..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDepartamento}
            onChange={(e) => setSelectedDepartamento(e.target.value)}
            className="flex h-9 w-full min-w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todos os departamentos</option>
            {departamentos.map((dept) => (
              <option key={dept.id} value={dept.nome}>
                {dept.nome}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-9 w-full min-w-[120px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Suspenso">Suspenso</option>
          </select>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.ativos}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Funcionários Ativos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 dark:bg-destructive/20 rounded-lg">
                  <UserX className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.inativos}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Funcionários Inativos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-950/50 rounded-lg">
                  <Edit className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.departamentos}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Departamentos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de funcionários */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <LoadingTable rows={5} />
            </div>
          ) : filteredFuncionarios.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  {searchTerm || selectedDepartamento || selectedStatus ? (
                    <Search className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || selectedDepartamento || selectedStatus
                  ? "Nenhum funcionário encontrado"
                  : "Nenhum funcionário cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedDepartamento || selectedStatus
                  ? "Tente ajustar os filtros ou limpar a busca para ver mais resultados."
                  : "Comece adicionando seu primeiro funcionário à empresa."}
              </p>
              {!searchTerm && !selectedDepartamento && !selectedStatus && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Funcionário
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cargo / Departamento
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data Admissão
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFuncionarios.map((funcionario) => (
                  <tr key={funcionario.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">
                          {funcionario.nome}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {funcionario.email}
                        </div>
                        {funcionario.cpf && (
                          <div className="text-sm text-muted-foreground">
                            {funcionario.cpf}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {funcionario.cargo || "Não informado"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {funcionario.departamento?.nome || "Não informado"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {funcionario.dataAdmissao
                        ? new Date(funcionario.dataAdmissao).toLocaleDateString(
                            "pt-BR"
                          )
                        : "Não informado"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatHorario(funcionario.horarioTrabalho)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          funcionario.status === "ativo"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {funcionario.status === "ativo"
                          ? "Ativo"
                          : funcionario.status === "inativo"
                          ? "Inativo"
                          : "Suspenso"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-600/70"
                          title="Editar"
                          onClick={() => handleEdit(funcionario)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-600 hover:text-orange-600/70"
                          title={
                            funcionario.status === "ativo"
                              ? "Desativar"
                              : "Ativar"
                          }
                          onClick={() => handleStatusToggle(funcionario)}
                          disabled={actionLoading}
                        >
                          {funcionario.status === "ativo" ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/70"
                          title="Excluir"
                          onClick={() => handleDelete(funcionario)}
                          disabled={actionLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Modal de Criação */}
      <CreateFuncionarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal de Edição */}
      {selectedFuncionario && (
        <CreateFuncionarioModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedFuncionario(null);
          }}
          onSuccess={handleCreateSuccess}
          funcionario={selectedFuncionario}
          isEditing={true}
        />
      )}

      {/* Modal de Gerenciamento de Departamentos */}
      <DepartamentoModal
        isOpen={isDepartamentoModalOpen}
        onClose={() => setIsDepartamentoModalOpen(false)}
        funcionarios={funcionarios}
      />
    </div>
  );
}
