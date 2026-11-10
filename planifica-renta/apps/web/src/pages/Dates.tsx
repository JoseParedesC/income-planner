import { MILESTONES } from '@pr/shared';
import { usePlan } from '../plan';

export default function Dates() {
  const { dianDate, setDianDate } = usePlan();
  const now = new Date(); const m = now.getMonth();
  const days = dianDate ? Math.ceil((new Date(`${dianDate}T23:59:59`).getTime() - now.getTime()) / 864e5) : null;
  return (<>
    <div className="card"><h2>⏰ Tu fecha de declaración</h2>
      <p className="mu">La DIAN fija el día según los dos últimos dígitos de tu NIT/cédula. Consúltalo en el calendario tributario oficial e ingrésalo aquí.</p>
      <div style={{ maxWidth: 260, margin: '10px 0' }}><input type="date" value={dianDate ?? ''} onChange={(e) => setDianDate(e.target.value || null)} /></div>
      {days !== null && (days >= 0
        ? <div className={`tip ${days < 30 ? 'warn' : 'ok'}`}><span className="e">⏳</span><div>Faltan <b>{days} días</b> para tu fecha límite. {days < 30 ? '¡Ya es hora de tener todo listo!' : 'Vas con tiempo para planificar.'}</div></div>
        : <div className="tip warn"><span className="e">📌</span><div>Esa fecha ya pasó. Si no declaraste, consulta cómo regularizarte con la DIAN.</div></div>)}
    </div>
    <div className="card"><h2>📅 Hitos del año</h2>
      {MILESTONES.map((h) => (
        <div key={h.short} className={`ev ${h.month < m ? 'p' : ''}`}><div className="m">{h.short}</div>
          <div><b>{h.title}</b>{h.month === m && <span className="pill"> Este mes</span>}<div className="mu">{h.text}</div></div></div>))}
    </div>
  </>);
}
