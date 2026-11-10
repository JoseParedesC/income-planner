import { BookOpen, Coins } from 'lucide-react';
import { Accordion, Badge, Card, CardHeader, Stagger, StaggerItem } from '../components/ui';
import { useMeta } from '../context/MetaContext';
import { formatCOP } from '../lib/format';

export default function Learn() {
  const { meta } = useMeta();
  return (
    <Stagger className="stack">
      <StaggerItem><Card><CardHeader icon={BookOpen} title="Cultura tributaria en breve" description="Toca una pregunta para ver la respuesta" />
        {meta.edu.map((e) => <Accordion key={e.title} title={e.title}>{e.text}</Accordion>)}</Card></StaggerItem>
      <StaggerItem><Card><CardHeader icon={Coins} title="Valor de la UVT por año" description="Referencia usada por el simulador (verifica en la DIAN)" />
        <div className="row">{Object.entries(meta.uvt).map(([y, v]) => <Badge key={y}>{y}: {formatCOP(v)}</Badge>)}</div></Card></StaggerItem>
    </Stagger>
  );
}
