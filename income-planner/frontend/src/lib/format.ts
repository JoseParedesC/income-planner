const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
export const formatCOP = (v: number) => cop.format(Math.round(v || 0));
export const formatNumber = (v: number) => num.format(Math.round(v || 0));
export const formatPct = (v: number, d = 1) => `${(v * 100).toFixed(d).replace('.', ',')} %`;
export const compactCOP = (v: number) =>
  Math.abs(v) >= 1e6 ? `$${(v / 1e6).toFixed(1).replace('.', ',')} M` : formatCOP(v);
