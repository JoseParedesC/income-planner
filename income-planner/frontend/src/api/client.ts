const KEY = 'ip_token';
export const token = {
  get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },
  set: (t: string) => { try { localStorage.setItem(KEY, t); } catch { /* noop */ } },
  clear: () => { try { localStorage.removeItem(KEY); } catch { /* noop */ } },
};

export class ApiError extends Error { constructor(public status: number, msg: string) { super(msg); } }

export async function api<T>(path: string, init: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const t = token.get();
  const res = await fetch(`/api${path}`, {
    method: init.method ?? 'GET', signal: init.signal,
    headers: { 'content-type': 'application/json', ...(t ? { authorization: `Bearer ${t}` } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? 'Error de red');
  return data as T;
}
