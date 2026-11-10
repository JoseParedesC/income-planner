import { Calculator, Gauge, Lightbulb, Wallet } from 'lucide-react';
import { BreakdownTable, IncomeFlowChart, RecommendationList, TaxBracketMeter } from '../components/domain';
import { Badge, Card, CardHeader, ProgressBar, Stagger, StaggerItem } from '../components/ui';
import { usePlan } from '../context/PlanContext';
import { formatCOP, formatPct } from '../lib/format';

export default function Simulator() {
  const { result: r, recs, year, calculating } = usePlan();
  const uso = r.cap ? Math.min(100, (r.sum / r.cap) * 100) : 0;
  return (
    <Stagger className="grid grid--2" gap={0.08}>
      <StaggerItem><Card>
        <CardHeader icon={Calculator} title="Resultado de tu simulación" description={`Año gravable ${year} · UVT ${formatCOP(r.uvt)}`} action={calculating ? <Badge>Calculando…</Badge> : <Badge tone={r.saldo > 0 ? 'warn' : 'ok'}>{r.saldo > 0 ? 'A pagar' : 'A favor'}</Badge>} />
        <BreakdownTable r={r} />
        <div style={{ marginTop: 18 }}>
          <div className="row" style={{ justifyContent: 'space-between', fontSize: '.84rem', marginBottom: 6 }}><span className="muted">Uso del tope de beneficios</span><b className="num">{uso.toFixed(0)} %</b></div>
          <ProgressBar value={uso} label="Uso del tope de beneficios" />
          <p className="faint" style={{ fontSize: '.8rem', marginTop: 10 }}>Tasa efectiva: <b className="num">{formatPct(r.tasaEfectiva)}</b> de tus ingresos brutos.</p>
        </div>
      </Card></StaggerItem>
      <div className="stack">
        <StaggerItem><Card><CardHeader icon={Wallet} title="Distribución de tu ingreso" /><IncomeFlowChart r={r} /></Card></StaggerItem>
        <StaggerItem><Card><CardHeader icon={Gauge} title="Tu tramo de tarifa" description="Tarifas marginales, art. 241 E.T." /><TaxBracketMeter marginal={r.marginal} active={r.ing > 0 && r.rlg > 0} /></Card></StaggerItem>
        <StaggerItem><Card><CardHeader icon={Lightbulb} title="Recomendaciones de planificación" /><RecommendationList recs={recs} /></Card></StaggerItem>
      </div>
    </Stagger>
  );
}
