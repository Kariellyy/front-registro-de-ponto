"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useDepartamentos } from "@/hooks/use-departamentos";
import { useFuncionarioActions } from "@/hooks/use-funcionarios";
import { gerarHorariosPadrao } from "@/lib/horarios";
import { Cargo, cargosService } from "@/services/cargos.service";
import { empresasService } from "@/services/empresas.service";
import {
    CreateFuncionarioRequest,
    UpdateFuncionarioRequest,
} from "@/services/funcionarios.service";
import { Funcionario } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

// Função para converter horários do backend para o formato do frontend
const convertBackendHorariosToFrontend = (
  horarios?: Funcionario["horarios"]
) => {
  if (!horarios || horarios.length === 0) {
    return gerarHorariosPadrao();
  }

  const horariosConvertidos: { [diaSemana: string]: HorarioDia } = {};

  // Inicializar todos os dias como inativos
  for (let i = 0; i <= 6; i++) {
    horariosConvertidos[i.toString()] = {
      ativo: false,
      inicio: "",
      fim: "",
      temIntervalo: false,
      intervaloInicio: "",
      intervaloFim: "",
    };
  }

  // Preencher com os dados do backend
  horarios.forEach((horario) => {
    const diaSemana = horario.diaSemana.toString();
    horariosConvertidos[diaSemana] = {
      ativo: horario.ativo,
      inicio: horario.horarioInicio || "",
      fim: horario.horarioFim || "",
      temIntervalo: horario.temIntervalo,
      intervaloInicio: horario.intervaloInicio || "",
      intervaloFim: horario.intervaloFim || "",
    };
  });

  return horariosConvertidos;
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
  cargoId?: string;
  salario?: number;
  departamentoId: string;
  dataAdmissao: string;
  inicioRegistros?: string;
  horariosFuncionario: { [diaSemana: string]: HorarioDia };
  cargaHorariaSemanal: number;
}

// Removido fluxo de criação de departamento neste modal

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
  // Removido botão/modal de criar departamento aqui
  const [horariosFuncionario, setHorariosFuncionario] = useState(
    gerarHorariosPadrao()
  );
  const [cargaHorariaSemanal, setCargaHorariaSemanal] = useState(40);
  const [horariosEmpresa, setHorariosEmpresa] = useState(gerarHorariosPadrao());
  const [cargosDept, setCargosDept] = useState<Cargo[]>([]);
  const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(false);
  const [isLoadingFuncionarioData, setIsLoadingFuncionarioData] =
    useState(false);
  const [isLoadingCargos, setIsLoadingCargos] = useState(false);


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
    const loadFuncionarioData = async () => {
      if (isEditing && funcionario) {
        setIsLoadingFuncionarioData(true);

        try {
          // Dados básicos
          setValue("nome", funcionario.nome);
          setValue("cpf", funcionario.cpf || "");
          setValue("email", funcionario.email);
          setValue("telefone", funcionario.telefone || "");

          const infoTrabalhistas = funcionario.informacoesTrabalhistas;
          setValue("departamentoId", infoTrabalhistas?.departamentoId || "");
          setValue("cargoId", infoTrabalhistas?.cargoId || "");
          setValue(
            "dataAdmissao",
            infoTrabalhistas?.dataAdmissao
              ? new Date(infoTrabalhistas.dataAdmissao)
                  .toISOString()
                  .split("T")[0]
              : ""
          );
          setValue(
            "inicioRegistros",
            infoTrabalhistas?.inicioRegistros
              ? new Date(infoTrabalhistas.inicioRegistros)
                  .toISOString()
                  .split("T")[0]
              : ""
          );

          // Carregar horários do funcionário salvos ou usar padrão
          let horariosCarregados;

          // Priorizar horariosFuncionario se existir, senão converter do formato backend
          if (funcionario.horariosFuncionario) {
            horariosCarregados = funcionario.horariosFuncionario;
          } else {
            // Converter horários do formato backend para frontend
            horariosCarregados = convertBackendHorariosToFrontend(
              funcionario.horarios
            );
          }

          setHorariosFuncionario(horariosCarregados);
          setValue("horariosFuncionario", horariosCarregados);

          const cargaCarregada = infoTrabalhistas?.cargaHorariaSemanal || 40;
          setCargaHorariaSemanal(cargaCarregada);
          setValue("cargaHorariaSemanal", cargaCarregada);

          // Carregar salário das informações trabalhistas
          if (
            infoTrabalhistas?.salario !== undefined &&
            infoTrabalhistas?.salario !== null
          ) {
            setValue("salario", infoTrabalhistas.salario);
          }

          // Carregar cargos do departamento se existir
          if (infoTrabalhistas?.departamentoId) {
            setIsLoadingCargos(true);
            try {
              const cargos = await cargosService.list(
                infoTrabalhistas.departamentoId
              );
              setCargosDept(cargos);
            } catch (error) {
              console.error("Erro ao carregar cargos:", error);
              setCargosDept([]);
            } finally {
              setIsLoadingCargos(false);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar dados do funcionário:", error);
        } finally {
          setIsLoadingFuncionarioData(false);
        }
      }
    };

    loadFuncionarioData();
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
            // mas sempre ativar intervalo com horário 12:00-14:00
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
                    intervaloInicio: "12:00",
                    intervaloFim: "14:00",
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

    if (isOpen && !isEditing) {
      // Só carregar horários da empresa se não estiver editando
      loadEmpresaHorarios();
    } else if (isOpen && empresa?.horariosSemanais) {
      // Se estiver editando, apenas definir os horários da empresa para referência
      setHorariosEmpresa(empresa.horariosSemanais);
    }
  }, [isOpen, empresa?.id, isEditing]);

  // Removidos forms e handlers de criação de departamento

  const onSubmit = async (data: FormData) => {
    if (isEditing && funcionario) {
      const funcionarioData: UpdateFuncionarioRequest = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
        cargoId: data.cargoId,
        departamentoId: data.departamentoId,
        dataAdmissao: data.dataAdmissao,
        inicioRegistros: data.inicioRegistros,
        salario: data.salario ? Number(data.salario) : null,
        horariosFuncionario: horariosFuncionario,
        cargaHorariaSemanal: Number(cargaHorariaSemanal),
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
        cargoId: data.cargoId,
        departamentoId: data.departamentoId,
        dataAdmissao: data.dataAdmissao,
        inicioRegistros: data.inicioRegistros,
        salario: data.salario ? Number(data.salario) : null,
        papel: "funcionario",
        horariosFuncionario: horariosFuncionario,
        cargaHorariaSemanal: Number(cargaHorariaSemanal),
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
    setCargosDept([]);
    setIsLoadingFuncionarioData(false);
    setIsLoadingCargos(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {isEditing ? "Editar Funcionário" : "Novo Funcionário"}
              </CardTitle>
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
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Input
                        id="nome"
                        {...register("nome", {
                          required: "Nome é obrigatório",
                          minLength: {
                            value: 2,
                            message: "Nome deve ter pelo menos 2 caracteres",
                          },
                        })}
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
                    {errors.nome && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
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
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
                    {errors.cpf && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
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
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Input
                        id="telefone"
                        {...register("telefone", {
                          required: "Telefone é obrigatório",
                          minLength: {
                            value: 10,
                            message:
                              "Telefone deve ter pelo menos 10 caracteres",
                          },
                        })}
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
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
                    <Label htmlFor="departamentoId">Departamento *</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <select
                        id="departamentoId"
                        {...register("departamentoId", {
                          required: "Departamento é obrigatório",
                        })}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={
                          loadingDepartamentos || isLoadingFuncionarioData
                        }
                        onChange={async (e) => {
                          const deptId = e.target.value;
                          setValue("cargoId", "");
                          setValue("salario", undefined as any);
                          setIsLoadingCargos(true);
                          try {
                            setCargosDept(
                              deptId ? await cargosService.list(deptId) : []
                            );
                          } finally {
                            setIsLoadingCargos(false);
                          }
                        }}
                      >
                        <option value="">Selecione um departamento</option>
                        {departamentos.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.nome}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.departamentoId && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.departamentoId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargoId">Cargo *</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : isLoadingCargos ? (
                      <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm items-center">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ) : (
                      <select
                        id="cargoId"
                        {...register("cargoId", {
                          required: "Cargo é obrigatório",
                        })}
                        onChange={async (e) => {
                          const id = e.target.value;
                          const cargo = cargosDept.find((c) => c.id === id);
                          if (cargo) {
                            // Se estiver criando um novo funcionário, usar o salário base do cargo
                            // Se estiver editando, manter o salário atual (a menos que seja undefined ou null)
                            const currentSalary =
                              funcionario?.informacoesTrabalhistas?.salario;
                            if (
                              !isEditing ||
                              currentSalary === undefined ||
                              currentSalary === null
                            ) {
                              setValue("salario", Number(cargo.baseSalarial));
                            }
                          }
                        }}
                        disabled={
                          cargosDept.length === 0 ||
                          isLoadingCargos ||
                          isLoadingFuncionarioData
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                      >
                        <option value="">
                          {isLoadingCargos
                            ? "Carregando cargos..."
                            : "Selecione um cargo"}
                        </option>
                        {cargosDept.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.cargoId && (
                      <p className="text-destructive text-sm mt-1">
                        {(errors as any).cargoId?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salario">Salário</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Input
                        id="salario"
                        type="number"
                        step="0.01"
                        {...register("salario")}
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Input
                        id="dataAdmissao"
                        type="date"
                        {...register("dataAdmissao", {
                          required: "Data de admissão é obrigatória",
                        })}
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
                    {errors.dataAdmissao && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.dataAdmissao.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inicioRegistros">
                      Início dos Registros
                    </Label>
                    {isLoadingFuncionarioData && isEditing ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Input
                        id="inicioRegistros"
                        type="date"
                        {...register("inicioRegistros")}
                        disabled={isLoadingFuncionarioData}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Registros anteriores a esta data serão ignorados nos
                      cálculos.
                    </p>
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

        {/* Removido: modal de adicionar departamento */}
      </div>
  );
}
