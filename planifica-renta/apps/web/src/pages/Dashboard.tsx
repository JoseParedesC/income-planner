import { useNavigate } from 'react-router-dom';
import { DOCS, formatCOP } from '@pr/shared';
import { usePlan } from '../plan';

export default function Dashboard() {
  const { result: r, done, inputs, loadDemo } = usePlan();
  const nav = useNavigate();
  const pc = Math.round((done.size / DOCS.length) * 100);
  const hasData = r.ing > 0 || inputs.pat > 0;
  return (<>
    <div className="g">
      <div className="k k1"><span>Impuesto estimado</span><b>{formatCOP(r.tax)}</b></div>
      <div className="k k2"><span>{r.saldo >= 0 ? 'Saldo a pagar' : 'Saldo a favor'}</span><b>{formatCOP(Math.abs(r.saldo))}</b></div>
      <div className="k k3"><span>Documentos listos</span><b>{pc} %</b></div>
      <div className="k k4"><span>¿Debes declarar?</span><b>{hasData ? (r.obligado ? 'Probablemente sí' : 'Probablemente no') : '—'}</b></div>
    </div>
    <div className="card" style={{ marginTop: 14 }}>
      <h2>👋 ¿Cómo funciona?</h2>
      <p className="mu">1) Registra tus ingresos y deducciones en <b>Mis datos</b>. 2) Mira tu impuesto en el <b>Simulador</b>. 3) Reúne soportes en <b>Documentos</b>. 4) No pierdas ninguna <b>Fecha</b>. 5) Aprende en <b>Aprende</b>.</p>
      <p className="mu">Documentos: {done.size} de {DOCS.length} listos</p>
      <div className="bar"><i style={{ width: `${pc}%` }} /></div>
      <button className="btn" onClick={() => nav('/datos')}>Empezar con mis datos →</button>{' '}
      <button className="btn soft" onClick={() => { loadDemo(); nav('/simulador'); }}>Cargar ejemplo</button>
    </div>
  </>);
}
