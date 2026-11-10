import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMeta } from '../../context/MetaContext';
import { usePlan } from '../../context/PlanContext';
import { ROUTES } from '../../lib/routes';
import { SaveStatus } from '../domain';
import { Button, ThemeToggle } from '../ui';

export function Topbar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { meta } = useMeta();
  const { year, setYear, save } = usePlan();
  const route = ROUTES.find((r) => r.path === pathname) ?? ROUTES[0];
  return (
    <header className="topbar">
      <div className="topbar__title"><h1>{route.title}</h1><p>{route.subtitle}</p></div>
      <div className="topbar__actions">
        <SaveStatus state={save} />
        <select className="select" value={year} onChange={(e) => setYear(+e.target.value)} aria-label="Año gravable">
          {meta.years.map((y) => <option key={y} value={y}>AG {y}</option>)}
        </select>
        <ThemeToggle />
        <Button variant="icon" onClick={logout} aria-label="Cerrar sesión"><LogOut size={18} /></Button>
      </div>
    </header>
  );
}
