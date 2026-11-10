import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Banknote, BadgeCheck, CircleCheck, FileText, FolderOpen, Home, Lightbulb, PenLine, PiggyBank, Users, type LucideIcon } from 'lucide-react';
import type { RecKind, Recommendation } from '../../types';
import { ease } from '../../lib/motion';

const ICONS: Record<RecKind, LucideIcon> = {
  empty: PenLine, obligation: FileText, ok: CircleCheck, savings: PiggyBank, housing: Home, dependents: Users,
  cap: AlertTriangle, refund: BadgeCheck, payment: Banknote, docs: FolderOpen,
};

export function RecommendationList({ recs, limit }: { recs: Recommendation[]; limit?: number }) {
  const list = limit ? recs.slice(0, limit) : recs;
  return (
    <div className="stack" style={{ gap: 10 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {list.map((x) => {
          const Icon = ICONS[x.kind] ?? Lightbulb;
          return (
            <motion.div key={x.kind} layout className={`tip tip--${x.tone}`} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35, ease }}>
              <span className="tip__icon"><Icon size={18} /></span>
              <div><b>{x.title}</b><p>{x.text}</p></div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
