import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ExtratoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Verificar se o usuário é funcionário
  if (session.user.role !== "funcionario") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
