"use client";

import { CreateFuncionarioModal } from "@/components/funcionarios/CreateFuncionarioModal";
import { DepartamentoModal } from "@/components/funcionarios/DepartamentoModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingTable } from "@/components/ui/loading";
import { useFuncionarioActions, useFuncionarios } from "@/hooks/use-funcionarios";
import { Funcionario } from "@/types";
import {
  AlertCircle,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserX
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepartamentoModalOpen, setIsDepartamentoModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [departamentosCompartilhados, setDepartamentosCompartilhados] = useState<string[]>([
    "Tecnologia", "Produto", "Gestão", "Marketing", "Vendas", "Financeiro", "Recursos Humanos"
  ]);
  
  const { 
    funcionarios, 
    loading, 
    error,
    refresh 
  } = useFuncionarios({ 
    limit: 10,
    ...(selectedStatus && { ativo: selectedStatus === "Ativo" })
  });

  const { 
    loading: actionLoading, 
    activateFuncionario, 
    deactivateFuncionario, 
    deleteFuncionario 
  } = useFuncionarioActions();

  // Filtros locais (você pode mover para o backend depois)
  const filteredFuncionarios = useMemo(() => {
    return funcionarios.filter(funcionario => {
      const matchesSearch = !searchTerm || 
        funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.cpf.includes(searchTerm);
      
      const matchesDepartamento = !selectedDepartamento || funcionario.departamento === selectedDepartamento;
      
      return matchesSearch && matchesDepartamento;
    });
  }, [funcionarios, searchTerm, selectedDepartamento]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const ativos = funcionarios.filter(f => f.ativo).length;
    const inativos = funcionarios.filter(f => !f.ativo).length;
    const departamentos = new Set(funcionarios.map(f => f.departamento)).size;

    return { ativos, inativos, departamentos };
  }, [funcionarios]);

  // Atualizar departamentos compartilhados quando funcionários mudarem
  useEffect(() => {
    const departamentosExistentes = Array.from(new Set(funcionarios.map(f => f.departamento)));
    setDepartamentosCompartilhados(prev => {
      const todos = [...new Set([...prev, ...departamentosExistentes])];
      return todos.filter((dept, index, arr) => arr.indexOf(dept) === index);
    });
  }, [funcionarios]);

  const handleStatusToggle = async (funcionario: Funcionario) => {
    const success = funcionario.ativo 
      ? await deactivateFuncionario(funcionario.id)
      : await activateFuncionario(funcionario.id);
    
    if (success) {
      refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      const success = await deleteFuncionario(id);
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

  const formatHorario = (horarioTrabalho: Funcionario['horarioTrabalho']) => {
    return `${horarioTrabalho.entrada} - ${horarioTrabalho.saida}`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
            <p className="text-muted-foreground">Gerencie os funcionários da empresa</p>
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
            onClick={() => setIsDepartamentoModalOpen(true)}
          >
            Gerenciar Departamentos
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionário por nome..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <div className="text-2xl font-bold text-foreground">{stats.ativos}</div>
                  <div className="text-sm text-muted-foreground">Funcionários Ativos</div>
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
                  <div className="text-2xl font-bold text-foreground">{stats.inativos}</div>
                  <div className="text-sm text-muted-foreground">Funcionários Inativos</div>
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
                  <div className="text-2xl font-bold text-foreground">{stats.departamentos}</div>
                  <div className="text-sm text-muted-foreground">Departamentos</div>
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
            <div className="p-6 text-center text-muted-foreground">
              {searchTerm || selectedDepartamento || selectedStatus 
                ? "Nenhum funcionário encontrado com os filtros aplicados." 
                : "Nenhum funcionário cadastrado."}
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
                        <div className="text-sm text-muted-foreground">
                          {funcionario.cpf}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {funcionario.cargo}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {funcionario.departamento}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(funcionario.dataAdmissao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatHorario(funcionario.horarioTrabalho)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={funcionario.ativo ? "default" : "destructive"}>
                        {funcionario.ativo ? "Ativo" : "Inativo"}
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
                          title={funcionario.ativo ? "Desativar" : "Ativar"}
                          onClick={() => handleStatusToggle(funcionario)}
                          disabled={actionLoading}
                        >
                          {funcionario.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive/70" 
                          title="Excluir"
                          onClick={() => handleDelete(funcionario.id)}
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
        departamentos={departamentosCompartilhados}
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
          departamentos={departamentosCompartilhados}
        />
      )}

      {/* Modal de Gerenciamento de Departamentos */}
      <DepartamentoModal
        isOpen={isDepartamentoModalOpen}
        onClose={() => setIsDepartamentoModalOpen(false)}
        departamentos={departamentosCompartilhados}
        funcionarios={funcionarios}
        onDepartamentoAdded={(departamento) => {
          setDepartamentosCompartilhados(prev => [...prev, departamento]);
        }}
        onDepartamentoRemoved={(departamento) => {
          setDepartamentosCompartilhados(prev => prev.filter(d => d !== departamento));
        }}
      />
    </div>
  );
}
