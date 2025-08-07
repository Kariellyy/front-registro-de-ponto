"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/empresa":
      return "Dashboard";
    case "/empresa/funcionarios":
      return "Funcionários";
    case "/empresa/jornada":
      return "Controle de Jornada";
    case "/empresa/ausencias":
      return "Ausências";
    case "/empresa/ferias":
      return "Gestão de Férias";
    case "/empresa/justificativas":
      return "Justificativas";
    case "/empresa/relatorio-contador":
      return "Relatório Contador";
    case "/empresa/tema":
      return "Tema";
    default:
      return "";
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <nav className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {pageTitle && (
            <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
