import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <motion.div className="progress__bar" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8, ease }} />
    </div>
  );
}
