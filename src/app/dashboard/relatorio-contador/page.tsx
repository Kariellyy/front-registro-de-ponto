"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { Calendar, ChevronDown, Download } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

type RelatorioResumo = {
  totalFuncionarios: number;
  horasRegulares: number;
  horasExtras: number;
  horasDebito: number;
  saldoBancoHoras: number;
};

type RelatorioFuncionario = {
  id: string;
  nome: string;
  horasRegulares: number;
  horasExtras: number;
  horasDebito: number;
  saldoMes: number;
  saldoAcumulado: number;
};

export default function RelatorioContadorPage() {
  const now = new Date();
  const [mes, setMes] = useState<number>(now.getUTCMonth() + 1);
  const [ano, setAno] = useState<number>(now.getUTCFullYear());
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState<RelatorioResumo | null>(null);
  const [funcionarios, setFuncionarios] = useState<RelatorioFuncionario[]>([]);
  const [error, setError] = useState<string | null>(null);

  const meses = useMemo(
    () => [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    []
  );

  const anos = useMemo(() => {
    const y = now.getUTCFullYear();
    return [y - 2, y - 1, y, y + 1];
  }, [now]);

  async function carregar() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<{
        resumo: RelatorioResumo;
        funcionarios: RelatorioFuncionario[];
      }>(`/ponto/relatorio-contador?mes=${mes}&ano=${ano}`);
      setResumo(data.resumo);
      setFuncionarios(data.funcionarios);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleExportPdf() {
    const base = process.env.NEXT_PUBLIC_API_URL as string;
    const session = await getSession();
    const res = await fetch(
      `${base}/ponto/relatorio-contador/pdf?mes=${mes}&ano=${ano}`,
      {
        headers: session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {},
      }
    );
    if (!res.ok) throw new Error("Falha ao gerar PDF");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-contador-${ano}-${String(mes).padStart(
      2,
      "0"
    )}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="bg-background border-b border-border pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Relatório para Contador
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPdf}>
                <Download className="w-4 h-4 mr-2" /> Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Período:
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-input rounded-md focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              {meses.map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-input rounded-md focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              {anos.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={carregar}
              disabled={loading}
            >
              <Calendar className="w-4 h-4" />{" "}
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
            style={{ backgroundColor: "#5baca3" }}
          ></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {resumo?.totalFuncionarios ?? 0}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Funcionários
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
            style={{ backgroundColor: "#5baca3" }}
          ></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {resumo?.horasRegulares ?? 0}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Horas Regulares
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
            style={{ backgroundColor: "#5baca3" }}
          ></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {resumo?.horasExtras ?? 0}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Horas Extras
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
            style={{ backgroundColor: "#5baca3" }}
          ></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {resumo?.horasDebito ?? 0}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Horas Débito
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center relative">
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
            style={{ backgroundColor: "#5baca3" }}
          ></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {resumo?.saldoBancoHoras ?? 0}h
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Saldo Banco Horas
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Funcionário
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Horas Regulares
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Horas Extras
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Horas Débito
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Saldo do Mês
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Saldo Acumulado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-sm text-muted-foreground"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : (
                funcionarios.map((f, index) => (
                  <tr
                    key={f.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50/50 dark:bg-gray-800/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {f.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.horasRegulares}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {f.horasExtras}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {f.horasDebito}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-semibold ${
                          f.saldoMes >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {f.saldoMes >= 0 ? "+" : ""}
                        {f.saldoMes}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-semibold ${
                          f.saldoAcumulado >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {f.saldoAcumulado >= 0 ? "+" : ""}
                        {f.saldoAcumulado}h
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
