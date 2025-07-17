import {
    Ausencia,
    BancoHoras,
    DashboardMetrics,
    Ferias,
    Funcionario,
    JustificativaPonto,
    RegistroPonto
} from "@/types";

// Mock de Funcionários
export const funcionariosMock: Funcionario[] = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "123.456.789-10",
    email: "joao.silva@empresa.com",
    telefone: "(11) 99999-0001",
    cargo: "Desenvolvedor Frontend",
    departamento: "Tecnologia",
    ativo: true,
    dataAdmissao: new Date("2023-01-15"),
    horarioTrabalho: {
      entrada: "08:00",
      saida: "17:00",
      intervalos: [
        { inicio: "12:00", fim: "13:00" }
      ]
    }
  },
  {
    id: "2",
    nome: "Maria Santos",
    cpf: "987.654.321-00",
    email: "maria.santos@empresa.com",
    telefone: "(11) 99999-0002",
    cargo: "Designer UX/UI",
    departamento: "Produto",
    ativo: true,
    dataAdmissao: new Date("2023-03-20"),
    horarioTrabalho: {
      entrada: "09:00",
      saida: "18:00",
      intervalos: [
        { inicio: "12:30", fim: "13:30" }
      ]
    }
  },
  {
    id: "3",
    nome: "Pedro Costa",
    cpf: "456.789.123-45",
    email: "pedro.costa@empresa.com",
    telefone: "(11) 99999-0003",
    cargo: "Gerente de Projeto",
    departamento: "Gestão",
    ativo: true,
    dataAdmissao: new Date("2022-08-10"),
    horarioTrabalho: {
      entrada: "08:30",
      saida: "17:30",
      intervalos: [
        { inicio: "12:00", fim: "13:00" }
      ]
    }
  },
  {
    id: "4",
    nome: "Ana Lima",
    cpf: "321.654.987-78",
    email: "ana.lima@empresa.com",
    telefone: "(11) 99999-0004",
    cargo: "Analista de Marketing",
    departamento: "Marketing",
    ativo: false,
    dataAdmissao: new Date("2023-06-01"),
    horarioTrabalho: {
      entrada: "08:00",
      saida: "17:00",
      intervalos: [
        { inicio: "12:00", fim: "13:00" }
      ]
    }
  },
  {
    id: "5",
    nome: "Carlos Ferreira",
    cpf: "789.123.456-89",
    email: "carlos.ferreira@empresa.com",
    telefone: "(11) 99999-0005",
    cargo: "Desenvolvedor Backend",
    departamento: "Tecnologia",
    ativo: true,
    dataAdmissao: new Date("2023-02-10"),
    horarioTrabalho: {
      entrada: "08:00",
      saida: "17:00",
      intervalos: [
        { inicio: "12:00", fim: "13:00" }
      ]
    }
  }
];

// Mock de Registros de Ponto
export const registrosPontoMock: RegistroPonto[] = [
  {
    id: "1",
    funcionarioId: "1",
    dataHora: new Date("2024-01-22T08:00:00"),
    tipo: "entrada",
    localizacao: {
      latitude: -23.550520,
      longitude: -46.633308,
      endereco: "Rua Augusta, 123 - São Paulo, SP"
    },
    qrCodeId: "QR001",
    status: "aprovado"
  },
  {
    id: "2",
    funcionarioId: "1",
    dataHora: new Date("2024-01-22T12:00:00"),
    tipo: "intervalo_inicio",
    localizacao: {
      latitude: -23.550520,
      longitude: -46.633308,
      endereco: "Rua Augusta, 123 - São Paulo, SP"
    },
    qrCodeId: "QR001",
    status: "aprovado"
  },
  {
    id: "3",
    funcionarioId: "1",
    dataHora: new Date("2024-01-22T13:00:00"),
    tipo: "intervalo_fim",
    localizacao: {
      latitude: -23.550520,
      longitude: -46.633308,
      endereco: "Rua Augusta, 123 - São Paulo, SP"
    },
    qrCodeId: "QR001",
    status: "aprovado"
  },
  {
    id: "4",
    funcionarioId: "1",
    dataHora: new Date("2024-01-22T17:00:00"),
    tipo: "saida",
    localizacao: {
      latitude: -23.550520,
      longitude: -46.633308,
      endereco: "Rua Augusta, 123 - São Paulo, SP"
    },
    qrCodeId: "QR001",
    status: "aprovado"
  },
  {
    id: "5",
    funcionarioId: "2",
    dataHora: new Date("2024-01-22T09:15:00"),
    tipo: "entrada",
    localizacao: {
      latitude: -23.550520,
      longitude: -46.633308,
      endereco: "Rua Augusta, 123 - São Paulo, SP"
    },
    qrCodeId: "QR001",
    status: "pendente",
    justificativa: "Atraso por trânsito"
  }
];

// Mock de Ausências
export const ausenciasMock: Ausencia[] = [
  {
    id: "1",
    funcionarioId: "4",
    tipo: "atestado",
    dataInicio: new Date("2024-01-20"),
    dataFim: new Date("2024-01-22"),
    motivo: "Consulta médica de emergência",
    status: "pendente",
    observacoes: "Aguardando apresentação do atestado médico"
  },
  {
    id: "2",
    funcionarioId: "5",
    tipo: "licenca",
    dataInicio: new Date("2024-01-25"),
    dataFim: new Date("2024-01-25"),
    motivo: "Assuntos pessoais",
    status: "aprovada",
    documentoAnexo: "licenca_carlos_25012024.pdf"
  },
  {
    id: "3",
    funcionarioId: "3",
    tipo: "falta",
    dataInicio: new Date("2024-01-18"),
    dataFim: new Date("2024-01-18"),
    motivo: "Não informado",
    status: "rejeitada",
    observacoes: "Falta injustificada"
  }
];

// Mock de Férias
export const feriasMock: Ferias[] = [
  {
    id: "1",
    funcionarioId: "1",
    periodoAquisitivo: {
      inicio: new Date("2023-01-15"),
      fim: new Date("2024-01-14")
    },
    diasDireito: 30,
    diasUsados: 15,
    periodos: [
      {
        id: "1",
        dataInicio: new Date("2023-07-01"),
        dataFim: new Date("2023-07-15"),
        dias: 15,
        status: "concluido"
      },
      {
        id: "2",
        dataInicio: new Date("2024-03-01"),
        dataFim: new Date("2024-03-15"),
        dias: 15,
        status: "agendado"
      }
    ]
  },
  {
    id: "2",
    funcionarioId: "2",
    periodoAquisitivo: {
      inicio: new Date("2023-03-20"),
      fim: new Date("2024-03-19")
    },
    diasDireito: 30,
    diasUsados: 0,
    periodos: [
      {
        id: "3",
        dataInicio: new Date("2024-02-10"),
        dataFim: new Date("2024-02-24"),
        dias: 15,
        status: "agendado"
      }
    ]
  }
];

// Mock de Justificativas de Ponto
export const justificativasPontoMock: JustificativaPonto[] = [
  {
    id: "1",
    funcionarioId: "1",
    registroPontoId: "5",
    motivo: "Atraso por trânsito",
    descricao: "Atraso de 15 minutos devido a acidente na via principal",
    dataJustificativa: new Date("2024-01-22T09:30:00"),
    status: "pendente"
  },
  {
    id: "2",
    funcionarioId: "2",
    registroPontoId: "6",
    motivo: "Consulta médica",
    descricao: "Saída antecipada para consulta médica agendada",
    dataJustificativa: new Date("2024-01-21T16:00:00"),
    status: "aprovada",
    analisadoPor: "3",
    dataAnalise: new Date("2024-01-21T18:00:00"),
    observacoesAnalise: "Justificativa aceita. Anexar comprovante da consulta."
  },
  {
    id: "3",
    funcionarioId: "3",
    registroPontoId: "7",
    motivo: "Esquecimento de bater ponto",
    descricao: "Esqueci de bater o ponto na saída do almoço",
    dataJustificativa: new Date("2024-01-20T14:30:00"),
    status: "rejeitada",
    analisadoPor: "3",
    dataAnalise: new Date("2024-01-20T17:00:00"),
    observacoesAnalise: "Justificativa não aceita. Falta de comprovação."
  }
];

// Mock de Banco de Horas
export const bancoHorasMock: BancoHoras[] = [
  {
    id: "1",
    funcionarioId: "1",
    mes: 1,
    ano: 2024,
    horasExtras: 12,
    horasDebito: 0,
    saldoAnterior: 25,
    saldoAtual: 37,
    detalhes: [
      {
        data: new Date("2024-01-15"),
        horas: 2,
        tipo: "extra",
        descricao: "Projeto urgente - frontend"
      },
      {
        data: new Date("2024-01-20"),
        horas: 4,
        tipo: "extra",
        descricao: "Deploy de emergência"
      },
      {
        data: new Date("2024-01-22"),
        horas: 6,
        tipo: "extra",
        descricao: "Reunião com cliente"
      }
    ]
  },
  {
    id: "2",
    funcionarioId: "2",
    mes: 1,
    ano: 2024,
    horasExtras: 8,
    horasDebito: 2,
    saldoAnterior: 18,
    saldoAtual: 24,
    detalhes: [
      {
        data: new Date("2024-01-10"),
        horas: 3,
        tipo: "extra",
        descricao: "Design de nova feature"
      },
      {
        data: new Date("2024-01-18"),
        horas: 2,
        tipo: "debito",
        descricao: "Saída antecipada"
      },
      {
        data: new Date("2024-01-25"),
        horas: 5,
        tipo: "extra",
        descricao: "Revisão de protótipos"
      }
    ]
  },
  {
    id: "3",
    funcionarioId: "3",
    mes: 1,
    ano: 2024,
    horasExtras: 0,
    horasDebito: 4,
    saldoAnterior: 2,
    saldoAtual: -2,
    detalhes: [
      {
        data: new Date("2024-01-12"),
        horas: 2,
        tipo: "debito",
        descricao: "Atraso manhã"
      },
      {
        data: new Date("2024-01-18"),
        horas: 2,
        tipo: "debito",
        descricao: "Falta injustificada"
      }
    ]
  }
];

// Mock de Métricas do Dashboard
export const dashboardMetricsMock: DashboardMetrics = {
  totalFuncionarios: 50,
  funcionariosPresentes: 47,
  funcionariosAusentes: 3,
  horasExtrasMes: 127,
  pontosJustificar: 8,
  feriasAgendadas: 12,
  ausenciasPendentes: 5
};

// Mock de Departamentos
export const departamentosMock = [
  { id: "1", nome: "Tecnologia", funcionarios: 15 },
  { id: "2", nome: "Produto", funcionarios: 8 },
  { id: "3", nome: "Gestão", funcionarios: 5 },
  { id: "4", nome: "Marketing", funcionarios: 7 },
  { id: "5", nome: "Vendas", funcionarios: 10 },
  { id: "6", nome: "Financeiro", funcionarios: 5 }
];

// Mock de Cargos
export const cargosMock = [
  { id: "1", nome: "Desenvolvedor Frontend", departamento: "Tecnologia" },
  { id: "2", nome: "Desenvolvedor Backend", departamento: "Tecnologia" },
  { id: "3", nome: "Designer UX/UI", departamento: "Produto" },
  { id: "4", nome: "Product Manager", departamento: "Produto" },
  { id: "5", nome: "Gerente de Projeto", departamento: "Gestão" },
  { id: "6", nome: "Analista de Marketing", departamento: "Marketing" },
  { id: "7", nome: "Vendedor", departamento: "Vendas" },
  { id: "8", nome: "Contador", departamento: "Financeiro" }
];

// Mock de QR Codes
export const qrCodesMock = [
  {
    id: "QR001",
    nome: "Entrada Principal",
    localizacao: "Recepção - Térreo",
    ativo: true,
    coordenadas: {
      latitude: -23.550520,
      longitude: -46.633308
    }
  },
  {
    id: "QR002",
    nome: "Sala de Reuniões",
    localizacao: "2º Andar - Sala 201",
    ativo: true,
    coordenadas: {
      latitude: -23.550525,
      longitude: -46.633315
    }
  },
  {
    id: "QR003",
    nome: "Área de Descanso",
    localizacao: "3º Andar - Copa",
    ativo: false,
    coordenadas: {
      latitude: -23.550530,
      longitude: -46.633320
    }
  }
];

// Mock de Feriados
export const feriadosMock = [
  {
    id: "1",
    nome: "Confraternização Universal",
    data: new Date("2024-01-01"),
    tipo: "nacional"
  },
  {
    id: "2",
    nome: "Carnaval",
    data: new Date("2024-02-12"),
    tipo: "nacional"
  },
  {
    id: "3",
    nome: "Carnaval",
    data: new Date("2024-02-13"),
    tipo: "nacional"
  },
  {
    id: "4",
    nome: "Sexta-feira Santa",
    data: new Date("2024-03-29"),
    tipo: "nacional"
  },
  {
    id: "5",
    nome: "Tiradentes",
    data: new Date("2024-04-21"),
    tipo: "nacional"
  },
  {
    id: "6",
    nome: "Dia do Trabalhador",
    data: new Date("2024-05-01"),
    tipo: "nacional"
  },
  {
    id: "7",
    nome: "Independência do Brasil",
    data: new Date("2024-09-07"),
    tipo: "nacional"
  },
  {
    id: "8",
    nome: "Nossa Senhora Aparecida",
    data: new Date("2024-10-12"),
    tipo: "nacional"
  },
  {
    id: "9",
    nome: "Finados",
    data: new Date("2024-11-02"),
    tipo: "nacional"
  },
  {
    id: "10",
    nome: "Proclamação da República",
    data: new Date("2024-11-15"),
    tipo: "nacional"
  },
  {
    id: "11",
    nome: "Natal",
    data: new Date("2024-12-25"),
    tipo: "nacional"
  }
]; 