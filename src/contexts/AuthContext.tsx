"use client";

import { LoginRequest, RegisterRequest } from "@/types/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  empresaId: string;
};

type Empresa = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  telefone?: string;
  horariosSemanais?: {
    [diaSemana: string]: {
      ativo: boolean;
      inicio: string;
      fim: string;
      temIntervalo: boolean;
      intervaloInicio?: string;
      intervaloFim?: string;
    };
  };
};

type AuthContextType = {
  user: User | null;
  empresa: Empresa | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  empresa: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session) {
      setUser({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role,
        empresaId: session.user.empresaId,
      });

      if (session.empresa) {
        setEmpresa(session.empresa);
      }
    } else {
      setUser(null);
      setEmpresa(null);
    }

    setIsLoading(false);
  }, [session, status]);

  const login = async (credentials: LoginRequest) => {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro no registro");
      }

      // Após registro, fazer login automaticamente
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    await update();
  };

  const logout = () => {
    void signOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        empresa,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
