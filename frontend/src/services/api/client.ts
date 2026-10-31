import type { HealthCheckResponse } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  public setAuthToken(token: string | null): void {
    this.token = token;
  }

  public getAuthToken(): string | null {
    return this.token;
  }

  /**
   * Generic typed request helper
   */
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\//, "");
    const url = `${this.baseUrl}/${cleanEndpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.error) {
          errorMessage = typeof errorData.error === "string" ? errorData.error : JSON.stringify(errorData.error);
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === "object" && errorData !== null) {
          // Format validation errors like { email: ["..."], password: ["..."] }
          const errorEntries = Object.entries(errorData)
            .map(([field, msgs]) => {
              const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
              return `${field}: ${text}`;
            })
            .join(" | ");
          if (errorEntries) {
            errorMessage = errorEntries;
          }
        }
      } catch {
        // Fall back to HTTP status text
      }
      const err = new Error(errorMessage) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }

    // Support empty responses (e.g. 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  public async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Fetch backend system health status
   */
  public async getHealth(): Promise<HealthCheckResponse> {
    return this.get<HealthCheckResponse>("health/");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
