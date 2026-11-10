import { motion } from 'framer-motion';
import { formatCOP, formatPct } from '../../lib/format';
import { ease } from '../../lib/motion';
import type { TaxResult } from '../../types';

/** Barra apilada: ¿a dónde va tu ingreso bruto? */
export function IncomeFlowChart({ r }: { r: TaxResult }) {
  if (!r.ing) return <p className="muted">Registra tus ingresos para ver cómo se distribuyen.</p>;
  const disp = Math.max(0, r.ing - r.apo - r.tax);
  const segs = [
    { label: 'Aportes obligatorios', v: r.apo, color: '#f59e0b' },
    { label: 'Impuesto de renta', v: r.tax, color: '#ec4899' },
    { label: 'Disponible', v: disp, color: '#14b8a6' },
  ];
  return (
    <div>
      <div className="flow" role="img" aria-label="Distribución del ingreso bruto">
        {segs.map((s) => (
          <motion.div key={s.label} className="flow__seg" style={{ background: s.color, flexBasis: 0 }}
            initial={{ flexGrow: 0 }} animate={{ flexGrow: Math.max(s.v, 0.0001) }} transition={{ duration: 0.9, ease }} />
        ))}
      </div>
      <div className="legend">
        {segs.map((s) => (
          <div key={s.label} className="legend__item">
            <i className="legend__dot" style={{ background: s.color }} /><span>{s.label} · {formatPct(s.v / r.ing)}</span><b className="num">{formatCOP(s.v)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
