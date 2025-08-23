"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, ChevronRight, Home, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getBreadcrumbItems = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const items = [
    { label: 'Home', href: '/empresa', icon: Home }
  ];

  if (segments.length > 1) {
    const currentPage = segments[1];
    const pageLabels: { [key: string]: string } = {
      'funcionarios': 'Funcionários',
      'jornada': 'Controle de Jornada',
      'ausencias': 'Ausências',
      'ferias': 'Gestão de Férias',
      'justificativas': 'Justificativas',
      'relatorio-contador': 'Relatório Contador',
      'tema': 'Tema'
    };

    if (pageLabels[currentPage]) {
      items.push({
        label: pageLabels[currentPage],
        href: `/${segments.slice(0, 2).join('/')}`,
        icon: null
      });
    }
  }

  return items;
};

export default function Navbar() {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (papel: string) => {
    const labels = {
      'dono': 'Dono',
      'administrador': 'Administrador',
      'funcionario': 'Funcionário'
    };
    return labels[papel as keyof typeof labels] || papel;
  };

  return (
    <nav className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            {breadcrumbItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                    index === breadcrumbItems.length - 1 ? 'text-foreground font-medium' : ''
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
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

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoUrl} alt={user.nome} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.nome)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.nome}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {getRoleLabel(user.papel)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {user.empresa.nome}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
