/** Motor de cálculo simplificado del impuesto de renta de personas naturales (cédula general, rentas de trabajo).
 *  Orientativo: verificar UVT, topes y tarifas con la DIAN / un contador. */
export const UVT: Record<number, number> = { 2023: 42412, 2024: 47065, 2025: 49799, 2026: 52374 };
export const YEARS = Object.keys(UVT).map(Number);

export interface TaxInputs {
  ing: number; aportes: number | null; ret: number; vol: number; viv: number;
  prep: number; gmf: number; dep: number; pat: number; cons: number;
}
export const emptyInputs = (): TaxInputs => ({ ing: 0, aportes: null, ret: 0, vol: 0, viv: 0, prep: 0, gmf: 0, dep: 0, pat: 0, cons: 0 });

// [límite superior UVT, tarifa marginal, UVT adicionales] — art. 241 E.T.
const BRACKETS: [number, number, number][] = [
  [1090, 0, 0], [1700, 0.19, 0], [4100, 0.28, 116], [8670, 0.33, 788],
  [18970, 0.35, 2296], [31000, 0.37, 5901], [Infinity, 0.39, 10352],
];

export function incomeTax(rlg: number, uvt: number): number {
  const x = rlg / uvt;
  let lo = 0;
  for (const [hi, rate, add] of BRACKETS) {
    if (x <= hi) return Math.max(0, ((x - lo) * rate + add) * uvt);
    lo = hi;
  }
  return 0;
}

export interface TaxResult {
  uvt: number; ing: number; apo: number; base: number;
  viv: number; prep: number; gmf: number; dep: number; vol: number; e25: number;
  cap: number; sum: number; lim: number; extraDep: number;
  rlg: number; tax: number; ret: number; saldo: number; obligado: boolean; tasaEfectiva: number;
  /** Tarifa marginal aplicable (0–0.39) */
  marginal: number;
}

export function calcTax(d: TaxInputs, year: number): TaxResult {
  const uvt = UVT[year];
  if (!uvt) throw new Error(`Año gravable no soportado: ${year}`);
  const n = (v: number | null | undefined) => Math.max(0, Number(v) || 0);
  const ing = n(d.ing);
  const apo = d.aportes == null ? ing * 0.08 : n(d.aportes);
  const base = Math.max(0, ing - apo);
  const nd = Math.floor(n(d.dep));
  const viv = Math.min(n(d.viv), 1200 * uvt);
  const prep = Math.min(n(d.prep), 192 * uvt);
  const gmf = n(d.gmf) * 0.5;
  const dep = nd > 0 ? Math.min(ing * 0.1, 384 * uvt) : 0;
  const vol = Math.min(n(d.vol), ing * 0.3, 3800 * uvt);
  const ded = viv + prep + gmf + dep;
  const e25 = Math.min(Math.max(0, base - ded - vol) * 0.25, 790 * uvt);
  const cap = Math.min(base * 0.4, 1340 * uvt);
  const sum = ded + vol + e25;
  const lim = Math.min(sum, cap);
  const extraDep = Math.min(nd, 4) * 72 * uvt;
  const rlg = Math.max(0, base - lim - extraDep);
  const tax = incomeTax(rlg, uvt);
  const ret = n(d.ret);
  const obligado = ing >= 1400 * uvt || n(d.pat) >= 4500 * uvt || n(d.cons) >= 1400 * uvt;
  const x = rlg / uvt;
  const marginal = BRACKETS.find(([hi]) => x <= hi)?.[1] ?? 0;
  return { uvt, ing, apo, base, viv, prep, gmf, dep, vol, e25, cap, sum, lim, extraDep, rlg, tax, ret,
    saldo: tax - ret, obligado, tasaEfectiva: ing ? tax / ing : 0, marginal };
}
