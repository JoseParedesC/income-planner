import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function Card({ children, hover, className = '' }: { children: ReactNode; hover?: boolean; className?: string }) {
  return <section className={`card${hover ? ' card--hover' : ''} ${className}`}>{children}</section>;
}
export function CardHeader({ icon: Icon, title, description, action }: { icon?: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="card__head">
      {Icon && <span className="card__icon"><Icon size={19} /></span>}
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action && <div className="card__action">{action}</div>}
    </header>
  );
}
