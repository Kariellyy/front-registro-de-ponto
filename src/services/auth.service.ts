import { api } from '@/lib/api';
import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RegisterResponse
} from '@/types/auth';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Salvar token e dados do usuário
    Cookies.set(TOKEN_KEY, response.access_token, { expires: 1 }); // 1 dia
    
    const authUser: AuthUser = {
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
      papel: response.user.papel,
      empresa: response.empresa,
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    
    return response;
  }

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response;
  }

  static async getMe(): Promise<{ user: AuthUser['user'], empresa: AuthUser['empresa'] }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const authUser: AuthUser = {
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
      papel: response.user.papel,
      empresa: response.empresa,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    
    return response;
  }

  static logout(): void {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getToken(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  }

  static getUser(): AuthUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
}
