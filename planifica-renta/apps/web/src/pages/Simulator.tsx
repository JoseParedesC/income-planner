import { formatCOP } from '@pr/shared';
import { usePlan } from '../plan';

const Row = ({ a, b, tot }: { a: string; b: string; tot?: boolean }) => <div className="row"><span>{a}</span><b className={tot ? 'tot' : ''}>{b}</b></div>;

export default function Simulator() {
  const { result: r, recs, year } = usePlan();
  const uso = r.cap ? Math.min(100, (r.sum / r.cap) * 100) : 0;
  return (<>
    <div className="card"><h2>🧮 Resultado de tu simulación</h2>
      <p className="mu">Año gravable {year} · UVT {formatCOP(r.uvt)}</p>
      <Row a="Ingresos brutos" b={formatCOP(r.ing)} />
      <Row a="(−) Aportes obligatorios" b={formatCOP(r.apo)} />
      <Row a="Ingreso neto base" b={formatCOP(r.base)} />
      <Row a="(−) Deducciones (vivienda, salud, dependientes, GMF)" b={formatCOP(r.viv + r.prep + r.dep + r.gmf)} />
      <Row a="(−) Aportes voluntarios exentos" b={formatCOP(r.vol)} />
      <Row a="(−) Renta exenta 25 %" b={formatCOP(r.e25)} />
      <Row a="Beneficios aplicados (tope 40 % / 1.340 UVT)" b={formatCOP(r.lim)} />
      <Row a="(−) Deducción adicional por dependientes" b={formatCOP(r.extraDep)} />
      <Row a="Renta líquida gravable" b={formatCOP(r.rlg)} tot />
      <Row a="Impuesto de renta estimado" b={formatCOP(r.tax)} tot />
      <Row a="(−) Retenciones" b={formatCOP(r.ret)} />
      <Row a={r.saldo >= 0 ? 'Saldo a pagar' : 'Saldo a favor'} b={formatCOP(Math.abs(r.saldo))} tot />
      <p className="mu" style={{ marginTop: 12 }}>Tasa efectiva: <b>{(r.tasaEfectiva * 100).toFixed(1)} %</b> · Uso del tope de beneficios: <b>{uso.toFixed(0)} %</b></p>
      <div className="bar"><i style={{ width: `${uso}%` }} /></div>
    </div>
    <div className="card"><h2>💡 Recomendaciones de planificación</h2>
      {recs.map((x, i) => <div key={i} className={`tip ${x.tone}`}><span className="e">{x.icon}</span><div>{x.text}</div></div>)}
    </div>
  </>);
}
