import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, token } from './api';

export interface User { id: string; email: string; name: string }
interface AuthCtx {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!token.get());

  useEffect(() => {
    if (!token.get()) return;
    api<{ user: User }>('/auth/me').then((r) => setUser(r.user)).catch(() => token.clear()).finally(() => setLoading(false));
  }, []);

  const done = (r: { token: string; user: User }) => { token.set(r.token); setUser(r.user); };
  const login = useCallback(async (email: string, password: string) => done(await api('/auth/login', { method: 'POST', body: { email, password } })), []);
  const register = useCallback(async (name: string, email: string, password: string) => done(await api('/auth/register', { method: 'POST', body: { name, email, password } })), []);
  const logout = useCallback(() => { token.clear(); setUser(null); }, []);

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
