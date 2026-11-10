import { TrendingUp } from 'lucide-react';

export function Brand() {
  return (
    <div className="brand">
      <span className="brand__logo"><TrendingUp size={20} strokeWidth={2.6} /></span>
      <div><b>Income Planner</b><small>Planificación tributaria</small></div>
    </div>
  );
}
