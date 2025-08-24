"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getBreadcrumbItems = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const items: Array<{
    label: string;
    href: string;
    icon: typeof Home | null;
  }> = [{ label: "Home", href: "/dashboard", icon: Home }];

  if (segments.length > 1) {
    const currentPage = segments[1];
    const pageLabels: { [key: string]: string } = {
      funcionarios: "Funcionários",
      jornada: "Controle de Jornada",
      ausencias: "Ausências",
      ferias: "Gestão de Férias",
      justificativas: "Justificativas",
      "relatorio-contador": "Relatório Contador",
      configuracoes: "Configurações da Empresa",
      tema: "Tema",
    };

    if (pageLabels[currentPage]) {
      items.push({
        label: pageLabels[currentPage],
        href: `/${segments.slice(0, 2).join("/")}`,
        icon: null,
      });
    }
  }

  return items;
};

export default function Navbar() {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);

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
                    index === breadcrumbItems.length - 1
                      ? "text-foreground font-medium"
                      : ""
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
        </div>
      </div>
    </nav>
  );
}
