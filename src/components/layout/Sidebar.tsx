"use client";

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
  MessageSquare,
  Users,
  UserX,
} from "lucide-react";
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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                RP
              </span>
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
      </SidebarContent>
    </Sidebar>
  );
}
