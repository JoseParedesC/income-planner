import { formatNumber } from '../../lib/format';

interface Props {
  id: string; label: string; hint?: string; value: number | null; onChange: (v: number | null) => void;
  currency?: boolean; nullable?: boolean; max?: number; placeholder?: string;
}
/** Campo numérico con separadores de miles (es-CO). `nullable` distingue «vacío» de 0. */
export function NumberField({ id, label, hint, value, onChange, currency = true, nullable, max = 1e13, placeholder = '0' }: Props) {
  const shown = value == null ? '' : formatNumber(value);
  return (
    <div className="field">
      <label htmlFor={id}>{label}{hint && <small>{hint}</small>}</label>
      <div className="input">
        {currency && <span className="input__affix">$</span>}
        <input id={id} inputMode="numeric" autoComplete="off" placeholder={placeholder} value={shown}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(0, 14);
            onChange(d === '' ? (nullable ? null : 0) : Math.min(Number(d), max));
          }} />
      </div>
    </div>
  );
}
