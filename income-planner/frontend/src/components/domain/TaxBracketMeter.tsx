import { motion } from 'framer-motion';
import { BRACKET_RATES } from '../../lib/constants';
import { formatPct } from '../../lib/format';

/** Escala de tarifas marginales (art. 241 E.T.) resaltando el tramo actual. */
export function TaxBracketMeter({ marginal, active }: { marginal: number; active: boolean }) {
  return (
    <div>
      <div className="meter">
        {BRACKET_RATES.map((rate) => {
          const on = active && rate === marginal;
          return (
            <div key={rate} className="meter__cell" style={on ? { color: '#fff' } : undefined}>
              {on && <motion.span layoutId="bracket" style={{ position: 'absolute', inset: 0, borderRadius: 9, background: 'var(--grad)' }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span style={{ position: 'relative' }}>{Math.round(rate * 100)}%</span>
            </div>
          );
        })}
      </div>
      <p className="faint" style={{ fontSize: '.8rem', marginTop: 10 }}>{active ? `Tu tarifa marginal es ${formatPct(marginal, 0)}: solo el excedente de cada tramo se grava a esa tasa.` : 'Ingresa tus datos para ubicar tu tramo.'}</p>
    </div>
  );
}
