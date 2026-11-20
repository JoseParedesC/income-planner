/** Lector del Formulario 210 (declaración de renta personas naturales, formato Excel de la DIAN).
 *  Es una función pura sobre un «lector de celdas», así se prueba sin depender de la librería de Excel. */
import { UVT, type TaxInputs } from './tax.js';

export type CellReader = (address: string) => unknown;

/** casilla del formulario → celda con el número de casilla (para validar el formato) y celda con el valor */
interface Casilla { n: number; label: string; value: string }
const C = (n: number, label: string, value: string): Casilla => ({ n, label, value });
export const CASILLAS: Casilla[] = [
  C(29, 'H9', 'I9'),     // Total patrimonio bruto
  C(32, 'G11', 'H11'),   // Ingresos brutos · rentas de trabajo
  C(33, 'G13', 'H13'),   // INCRNGO · rentas de trabajo (aportes obligatorios)
  C(35, 'G17', 'H17'),   // Aportes voluntarios AFC / FVP / AVC
  C(38, 'G20', 'H20'),   // Intereses de vivienda
  C(39, 'G21', 'H21'),   // Otras deducciones imputables
  C(43, 'M11', 'N11'),   // Ingresos brutos · trabajo sin relación laboral (honorarios)
  C(44, 'M13', 'N13'),   // INCRNGO · honorarios
  C(47, 'M17', 'N17'),   // Aportes voluntarios · honorarios
  C(50, 'M20', 'N20'),   // Intereses de vivienda · honorarios
  C(51, 'M21', 'N21'),   // Otras deducciones · honorarios
  C(58, 'T11', 'U11'),   // Ingresos brutos · rentas de capital (no soportado)
  C(74, 'X11', 'Y11'),   // Ingresos brutos · rentas no laborales (no soportado)
  C(129, 'W41', 'X41'),  // Total impuesto a cargo (solo informativo)
  C(132, 'W44', 'X44'),  // Retenciones del año gravable
  C(138, 'F48', 'G48'),  // Número de dependientes económicos
];

export class F210FormatError extends Error {}

/** Convierte el contenido de una celda a número (acepta «1.234.567,89», «$ 5000», fórmulas con resultado en caché). */
export function toNumber(v: unknown): number | null {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const s = v.replace(/[$\s]/g, '');
    if (!s) return null;
    let t = s;
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) t = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d+,\d+$/.test(s)) t = s.replace(',', '.');
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export interface F210Import {
  /** Año gravable detectado (null si el archivo no lo indica) */
  year: number | null;
  /** UVT escrita en el archivo, si la hay */
  uvtInFile: number | null;
  /** Campos del planificador que se pisan (no incluye «cons», que el formulario no trae) */
  inputs: Omit<TaxInputs, 'cons'>;
  /** Total impuesto a cargo declarado (casilla 129), para comparar con la estimación */
  declaredTax: number | null;
  /** Casillas leídas con valor distinto de cero */
  found: Record<number, number>;
  warnings: string[];
}

function detectYear(read: CellReader, uvtInFile: number | null): number | null {
  const m = /UVT\s*(\d{4})/i.exec(String(read('AD5') ?? ''));
  if (m) return Number(m[1]);
  if (uvtInFile) {
    const hit = Object.entries(UVT).find(([, v]) => v === uvtInFile);
    if (hit) return Number(hit[0]);
  }
  return null;
}

export function parseF210(read: CellReader): F210Import {
  // 1. ¿Es el Formulario 210? Los números de casilla deben estar en su sitio.
  const ok = CASILLAS.filter((c) => toNumber(read(c.label)) === c.n).length;
  if (ok < CASILLAS.length * 0.75) throw new F210FormatError('El archivo no parece el Formulario 210 de la DIAN (hoja «210»).');

  const found: Record<number, number> = {};
  const raw = (n: number): number | null => {
    const c = CASILLAS.find((x) => x.n === n)!;
    const v = toNumber(read(c.value));
    if (v) found[n] = v;
    return v;
  };
  const pos = (n: number) => Math.max(0, raw(n) ?? 0);
  const sum = (...ns: number[]) => ns.reduce((a, n) => a + pos(n), 0);
  const has = (...ns: number[]) => ns.some((n) => (raw(n) ?? 0) > 0);

  const uvtInFile = toNumber(read('AD6'));
  const year = detectYear(read, uvtInFile);
  const warnings: string[] = [];

  const inputs: F210Import['inputs'] = {
    ing: sum(32, 43),
    aportes: has(33, 44) ? sum(33, 44) : null,
    ret: pos(132),
    vol: sum(35, 47),
    viv: sum(38, 50),
    prep: sum(39, 51),
    gmf: 0,
    dep: Math.min(30, Math.floor(pos(138))),
    pat: pos(29),
  };
  const declaredTax = raw(129);

  if (has(39, 51)) warnings.push('«Otras deducciones imputables» (casillas 39 y 51) se cargaron completas en «Medicina prepagada / seguros». El formulario no separa GMF, dependientes ni prepagada: revisa que no se dupliquen con el número de dependientes.');
  if (has(58, 74)) warnings.push('El archivo trae rentas de capital o no laborales (casillas 58 y 74). El planificador solo calcula rentas de trabajo, así que no se importaron.');
  if (year == null) warnings.push('No se pudo detectar el año gravable en el archivo; los datos se cargaron en el año seleccionado.');
  if (year != null && uvtInFile && UVT[year] && UVT[year] !== uvtInFile) warnings.push(`La UVT del archivo (${uvtInFile}) difiere de la del planificador para ${year} (${UVT[year]}).`);
  if (!Object.keys(found).length) warnings.push('El formulario está vacío: no se encontraron valores en las casillas.');

  return { year, uvtInFile, inputs, declaredTax, found, warnings };
}
