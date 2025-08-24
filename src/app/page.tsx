import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirecionar baseado no papel do usuário
    const userRole = session.user.role;

    if (userRole === "funcionario") {
      redirect("/funcionario");
    } else {
      redirect("/empresa");
    }
  } else {
    redirect("/login");
  }
}
