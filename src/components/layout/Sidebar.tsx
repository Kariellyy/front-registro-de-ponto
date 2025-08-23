"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {
    Calendar,
    Clock,
    FileText,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Settings,
    User,
    Users,
    UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/empresa",
    icon: LayoutDashboard,
  },
  {
    name: "Controle de Jornada",
    href: "/empresa/jornada",
    icon: Clock,
  },
  {
    name: "Ausências",
    href: "/empresa/ausencias",
    icon: UserX,
  },
  {
    name: "Gestão de Férias",
    href: "/empresa/ferias",
    icon: Calendar,
  },
  {
    name: "Justificativas",
    href: "/empresa/justificativas",
    icon: MessageSquare,
  },
  {
    name: "Relatório Contador",
    href: "/empresa/relatorio-contador",
    icon: FileText,
  },
  {
    name: "Funcionários",
    href: "/empresa/funcionarios",
    icon: Users,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="RPonto"
                width={50}
                height={50}
                className="w-8"
              />
            </div>
            <h1 className="text-xl font-semibold">Registro de Ponto</h1>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} size="default">
                      <Link href={item.href}>
                        <item.icon />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto px-4 py-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground">Administrador</span>
                </div>
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
      </SidebarContent>
    </Sidebar>
  );
}
