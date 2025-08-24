import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware do NextAuth já cuida da autenticação
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/empresa/:path*"],
};
