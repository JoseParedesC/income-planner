import { calcTax, type TaxInputs } from './tax.js';

export type RecKind = 'empty' | 'obligation' | 'ok' | 'savings' | 'housing' | 'dependents' | 'cap' | 'refund' | 'payment' | 'docs';
export interface Recommendation { kind: RecKind; tone: 'info' | 'warn' | 'ok'; title: string; text: string }

const cop = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Math.round(v));

export function recommendations(d: TaxInputs, year: number, docsDone: number, docsTotal: number): Recommendation[] {
  const r = calcTax(d, year);
  if (!r.ing) return [{ kind: 'empty', tone: 'info', title: 'Empieza registrando tus datos', text: 'Ingresa tus ingresos en «Mis datos» para ver recomendaciones personalizadas.' }];
  const out: Recommendation[] = [];
  out.push(r.obligado
    ? { kind: 'obligation', tone: 'warn', title: 'Probablemente debes declarar', text: 'Superas al menos uno de los topes para declarar. Prepara tu información con tiempo.' }
    : { kind: 'ok', tone: 'ok', title: 'Probablemente no debes declarar', text: 'Con estos datos no superas los topes de ingresos, patrimonio ni consumos. Confírmalo en el calendario DIAN.' });
  const ahorro = r.tax - calcTax({ ...d, vol: (d.vol || 0) + r.ing * 0.1 }, year).tax;
  if (ahorro > 1000) out.push({ kind: 'savings', tone: 'info', title: 'Aportes voluntarios', text: `Un aporte voluntario adicional del 10 % de tus ingresos (${cop(r.ing * 0.1)}) a pensión voluntaria o AFC podría ahorrarte cerca de ${cop(ahorro)} (estimado). Debe hacerse antes del 31 de diciembre.` });
  if (!d.viv) out.push({ kind: 'housing', tone: 'info', title: 'Intereses de vivienda', text: 'Si pagas intereses de crédito de vivienda son deducibles (hasta 1.200 UVT al año). Pide el certificado a tu banco.' });
  if (!d.dep) out.push({ kind: 'dependents', tone: 'info', title: 'Dependientes', text: '¿Tienes dependientes? Pueden darte deducciones adicionales; reúne los soportes si aplica.' });
  if (r.cap && r.sum >= r.cap) out.push({ kind: 'cap', tone: 'warn', title: 'Alcanzaste el tope de beneficios', text: 'Ya llegas al tope global (40 % del ingreso neto o 1.340 UVT). Más deducciones no reducirán más tu impuesto.' });
  if (r.saldo < 0) out.push({ kind: 'refund', tone: 'ok', title: 'Posible saldo a favor', text: `Tus retenciones superan el impuesto estimado: posible saldo a favor de ${cop(-r.saldo)}.` });
  else if (r.saldo > 0) out.push({ kind: 'payment', tone: 'warn', title: 'Posible saldo a pagar', text: `Posible saldo a pagar de ${cop(r.saldo)}. Ve reservando ese valor para evitar sorpresas.` });
  if (docsDone < docsTotal) out.push({ kind: 'docs', tone: 'info', title: 'Documentos pendientes', text: `Te faltan ${docsTotal - docsDone} documentos por reunir.` });
  return out;
}
