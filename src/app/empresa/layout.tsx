import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import EmpresaLayout from "@/components/layout/EmpresaLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <EmpresaLayout>{children}</EmpresaLayout>
    </ProtectedRoute>
  );
}
