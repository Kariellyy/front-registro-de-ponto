import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const funcionarios = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@empresa.com",
    cpf: "123.456.789-10",
    cargo: "Desenvolvedor Frontend",
    departamento: "Tecnologia",
    dataAdmissao: "2023-01-15",
    status: "Ativo",
    horario: "08:00 - 17:00",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@empresa.com",
    cpf: "987.654.321-00",
    cargo: "Designer UX/UI",
    departamento: "Produto",
    dataAdmissao: "2023-03-20",
    status: "Ativo",
    horario: "09:00 - 18:00",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro.costa@empresa.com",
    cpf: "456.789.123-45",
    cargo: "Gerente de Projeto",
    departamento: "Gestão",
    dataAdmissao: "2022-08-10",
    status: "Ativo",
    horario: "08:30 - 17:30",
  },
  {
    id: "4",
    nome: "Ana Lima",
    email: "ana.lima@empresa.com",
    cpf: "321.654.987-78",
    cargo: "Analista de Marketing",
    departamento: "Marketing",
    dataAdmissao: "2023-06-01",
    status: "Inativo",
    horario: "08:00 - 17:00",
  },
];

export default function FuncionariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie os funcionários da empresa</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Funcionário
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionário..."
                  className="pl-10"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Todos os departamentos</option>
              <option>Tecnologia</option>
              <option>Produto</option>
              <option>Gestão</option>
              <option>Marketing</option>
              <option>Recursos Humanos</option>
            </select>
            <select className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option>Todos os status</option>
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Férias</option>
              <option>Licença</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Funcionários Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 dark:bg-destructive/20 rounded-lg">
                <UserX className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">1</div>
                <div className="text-sm text-muted-foreground">Funcionários Inativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 dark:bg-success/20 rounded-lg">
                <Plus className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2</div>
                <div className="text-sm text-muted-foreground">Contratados este mês</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 dark:bg-warning/20 rounded-lg">
                <Edit className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">Departamentos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de funcionários */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cargo / Departamento
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Data Admissão
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Horário
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">
                        {funcionario.nome}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {funcionario.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {funcionario.cpf}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {funcionario.cargo}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {funcionario.departamento}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(funcionario.dataAdmissao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {funcionario.horario}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        funcionario.status === "Ativo"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {funcionario.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-success hover:text-success/70">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/70">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Paginação */}
      <Card>
        <CardContent className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando 4 de 4 funcionários
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Anterior
            </Button>
            <Button size="sm">
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
