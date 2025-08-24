export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: "dono" | "administrador" | "funcionario";
  empresaId: string;
  telefone?: string;
  photoUrl?: string;
  status: "ativo" | "inativo" | "suspenso";
  createdAt: string;
  updatedAt: string;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
  nomeEmpresa: string;
  cnpj: string;
  emailEmpresa: string;
}

export interface AuthResponse {
  access_token: string;
  user: Usuario;
  empresa: Empresa;
}

export interface RegisterResponse {
  message: string;
  user: Usuario;
  empresa: Empresa;
}

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  papel: "dono" | "administrador" | "funcionario";
  empresa: Empresa;
}

// Tipos para NextAuth
declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      empresaId: string;
    };
    empresa: {
      id: string;
      name: string;
      cnpj: string;
      email: string;
      telefone?: string;
    } | null;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    empresaId: string;
    empresa: {
      id: string;
      name: string;
      cnpj: string;
      email: string;
      telefone?: string;
    } | null;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: string;
    empresaId: string;
    empresa: {
      id: string;
      name: string;
      cnpj: string;
      email: string;
      telefone?: string;
    } | null;
  }
}
