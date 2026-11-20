import { AlertTriangle, CheckCircle2, FileSpreadsheet, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { formatCOP } from '../../lib/format';
import type { F210Outcome } from '../../types';
import { Button, Card, CardHeader } from '../ui';

/** Carga del Formulario 210 (.xlsx de la DIAN): el backend lo lee y los datos se cargan en «Mis datos». */
export function F210Importer() {
  const { importF210, year } = usePlan();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<F210Outcome | null>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true); setError(null); setOutcome(null);
    try { setOutcome(await importF210(file)); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo leer el archivo'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };

  return (
    <Card>
      <CardHeader icon={FileSpreadsheet} title="Importar Formulario 210" description="Sube el Excel de la DIAN y completamos tus datos automáticamente" />
      <div className="row">
        <input ref={input} type="file" hidden accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => onFile(e.target.files?.[0])} />
        <Button variant="soft" loading={busy} onClick={() => input.current?.click()}><Upload size={16} />Elegir archivo .xlsx</Button>
        <span className="faint" style={{ fontSize: '.82rem' }}>Se usa el año gravable del archivo (hoy: AG {year}). Reemplaza los valores de este año.</span>
      </div>
      {error && <p role="alert" className="row" style={{ marginTop: 14, color: 'var(--danger)', gap: 8 }}><AlertTriangle size={16} />{error}</p>}
      {outcome && (
        <div role="status" className="stack" style={{ marginTop: 14, gap: 8 }}>
          <p className="row" style={{ gap: 8, color: 'var(--success)' }}><CheckCircle2 size={16} />
            Importado AG {outcome.year}{outcome.yearChanged ? ' (cambiamos el año seleccionado)' : ''} · {outcome.fields} casillas con valor
            {outcome.declaredTax ? ` · impuesto a cargo declarado ${formatCOP(outcome.declaredTax)}` : ''}</p>
          {outcome.warnings.map((w) => <p key={w} className="row muted" style={{ gap: 8, alignItems: 'flex-start' }}><AlertTriangle size={16} style={{ flex: 'none', marginTop: 2 }} />{w}</p>)}
        </div>
      )}
    </Card>
  );
}
