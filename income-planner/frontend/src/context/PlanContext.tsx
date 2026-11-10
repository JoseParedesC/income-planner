import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import { useDebouncedEffect } from '../hooks/useDebouncedEffect';
import { DEMO_INPUTS, EMPTY_INPUTS, EMPTY_RESULT } from '../lib/constants';
import type { Recommendation, TaxInputs, TaxResult } from '../types';
import { useMeta } from './MetaContext';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';
interface PlanCtx {
  year: number; setYear: (y: number) => void;
  inputs: TaxInputs; setInput: (k: keyof TaxInputs, v: number | null) => void; loadDemo: () => void;
  dianDate: string | null; setDianDate: (d: string | null) => void;
  done: Set<string>; toggleDoc: (key: string) => void;
  result: TaxResult; recs: Recommendation[]; calculating: boolean;
  save: SaveState; loaded: boolean;
}
const Ctx = createContext<PlanCtx>(null!);
export const usePlan = () => useContext(Ctx);

export function PlanProvider({ children }: { children: ReactNode }) {
  const { meta } = useMeta();
  const [year, setYearState] = useState(() => { const y = Number(localStorage.getItem('ip_year')); return meta.years.includes(y) ? y : 2026; });
  const [inputs, setInputs] = useState<TaxInputs>(EMPTY_INPUTS);
  const [dianDate, setDian] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [save, setSave] = useState<SaveState>('idle');
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<TaxResult>(EMPTY_RESULT);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [calculating, setCalculating] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    let off = false; setLoaded(false); dirty.current = false;
    Promise.all([api<{ inputs: TaxInputs; dianDate: string | null }>(`/tax/${year}`), api<{ done: string[] }>(`/checklist/${year}`)])
      .then(([t, c]) => { if (off) return; setInputs(t.inputs); setDian(t.dianDate); setDone(new Set(c.done)); setLoaded(true); })
      .catch(() => !off && setSave('error'));
    return () => { off = true; };
  }, [year]);

  // Autoguardado
  useDebouncedEffect(() => {
    if (!dirty.current) return;
    setSave('saving');
    api(`/tax/${year}`, { method: 'PUT', body: { inputs, dianDate } }).then(() => setSave('saved')).catch(() => setSave('error'));
  }, [inputs, dianDate, year], 700);

  // Simulación en el backend (única fuente de verdad del cálculo)
  const docsDone = done.size;
  useDebouncedEffect(() => {
    if (!loaded) return;
    const ac = new AbortController(); setCalculating(true);
    api<{ result: TaxResult; recommendations: Recommendation[] }>('/simulate', { method: 'POST', body: { year, inputs, docsDone }, signal: ac.signal })
      .then((r) => { setResult(r.result); setRecs(r.recommendations); setCalculating(false); })
      .catch((e) => { if (e.name !== 'AbortError') setCalculating(false); });
    return () => ac.abort();
  }, [inputs, year, docsDone, loaded], 220);

  const setYear = (y: number) => { try { localStorage.setItem('ip_year', String(y)); } catch { /* noop */ } setYearState(y); };
  const setInput = useCallback((k: keyof TaxInputs, v: number | null) => { dirty.current = true; setInputs((p) => ({ ...p, [k]: v } as TaxInputs)); }, []);
  const setDianDate = useCallback((d: string | null) => { dirty.current = true; setDian(d); }, []);
  const loadDemo = useCallback(() => { dirty.current = true; setInputs(DEMO_INPUTS); }, []);
  const toggleDoc = useCallback((key: string) => {
    const next = !done.has(key);
    setDone((p) => { const s = new Set(p); if (next) s.add(key); else s.delete(key); return s; });
    api(`/checklist/${year}/${key}`, { method: 'PUT', body: { done: next } }).catch(() => setSave('error'));
  }, [done, year]);

  const value = useMemo(() => ({ year, setYear, inputs, setInput, loadDemo, dianDate, setDianDate, done, toggleDoc, result, recs, calculating, save, loaded }),
    [year, inputs, setInput, loadDemo, dianDate, setDianDate, done, toggleDoc, result, recs, calculating, save, loaded]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
