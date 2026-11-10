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
  return { uvt, ing, apo, base, viv, prep, gmf, dep, vol, e25, cap, sum, lim, extraDep, rlg, tax, ret,
    saldo: tax - ret, obligado, tasaEfectiva: ing ? tax / ing : 0 };
}

export const formatCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Math.round(v || 0));

export interface Recommendation { icon: string; tone: 'info' | 'warn' | 'ok'; text: string }

export function recommendations(d: TaxInputs, year: number, docsDone: number, docsTotal: number): Recommendation[] {
  const r = calcTax(d, year);
  if (!r.ing) return [{ icon: '✍️', tone: 'info', text: 'Registra tus ingresos en «Mis datos» para ver recomendaciones personalizadas.' }];
  const out: Recommendation[] = [];
  out.push(r.obligado
    ? { icon: '📌', tone: 'warn', text: 'Superas al menos uno de los topes para declarar. Prepara tu información con tiempo.' }
    : { icon: '✅', tone: 'ok', text: 'Con estos datos no superas los topes de ingresos, patrimonio ni consumos. Confírmalo en el calendario DIAN.' });
  const ahorro = r.tax - calcTax({ ...d, vol: (d.vol || 0) + r.ing * 0.1 }, year).tax;
  if (ahorro > 1000) out.push({ icon: '💜', tone: 'info', text: `Un aporte voluntario adicional del 10 % de tus ingresos (${formatCOP(r.ing * 0.1)}) a pensión voluntaria o AFC podría ahorrarte cerca de ${formatCOP(ahorro)} (estimado). Debe hacerse antes del 31 de diciembre.` });
  if (!d.viv) out.push({ icon: '🏠', tone: 'info', text: 'Si pagas intereses de crédito de vivienda son deducibles (hasta 1.200 UVT al año). Pide el certificado a tu banco.' });
  if (!d.dep) out.push({ icon: '👨‍👩‍👧', tone: 'info', text: '¿Tienes dependientes? Pueden darte deducciones adicionales; reúne los soportes si aplica.' });
  if (r.cap && r.sum >= r.cap) out.push({ icon: '⚠️', tone: 'warn', text: 'Ya alcanzas el tope global de beneficios (40 % del ingreso neto o 1.340 UVT). Más deducciones no reducirán más tu impuesto.' });
  if (r.saldo < 0) out.push({ icon: '🎉', tone: 'ok', text: `Tus retenciones superan el impuesto estimado: posible saldo a favor de ${formatCOP(-r.saldo)}.` });
  else if (r.saldo > 0) out.push({ icon: '💸', tone: 'warn', text: `Posible saldo a pagar de ${formatCOP(r.saldo)}. Ve reservando ese valor para evitar sorpresas.` });
  if (docsDone < docsTotal) out.push({ icon: '📂', tone: 'info', text: `Te faltan ${docsTotal - docsDone} documentos por reunir.` });
  return out;
}
