import { motion } from 'framer-motion';
import { formatCOP } from '../../lib/format';
import { fadeUp } from '../../lib/motion';
import type { TaxResult } from '../../types';

type Row = { label: string; value: number; kind?: 'minus' | 'strong' };

export function BreakdownTable({ r }: { r: TaxResult }) {
  const rows: Row[] = [
    { label: 'Ingresos brutos', value: r.ing },
    { label: '(−) Aportes obligatorios salud y pensión', value: r.apo, kind: 'minus' },
    { label: 'Ingreso neto base', value: r.base },
    { label: '(−) Deducciones: vivienda, salud, dependientes, GMF', value: r.viv + r.prep + r.dep + r.gmf, kind: 'minus' },
    { label: '(−) Aportes voluntarios exentos', value: r.vol, kind: 'minus' },
    { label: '(−) Renta exenta 25 %', value: r.e25, kind: 'minus' },
    { label: 'Beneficios aplicados (tope 40 % / 1.340 UVT)', value: r.lim },
    { label: '(−) Deducción adicional por dependientes', value: r.extraDep, kind: 'minus' },
    { label: 'Renta líquida gravable', value: r.rlg, kind: 'strong' },
    { label: 'Impuesto de renta estimado', value: r.tax, kind: 'strong' },
    { label: '(−) Retenciones practicadas', value: r.ret, kind: 'minus' },
    { label: r.saldo >= 0 ? 'Saldo a pagar' : 'Saldo a favor', value: Math.abs(r.saldo), kind: 'strong' },
  ];
  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
      {rows.map((x) => (
        <motion.div key={x.label} variants={fadeUp} className={`tbl__row${x.kind ? ` tbl__row--${x.kind}` : ''}`}>
          <span>{x.label}</span><b className="num">{formatCOP(x.value)}</b>
        </motion.div>
      ))}
    </motion.div>
  );
}
