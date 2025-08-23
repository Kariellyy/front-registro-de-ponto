'use client';

import { AuthService } from '@/services/auth.service';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        // Tentar obter dados atualizados do usuário
        try {
          await refreshUser();
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error);
          // Se falhar, usar dados do localStorage
          const localUser = AuthService.getUser();
          if (localUser) {
            setUser(localUser);
          } else {
            AuthService.logout();
          }
        }
      }
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error);
      AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthService.login(credentials);
      
      const authUser: AuthUser = {
        id: response.user.id,
        nome: response.user.nome,
        email: response.user.email,
        papel: response.user.papel,
        empresa: response.empresa,
      };
      
      setUser(authUser);
      
      // Redirecionar para o dashboard da empresa
      router.push('/empresa');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await AuthService.register(data);
      
      // Após registro, fazer login automaticamente
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await AuthService.getMe();
      
      const authUser: AuthUser = {
        id: response.user.id,
        nome: response.user.nome,
        email: response.user.email,
        papel: response.user.papel,
        empresa: response.empresa,
      };
      
      setUser(authUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
