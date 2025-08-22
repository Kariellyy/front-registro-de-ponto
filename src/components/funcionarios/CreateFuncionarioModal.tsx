"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useFuncionarioActions } from "@/hooks/use-funcionarios";
import { CreateFuncionarioRequest, UpdateFuncionarioRequest } from "@/services/funcionarios.service";
import { Funcionario } from "@/types";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

interface CreateFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  funcionario?: Funcionario;
  isEditing?: boolean;
  departamentos?: string[];
}

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  entrada: string;
  saida: string;
  intervalos: { inicio: string; fim: string }[];
}

interface DepartamentoFormData {
  nome: string;
}

export function CreateFuncionarioModal({ isOpen, onClose, onSuccess, funcionario, isEditing = false, departamentos: propDepartamentos }: CreateFuncionarioModalProps) {
  const { createFuncionario, updateFuncionario, loading, error } = useFuncionarioActions();
  const [intervalos, setIntervalos] = useState([{ inicio: "--", fim: "--" }]);
  const [departamentos, setDepartamentos] = useState([
    "Tecnologia", "Produto", "Gestão", "Marketing", "Vendas", "Financeiro", "Recursos Humanos"
  ]);
  const [showDepartamentoModal, setShowDepartamentoModal] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
          entrada: "--",
    saida: "--",
    }
  });

  // Atualizar departamentos quando receber novos dados
  useEffect(() => {
    if (propDepartamentos) {
      // Remover duplicatas antes de atualizar
      const departamentosUnicos = [...new Set(propDepartamentos)];
      setDepartamentos(departamentosUnicos);
    }
  }, [propDepartamentos]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (isEditing && funcionario) {
      setValue("nome", funcionario.nome);
      setValue("cpf", funcionario.cpf);
      setValue("email", funcionario.email);
      setValue("telefone", funcionario.telefone);
      setValue("cargo", funcionario.cargo);
      setValue("departamento", funcionario.departamento);
      setValue("dataAdmissao", new Date(funcionario.dataAdmissao).toISOString().split('T')[0]);
      setValue("entrada", funcionario.horarioTrabalho.entrada);
      setValue("saida", funcionario.horarioTrabalho.saida);
      setIntervalos(funcionario.horarioTrabalho.intervalos.length > 0 ? funcionario.horarioTrabalho.intervalos : [{ inicio: "--", fim: "--" }]);
      
      // Adicionar o departamento do funcionário se não existir na lista
      if (!departamentos.includes(funcionario.departamento)) {
        setDepartamentos(prev => [...prev, funcionario.departamento]);
      }
    }
  }, [isEditing, funcionario, setValue, departamentos]);

  const {
    register: registerDepartamento,
    handleSubmit: handleSubmitDepartamento,
    reset: resetDepartamento,
    formState: { errors: errorsDepartamento },
  } = useForm<DepartamentoFormData>();

  const addIntervalo = () => {
    setIntervalos([...intervalos, { inicio: "", fim: "" }]);
  };

  const removeIntervalo = (index: number) => {
    setIntervalos(intervalos.filter((_, i) => i !== index));
  };

  const updateIntervalo = (index: number, field: "inicio" | "fim", value: string) => {
    const newIntervalos = [...intervalos];
    newIntervalos[index][field] = value;
    setIntervalos(newIntervalos);
  };

  const handleAddDepartamento = (data: DepartamentoFormData) => {
    if (data.nome.trim()) {
      setDepartamentos([...departamentos, data.nome.trim()]);
      resetDepartamento();
      setShowDepartamentoModal(false);
      toast.success("Departamento adicionado com sucesso!");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (isEditing && funcionario) {
      const funcionarioData: UpdateFuncionarioRequest = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
        cargo: data.cargo,
        departamento: data.departamento,
        dataAdmissao: data.dataAdmissao,
        horarioTrabalho: {
          entrada: data.entrada,
          saida: data.saida,
          intervalos: intervalos.filter(i => i.inicio && i.fim),
        },
      };

      const result = await updateFuncionario(funcionario.id, funcionarioData);
      if (result) {
        toast.success("Funcionário atualizado com sucesso!");
        reset();
        setIntervalos([{ inicio: "--", fim: "--" }]);
        onSuccess();
        onClose();
      } else {
        toast.error("Erro ao atualizar funcionário. Tente novamente.");
      }
    } else {
      const funcionarioData: CreateFuncionarioRequest = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
        cargo: data.cargo,
        departamento: data.departamento,
        dataAdmissao: data.dataAdmissao,
        ativo: true,
        horarioTrabalho: {
          entrada: data.entrada,
          saida: data.saida,
          intervalos: intervalos.filter(i => i.inicio && i.fim),
        },
      };

      const result = await createFuncionario(funcionarioData);
      if (result) {
        toast.success("Funcionário criado com sucesso!");
        reset();
        setIntervalos([{ inicio: "--", fim: "--" }]);
        onSuccess();
        onClose();
      } else {
        toast.error("Erro ao criar funcionário. Tente novamente.");
      }
    }
  };

  const handleClose = () => {
    reset();
    setIntervalos([{ inicio: "--", fim: "--" }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <toast.ToastContainer />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditing ? "Editar Funcionário" : "Novo Funcionário"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Pessoais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    {...register("nome", { 
                      required: "Nome é obrigatório",
                      minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" }
                    })}
                  />
                  {errors.nome && (
                    <p className="text-destructive text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    {...register("cpf", { 
                      required: "CPF é obrigatório",
                      pattern: {
                        value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                        message: "CPF deve estar no formato XXX.XXX.XXX-XX"
                      }
                    })}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      e.target.value = formatted;
                    }}
                    maxLength={14}
                  />
                  {errors.cpf && (
                    <p className="text-destructive text-sm mt-1">{errors.cpf.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    {...register("telefone", { 
                      required: "Telefone é obrigatório",
                      minLength: { value: 10, message: "Telefone deve ter pelo menos 10 caracteres" }
                    })}
                  />
                  {errors.telefone && (
                    <p className="text-destructive text-sm mt-1">{errors.telefone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Profissionais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    {...register("cargo", { 
                      required: "Cargo é obrigatório",
                      minLength: { value: 2, message: "Cargo deve ter pelo menos 2 caracteres" }
                    })}
                  />
                  {errors.cargo && (
                    <p className="text-destructive text-sm mt-1">{errors.cargo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <div className="flex gap-2">
                    <select
                      id="departamento"
                      {...register("departamento", { required: "Departamento é obrigatório" })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione um departamento</option>
                      {departamentos.map((dept, index) => (
                        <option key={`${dept}-${index}`} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDepartamentoModal(true)}
                      className="h-9 w-9 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.departamento && (
                    <p className="text-destructive text-sm mt-1">{errors.departamento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                  <Input
                    id="dataAdmissao"
                    type="date"
                    {...register("dataAdmissao", { required: "Data de admissão é obrigatória" })}
                  />
                  {errors.dataAdmissao && (
                    <p className="text-destructive text-sm mt-1">{errors.dataAdmissao.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Horário de Trabalho */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Horário de Trabalho</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entrada">Horário de Entrada *</Label>
                  <Input
                    id="entrada"
                    type="time"
                    placeholder="--"
                    {...register("entrada", { required: "Horário de entrada é obrigatório" })}
                  />
                  {errors.entrada && (
                    <p className="text-destructive text-sm mt-1">{errors.entrada.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saida">Horário de Saída *</Label>
                  <Input
                    id="saida"
                    type="time"
                    placeholder="--"
                    {...register("saida", { required: "Horário de saída é obrigatório" })}
                  />
                  {errors.saida && (
                    <p className="text-destructive text-sm mt-1">{errors.saida.message}</p>
                  )}
                </div>
              </div>

              {/* Intervalos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <Label>Intervalos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addIntervalo}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Intervalo
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {intervalos.map((intervalo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="time"
                        placeholder="Início"
                        value={intervalo.inicio}
                        onChange={(e) => updateIntervalo(index, "inicio", e.target.value)}
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input
                        type="time"
                        placeholder="Fim"
                        value={intervalo.fim}
                        onChange={(e) => updateIntervalo(index, "fim", e.target.value)}
                      />
                      {intervalos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIntervalo(index)}
                          className="text-destructive hover:text-destructive/70"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (isEditing ? "Atualizando..." : "Criando...") : (isEditing ? "Atualizar Funcionário" : "Criar Funcionário")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal para adicionar departamento */}
      {showDepartamentoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Novo Departamento
                <Button variant="ghost" size="sm" onClick={() => setShowDepartamentoModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDepartamento(handleAddDepartamento)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeDepartamento">Nome do Departamento *</Label>
                  <Input
                    id="nomeDepartamento"
                    {...registerDepartamento("nome", { 
                      required: "Nome do departamento é obrigatório",
                      minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" }
                    })}
                  />
                  {errorsDepartamento.nome && (
                    <p className="text-destructive text-sm mt-1">{errorsDepartamento.nome.message}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowDepartamentoModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar Departamento
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </>
  );
} 