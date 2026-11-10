import { ArrowRight, Banknote, FileCheck2, FolderCheck, Landmark, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IncomeFlowChart, KpiCard, ProgressRing, RecommendationList } from '../components/domain';
import { AnimatedNumber, Button, Card, CardHeader, Stagger, StaggerItem } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useMeta } from '../context/MetaContext';
import { usePlan } from '../context/PlanContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { meta } = useMeta();
  const { result: r, done, inputs, loadDemo, recs, year } = usePlan();
  const nav = useNavigate();
  const pc = meta.docs.length ? (done.size / meta.docs.length) * 100 : 0;
  const hasData = r.ing > 0 || inputs.pat > 0;
  return (
    <Stagger className="stack" gap={0.08}>
      <StaggerItem>
        <div className="hero">
          <h1>Hola, {user?.name.split(' ')[0]} 👋</h1>
          <p>Tu planificación del año gravable {year} en un solo lugar: simula tu renta, organiza tus soportes y no pierdas ninguna fecha.</p>
          <div className="row" style={{ marginTop: 20 }}>
            <Button variant="light" onClick={() => nav('/datos')}>Completar mis datos <ArrowRight size={16} /></Button>
            <Button variant="ghost" onClick={() => { loadDemo(); nav('/simulador'); }}><Sparkles size={16} />Cargar ejemplo</Button>
          </div>
        </div>
      </StaggerItem>
      <div className="grid grid--kpi">
        <KpiCard tone="a" icon={Landmark} label="Impuesto estimado" hint={`Tasa efectiva ${(r.tasaEfectiva * 100).toFixed(1).replace('.', ',')} %`}><AnimatedNumber value={r.tax} /></KpiCard>
        <KpiCard tone="b" icon={r.saldo >= 0 ? Banknote : Wallet} label={r.saldo >= 0 ? 'Saldo a pagar' : 'Saldo a favor'} hint="Impuesto − retenciones"><AnimatedNumber value={Math.abs(r.saldo)} /></KpiCard>
        <KpiCard tone="c" icon={FolderCheck} label="Documentos listos" hint={`${done.size} de ${meta.docs.length}`}><AnimatedNumber value={pc} format={(n) => `${Math.round(n)} %`} /></KpiCard>
        <KpiCard tone="d" icon={FileCheck2} label="¿Debes declarar?" hint="Según topes en UVT">{hasData ? (r.obligado ? 'Probablemente sí' : 'Probablemente no') : '—'}</KpiCard>
      </div>
      <div className="grid grid--2">
        <StaggerItem><Card hover><CardHeader icon={Wallet} title="¿A dónde va tu ingreso?" description="Distribución del ingreso bruto anual" /><IncomeFlowChart r={r} /></Card></StaggerItem>
        <StaggerItem><Card hover>
          <CardHeader icon={FolderCheck} title="Avance de documentos" description="Soportes reunidos para tu declaración" />
          <div className="row" style={{ gap: 22 }}><ProgressRing value={pc} /><div><p className="muted">{done.size} de {meta.docs.length} documentos listos.</p><Button variant="soft" style={{ marginTop: 12 }} onClick={() => nav('/documentos')}>Ver checklist</Button></div></div>
        </Card></StaggerItem>
      </div>
      <StaggerItem><Card><CardHeader icon={Sparkles} title="Recomendaciones para ti" action={<Button variant="ghost" onClick={() => nav('/simulador')}>Ver todas</Button>} /><RecommendationList recs={recs} limit={3} /></Card></StaggerItem>
    </Stagger>
  );
}
