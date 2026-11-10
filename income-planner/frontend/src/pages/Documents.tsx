import { FolderCheck } from 'lucide-react';
import { DocumentList, ProgressRing } from '../components/domain';
import { Card, CardHeader, Stagger, StaggerItem } from '../components/ui';
import { useMeta } from '../context/MetaContext';
import { usePlan } from '../context/PlanContext';

export default function Documents() {
  const { meta } = useMeta();
  const { done, loaded } = usePlan();
  const total = meta.docs.length;
  return (
    <Stagger className="stack">
      <StaggerItem><Card><div className="row" style={{ gap: 22 }}>
        <ProgressRing value={total ? (done.size / total) * 100 : 0} />
        <div><h2>{done.size === total && total > 0 ? '¡Todo listo para declarar!' : 'Reúne tus soportes'}</h2><p className="muted">{done.size} de {total} documentos listos. Marca cada uno cuando lo tengas.</p></div>
      </div></Card></StaggerItem>
      <StaggerItem><Card><CardHeader icon={FolderCheck} title="Checklist de documentos" description="Toca un ítem para marcarlo" />{loaded && <DocumentList />}</Card></StaggerItem>
    </Stagger>
  );
}
