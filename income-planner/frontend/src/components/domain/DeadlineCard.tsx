import { motion } from 'framer-motion';
import { CalendarClock, Hourglass } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { ease } from '../../lib/motion';
import { AnimatedNumber, Card, CardHeader } from '../ui';

export function DeadlineCard() {
  const { dianDate, setDianDate } = usePlan();
  const days = dianDate ? Math.ceil((new Date(`${dianDate}T23:59:59`).getTime() - Date.now()) / 864e5) : null;
  const urgent = days !== null && days >= 0 && days < 30;
  return (
    <Card>
      <CardHeader icon={CalendarClock} title="Tu fecha de declaración" description="La DIAN la asigna según los dos últimos dígitos de tu NIT/cédula. Consúltala en el calendario oficial y regístrala aquí." />
      <div className="field" style={{ maxWidth: 260 }}>
        <label htmlFor="dian">Fecha límite</label>
        <div className="input"><input id="dian" type="date" value={dianDate ?? ''} onChange={(e) => setDianDate(e.target.value || null)} /></div>
      </div>
      {days !== null && (
        <motion.div key={days >= 0 ? 'f' : 'p'} className={`tip tip--${days < 0 ? 'warn' : urgent ? 'warn' : 'ok'}`} style={{ marginTop: 16 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
          <span className="tip__icon"><Hourglass size={18} /></span>
          {days >= 0
            ? <div><b><AnimatedNumber value={days} format={(n) => `${Math.round(n)} días`} /> restantes</b><p>{urgent ? '¡Ya es hora de tener todo listo!' : 'Vas con tiempo para planificar con calma.'}</p></div>
            : <div><b>Esa fecha ya pasó</b><p>Si aún no declaraste, consulta cómo regularizarte con la DIAN.</p></div>}
        </motion.div>
      )}
    </Card>
  );
}
