import type { TaxInputs } from '@pr/shared';
import { usePlan } from '../plan';

const F: [keyof TaxInputs, string, string][] = [
  ['ing', 'Ingresos laborales brutos', 'Salarios, bonos, honorarios'],
  ['aportes', 'Aportes obligatorios salud y pensión', 'Vacío = se estima el 8 %'],
  ['ret', 'Retenciones en la fuente', 'Certificado de ingresos y retenciones'],
  ['vol', 'Aportes voluntarios pensión / AFC', 'Reducen tu base'],
  ['viv', 'Intereses de crédito de vivienda', 'Pagados en el año'],
  ['prep', 'Medicina prepagada / seguros de salud', 'Pagados en el año'],
  ['gmf', 'GMF (4×1000) pagado', 'Se toma el 50 %'],
  ['dep', 'Número de dependientes', 'Hijos, cónyuge, padres'],
  ['pat', 'Patrimonio bruto a 31 dic', 'Bienes, cuentas, inversiones'],
  ['cons', 'Consumos con tarjeta, compras o consignaciones', 'El mayor valor del año'],
];

export default function DataPage() {
  const { inputs, setInput, loaded } = usePlan();
  return (
    <div className="card"><h2>📒 Mis ingresos y deducciones</h2>
      <p className="mu">Valores anuales en pesos colombianos. Se guardan en tu cuenta.</p>
      {!loaded ? <p className="mu">Cargando…</p> :
        <div className="g" style={{ marginTop: 12 }}>
          {F.map(([k, l, h]) => (
            <div key={k}><label htmlFor={k}>{l}<small>{h}</small></label>
              <input id={k} type="number" min={0} inputMode="numeric" placeholder={k === 'dep' ? '0' : '$ 0'}
                value={inputs[k] ?? ''} onChange={(e) => setInput(k, e.target.value === '' ? (k === 'aportes' ? null : 0) : Math.max(0, Number(e.target.value)))} />
            </div>))}
        </div>}
    </div>);
}
