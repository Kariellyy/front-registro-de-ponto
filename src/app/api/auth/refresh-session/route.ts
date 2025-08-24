import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Atualizar a sessão
    const updatedSession = await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      user: updatedSession?.user,
      empresa: updatedSession?.empresa,
    });
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
