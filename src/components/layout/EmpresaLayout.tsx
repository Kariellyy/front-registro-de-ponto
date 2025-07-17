"use client";

import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import Navbar from "./Navbar";
import AppSidebar from "./Sidebar";

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
