export interface User { id: string; email: string; name: string }
export interface TaxInputs {
  ing: number; aportes: number | null; ret: number; vol: number; viv: number;
  prep: number; gmf: number; dep: number; pat: number; cons: number;
}
export interface TaxResult {
  uvt: number; ing: number; apo: number; base: number; viv: number; prep: number; gmf: number; dep: number; vol: number; e25: number;
  cap: number; sum: number; lim: number; extraDep: number; rlg: number; tax: number; ret: number; saldo: number;
  obligado: boolean; tasaEfectiva: number; marginal: number;
}
export type RecKind = 'empty' | 'obligation' | 'ok' | 'savings' | 'housing' | 'dependents' | 'cap' | 'refund' | 'payment' | 'docs';
export interface Recommendation { kind: RecKind; tone: 'info' | 'warn' | 'ok'; title: string; text: string }
export interface Meta {
  years: number[]; uvt: Record<string, number>;
  docs: { key: string; label: string }[];
  milestones: { month: number; short: string; title: string; text: string }[];
  edu: { title: string; text: string }[];
}
