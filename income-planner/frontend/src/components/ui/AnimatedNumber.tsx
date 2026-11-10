import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { formatCOP } from '../../lib/format';
import { ease } from '../../lib/motion';

/** Número que «cuenta» suavemente hasta su nuevo valor. */
export function AnimatedNumber({ value, format = formatCOP }: { value: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const initial = useRef(format(value)); // constante: React nunca pisa el texto animado
  const current = useRef(0);
  useEffect(() => {
    const c = animate(current.current, value, { duration: 0.9, ease, onUpdate: (v) => { current.current = v; if (ref.current) ref.current.textContent = format(v); } });
    return () => c.stop();
  }, [value, format]);
  return <span ref={ref} className="num">{initial.current}</span>;
}
