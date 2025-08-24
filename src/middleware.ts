import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware personalizado pode ser adicionado aqui
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/empresa/:path*", "/dashboard/:path*"],
};
