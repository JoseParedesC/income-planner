import { motion } from 'framer-motion';

export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span className={`check${checked ? ' check--on' : ''}`} aria-hidden>
      <svg viewBox="0 0 24 24" width="15" height="15">
        <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"
          initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ duration: 0.25 }} />
      </svg>
    </span>
  );
}
