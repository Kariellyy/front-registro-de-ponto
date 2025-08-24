"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useDepartamentos } from "@/hooks/use-departamentos";
import { Funcionario } from "@/types";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface DepartamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionarios: Funcionario[];
}

interface DepartamentoFormData {
  nome: string;
  descricao?: string;
}

export function DepartamentoModal({
  isOpen,
  onClose,
  funcionarios,
}: DepartamentoModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { departamentos, createDepartamento, deleteDepartamento, loading } =
    useDepartamentos();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartamentoFormData>();

  const handleAddDepartamento = async (data: DepartamentoFormData) => {
    if (data.nome.trim()) {
      const result = await createDepartamento({
        nome: data.nome.trim(),
        descricao: data.descricao,
      });

      if (result) {
        reset();
        setShowAddForm(false);
        toast.success("Departamento adicionado com sucesso!");
      } else {
        toast.error("Erro ao adicionar departamento. Tente novamente.");
      }
    }
  };

  const handleRemoveDepartamento = async (
    departamentoId: string,
    departamentoNome: string
  ) => {
    const funcionariosNoDepartamento = funcionarios.filter(
      (f) => f.departamentoId === departamentoId
    );

    if (funcionariosNoDepartamento.length > 0) {
      toast.error(
        `Não é possível excluir o departamento "${departamentoNome}" pois há ${funcionariosNoDepartamento.length} funcionário(s) vinculado(s). ` +
          "Edite os funcionários para remover o vínculo antes de excluir o departamento."
      );
      return;
    }

    if (
      confirm(
        `Tem certeza que deseja excluir o departamento "${departamentoNome}"?`
      )
    ) {
      const success = await deleteDepartamento(departamentoId);
      if (success) {
        toast.success(
          `Departamento "${departamentoNome}" removido com sucesso!`
        );
      } else {
        toast.error("Erro ao excluir departamento. Tente novamente.");
      }
    }
  };

  const getFuncionariosPorDepartamento = (departamentoId: string) => {
    return funcionarios.filter((f) => f.departamentoId === departamentoId);
  };

  if (!isOpen) return null;

  return (
    <>
      <toast.ToastContainer />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Gerenciar Departamentos</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Adicionar novo departamento */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? "Cancelar" : "Novo Departamento"}
                </Button>
              </div>

              {showAddForm && (
                <form
                  onSubmit={handleSubmit(handleAddDepartamento)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="nomeDepartamento">
                      Nome do Departamento *
                    </Label>
                    <Input
                      id="nomeDepartamento"
                      {...register("nome", {
                        required: "Nome do departamento é obrigatório",
                        minLength: {
                          value: 2,
                          message: "Nome deve ter pelo menos 2 caracteres",
                        },
                      })}
                    />
                    {errors.nome && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricaoDepartamento">Descrição</Label>
                    <Input
                      id="descricaoDepartamento"
                      {...register("descricao")}
                      placeholder="Descrição opcional do departamento"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Adicionando..." : "Adicionar Departamento"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Lista de departamentos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Departamentos Existentes</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {departamentos.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground text-sm mb-2">📁</div>
                    <p className="text-muted-foreground text-sm">
                      Nenhum departamento cadastrado
                    </p>
                  </div>
                ) : (
                  departamentos.map((departamento) => {
                    const funcionariosNoDept = getFuncionariosPorDepartamento(
                      departamento.id
                    );
                    const podeExcluir = funcionariosNoDept.length === 0;

                    return (
                      <div
                        key={departamento.id}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {departamento.nome}
                          </div>
                          {departamento.descricao && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {departamento.descricao}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {funcionariosNoDept.length} funcionário(s)
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!podeExcluir && (
                            <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                              Não pode excluir
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveDepartamento(
                                departamento.id,
                                departamento.nome
                              )
                            }
                            className="text-destructive hover:text-destructive/70 hover:bg-destructive/10"
                            disabled={!podeExcluir || loading}
                            title={
                              !podeExcluir
                                ? "Edite os funcionários para remover o vínculo antes de excluir o departamento"
                                : "Excluir departamento"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
