import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { fadeUp } from '../../lib/motion';

export function KpiCard({ tone, icon: Icon, label, hint, children }: { tone: 'a' | 'b' | 'c' | 'd'; icon: LucideIcon; label: string; hint?: string; children: ReactNode }) {
  return (
    <motion.div className={`kpi kpi--${tone}`} variants={fadeUp} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <span className="kpi__label"><Icon size={16} />{label}</span>
      <b className="kpi__value">{children}</b>
      {hint && <span className="kpi__hint">{hint}</span>}
    </motion.div>
  );
}
