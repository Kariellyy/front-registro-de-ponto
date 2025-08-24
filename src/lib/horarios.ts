interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
  temIntervalo: boolean;
  intervaloInicio?: string;
  intervaloFim?: string;
}

export function calcularCargaHorariaSemanal(
  horarios: { [diaSemana: string]: HorarioDia }
): number {
  let totalHoras = 0;

  Object.values(horarios).forEach((horario) => {
    if (horario.ativo && horario.inicio && horario.fim) {
      const horasDia = calcularHorasDia(horario);
      totalHoras += horasDia;
    }
  });

  return Math.round(totalHoras * 100) / 100;
}

export function calcularHorasDia(horario: HorarioDia): number {
  if (!horario.ativo || !horario.inicio || !horario.fim) {
    return 0;
  }

  const [inicioHour, inicioMin] = horario.inicio.split(':').map(Number);
  const [fimHour, fimMin] = horario.fim.split(':').map(Number);

  let horasDia = (fimHour + fimMin / 60) - (inicioHour + inicioMin / 60);

  // Descontar intervalo se existir
  if (horario.temIntervalo && horario.intervaloInicio && horario.intervaloFim) {
    const [intInicioHour, intInicioMin] = horario.intervaloInicio.split(':').map(Number);
    const [intFimHour, intFimMin] = horario.intervaloFim.split(':').map(Number);
    const horasIntervalo = (intFimHour + intFimMin / 60) - (intInicioHour + intInicioMin / 60);
    horasDia -= horasIntervalo;
  }

  return Math.max(0, horasDia);
}

export function validarHorario(horario: HorarioDia): string[] {
  const erros: string[] = [];

  if (!horario.ativo) {
    return erros;
  }

  if (!horario.inicio || !horario.fim) {
    erros.push('Horário de início e fim são obrigatórios');
    return erros;
  }

  const [inicioHour, inicioMin] = horario.inicio.split(':').map(Number);
  const [fimHour, fimMin] = horario.fim.split(':').map(Number);

  const inicioMinutos = inicioHour * 60 + inicioMin;
  const fimMinutos = fimHour * 60 + fimMin;

  if (fimMinutos <= inicioMinutos) {
    erros.push('Horário de fim deve ser posterior ao horário de início');
  }

  if (horario.temIntervalo) {
    if (!horario.intervaloInicio || !horario.intervaloFim) {
      erros.push('Horário de intervalo é obrigatório quando ativado');
      return erros;
    }

    const [intInicioHour, intInicioMin] = horario.intervaloInicio.split(':').map(Number);
    const [intFimHour, intFimMin] = horario.intervaloFim.split(':').map(Number);

    const intInicioMinutos = intInicioHour * 60 + intInicioMin;
    const intFimMinutos = intFimHour * 60 + intFimMin;

    if (intFimMinutos <= intInicioMinutos) {
      erros.push('Horário de fim do intervalo deve ser posterior ao horário de início');
    }

    if (intInicioMinutos <= inicioMinutos) {
      erros.push('Intervalo deve iniciar após o horário de trabalho');
    }

    if (intFimMinutos >= fimMinutos) {
      erros.push('Intervalo deve terminar antes do fim do expediente');
    }
  }

  return erros;
}

export function gerarHorariosPadrao(): { [diaSemana: string]: HorarioDia } {
  return {
    "1": { ativo: true, inicio: "08:00", fim: "18:00", temIntervalo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
    "2": { ativo: true, inicio: "08:00", fim: "18:00", temIntervalo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
    "3": { ativo: true, inicio: "08:00", fim: "18:00", temIntervalo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
    "4": { ativo: true, inicio: "08:00", fim: "18:00", temIntervalo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
    "5": { ativo: true, inicio: "08:00", fim: "18:00", temIntervalo: true, intervaloInicio: "12:00", intervaloFim: "13:00" },
    "6": { ativo: true, inicio: "08:00", fim: "12:00", temIntervalo: false, intervaloInicio: "", intervaloFim: "" },
    "0": { ativo: false, inicio: "", fim: "", temIntervalo: false, intervaloInicio: "", intervaloFim: "" },
  };
}

export function diasSemanaLabels() {
  return [
    { key: "1", nome: "Segunda-feira", abrev: "SEG" },
    { key: "2", nome: "Terça-feira", abrev: "TER" },
    { key: "3", nome: "Quarta-feira", abrev: "QUA" },
    { key: "4", nome: "Quinta-feira", abrev: "QUI" },
    { key: "5", nome: "Sexta-feira", abrev: "SEX" },
    { key: "6", nome: "Sábado", abrev: "SÁB" },
    { key: "0", nome: "Domingo", abrev: "DOM" },
  ];
}
