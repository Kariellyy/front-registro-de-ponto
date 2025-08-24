import { AuthResponse } from "@/types/auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (response.ok) {
            const data: AuthResponse = await response.json();

            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.nome,
              role: data.user.papel,
              empresaId: data.user.empresaId,
              empresa: data.empresa
                ? {
                    id: data.empresa.id,
                    name: data.empresa.nome,
                    cnpj: data.empresa.cnpj,
                    email: data.empresa.email,
                    telefone: data.empresa.telefone,
                  }
                : null,
              accessToken: data.access_token,
            };
          }

          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.empresaId = user.empresaId;
        token.empresa = user.empresa;
      }

      // Refresh token quando solicitado
      if (trigger === "update" && token.accessToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            token.empresaId = userData.user.empresaId;
            token.empresa = userData.empresa
              ? {
                  id: userData.empresa.id,
                  name: userData.empresa.nome,
                  cnpj: userData.empresa.cnpj,
                  email: userData.empresa.email,
                  telefone: userData.empresa.telefone,
                }
              : null;
          }
        } catch (error) {
          console.error("Erro ao refrescar token:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.empresaId = token.empresaId as string;
      session.empresa = token.empresa as typeof session.empresa;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
