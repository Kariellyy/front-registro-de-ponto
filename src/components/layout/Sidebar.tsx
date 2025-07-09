"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  UserX,
  Calendar,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
        <SidebarGroup>
          <SidebarGroupLabel>Sistema de Ponto</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
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
