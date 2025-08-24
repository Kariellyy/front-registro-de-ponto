import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Se não há token, redirecionar para login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token.role;

    // Proteger rota /dashboard - apenas admin e dono
    if (path.startsWith("/dashboard") && userRole === "funcionario") {
      return NextResponse.redirect(new URL("/funcionario", req.url));
    }

    // Proteger rota /funcionario - apenas funcionários
    if (path.startsWith("/funcionario") && userRole !== "funcionario") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/funcionario/:path*"],
};
