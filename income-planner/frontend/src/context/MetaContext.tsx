import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import type { Meta } from '../types';

const FALLBACK: Meta = { years: [2026], uvt: {}, docs: [], milestones: [], edu: [] };
const Ctx = createContext<{ meta: Meta; ready: boolean }>({ meta: FALLBACK, ready: false });
export const useMeta = () => useContext(Ctx);

export function MetaProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<Meta>(FALLBACK);
  const [ready, setReady] = useState(false);
  useEffect(() => { api<Meta>('/meta').then((m) => { setMeta(m); setReady(true); }).catch(() => setReady(true)); }, []);
  return <Ctx.Provider value={{ meta, ready }}>{children}</Ctx.Provider>;
}
