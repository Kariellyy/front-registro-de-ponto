import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private normalizeDatesToUTC(value: any): any {
    if (value === null || value === undefined) return value;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value))
      return value.map((v) => this.normalizeDatesToUTC(v));
    if (typeof value === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value))
        out[k] = this.normalizeDatesToUTC(v);
      return out;
    }
    if (typeof value === "string") {
      // manter datas puras YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      // já em ISO com timezone (Z ou +hh:mm)
      if (/Z$|[\+\-]\d{2}:?\d{2}$/.test(value)) return value;
      // strings de data-hora sem timezone → normalizar para UTC
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString();
      return value;
    }
    return value;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const session = await getSession();
    return session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {};
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const authHeaders = await this.getAuthHeaders();

    let body = options.body as any;
    if (body && typeof body === "object" && !(body instanceof FormData)) {
      body = JSON.stringify(this.normalizeDatesToUTC(body));
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      ...options,
      body,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado ou inválido - NextAuth irá lidar com isso
          console.error("Token expirado ou inválido");
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Para DELETE, verificar se há conteúdo antes de tentar fazer parse
      const contentType = response.headers.get("content-type");
      if (
        response.status === 204 ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        // Resposta vazia ou não-JSON
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", ...options });
  }

  async post<T>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch<T>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", ...options });
  }
}

export const api = new ApiClient(API_BASE_URL);
