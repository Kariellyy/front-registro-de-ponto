export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  ativo: boolean;
  dataAdmissao: Date;
  horarioTrabalho: {
    entrada: string;
    saida: string;
    intervalos: {
      inicio: string;
      fim: string;
    }[];
  };
}

export interface RegistroPonto {
  id: string;
  funcionarioId: string;
  dataHora: Date;
  tipo: "entrada" | "saida" | "intervalo_inicio" | "intervalo_fim";
  localizacao: {
    latitude: number;
    longitude: number;
    endereco: string;
  };
  qrCodeId: string;
  justificativa?: string;
  status: "aprovado" | "pendente" | "rejeitado";
}

export interface Ausencia {
  id: string;
  funcionarioId: string;
  tipo: "falta" | "atestado" | "licenca" | "feriado";
  dataInicio: Date;
  dataFim: Date;
  motivo: string;
  documentoAnexo?: string;
  status: "pendente" | "aprovada" | "rejeitada";
  observacoes?: string;
}

export interface Ferias {
  id: string;
  funcionarioId: string;
  periodoAquisitivo: {
    inicio: Date;
    fim: Date;
  };
  diasDireito: number;
  diasUsados: number;
  periodos: {
    id: string;
    dataInicio: Date;
    dataFim: Date;
    dias: number;
    status: "agendado" | "em_andamento" | "concluido" | "cancelado";
  }[];
}

export interface JustificativaPonto {
  id: string;
  funcionarioId: string;
  registroPontoId: string;
  motivo: string;
  descricao: string;
  documentoAnexo?: string;
  dataJustificativa: Date;
  status: "pendente" | "aprovada" | "rejeitada";
  analisadoPor?: string;
  dataAnalise?: Date;
  observacoesAnalise?: string;
}

export interface BancoHoras {
  id: string;
  funcionarioId: string;
  mes: number;
  ano: number;
  horasExtras: number;
  horasDebito: number;
  saldoAnterior: number;
  saldoAtual: number;
  detalhes: {
    data: Date;
    horas: number;
    tipo: "extra" | "debito" | "compensacao";
    descricao: string;
  }[];
}

export interface DashboardMetrics {
  totalFuncionarios: number;
  funcionariosPresentes: number;
  funcionariosAusentes: number;
  horasExtrasMes: number;
  pontosJustificar: number;
  feriasAgendadas: number;
  ausenciasPendentes: number;
}
