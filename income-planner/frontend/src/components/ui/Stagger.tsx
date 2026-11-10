import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp } from '../../lib/motion';

/** Contenedor que anima a sus hijos <StaggerItem> en cascada. */
export function Stagger({ children, className, gap = 0.07 }: { children: ReactNode; className?: string; gap?: number }) {
  return <motion.div className={className} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}>{children}</motion.div>;
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={fadeUp}>{children}</motion.div>;
}
