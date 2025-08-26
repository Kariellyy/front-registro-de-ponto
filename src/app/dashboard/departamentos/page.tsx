"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Cargo,
  cargosService,
  CreateCargoRequest,
} from "@/services/cargos.service";
import {
  Departamento,
  departamentosService,
} from "@/services/departamentos.service";
import { Check, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function DepartamentosPage() {
  const toast = useToast();
  const isMobile = useIsMobile();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Partial<CreateCargoRequest>>({
    baseSalarial: 0,
  });
  const [deptDraft, setDeptDraft] = useState<Partial<Departamento>>({});
  const [newDept, setNewDept] = useState<{ nome: string; descricao?: string }>({
    nome: "",
    descricao: "",
  });
  const [editingDept, setEditingDept] = useState<boolean>(false);
  const [openCreateDept, setOpenCreateDept] = useState(false);

  useEffect(() => {
    const load = async () => {
      const depts = await departamentosService.list();
      setDepartamentos(depts);
      setSelectedDeptId((prev) => prev || depts[0]?.id || "");
    };
    load();
  }, []);

  useEffect(() => {
    const loadCargos = async () => {
      if (!selectedDeptId) return setCargos([]);
      const list = await cargosService.list(selectedDeptId);
      setCargos(list);
    };
    loadCargos();
  }, [selectedDeptId]);

  const filteredCargos = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return cargos;
    return cargos.filter((c) =>
      [c.nome, c.descricao ?? ""].some((t) => t.toLowerCase().includes(key))
    );
  }, [cargos, search]);

  const selectedDept = useMemo(
    () => departamentos.find((d) => d.id === selectedDeptId),
    [departamentos, selectedDeptId]
  );

  const createDepartamento = async () => {
    if (!newDept.nome.trim())
      return toast.error("Informe o nome do departamento");
    try {
      const created = await departamentosService.create({
        nome: newDept.nome,
        descricao: newDept.descricao || "",
      });
      setDepartamentos((prev) => [created, ...prev]);
      setNewDept({ nome: "", descricao: "" });
      setSelectedDeptId(created.id);
      toast.success("Departamento criado");
    } catch {
      toast.error("Erro ao criar departamento");
    }
  };

  const startEditDept = () => {
    if (!selectedDept) return;
    setDeptDraft({ ...selectedDept });
    setEditingDept(true);
  };

  const cancelEditDept = () => {
    setDeptDraft({});
    setEditingDept(false);
  };

  const saveEditDept = async () => {
    if (!selectedDept) return;
    try {
      const updated = await departamentosService.update(selectedDept.id, {
        nome: deptDraft.nome || selectedDept.nome,
        descricao: deptDraft.descricao,
      });
      setDepartamentos((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
      setEditingDept(false);
      toast.success("Departamento atualizado");
    } catch {
      toast.error("Erro ao atualizar departamento");
    }
  };

  const deleteDepartamento = async (id: string) => {
    try {
      await departamentosService.delete(id);
      setDepartamentos((prev) => prev.filter((d) => d.id !== id));
      if (selectedDeptId === id) {
        setSelectedDeptId((prev) => {
          const next = departamentos.find((d) => d.id !== id)?.id || "";
          return next;
        });
        setCargos([]);
      }
      toast.success("Departamento removido");
    } catch {
      toast.error("Erro ao remover departamento");
    }
  };

  const handleAdd = async () => {
    if (!selectedDeptId) return;
    if (!draft?.nome) return toast.error("Informe o nome do cargo");
    try {
      const created = await cargosService.create({
        nome: draft.nome,
        descricao: draft.descricao || "",
        baseSalarial: Number(draft.baseSalarial || 0),
        departamentoId: selectedDeptId,
      });
      setCargos((prev) => [...prev, created]);
      setDraft({ baseSalarial: 0 });
      toast.success("Cargo criado");
    } catch {
      toast.error("Erro ao criar cargo");
    }
  };

  const handleUpdate = async (cargo: Cargo) => {
    try {
      const updated = await cargosService.update(cargo.id, {
        nome: cargo.nome,
        descricao: cargo.descricao,
        baseSalarial: Number(cargo.baseSalarial),
      });
      setCargos((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast.success("Cargo atualizado");
    } catch {
      toast.error("Erro ao atualizar cargo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cargosService.delete(id);
      setCargos((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cargo removido");
    } catch {
      toast.error("Erro ao remover cargo");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <p className="text-muted-foreground">
          Gerencie departamentos e seus cargos.
        </p>
      </div>

      {/* Mobile: departamentos como acordeão acima */}
      {isMobile && (
        <Card className="rounded-2xl">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Departamentos</CardTitle>
            <Button
              className="gap-2"
              size="sm"
              onClick={() => setOpenCreateDept(true)}
            >
              <Plus className="h-4 w-4" /> Novo
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            <div className="rounded-xl border p-2">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-1">
                  {departamentos.map((d) => {
                    const isActive = d.id === selectedDeptId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDeptId(d.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors border ${
                          isActive
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "hover:bg-muted border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">{d.nome}</span>
                          <div className="flex items-center gap-1 opacity-80">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDeptId(d.id);
                                setDeptDraft({ ...d });
                                setEditingDept(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDepartamento(d.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {d.descricao && (
                          <p className="text-xs text-muted-foreground truncate">
                            {d.descricao}
                          </p>
                        )}
                      </button>
                    );
                  })}
                  {departamentos.length === 0 && (
                    <div className="text-sm text-muted-foreground px-2 py-4">
                      Nenhum departamento cadastrado
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}

      <div
        className={`flex gap-4 ${
          isMobile ? "flex-col" : "flex-row"
        } h-[calc(100vh-26vh)] overflow-hidden`}
      >
        {/* Sidebar fixa (desktop) */}
        {!isMobile && (
          <Card className="rounded-2xl w-[280px] min-w-[280px] max-w-[280px] h-full overflow-hidden">
            <CardHeader className="px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Departamentos</CardTitle>
              <Button
                className="gap-2"
                size="sm"
                onClick={() => setOpenCreateDept(true)}
              >
                <Plus className="h-4 w-4" /> Novo
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0 flex flex-col h-full">
              <div className="rounded-xl border p-2 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-1">
                    {departamentos.map((d) => {
                      const isActive = d.id === selectedDeptId;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDeptId(d.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors border ${
                            isActive
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "hover:bg-muted border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">
                              {d.nome}
                            </span>
                            <div className="flex items-center gap-1 opacity-80">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDeptId(d.id);
                                  setDeptDraft({ ...d });
                                  setEditingDept(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDepartamento(d.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {d.descricao && (
                            <p className="text-xs text-muted-foreground truncate">
                              {d.descricao}
                            </p>
                          )}
                        </button>
                      );
                    })}
                    {departamentos.length === 0 && (
                      <div className="text-sm text-muted-foreground px-2 py-4">
                        Nenhum departamento cadastrado
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo direito */}
        <Card className="rounded-2xl flex-1 h-full overflow-hidden">
          <CardHeader className="gap-2">
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {!editingDept && (
                  <span className="text-lg font-semibold truncate">
                    {selectedDept?.nome || "—"}
                  </span>
                )}
                {editingDept && (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      placeholder="Nome"
                      value={deptDraft.nome || ""}
                      onChange={(e) =>
                        setDeptDraft((p) => ({ ...p, nome: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Descrição"
                      value={deptDraft.descricao || ""}
                      onChange={(e) =>
                        setDeptDraft((p) => ({
                          ...p,
                          descricao: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!editingDept && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={startEditDept}
                      disabled={!selectedDept}
                    >
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        selectedDept && deleteDepartamento(selectedDept.id)
                      }
                      disabled={!selectedDept}
                    >
                      <Trash2 className="h-4 w-4" /> Excluir
                    </Button>
                  </>
                )}
                {editingDept && (
                  <>
                    <Button size="sm" className="gap-2" onClick={saveEditDept}>
                      <Check className="h-4 w-4" /> Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={cancelEditDept}
                    >
                      <X className="h-4 w-4" /> Cancelar
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-0 flex flex-col h-full">
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Buscar cargo ou descrição"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-xl border flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Nome</TableHead>
                    <TableHead className="w-[40%]">Descrição</TableHead>
                    <TableHead className="w-[20%]">Base Salarial</TableHead>
                    <TableHead className="w-[10%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCargos.map((cargo, idx) => (
                    <TableRow
                      key={cargo.id}
                      className={idx % 2 === 1 ? "bg-muted/30" : ""}
                    >
                      <TableCell>
                        <Input
                          value={cargo.nome}
                          onChange={(e) =>
                            setCargos((prev) =>
                              prev.map((c) =>
                                c.id === cargo.id
                                  ? { ...c, nome: e.target.value }
                                  : c
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={cargo.descricao || ""}
                          onChange={(e) =>
                            setCargos((prev) =>
                              prev.map((c) =>
                                c.id === cargo.id
                                  ? { ...c, descricao: e.target.value }
                                  : c
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={cargo.baseSalarial as any}
                          onChange={(e) =>
                            setCargos((prev) =>
                              prev.map((c) =>
                                c.id === cargo.id
                                  ? {
                                      ...c,
                                      baseSalarial: Number(e.target.value),
                                    }
                                  : c
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => handleUpdate(cargo)}
                          >
                            <Save className="w-4 h-4" /> Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleDelete(cargo.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCargos.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        Nenhum cargo encontrado
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Linha de cadastro rápido */}
                  <TableRow>
                    <TableCell>
                      <Input
                        placeholder="Nome"
                        value={draft.nome || ""}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, nome: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Descrição"
                        value={draft.descricao || ""}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, descricao: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="0"
                        value={(draft.baseSalarial as any) || ""}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            baseSalarial: Number(e.target.value),
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={handleAdd}
                        disabled={!selectedDeptId}
                      >
                        <Plus className="w-4 h-4" /> Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openCreateDept} onOpenChange={setOpenCreateDept}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Departamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Nome"
              value={newDept.nome}
              onChange={(e) =>
                setNewDept((p) => ({ ...p, nome: e.target.value }))
              }
            />
            <Input
              placeholder="Descrição (opcional)"
              value={newDept.descricao}
              onChange={(e) =>
                setNewDept((p) => ({ ...p, descricao: e.target.value }))
              }
            />
          </div>
          <DialogFooter>
            <Button
              className="gap-2"
              onClick={async () => {
                await createDepartamento();
                setOpenCreateDept(false);
              }}
            >
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
