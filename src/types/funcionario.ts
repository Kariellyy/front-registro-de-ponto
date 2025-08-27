export interface RegistroPonto {
  id: number;
  tipo: "entrada" | "saida" | "intervalo_inicio" | "intervalo_fim";
  dataHora: Date;
  status: "aprovado" | "pendente" | "rejeitado";
}

export interface BancoHoras {
  saldoAtual: number;
  saldoMes: number;
  horasExtras: number;
  horasDebito: number;
  horasTrabalhadas: number;
  horasPrevistas: number;
  horasJustificadas: number;
  mes: string;
  ano: number;
}

export interface FuncionarioInfo {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  horarioTrabalho?: {
    entrada: string;
    saida: string;
    intervalos: Array<{
      inicio: string;
      fim: string;
    }>;
  };
}

export interface ExtratoItem {
  id: number;
  data: Date;
  tipo: "entrada" | "saida" | "intervalo_inicio" | "intervalo_fim";
  hora: string;
  saldo: number;
  acumulado: number;
}

export interface ExtratoResumo {
  saldoInicial: number;
  saldoFinal: number;
  totalHorasTrabalhadas: number;
  totalHorasPrevistas: number;
  saldoMes: number;
  saldoTotal: number;
  mes: string;
  ano: number;
}
