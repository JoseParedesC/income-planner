import { AnimatePresence, motion } from 'framer-motion';
import { Check, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import type { SaveState } from '../../context/PlanContext';

const MAP = {
  idle: { icon: Cloud, text: 'Sincronizado', cls: '' },
  saving: { icon: RefreshCw, text: 'Guardando…', cls: 'spin' },
  saved: { icon: Check, text: 'Guardado', cls: '' },
  error: { icon: CloudOff, text: 'Sin guardar', cls: '' },
} as const;

export function SaveStatus({ state }: { state: SaveState }) {
  const { icon: Icon, text, cls } = MAP[state];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={state} className="save hide-sm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
        style={state === 'error' ? { color: 'var(--danger)' } : state === 'saved' ? { color: 'var(--success)' } : undefined} role="status">
        <Icon size={15} className={cls} />{text}
      </motion.span>
    </AnimatePresence>
  );
}
