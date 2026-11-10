import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DOCS, YEARS, calcTax, emptyInputs, recommendations, type TaxInputs } from '@pr/shared';
import { api } from './api';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
interface PlanCtx {
  year: number; setYear: (y: number) => void;
  inputs: TaxInputs; setInput: (k: keyof TaxInputs, v: number | null) => void; loadDemo: () => void;
  dianDate: string | null; setDianDate: (d: string | null) => void;
  done: Set<string>; toggleDoc: (key: string) => void;
  result: ReturnType<typeof calcTax>; recs: ReturnType<typeof recommendations>;
  save: SaveState; loaded: boolean;
}
const Ctx = createContext<PlanCtx>(null!);
export const usePlan = () => useContext(Ctx);

const DEMO: TaxInputs = { ing: 140_000_000, aportes: null, ret: 14_000_000, vol: 8_000_000, viv: 6_000_000, prep: 3_000_000, gmf: 400_000, dep: 1, pat: 150_000_000, cons: 30_000_000 };

export function PlanProvider({ children }: { children: ReactNode }) {
  const [year, setYearState] = useState(() => { const y = Number(localStorage.getItem('pr_year')); return YEARS.includes(y) ? y : YEARS[YEARS.length - 1]; });
  const [inputs, setInputs] = useState<TaxInputs>(emptyInputs());
  const [dianDate, setDian] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [save, setSave] = useState<SaveState>('idle');
  const [loaded, setLoaded] = useState(false);
  const dirty = useRef(false);
  const timer = useRef<number>();

  useEffect(() => {
    let off = false; setLoaded(false); dirty.current = false;
    Promise.all([api<{ inputs: TaxInputs; dianDate: string | null }>(`/tax/${year}`), api<{ done: string[] }>(`/checklist/${year}`)])
      .then(([t, c]) => { if (off) return; setInputs(t.inputs); setDian(t.dianDate); setDone(new Set(c.done)); setLoaded(true); })
      .catch(() => !off && setSave('error'));
    return () => { off = true; };
  }, [year]);

  useEffect(() => {
    if (!dirty.current) return;
    setSave('saving'); window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      api(`/tax/${year}`, { method: 'PUT', body: { inputs, dianDate } }).then(() => setSave('saved')).catch(() => setSave('error'));
    }, 700);
    return () => window.clearTimeout(timer.current);
  }, [inputs, dianDate, year]);

  const setYear = (y: number) => { try { localStorage.setItem('pr_year', String(y)); } catch { /* noop */ } setYearState(y); };
  const setInput = useCallback((k: keyof TaxInputs, v: number | null) => { dirty.current = true; setInputs((p) => ({ ...p, [k]: v } as TaxInputs)); }, []);
  const setDianDate = (d: string | null) => { dirty.current = true; setDian(d); };
  const loadDemo = () => { dirty.current = true; setInputs(DEMO); };
  const toggleDoc = (key: string) => {
    const next = !done.has(key);
    setDone((p) => { const s = new Set(p); next ? s.add(key) : s.delete(key); return s; });
    api(`/checklist/${year}/${key}`, { method: 'PUT', body: { done: next } }).catch(() => setSave('error'));
  };

  const result = useMemo(() => calcTax(inputs, year), [inputs, year]);
  const recs = useMemo(() => recommendations(inputs, year, done.size, DOCS.length), [inputs, year, done]);

  return <Ctx.Provider value={{ year, setYear, inputs, setInput, loadDemo, dianDate, setDianDate, done, toggleDoc, result, recs, save, loaded }}>{children}</Ctx.Provider>;
}
