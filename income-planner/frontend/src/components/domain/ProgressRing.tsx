import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';

export function ProgressRing({ value, size = 108, stroke = 10 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, mid = size / 2;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <defs><linearGradient id="ring-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4f46e5" /><stop offset="1" stopColor="#c026d3" /></linearGradient></defs>
        <circle cx={mid} cy={mid} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <motion.circle cx={mid} cy={mid} r={r} fill="none" stroke="url(#ring-g)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1, ease }} />
      </svg>
      <div className="ring__label num">{Math.round(value)}%</div>
    </div>
  );
}
