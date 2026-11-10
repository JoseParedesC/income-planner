import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'soft' | 'ghost' | 'icon' | 'light'; loading?: boolean; block?: boolean; children?: ReactNode;
}
export function Button({ variant = 'primary', loading, block, children, className = '', disabled, ...rest }: Props) {
  return (
    <motion.button whileHover={disabled ? undefined : { y: -1 }} whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`btn btn--${variant}${block ? ' btn--block' : ''} ${className}`} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 size={16} className="spin" />}{children}
    </motion.button>
  );
}
