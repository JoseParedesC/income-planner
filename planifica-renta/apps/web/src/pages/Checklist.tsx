import { DOCS } from '@pr/shared';
import { usePlan } from '../plan';

export default function Checklist() {
  const { done, toggleDoc, loaded } = usePlan();
  return (
    <div className="card"><h2>📂 Checklist de documentos</h2><p className="mu">Marca lo que ya tienes listo para tu declaración.</p>
      {loaded && DOCS.map((d) => (
        <label key={d.key} className={`chk ${done.has(d.key) ? 'd' : ''}`}>
          <input type="checkbox" checked={done.has(d.key)} onChange={() => toggleDoc(d.key)} /><span>{d.label}</span>
        </label>))}
    </div>);
}
