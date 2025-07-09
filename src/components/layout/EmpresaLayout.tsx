"use client";

import Navbar from "./Navbar";
import AppSidebar from "./Sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface EmpresaLayoutProps {
  children: React.ReactNode;
}

export default function EmpresaLayout({ children }: EmpresaLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
