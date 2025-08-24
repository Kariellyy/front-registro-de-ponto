import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: session.user,
        empresa: session.empresa,
      });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
