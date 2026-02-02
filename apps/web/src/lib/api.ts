const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public message: string, public status: number) { super(message); }
}

export const api = {
  async get<T>(path: string, options?: { token?: string }): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { headers: options?.token ? { Authorization: `Bearer ${options.token}` } : {} });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new ApiError(err.message || 'Erreur', res.status); }
    return res.json();
  },
  async post<T>(path: string, data: any, options?: { token?: string }): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}) }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new ApiError(err.message || 'Erreur', res.status); }
    return res.json();
  },
  async patch<T>(path: string, data: any, options?: { token?: string }): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}) }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new ApiError(err.message || 'Erreur', res.status); }
    return res.json();
  },
  async delete(path: string, options?: { token?: string }): Promise<void> {
    const res = await fetch(`${API_URL}${path}`, { method: 'DELETE', headers: options?.token ? { Authorization: `Bearer ${options.token}` } : {} });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new ApiError(err.message || 'Erreur', res.status); }
  },
};
