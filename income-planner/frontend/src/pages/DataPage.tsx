import { Briefcase, Building2, PiggyBank } from 'lucide-react';
import { Badge, AnimatedNumber, Card, CardHeader, NumberField, Skeleton, Stagger, StaggerItem } from '../components/ui';
import { usePlan } from '../context/PlanContext';
import { formatNumber } from '../lib/format';
import type { TaxInputs } from '../types';

type F = { k: keyof TaxInputs; label: string; hint: string; currency?: boolean; nullable?: boolean };
const GROUPS: { icon: typeof Briefcase; title: string; desc: string; fields: F[] }[] = [
  { icon: Briefcase, title: 'Ingresos y retenciones', desc: 'Lo que recibiste y lo que ya te retuvieron', fields: [
    { k: 'ing', label: 'Ingresos laborales brutos', hint: 'Salarios, bonos, honorarios' },
    { k: 'aportes', label: 'Aportes obligatorios salud y pensión', hint: 'Vacío = se estima el 8 %', nullable: true },
    { k: 'ret', label: 'Retenciones en la fuente', hint: 'Certificado de ingresos y retenciones' } ] },
  { icon: PiggyBank, title: 'Deducciones y beneficios', desc: 'Conceptos que pueden reducir tu base gravable', fields: [
    { k: 'vol', label: 'Aportes voluntarios pensión / AFC', hint: 'Reducen tu base' },
    { k: 'viv', label: 'Intereses de crédito de vivienda', hint: 'Pagados en el año' },
    { k: 'prep', label: 'Medicina prepagada / seguros de salud', hint: 'Pagados en el año' },
    { k: 'gmf', label: 'GMF (4×1000) pagado', hint: 'Se toma el 50 %' },
    { k: 'dep', label: 'Número de dependientes', hint: 'Hijos, cónyuge, padres', currency: false } ] },
  { icon: Building2, title: 'Patrimonio y consumos', desc: 'Sirven para saber si estás obligado a declarar', fields: [
    { k: 'pat', label: 'Patrimonio bruto a 31 de diciembre', hint: 'Bienes, cuentas, inversiones' },
    { k: 'cons', label: 'Consumos con tarjeta, compras o consignaciones', hint: 'El mayor valor del año' } ] },
];

export default function DataPage() {
  const { inputs, setInput, loaded, result } = usePlan();
  if (!loaded) return <div className="stack">{[0, 1, 2].map((i) => <Card key={i}><Skeleton h={22} w="40%" /><div style={{ height: 16 }} /><Skeleton h={46} /></Card>)}</div>;
  return (
    <Stagger className="stack">
      <StaggerItem><div className="row"><Badge>Impuesto estimado: <AnimatedNumber value={result.tax} /></Badge><span className="faint" style={{ fontSize: '.82rem' }}>Valores anuales en pesos colombianos · se guardan solos</span></div></StaggerItem>
      {GROUPS.map((g) => (
        <StaggerItem key={g.title}><Card>
          <CardHeader icon={g.icon} title={g.title} description={g.desc} />
          <div className="grid grid--fields">
            {g.fields.map((f) => <NumberField key={f.k} id={f.k} label={f.label} hint={f.hint} currency={f.currency} nullable={f.nullable} placeholder={f.nullable ? formatNumber(result.apo) : undefined} max={f.k === 'dep' ? 30 : undefined}
              value={inputs[f.k]} onChange={(v) => setInput(f.k, v)} />)}
          </div>
        </Card></StaggerItem>
      ))}
    </Stagger>
  );
}
