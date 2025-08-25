"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDepartamentos } from "@/hooks/use-departamentos";
import { useFuncionarioActions } from "@/hooks/use-funcionarios";
import { gerarHorariosPadrao } from "@/lib/horarios";
import { empresasService } from "@/services/empresas.service";
import {
  CreateFuncionarioRequest,
  UpdateFuncionarioRequest,
} from "@/services/funcionarios.service";
import { Funcionario } from "@/types";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HorariosFuncionarioConfig } from "./HorariosFuncionarioConfig";

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
    6,
    9
  )}-${numbers.slice(9, 11)}`;
};

interface CreateFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  funcionario?: Funcionario;
  isEditing?: boolean;
}

interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
  temIntervalo: boolean;
  intervaloInicio?: string;
  intervaloFim?: string;
}

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamentoId: string;
  dataAdmissao: string;
  horariosFuncionario: { [diaSemana: string]: HorarioDia };
  cargaHorariaSemanal: number;
}

interface DepartamentoFormData {
  nome: string;
  descricao?: string;
}

export function CreateFuncionarioModal({
  isOpen,
  onClose,
  onSuccess,
  funcionario,
  isEditing = false,
}: CreateFuncionarioModalProps) {
  const { createFuncionario, updateFuncionario, loading, error } =
    useFuncionarioActions();
  const {
    departamentos,
    createDepartamento,
    loading: loadingDepartamentos,
  } = useDepartamentos();
  const { empresa } = useAuth();
  const [showDepartamentoModal, setShowDepartamentoModal] = useState(false);
  const [horariosFuncionario, setHorariosFuncionario] = useState(
    gerarHorariosPadrao()
  );
  const [cargaHorariaSemanal, setCargaHorariaSemanal] = useState(40);
  const [horariosEmpresa, setHorariosEmpresa] = useState(gerarHorariosPadrao());
  const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      horariosFuncionario: gerarHorariosPadrao(),
      cargaHorariaSemanal: 40,
    },
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (isEditing && funcionario) {
      setValue("nome", funcionario.nome);
      setValue("cpf", funcionario.cpf || "");
      setValue("email", funcionario.email);
      setValue("telefone", funcionario.telefone || "");
      setValue("cargo", funcionario.cargo || "");
      setValue("departamentoId", funcionario.departamentoId || "");
      setValue(
        "dataAdmissao",
        funcionario.dataAdmissao
          ? new Date(funcionario.dataAdmissao).toISOString().split("T")[0]
          : ""
      );

      // Carregar horários do funcionário ou usar padrão
      const horariosCarregados =
        funcionario.horariosFuncionario || gerarHorariosPadrao();
      setHorariosFuncionario(horariosCarregados);
      setValue("horariosFuncionario", horariosCarregados);

      const cargaCarregada = funcionario.cargaHorariaSemanal || 40;
      setCargaHorariaSemanal(cargaCarregada);
      setValue("cargaHorariaSemanal", cargaCarregada);
    }
  }, [isEditing, funcionario, setValue]);

  // Carregar horários completos da empresa quando o modal abrir
  useEffect(() => {
    const loadEmpresaHorarios = async () => {
      if (isOpen && empresa && !isLoadingEmpresa) {
        setIsLoadingEmpresa(true);
        try {
          const empresaCompleta = await empresasService.getMinhaEmpresa();
          if (empresaCompleta.horariosSemanais) {
            setHorariosEmpresa(empresaCompleta.horariosSemanais);

            // Para funcionários novos (não editando), usar horários da empresa como padrão
            // mas sempre ativar intervalo com horário 11:00-13:00
            if (!isEditing) {
              const horariosComIntervalo = {
                ...empresaCompleta.horariosSemanais,
              };

              // Ativar intervalo para todos os dias ativos
              Object.keys(horariosComIntervalo).forEach((dia) => {
                if (horariosComIntervalo[dia].ativo) {
                  horariosComIntervalo[dia] = {
                    ...horariosComIntervalo[dia],
                    temIntervalo: true,
                    intervaloInicio: "11:00",
                    intervaloFim: "13:00",
                  };
                }
              });

              setHorariosFuncionario(horariosComIntervalo);
              setValue("horariosFuncionario", horariosComIntervalo);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar horários da empresa:", error);
          // Manter horários padrão em caso de erro
        } finally {
          setIsLoadingEmpresa(false);
        }
      }
    };

    if (isOpen) {
      loadEmpresaHorarios();
    }
  }, [isOpen, empresa?.id]);

  const {
    register: registerDepartamento,
    handleSubmit: handleSubmitDepartamento,
    reset: resetDepartamento,
    formState: { errors: errorsDepartamento },
  } = useForm<DepartamentoFormData>();

  const handleAddDepartamento = async (data: DepartamentoFormData) => {
    if (data.nome.trim()) {
      const result = await createDepartamento({
        nome: data.nome.trim(),
        descricao: data.descricao,
      });

      if (result) {
        resetDepartamento();
        setShowDepartamentoModal(false);
        toast.success("Departamento adicionado com sucesso!");
      } else {
        toast.error("Erro ao adicionar departamento. Tente novamente.");
      }
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
        departamentoId: data.departamentoId,
        dataAdmissao: data.dataAdmissao,
        horariosFuncionario: horariosFuncionario,
        cargaHorariaSemanal: cargaHorariaSemanal,
      };

      const result = await updateFuncionario(funcionario.id, funcionarioData);
      if (result) {
        toast.success("Funcionário atualizado com sucesso!");
        reset();

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
        departamentoId: data.departamentoId,
        dataAdmissao: data.dataAdmissao,
        papel: "funcionario",
        horariosFuncionario: horariosFuncionario,
        cargaHorariaSemanal: cargaHorariaSemanal,
      };

      const result = await createFuncionario(funcionarioData);
      if (result) {
        toast.success(
          "Funcionário criado com sucesso! Senha: CPF (apenas números)"
        );
        reset();

        onSuccess();
        onClose();
      } else {
        toast.error("Erro ao criar funcionário. Tente novamente.");
      }
    }
  };

  const handleClose = () => {
    reset();
    setHorariosFuncionario(gerarHorariosPadrao());
    setCargaHorariaSemanal(40);
    setHorariosEmpresa(gerarHorariosPadrao());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <toast.ToastContainer />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {isEditing ? "Editar Funcionário" : "Novo Funcionário"}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span>Carga Horária Semanal:</span>
                <span className="font-medium text-primary">
                  {cargaHorariaSemanal}h
                </span>
              </div>
            </div>
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

                <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>💡 Dica:</strong> A senha do funcionário será
                    automaticamente o CPF (apenas números). O funcionário poderá
                    alterar a senha no primeiro acesso.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      {...register("nome", {
                        required: "Nome é obrigatório",
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
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      {...register("cpf", {
                        required: "CPF é obrigatório",
                        pattern: {
                          value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                          message: "CPF deve estar no formato XXX.XXX.XXX-XX",
                        },
                      })}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value);
                        e.target.value = formatted;
                      }}
                      maxLength={14}
                    />
                    {errors.cpf && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.cpf.message}
                      </p>
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
                          message: "Email inválido",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      {...register("telefone", {
                        required: "Telefone é obrigatório",
                        minLength: {
                          value: 10,
                          message: "Telefone deve ter pelo menos 10 caracteres",
                        },
                      })}
                    />
                    {errors.telefone && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.telefone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informações Profissionais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Informações Profissionais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo *</Label>
                    <Input
                      id="cargo"
                      {...register("cargo", {
                        required: "Cargo é obrigatório",
                        minLength: {
                          value: 2,
                          message: "Cargo deve ter pelo menos 2 caracteres",
                        },
                      })}
                    />
                    {errors.cargo && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.cargo.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departamentoId">Departamento *</Label>
                    <div className="flex gap-2">
                      <select
                        id="departamentoId"
                        {...register("departamentoId", {
                          required: "Departamento é obrigatório",
                        })}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loadingDepartamentos}
                      >
                        <option value="">Selecione um departamento</option>
                        {departamentos.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.nome}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDepartamentoModal(true)}
                        className="h-9 w-9 p-0"
                        disabled={loadingDepartamentos}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.departamentoId && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.departamentoId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                    <Input
                      id="dataAdmissao"
                      type="date"
                      {...register("dataAdmissao", {
                        required: "Data de admissão é obrigatória",
                      })}
                    />
                    {errors.dataAdmissao && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.dataAdmissao.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Horários de Trabalho */}
              <HorariosFuncionarioConfig
                horarios={horariosFuncionario}
                horariosEmpresa={horariosEmpresa}
                onChange={(novosHorarios, novaCarga) => {
                  setHorariosFuncionario(novosHorarios);
                  setCargaHorariaSemanal(novaCarga);
                  setValue("horariosFuncionario", novosHorarios);
                  setValue("cargaHorariaSemanal", novaCarga);
                }}
              />

              {/* Botões */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || loadingDepartamentos}
                >
                  {loading
                    ? isEditing
                      ? "Atualizando..."
                      : "Criando..."
                    : isEditing
                    ? "Atualizar Funcionário"
                    : "Criar Funcionário"}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDepartamentoModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmitDepartamento(handleAddDepartamento)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="nomeDepartamento">
                      Nome do Departamento *
                    </Label>
                    <Input
                      id="nomeDepartamento"
                      {...registerDepartamento("nome", {
                        required: "Nome do departamento é obrigatório",
                        minLength: {
                          value: 2,
                          message: "Nome deve ter pelo menos 2 caracteres",
                        },
                      })}
                    />
                    {errorsDepartamento.nome && (
                      <p className="text-destructive text-sm mt-1">
                        {errorsDepartamento.nome.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricaoDepartamento">Descrição</Label>
                    <Input
                      id="descricaoDepartamento"
                      {...registerDepartamento("descricao")}
                      placeholder="Descrição opcional do departamento"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDepartamentoModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loadingDepartamentos}>
                      {loadingDepartamentos
                        ? "Adicionando..."
                        : "Adicionar Departamento"}
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
