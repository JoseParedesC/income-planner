import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ease } from '../../lib/motion';

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acc">
      <button className="acc__btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {title}<motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease }}><ChevronDown size={18} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }} style={{ overflow: 'hidden' }}>
            <div className="acc__body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
